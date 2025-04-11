<?php

// Mostrar errores en desarrollo
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Cabecera para indicar respuesta JSON
header('Content-Type: application/json');

session_start();

// Autoload de SDK WebPay
require_once __DIR__ . '/vendor/autoload.php';

use Transbank\Webpay\WebpayPlus\Transaction;
use Transbank\Webpay\WebpayPlus\Options;

// ⚠️ Configura correctamente tu código de comercio y ambiente aquí
Options::setCommerceCode('597055555532'); // Código de comercio de prueba
Options::setApiKey('X'); // Tu API Key si es necesaria
Options::setIntegrationType(Options::ENVIRONMENT_INTEGRATION); // Modo integración

// Recibir datos desde React
$datosJSON = file_get_contents("php://input");
$datos = json_decode($datosJSON, true);

// Validar JSON recibido
if (!$datos) {
    echo json_encode(['success' => false, 'error' => 'Datos JSON inválidos.']);
    exit;
}

// Guardar en sesión para usarlos luego
$_SESSION['datos_formulario'] = $datos;

// Generar identificadores
$buyOrder = 'ORDEN_' . uniqid();
$sessionId = session_id();
$returnUrl = 'http://localhost:8000/webpayRespuesta.php'; // URL de retorno de WebPay

// Obtener monto
$monto = isset($datos['pago']['monto']) ? intval($datos['pago']['monto']) : 0;
if ($monto <= 0) {
    echo json_encode(['success' => false, 'error' => 'Monto inválido para la transacción.']);
    exit;
}

try {
    // Iniciar transacción con WebPay
    $response = (new Transaction)->create($buyOrder, $sessionId, $monto, $returnUrl);

    // Devolver datos al frontend
    echo json_encode([
        'success' => true,
        'token' => $response->getToken(),
        'url' => $response->getUrl()
    ]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => 'Error en la transacción: ' . $e->getMessage()]);
}
