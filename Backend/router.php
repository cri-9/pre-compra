<?php
// router.php

// Cabeceras CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Manejar solicitudes OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Obtener la ruta solicitada
$request = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH); // Limpia la ruta

switch ($request) {
    case '/enviarAgendamiento':
        require 'enviarAgendamiento.php'; // Asegúrate de que el nombre del archivo sea correcto
        break;
    case '/enviarCotizacion':
        require 'enviarCotizacion.php'; // Asegúrate de que el nombre del archivo sea correcto
        break;
    case '/verificarBloque':
        require 'verificarBloque.php'; // Asegúrate de que el nombre del archivo sea correcto            
        break;
    case '/guardarAgendamiento':
        require 'guardarAgendamiento.php';
        break;   
    default:
        http_response_code(404);
        echo json_encode(["success" => false, "error" => "Ruta no encontrada"]);
        break;
}
?>