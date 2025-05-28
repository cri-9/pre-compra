<?php

//echo "INICIO auth.php"; exit;
//oculta errores de deprecated y notice
error_reporting(E_ALL & ~E_DEPRECATED & ~E_NOTICE & ~E_WARNING);
ini_set('display_errors', 0);


session_start();
require_once 'vendor/autoload.php';

// Configuración del cliente de Google
$client = new Google_Client();
$client->setAuthConfig(__DIR__ . '/credenciales.json');
$client->setRedirectUri('http://localhost/pre-compra/Backend/callback.php');
$client->addScope(Google_Service_Calendar::CALENDAR_EVENTS);
$client->setAccessType('offline');
$client->setApprovalPrompt('force'); // legacy
$client->setPrompt('consent');       // moderno

$authUrl = $client->createAuthUrl();
header('Location: ' . filter_var($authUrl, FILTER_SANITIZE_URL));
exit;


// Función HTML para mostrar mensajes
function html($contenido) {
    echo "<!DOCTYPE html><html lang='es'><head><meta charset='UTF-8'>
    <meta http-equiv='refresh' content='5;url=paginaPrincipal.php'>
    <title>Autenticación Google</title>
    <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
        .box { background: #f9f9f9; padding: 30px; border-radius: 10px; display: inline-block; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
        a { display: inline-block; margin-top: 15px; color: #007bff; text-decoration: none; }
        a:hover { text-decoration: underline; }
    </style>
    </head><body><div class='box'>$contenido</div></body></html>";
}

// ----- Cerrar sesión -----
if (isset($_GET['logout'])) {
    if (file_exists('token.json')) {
        unlink('token.json');
    }
    html("<h2>🚪 Sesión cerrada correctamente</h2><p>Redirigiendo a inicio...</p>");
    exit;
}

// ----- Procesar código de autorización -----
if (isset($_GET['code'])) {
    $accessToken = $client->fetchAccessTokenWithAuthCode($_GET['code']);
    $client->setAccessToken($accessToken);

    if (!file_exists(dirname(__DIR__ . '/token.json'))) {
        mkdir(dirname(__DIR__ . '/token.json'), 0700, true);
    }
    file_put_contents(__DIR__ . '/token.json', json_encode($client->getAccessToken()));

    html("<h2>✅ Autenticación completada</h2><p>Redirigiendo a la página principal...</p><a href='paginaPrincipal.php'>Ir ahora</a>");
    exit;
}

// ----- Token existente -----
if (file_exists('token.json')) {
    $accessToken = json_decode(file_get_contents('token.json'), true);
    $client->setAccessToken($accessToken);

    // Renovar token si está expirado
    if ($client->isAccessTokenExpired()) {
        if (isset($accessToken['refresh_token'])) {
            $client->fetchAccessTokenWithRefreshToken($client->getRefreshToken());
            file_put_contents('token.json', json_encode($client->getAccessToken()));
            html("<h2>🔁 Token renovado automáticamente</h2><p>Redirigiendo...</p>");
            exit;
        } else {
            unlink('token.json');
            header("Location: auth.php");
            exit;
        }
    }

    // Obtener eventos
    try {
        $service = new Google_Service_Calendar($client);
        $events = $service->events->listEvents('primary');

        $contenido = "<h2>✅ Ya estás autenticado</h2><p>Eventos encontrados:</p>";
        foreach ($events->getItems() as $event) {
            $contenido .= "📅 " . htmlspecialchars($event->getSummary()) . "<br>";
        }
        $contenido .= "<br><a href='paginaPrincipal.php'>Ir ahora</a><br><a href='auth.php?logout=1'>Cerrar sesión</a>";
        html($contenido);
        exit;
    } catch (Exception $e) {
        html("<h2>❌ Error al acceder a Google Calendar</h2><p>{$e->getMessage()}</p>");
        exit;
    }
}

// ----- Redirigir a autenticación si no hay token -----
$authUrl = $client->createAuthUrl([
    'access_type' => 'offline',
    'prompt' => 'consent'
]);
header("Location: $authUrl");
exit;

