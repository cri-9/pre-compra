
<?php
// callback.php

require_once 'vendor/autoload.php';

$client = new Google_Client();
$client->SetClientId('TU_CLIENT_ID');
$client->SetClientSecret('TU_CLIENT_SECRET');
$client->setAuthConfig('credenciales.json');
$client->authenticate($_GET['code']);
$client->addScope(Google_Service_Calendar::CALENDAR);
$client->setRedirectUri('http://localhost:8000/callback');


// El código de autorización recibido por Google
if (isset($_GET['code'])) {
    $token = $client->fetchAccessTokenWithAuthCode($_GET['code']);
    $client->setAccessToken($token);

    // Aquí puedes hacer lo que necesites con el token
    echo 'Autenticado correctamente!';
}
