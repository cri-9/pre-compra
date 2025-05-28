<?php

// Oculta errores de deprecated, notice y warning
error_reporting(E_ALL & ~E_DEPRECATED & ~E_NOTICE & ~E_WARNING);
ini_set('display_errors', 0);

// Habilitar CORS para desarrollo
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");


try {
    require 'vendor/autoload.php';

    $credentialsPath = __DIR__ . '/credenciales.json';
    if (!file_exists($credentialsPath)) {
        throw new Exception("Archivo credenciales.json no encontrado");
    }

    $client = new Google_Client();
    $client->setAuthConfig($credentialsPath);
    $client->setRedirectUri('http://localhost/pre-compra/Backend/callback.php');
    $client->addScope(Google_Service_Calendar::CALENDAR_EVENTS);

    if (!isset($_GET['code'])) {
        throw new Exception("Parámetro 'code' no recibido en la URL");
    }

    // Intercambiar código por token
    $token = $client->fetchAccessTokenWithAuthCode($_GET['code']);

    if (isset($token['error'])) {
        throw new Exception($token['error_description'] ?? $token['error']);
    }

    $client->setAccessToken($token);

    // Guardar token (incluye refresh token)
    $tokenPath = __DIR__ . '/token.json';
    if (!file_put_contents($tokenPath, json_encode($client->getAccessToken()))) {
        throw new Exception("No se pudo guardar el token");
    }

    echo json_encode([
        "success" => true,
        "message" => "Autenticación exitosa. Token guardado.",
        "token_path" => $tokenPath
    ]);

} catch (Exception $e) {
    // Mostrar error en pantalla para debug
    echo json_encode([
        "success" => false,
        "error" => $e->getMessage()
    ]);
    exit;
}