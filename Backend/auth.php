<?php
require_once 'vendor/autoload.php';

$client = new Google_Client(); //
$client->setAuthConfig('credenciales.json'); //Ruta del archivo de credenciales
$client->addScope(Google_Service_Calendar::CALENDAR); //Permisos de Google Calendar
$client->setAccessType('offline'); //Acceso offline
$client->setPrompt('select_account consent'); //Solicitar consentimiento del usuario

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

// ----- CERRAR SESIÓN -----
if (isset($_GET['logout'])) {
    if (file_exists('token.json')) {
        unlink('token.json');
    }
    html("<h2>🚪 Sesión cerrada correctamente</h2><p>Redirigiendo a inicio...</p>");
    exit;
}

// ----- CARGAR TOKEN -----
if (file_exists('token.json')) {
    $accessToken = json_decode(file_get_contents('token.json'), true);
    $client->setAccessToken($accessToken);

    // Crear el servicio de calendario
$service = new Google_Service_Calendar($client);

// Obtener los eventos del calendario
$calendarId = 'primary';
$events = $service->events->listEvents($calendarId);

foreach ($events->getItems() as $event) {
    printf("Evento: %s\n", $event->getSummary());
}

    // Si está expirado y hay refresh_token, intenta renovarlo
    if ($client->isAccessTokenExpired()) {
        if (isset($accessToken['refresh_token'])) {
            $client->fetchAccessTokenWithRefreshToken($client->getRefreshToken());
            file_put_contents('token.json', json_encode($client->getAccessToken()));
            html("<h2>🔁 Token renovado automáticamente</h2><p>Redirigiendo...</p>");
        } else {
            unlink('token.json');
            header("Location: auth.php");
            exit;
        }
    }
}

// ----- MANEJO DEL CÓDIGO DE RETORNO DE GOOGLE -----
if (isset($_GET['code'])) {
    $accessToken = $client->fetchAccessTokenWithAuthCode($_GET['code']);
    $client->setAccessToken($accessToken);

    if (!file_exists(dirname('token.json'))) {
        mkdir(dirname('token.json'), 0700, true);
    }
    file_put_contents('token.json', json_encode($client->getAccessToken()));
    html("<h2>✅ Autenticación completada</h2><p>Redirigiendo a la página principal...</p><a href='paginaPrincipal.php'>Ir ahora</a>");
    exit;
}

// ----- REDIRECCIÓN SI NO HAY TOKEN -----
if (!$client->getAccessToken()) {
    $authUrl = $client->createAuthUrl();
    header("Location: $authUrl");
    exit;
}

// ----- AUTENTICACIÓN YA EXISTENTE -----
html("<h2>✅ Ya estás autenticado</h2><p>Redirigiendo a la página principal...</p><a href='paginaPrincipal.php'>Ir ahora</a><br><a href='auth.php?logout=1'>Cerrar sesión</a>");
