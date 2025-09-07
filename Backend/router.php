<?php
// ===== CONFIGURACIÓN CORS AUTOMÁTICA =====
// Detectar entorno automáticamente
$isLocalDevelopment = (
    $_SERVER['SERVER_NAME'] === 'localhost' || 
    $_SERVER['SERVER_NAME'] === '127.0.0.1' ||
    strpos($_SERVER['HTTP_HOST'], 'localhost') !== false ||
    strpos($_SERVER['HTTP_HOST'], '127.0.0.1') !== false ||
    strpos($_SERVER['HTTP_HOST'], ':8080') !== false ||
    strpos($_SERVER['HTTP_HOST'], ':3000') !== false ||
    strpos($_SERVER['HTTP_HOST'], ':8000') !== false
);

// Configurar CORS según el entorno
if ($isLocalDevelopment) {
    // DESARROLLO: Permitir localhost
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if (preg_match('/^https?:\/\/(localhost|127\.0\.0\.1)(:[0-9]+)?$/', $origin)) {
        header("Access-Control-Allow-Origin: $origin");
    } else {
        header("Access-Control-Allow-Origin: http://localhost:3001");
    }
} else {
    // PRODUCCIÓN: Solo dominios específicos
    header("Access-Control-Allow-Origin: https://visualmecanica.cl");
}

header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept");
header("Access-Control-Allow-Credentials: true");

// Manejar preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

// Configuración de errores
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Por defecto, respuestas JSON
header("Content-Type: application/json");

// Obtener la ruta solicitada
$requestUri = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);
$archivoSolicitado = __DIR__ . $requestUri;

// Verificar si es una solicitud de archivos estáticos
if (is_file($archivoSolicitado) && realpath($archivoSolicitado) !== realpath(__FILE__)) {
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
        readfile($archivoSolicitado);
        exit;
    }
    
    // Archivo PHP pero no es el router - PERMITIR ACCESO DIRECTO
    if ($extension === 'php' && realpath($archivoSolicitado) !== realpath(__FILE__)) {
        // Resetear headers para archivos PHP directos
        header_remove('Content-Type');
        require $archivoSolicitado;
        exit;
    }
}

// Procesar datos de entrada
$rawInput = file_get_contents('php://input');
if ($_SERVER['REQUEST_METHOD'] === 'POST' && !empty($_POST)) {
    $input = $_POST;
} else {
    $input = json_decode($rawInput, true) ?: [];
}

// Determinar la ruta solicitada
$ruta = $input['ruta'] ?? $_POST['ruta'] ?? $_GET['ruta'] ?? '';

// Logs para depuración
error_log("Método: " . $_SERVER['REQUEST_METHOD']);
error_log("Ruta: " . $ruta);
error_log("Datos: " . print_r($input, true));

// Enrutamiento
switch ($ruta) {
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
        // En producción, usar el archivo completo; en desarrollo, el simplificado
        if (file_exists(__DIR__ . '/notificarTransferencia.php') && 
            file_exists(__DIR__ . '/vendor/autoload.php')) {
            require 'notificarTransferencia.php';
        } else {
            require 'notificarTransferencia_simple.php';
        }
        break;
    case 'webpayRespuesta':
        require 'webpayRespuesta.php';
        break;
    case 'test':
        require 'test_router_cors.php';
        break;
    default:
        http_response_code(404);
        echo json_encode(["success" => false, "error" => "Ruta no encontrada", "ruta_recibida" => $ruta]);
        break;
}

// DEBUG: Mostrar la ruta solicitada y si el archivo existe
error_log('DEBUG - requestUri: ' . $requestUri);
error_log('DEBUG - archivoSolicitado: ' . $archivoSolicitado);
error_log('DEBUG - is_file(archivoSolicitado): ' . (is_file($archivoSolicitado) ? 'SI' : 'NO'));
?>