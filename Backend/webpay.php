<?php
// Deshabilitar warnings de deprecated para evitar problemas en respuesta JSON
error_reporting(E_ALL & ~E_DEPRECATED);

require_once __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . '/helpers/env.php';
require_once __DIR__ . '/helpers/rateLimiter.php';

// Configurar cabeceras CORS automáticamente
require_once 'helpers/corsHeaders.php';
setCorsHeaders();

header('Content-Type: application/json');

error_log("Datos recibidos: " . print_r($_POST, true));

register_shutdown_function(function() {
    $error = error_get_last();
    if ($error && in_array($error['type'], [E_ERROR, E_CORE_ERROR, E_COMPILE_ERROR, E_PARSE])) {
        if (!headers_sent()) {
            header('Content-Type: application/json');
            http_response_code(500);
        }
        echo json_encode([
            "success" => false,
            "error" => "Error fatal en PHP: " . $error['message']
        ]);
    }
});

session_start();

// Cargar clases de Transbank sin mostrar warnings deprecated
use Transbank\Webpay\WebpayPlus\Transaction;
use Transbank\Webpay\Options;

$apiKey = getenv_backend('WEBPAY_API_KEY');
$commerceCode = getenv_backend('WEBPAY_COMMERCE_CODE');
$environment = getenv_backend('WEBPAY_ENVIRONMENT', 'integration');

// Validar que las credenciales estén configuradas
if (empty($apiKey) || empty($commerceCode)) {
    error_log("ERROR: Credenciales de Webpay no configuradas correctamente");
    throw new Exception("Configuración de pago no disponible");
}

$options = new Options(
  $apiKey,
  $commerceCode,
  $environment === 'production' ? Options::ENVIRONMENT_PRODUCTION : Options::ENVIRONMENT_INTEGRATION
);

$yaRespondio = false;

try {
    $datosJSON = file_get_contents("php://input");
    $datos = json_decode($datosJSON, true);
    $nowLog = "[" . date('d-M-Y H:i:s T') . "] ";

    error_log($nowLog . "Recibiendo datos de la solicitud...");

    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception("JSON inválido: " . json_last_error_msg());
    }

    error_log($nowLog . "JSON recibido: " . $datosJSON);
    error_log($nowLog . "DEBUG: Estado de datos recibidos antes de validar agendamiento: " . json_encode($datos));

    if (
        !isset($datos['agendamiento']) ||
        !(is_array($datos['agendamiento']) || is_object($datos['agendamiento']))
    ) {
        throw new Exception("Falta el objeto 'agendamiento'.");
    }

    if (!isset($datos['pago']['monto']) || !is_numeric($datos['pago']['monto']) || $datos['pago']['monto'] <= 0) {
        throw new Exception("Monto de pago inválido o faltante.");
    }

    if (!isset($datos['cliente']['email'])) {
        throw new Exception("Datos de cliente inválidos o faltantes.");
    }

    if (is_object($datos['agendamiento'])) {
        $datos['agendamiento'] = (array)$datos['agendamiento'];
    }

    $fecha = $datos['agendamiento']['fecha'] ?? null;
    $bloque = $datos['agendamiento']['bloque'] ?? null;

    if (empty($fecha) || empty($bloque)) {
        throw new Exception("Debe seleccionar fecha y bloque de agendamiento antes de pagar.");
    }

    // Lógica de recargo para Región IX
    $comunas_con_recargo = [
        "Pucon", "Villarrica", "Galvarino", "Victoria", "Nueva Imperial", "Gorbea"
    ];
    $recargo = 0;
    if (
        isset($datos['vendedor']['region'], $datos['vendedor']['comuna']) &&
        $datos['vendedor']['region'] === 'IX' &&
        in_array($datos['vendedor']['comuna'], $comunas_con_recargo)
    ) {
        $recargo = 15000;
    }
    $montoBase = intval($datos['pago']['monto']); // monto base recibido
    $amount = $montoBase + $recargo; // Ahora el monto enviado a Webpay SIEMPRE incluye el recargo
    // También actualizamos el monto en el array de pago para que quede correcto
    $datos['pago']['monto'] = $amount;
    $buyOrder = $datos['buyOrder'] ?? uniqid();
    $sessionId = $datos['sessionId'] ?? session_id();
    
    // Definir la URL base para la URL de retorno
    $baseUrl = getenv_backend('APP_URL', 'http://localhost/pre-compra/Backend');
    $returnUrl = $baseUrl . '/webpayRespuesta.php';

    error_log($nowLog . "Creando transacción Webpay: buyOrder=$buyOrder, sessionId=$sessionId, amount=$amount, returnUrl=$returnUrl");

    try {
        $transaction = new Transaction($options);
        $response = $transaction->create($buyOrder, $sessionId, $amount, $returnUrl);
        $token = $response->getToken();
        
        if (empty($token)) {
            throw new Exception("No se pudo obtener el token de Webpay");
        }
        
        error_log($nowLog . "Transacción WebpayPlus creada exitosamente. Token: $token, URL: " . $response->getUrl());
        
    } catch (Exception $e) {
        error_log($nowLog . "Error creando transacción Webpay: " . $e->getMessage());
        throw new Exception("Error al crear la transacción de pago: " . $e->getMessage());
    }

    // Actualizamos el monto total en el array de pago antes de guardar
    $datos['pago']['monto'] = $amount;

    $tmpFilePath = __DIR__ . "/tmp_datosform_" . $token . ".json";
    $toSave = [
        'datos_frontend' => $datos,
        'buyOrder' => $buyOrder,
        'sessionId' => $sessionId,
        'amount' => $amount,
        'fecha_creacion' => date('c')
    ];
    $resultadoArchivo = file_put_contents($tmpFilePath, json_encode($toSave));

    if ($resultadoArchivo === false) {
        throw new Exception("Error al guardar datos temporales previos al pago.");
    }

    error_log($nowLog . "Archivo temporal guardado exitosamente: $tmpFilePath");

    echo json_encode([
        'success' => true,
        'url' => $response->getUrl(),
        'token' => $token
    ]);

} catch (Exception $e) {
    error_log("[" . date('d-M-Y H:i:s T') . "] EXCEPCIÓN: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}

?>
