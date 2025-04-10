<?php
require_once 'vendor/autoload.php';

$client = new Google_Client();
$client->setApplicationName('Google Calendar API - PreCompra');
$client->setScopes(Google_Service_Calendar::CALENDAR);
$client->setAuthConfig('credenciales.json'); // Asegúrate de que este archivo exista
$client->setAccessType('offline');
$client->setPrompt('select_account consent');

// Guardar y reutilizar el token
$tokenPath = 'token.json';
if (file_exists($tokenPath)) {
    $accessToken = json_decode(file_get_contents($tokenPath), true);
    $client->setAccessToken($accessToken);
}

// Verificar si es válido o se necesita renovar
if ($client->isAccessTokenExpired()) {
    if ($client->getRefreshToken()) {
        $client->fetchAccessTokenWithRefreshToken($client->getRefreshToken());
    } else {
        // 🔗 Aquí debería aparecer el link de autorización
        $authUrl = $client->createAuthUrl();
        printf("Abre el siguiente enlace en tu navegador:\n%s\n", $authUrl);
        print 'Pega el código de autorización aquí: ';
        $authCode = trim(fgets(STDIN));

        // Intercambiar por el token
        $accessToken = $client->fetchAccessTokenWithAuthCode($authCode);
        $client->setAccessToken($accessToken);

        // Guardar el token en un archivo
        if (!file_exists(dirname($tokenPath))) {
            mkdir(dirname($tokenPath), 0700, true);
        }
        file_put_contents($tokenPath, json_encode($client->getAccessToken()));
    }
}

echo "Autenticación completada.\n";

