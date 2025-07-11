<?php
// Este script es una versión simplificada de notificarTransferencia.php
// que aísla los problemas para poder solucionarlos uno a uno

// Configuración básica de errores
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('log_errors', 1);

// Función para log detallado
function debug_log($mensaje, $nivel = 'INFO') {
    error_log("[$nivel] " . $mensaje);
}

debug_log("===== INICIO DE EJECUCIÓN DE notificarTransferencia_fix.php =====");

// Configurar cabeceras CORS básicas directamente
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

// Manejar OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Validar método y content-type
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        "success" => false,
        "error" => "Método incorrecto",
        "details" => "Este endpoint sólo acepta solicitudes POST"
    ]);
    exit;
}

// Validar Content-Type
if (!isset($_SERVER['CONTENT_TYPE']) || stripos($_SERVER['CONTENT_TYPE'], 'application/json') === false) {
    echo json_encode([
        "success" => false,
        "error" => "Content-Type inválido",
        "details" => "La solicitud debe ser enviada como application/json"
    ]);
    exit;
}

// Obtener datos de entrada
$raw_input = file_get_contents("php://input");
$input = json_decode($raw_input, true);

// Validar JSON
if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode([
        "success" => false,
        "error" => "JSON inválido",
        "details" => "Error: " . json_last_error_msg()
    ]);
    exit;
}

// Log detallado de datos recibidos
debug_log("Datos recibidos: " . json_encode($input, JSON_PRETTY_PRINT));

// Respuesta de prueba (simulando un procesamiento exitoso)
$response = [
    "success" => true,
    "message" => "Solicitud procesada correctamente (versión simplificada)",
    "debug_mode" => true,
    "data_received" => $input,
    "mail" => [
        "success" => true,
        "simulated" => true
    ],
    "calendar" => [
        "success" => true,
        "simulated" => true
    ]
];

// Enviar respuesta
echo json_encode($response);
?>
