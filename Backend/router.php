<?php
// Obtener la ruta solicitada
$requestUri = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);
$archivoSolicitado = __DIR__ . $requestUri;

// Definir la ruta base
if (is_file($archivoSolicitado) && pathinfo($archivoSolicitado, PATHINFO_EXTENSION) === 'php') {
    require $archivoSolicitado;
    return;
}
// 1. Servir archivos estáticos (imágenes, CSS, JS, HTML) si existen
if (php_sapi_name() === "cli-server" && is_file($archivoSolicitado)) {
    $extension = pathinfo($archivoSolicitado, PATHINFO_EXTENSION);
    $mimeTypes = [
        'css' => 'text/css',
        'js' => 'application/javascript',
        'jpg' => 'image/jpeg',
        'jpeg' => 'image/jpeg',
        'png' => 'image/png',
        'gif' => 'image/gif',
        'svg' => 'image/svg+xml',
        'html' => 'text/html',
        'ico' => 'image/x-icon',
    ];
    if (isset($mimeTypes[$extension])) {
        header('Content-Type: ' . $mimeTypes[$extension]);
    }
    readfile($archivoSolicitado);
    return;
}

// 2. Servir archivos PHP existentes directamente
if (php_sapi_name() === "cli-server" && is_file($archivoSolicitado) && pathinfo($archivoSolicitado, PATHINFO_EXTENSION) === 'php') {
    require $archivoSolicitado;
    return;
}

// 3. Si la ruta solicitada es un archivo PHP existente, ejecutarlo directamente (independiente del servidor)
if (is_file($archivoSolicitado) && pathinfo($archivoSolicitado, PATHINFO_EXTENSION) === 'php') {
    require $archivoSolicitado;
    return;
}

error_reporting(E_ALL & ~E_DEPRECATED & ~E_NOTICE & ~E_WARNING);
ini_set('display_errors', 0);
// Mostrar errores para depuración
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
// CORS headers
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");
// Manejar solicitudes OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}
// Leer entrada JSON
$rawInput = file_get_contents('php://input');
$input = json_decode($rawInput, true);
// Permitir la ruta también por GET
$ruta = $input['ruta'] ?? $_GET['ruta'] ?? '';
// Logs para depuración
error_log("Raw Input: " . $rawInput);
error_log("Parsed Input: " . print_r($input, true));
error_log("Request Method: " . $_SERVER['REQUEST_METHOD']);
error_log("Content Type: " . ($_SERVER['CONTENT_TYPE'] ?? 'No Content-Type'));
error_log("Ruta solicitada: " . $ruta);
switch ($ruta) {
    case 'enviarAgendamiento':
        require 'enviarAgendamiento.php';
        break;
    case 'enviarCotizacion':
        require 'enviarCotizacion.php';
        break;
    case 'verificarBloque':
        require 'verificarBloque.php';
        break;
    case 'guardarAgendamiento':
        require 'guardarAgendamiento.php';
        break;
    case 'agendarTransferencia':
        require 'agendarTransferencia.php';
        break;
    case 'notificarTransferencia':
        require 'notificarTransferencia.php';
        break;
    case 'webpayRespuesta':
        require 'webpayRespuesta.php';
        break;
        
    default:
        http_response_code(404);
        echo json_encode(["success" => false, "error" => "Ruta no encontrada"]);
        break;
}

// DEBUG: Mostrar la ruta solicitada y si el archivo existe
error_log('DEBUG - requestUri: ' . $requestUri);
error_log('DEBUG - archivoSolicitado: ' . $archivoSolicitado);
error_log('DEBUG - is_file(archivoSolicitado): ' . (is_file($archivoSolicitado) ? 'SI' : 'NO'));
