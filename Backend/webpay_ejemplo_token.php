# webpay.php (completo usando almacenamiento por token)

```php
<?php
require_once __DIR__ . '/helpers/env.php';
require_once __DIR__ . '/helpers/rateLimiter.php';

rateLimit();

// Configuración de CORS y manejo de errores
header('Access-Control-Allow-Origin: https://visualmecanica.cl');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Oculta errores de deprecated, notice y warnings (para no contaminar output JSON)
error_reporting(E_ALL & ~E_DEPRECATED & ~E_NOTICE & ~E_WARNING);
ini_set('display_errors', 0);

// Manejo de preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Manejo de errores sin mostrar detalles en la respuesta
register_shutdown_function(function() {
    $error = error_get_last();
    if ($error && (in_array($error['type'], [E_ERROR, E_CORE_ERROR, E_COMPILE_ERROR, E_PARSE]))) {
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

require_once __DIR__ . '/vendor/autoload.php';

use Transbank\Webpay\WebpayPlus\Transaction;
use Transbank\Webpay\Options;

// Configuración desde .env o valores por defecto
if (file_exists(__DIR__ . '/.env')) {
    $envVars = parse_ini_file(__DIR__ . '/.env');
    $commerceCode = $envVars['WEBPAY_COMMERCE_CODE'] ?? '597055555532';
    $apiKey = $envVars['WEBPAY_API_KEY'] ?? '579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C';
    $environment = $envVars['WEBPAY_ENVIRONMENT'] ?? 'integration';
    $baseUrl = $envVars['APP_URL'] ?? 'http://localhost:8000';
} else {
    $commerceCode = '597055555532';
    $apiKey = '579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C';
    $environment = 'integration';
    $baseUrl = 'http://localhost:8000';
}

$options = new Options(
    $apiKey,
    $commerceCode,
    $environment === 'production'
        ? Options::ENVIRONMENT_PRODUCTION
        : Options::ENVIRONMENT_INTEGRATION
);

try {
    $datosJSON = file_get_contents("php://input");
    $datos = json_decode($datosJSON, true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('Error al decodificar JSON: ' . json_last_error_msg());
    }

    $buyOrder = $datos['buyOrder'] ?? uniqid();
    $sessionId = $datos['sessionId'] ?? uniqid("sess_");
    $amount = $datos['amount'] ?? 1000;
    $returnUrl = $baseUrl . '/Backend/webpayRespuesta.php';

    $transaction = new Transaction($options);
    $response = $transaction->create($buyOrder, $sessionId, $amount, $returnUrl);
    $token = $response->getToken();

    // ---- Persistencia por token ----
    file_put_contents(__DIR__ . "/tmp_datosform_$token.json", json_encode($datos));

    echo json_encode([
        'success' => true,
        'url' => $response->getUrl(),
        'token' => $token,
        // 'response' => $response // descomenta solo para depuración
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}



# webpayRespuesta.php (completo usando recuperación por token)




header('Content-Type: application/json');
error_reporting(E_ALL & ~E_DEPRECATED & ~E_NOTICE & ~E_WARNING);
ini_set('display_errors', 0);

require 'conexionBD.php';
require_once __DIR__ . '/vendor/autoload.php';

$commerceCode = '597055555532';
$apiKey = '579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C';
$environment = Options::ENVIRONMENT_INTEGRATION;

header("Access-Control-Allow-Origin: https://visualmecanica.cl");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

$options = new Options(
    $apiKey,
    $commerceCode,
    $environment
);

$token = null;
if (isset($_GET['token_ws'])) {
    $token = $_GET['token_ws'];
} else {
    $data = json_decode(file_get_contents("php://input"), true);
    $token = $data['token_ws'] ?? null;
}

if (!$token) {
    echo json_encode(['success' => false, 'message' => 'Token de pago no recibido.']);
    exit;
}

// ---- Recuperar datos de archivo temporal por token ----
$datosFile = __DIR__ . "/tmp_datosform_$token.json";
if (file_exists($datosFile)) {
    $data = json_decode(file_get_contents($datosFile), true);
    // Opcional: eliminar archivo temporal (buena práctica)
    unlink($datosFile);
} else {
    echo json_encode(['success' => false, 'message' => 'Datos de agendamiento no encontrados (por token).']);
    exit;
}

try {
    $transaction = new Transaction($options);
    $response = $transaction->commit($token);

    if ($response->getStatus() !== 'AUTHORIZED') {
        echo json_encode(['success' => false, 'message' => 'El pago no fue autorizado.']);
        exit;
    }

    $cliente = $data['cliente'] ?? [];
    $agendamiento = $data['agendamiento'] ?? [];
    $vehiculo = $data['vehiculo'] ?? [];
    $vendedor = $data['vendedor'] ?? [];
    $monto = $data['pago']['monto'] ?? 0;
    $metodo = $data['pago']['metodo'] ?? 'WebPay';
    $nombreServicio = $data['pago']['nombreServicio'] ?? ($data['nombreServicio'] ?? '');
    $codigoDescuento = $data['pago']['codigoDescuento'] ?? '';

    // Verificar si el bloque ya está ocupado
    $check = $conn->prepare("SELECT COUNT(*) FROM agendamientos WHERE fecha_agendada = :fecha AND bloque = :bloque");
    $check->execute([
        ':fecha' => $agendamiento['fecha'],
        ':bloque' => $agendamiento['bloque']
    ]);
    if ($check->fetchColumn() > 0) {
        echo json_encode(['success' => false, 'message' => 'Ese bloque ya está reservado. Elige otro.']);
        exit;
    }

    // Insertar en base de datos
    $stmt = $conn->prepare("INSERT INTO agendamientos (
        marca_vehiculo, modelo_vehiculo, anio_vehiculo, patente,
        nombre_cliente, apellido_cliente, email_cliente, telefono_cliente, rut_cliente,
        direccion_cliente, region_cliente, comuna_cliente,
        tipo_vendedor, nombre_vendedor, telefono_vendedor, direccion_vendedor, region_vendedor, comuna_vendedor,
        fecha_agendada, bloque, metodo_pago
    ) VALUES (
        :marca, :modelo, :anio, :patente,
        :nombre, :apellido, :email, :telefono, :rut,
        :direccion, :region, :comuna,
        :tipo_vendedor, :nombre_vendedor, :telefono_vendedor, :direccion_vendedor, :region_vendedor, :comuna_vendedor,
        :fecha, :bloque, :metodo_pago
    )");

    $exito = $stmt->execute([
        ':marca' => $vehiculo['marca'] ?? '',
        ':modelo' => $vehiculo['modelo'] ?? '',
        ':anio' => $vehiculo['anio'] ?? '',
        ':patente' => $vehiculo['patente'] ?? '',
        ':nombre' => $cliente['nombre'] ?? '',
        ':apellido' => $cliente['apellido'] ?? '',
        ':email' => $cliente['email'] ?? '',
        ':telefono' => $cliente['telefono'] ?? '',
        ':rut' => $cliente['rut'] ?? '',
        ':direccion' => $cliente['direccion'] ?? '',
        ':region' => $cliente['region'] ?? '',
        ':comuna' => $cliente['comuna'] ?? '',
        ':tipo_vendedor' => $vendedor['tipo'] ?? '',
        ':nombre_vendedor' => $vendedor['nombre'] ?? '',
        ':telefono_vendedor' => $vendedor['telefono'] ?? '',
        ':direccion_vendedor' => $vendedor['direccion'] ?? '',
        ':region_vendedor' => $vendedor['region'] ?? '',
        ':comuna_vendedor' => $vendedor['comuna'] ?? '',
        ':fecha' => $agendamiento['fecha'] ?? '',
        ':bloque' => $agendamiento['bloque'] ?? '',
        ':metodo_pago' => $metodo
    ]);

    if ($exito) {
        // Aquí podrías eliminar el archivo temporal si no lo hiciste antes
        echo json_encode([
            'success' => true,
            'message' => 'Pago y agendamiento exitoso.',
            'cliente' => $cliente,
            'agendamiento' => $agendamiento,
            'pago' => [
                'monto' => $monto,
                'metodo' => $metodo,
                'nombreServicio' => $nombreServicio,
                'codigoDescuento' => $codigoDescuento
            ]
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'No se pudo guardar en la base de datos.']);
    }

} catch (Exception $e) {
    error_log("Error en webpayRespuesta.php: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Error interno del servidor.']);
} ;
