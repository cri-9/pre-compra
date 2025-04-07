<?php
// router.php

// Cabeceras CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Obtener la ruta solicitada
$request = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH); // Limpia la ruta

switch ($request) {
    case '/enviarCotizacion.php':
        require 'enviarCotizacion.php'; // Asegúrate de que el nombre del archivo sea correcto
        break;
    default:
        http_response_code(404);
        echo json_encode(["success" => false, "error" => "Ruta no encontrada"]);
        break;
}
?>