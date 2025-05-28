<?php
require_once __DIR__ . '/helpers/env.php';
require_once __DIR__ . '/helpers/rateLimiter.php';

rateLimit();

// --------------------------
// webpayRespuesta.php: refactorizado
// --------------------------

header('Access-Control-Allow-Origin: https://visualmecanica.cl');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Content-Type: application/json');

session_set_cookie_params([
  'lifetime' => 0,
  'path' => '/',
  'domain' => 'localhost',
  'secure' => false,
  'httponly' => true,
  'samesite' => 'Lax'
]);
session_start();

error_reporting(E_ALL & ~E_DEPRECATED & ~E_NOTICE & ~E_WARNING);
ini_set('display_errors', 0);

require 'conexionBD.php';
require_once __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . '/agregarEvento.php';

use Transbank\Webpay\WebpayPlus\Transaction;
use Transbank\Webpay\Options;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// --- CONFIGURACIÓN TRANSBANK
$apiKey = getenv_backend('WEBPAY_API_KEY');
$commerceCode = getenv_backend('WEBPAY_COMMERCE_CODE');
$environment = getenv_backend('WEBPAY_ENVIRONMENT', 'integration');
$options = new Options(
  $apiKey,
  $commerceCode,
  $environment === 'production' ? Options::ENVIRONMENT_PRODUCTION : Options::ENVIRONMENT_INTEGRATION
);  

// --- FUNCIONES AUXLIARES ---
function getDatosFormulario($token) {
    $datosFile = __DIR__ . "/tmp_datosform_$token.json";
    if (file_exists($datosFile)) {
        $jsonContent = file_get_contents($datosFile);
        if (json_last_error() === JSON_ERROR_NONE || is_string($jsonContent)) {
            $data = json_decode($jsonContent, true);
            unlink($datosFile); // Limpieza
            return $data;
        }
    }
    // Fallback a sesión
    if (isset($_SESSION['datos_formulario'])) {
        $data = $_SESSION['datos_formulario'];
        unset($_SESSION['datos_formulario']);
        return $data;
    }
    return null;
}

/**
 * Suma una hora a una cadena tipo 'HH:MM' y devuelve formato 'HH:MM'
 */
function sumarUnaHora($horaInicio) {
    $format = 'H:i';
    $dt = DateTime::createFromFormat($format, $horaInicio);
    if (!$dt) return '';
    $dt->modify('+1 hour');
    return $dt->format($format);
}

function enviarMail($params) {
    $mail = new PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host = $params['smtpHost'];
        $mail->SMTPAuth = true;
        $mail->Username = $params['smtpUser'];
        $mail->Password = $params['smtpPass'];
        $mail->SMTPSecure = $params['smtpSecure'];
        $mail->Port = $params['smtpPort'];
        $mail->CharSet = 'UTF-8';
        $mail->setFrom($params['fromEmail'], $params['fromName']);
        $mail->addAddress($params['toEmail'], $params['toName']);
        $mail->Subject = $params['subject'];
        $mail->isHTML(true);
        $mail->Body = $params['body'];
        $mail->AltBody = $params['altBody'];
        $mail->send();
        return true;
    } catch (Exception $e) {
        error_log('Error enviando correo (' . $params['subject'] . '): ' . $mail->ErrorInfo);
        return false;
    }
}

function logErrorAndExit($mensaje, $codigoHTTP = 400) {
    error_log($mensaje);
    http_response_code($codigoHTTP);
    echo json_encode(['success' => false, 'message' => $mensaje]);
    exit;
}

// --- OBTENCIÓN TOKEN ---
// --- LOGS DE DEPURACIÓN DE ENTRADA ---
error_log('DEBUG $_GET: ' . json_encode($_GET));
error_log('DEBUG $_POST: ' . json_encode($_POST));

// Permitir token_ws por POST, GET o fallback de archivo (para pruebas)
$token = $_POST['token_ws'] ?? $_GET['token_ws'] ?? (json_decode(@file_get_contents(__DIR__ . "/tmp_test.json"), true)['token_ws'] ?? null);
error_log('DEBUG $token: ' . $token);
if (!$token) logErrorAndExit('Token de pago no recibido. Debes enviar el parámetro token_ws por POST o GET.', 400);

// --- DATOS FORMULARIO/RESERVA ---
$data = getDatosFormulario($token);
if (!$data) logErrorAndExit('Datos de agendamiento no encontrados (por token ni sesión).', 422);

// Logging de datos clave
error_log("Token recibido: $token");
error_log("Datos de formulario: " . json_encode($data));

// --- INTENTAR TRANSACCIÓN (DEBE SER AUTORIZADA) ---
try {
    $transaction = new Transaction($options);
    $response = $transaction->commit($token);

    if ($response->getStatus() !== 'AUTHORIZED') logErrorAndExit('El pago no fue autorizado.', 402);
} catch (Exception $e) {
    logErrorAndExit('Error al procesar con Webpay: ' . $e->getMessage(), 500);
}

// --- EXTRAER Y VALIDAR DATOS ---
// Ajuste para soportar datos anidados en 'datos_frontend'
if (isset($data['datos_frontend'])) {
    $cliente = $data['datos_frontend']['cliente'] ?? [];
    $agendamiento = $data['datos_frontend']['agendamiento'] ?? [];
    $vendedor = $data['datos_frontend']['vendedor'] ?? [];
    $vehiculo = $data['datos_frontend']['vehiculo'] ?? [];
    $pago = $data['datos_frontend']['pago'] ?? [];
    $monto = $pago['monto'] ?? 0;
    $metodo = $pago['metodo'] ?? 'WebPay';
    $nombreServicio = $pago['nombreServicio'] ?? ($data['datos_frontend']['nombreServicio'] ?? '');
    $codigoDescuento = $pago['codigoDescuento'] ?? '';
} else {
    $cliente = $data['cliente'] ?? [];
    $agendamiento = $data['agendamiento'] ?? [];
    $vendedor = $data['vendedor'] ?? [];
    $vehiculo = $data['vehiculo'] ?? [];
    $monto = $data['pago']['monto'] ?? 0;
    $metodo = $data['pago']['metodo'] ?? 'WebPay';
    $nombreServicio = $data['pago']['nombreServicio'] ?? ($data['nombreServicio'] ?? '');
    $codigoDescuento = $data['pago']['codigoDescuento'] ?? '';
}

// --- CHEQUEO DISPONIBILIDAD EN BD Y GOOGLE CALENDAR ---
$fechaCheck = $agendamiento['fecha'] ?? '';
$bloqueCheck = $agendamiento['bloque'] ?? '';

if (empty($fechaCheck) || empty($bloqueCheck)) {
    logErrorAndExit('Datos de fecha o bloque no válidos.', 422);
}

// Chequear bloque ocupado BD
$debugStmt = $conn->prepare("SELECT * FROM agendamientos WHERE fecha_agendada = :fecha AND bloque = :bloque");
$debugStmt->execute([':fecha' => $fechaCheck, ':bloque' => $bloqueCheck]);
$debugRows = $debugStmt->fetchAll(PDO::FETCH_ASSOC);

foreach ($debugRows as $row) {
    if (
        (isset($cliente['rut']) && isset($row['rut_cliente']) && $cliente['rut'] === $row['rut_cliente']) ||
        (isset($cliente['email']) && isset($row['email_cliente']) && $cliente['email'] === $row['email_cliente'])
    ) {
        continue;
    } else {
        logErrorAndExit('Ese bloque ya está reservado. Elige otro.', 409);
    }
}

/**
 * Robust Google Calendar time range calculation.
 * Given $agendamiento['horario'], $agendamiento['hora_inicio'], $agendamiento['hora_fin'], or $bloqueCheck,
 * determines $horaInicio and $horaFin for Google Calendar.
 */
function calcularRangoHorario($agendamiento, $bloqueCheck, $bloques) {
    // 1. Prefer explicit hora_inicio/hora_fin
    if (!empty($agendamiento['hora_inicio']) && !empty($agendamiento['hora_fin'])) {
        return [
            trim($agendamiento['hora_inicio']),
            trim($agendamiento['hora_fin'])
        ];
    }
    // 2. If only hora_inicio, add 1 hour
    if (!empty($agendamiento['hora_inicio'])) {
        $inicio = trim($agendamiento['hora_inicio']);
        $fin = sumarUnaHora($inicio);
        return [$inicio, $fin];
    }
    // 3. If horario is a range (e.g. "09:00 - 13:00")
    if (!empty($agendamiento['horario'])) {
        $horario = $agendamiento['horario'];
        if (strpos($horario, '-') !== false) {
            list($inicio, $fin) = array_map('trim', explode('-', $horario));
            // If fin is missing, add 1 hour
            if (!$fin && $inicio) {
                $fin = sumarUnaHora($inicio);
            }
            return [$inicio, $fin];
        } else {
            // horario is a single hour
            $inicio = trim($horario);
            $fin = sumarUnaHora($inicio);
            return [$inicio, $fin];
        }
    }
    // 4. If bloqueCheck is a known block
    if (!empty($bloques[$bloqueCheck])) {
        $bloque = $bloques[$bloqueCheck];
        if (strpos($bloque, '-') !== false) {
            list($inicio, $fin) = array_map('trim', explode('-', $bloque));
            return [$inicio, $fin];
        }
    }
    // 5. Fallback: empty
    return [null, null];
}

// Chequear Google Calendar
$horario = $agendamiento['horario'] ?? '';
list($horaInicioGC, $horaFinGC) = calcularRangoHorario($agendamiento, $bloqueCheck, [
    'AM' => '09:00 - 13:00',
    'PM' => '14:00 - 18:00',
    // Agrega más si corresponde
]);
if ($fechaCheck && $horaInicioGC && $horaFinGC) {
    $fechaInicio = $fechaCheck . 'T' . $horaInicioGC . ':00-04:00';
    $fechaFin = $fechaCheck . 'T' . $horaFinGC . ':00-04:00';
    require_once __DIR__ . '/estaBloqueOcupadoEnGoogleCalendar.php';
    $ocupadoGC = estaBloqueOcupadoEnGoogleCalendar($fechaInicio, $fechaFin);
    if (isset($ocupadoGC['ocupado']) && $ocupadoGC['ocupado']) {
        logErrorAndExit('Ese bloque ya está reservado en Google Calendar. Elige otro.', 409);
    }
}

// --- INSERTAR EN BD ---
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
    ':fecha' => $fechaCheck,
    ':bloque' => $bloqueCheck,
    ':metodo_pago' => $metodo
]);

// --- GOOGLE CALENDAR: crea evento si corresponde ---
error_log("DEBUG Google Calendar: exito=$exito, fechaCheck=$fechaCheck, horario=$horario, bloqueCheck=$bloqueCheck");

if ($exito && $fechaCheck && $horaInicioGC && $horaFinGC) {
    $fechaInicio = $fechaCheck . 'T' . $horaInicioGC . ':00-04:00';
    $fechaFin = $fechaCheck . 'T' . $horaFinGC . ':00-04:00';
    $eventoGC = [
        'summary' => "$nombreServicio - " . ($cliente['nombre'] ?? ''),
        'location' => $cliente['direccion'] ?? '',
        'description' => 'Reserva para ' . ($cliente['nombre'] ?? '') . ' ' . ($cliente['apellido'] ?? ''),
        'start' => $fechaInicio,
        'end' => $fechaFin
    ];
    $resultadoGC = agregarEvento($eventoGC);
    if (!$resultadoGC['success']) {
        error_log('Error Google Calendar: ' . $resultadoGC['error']);
    }
}

// --- Extraer y formatear hora EXACTA de agendamiento elegida por el cliente ---
$bloques = [
    'AM' => '09:00 - 13:00',
    'PM' => '14:00 - 18:00',
    // Agrega más si corresponde, ej: 'NOCHE' => '19:00 - 22:00'
];

$horaAgendamiento = '';
$etiquetaHora = 'Hora';

// Determinar la hora y la etiqueta más adecuada para el mail
if (!empty($agendamiento['hora_inicio']) && !empty($agendamiento['hora_fin'])) {
    $horaAgendamiento = trim($agendamiento['hora_inicio']) . ' - ' . trim($agendamiento['hora_fin']);
    $etiquetaHora = 'Hora'; // Rango
} elseif (!empty($agendamiento['hora_inicio'])) {
    $horaAgendamiento = trim($agendamiento['hora_inicio']);
    $etiquetaHora = 'Hora de inicio';
} elseif (!empty($agendamiento['horario'])) {
    $horaAgendamiento = $agendamiento['horario'];
    $etiquetaHora = 'Hora';
} elseif (!empty($bloques[$bloqueCheck])) {
    $horaAgendamiento = $bloques[$bloqueCheck];
    $etiquetaHora = 'Hora';
} else {
    $horaAgendamiento = $bloqueCheck ?: 'Sin información';
    $etiquetaHora = 'Hora';
}

// --- EMAILS ---
$smtpHost = 'smtp.gmail.com';
$smtpUser = 'cotizacionautomotriz09@gmail.com';
$smtpPass = 'jewckbskarnbixwf';
$smtpPort = 587;
$smtpSecure = 'tls';
$fromEmail = 'cotizacionautomotriz09@gmail.com';
$fromName = 'Agenda Servicio';

// Plantilla para el cliente
// --- Log para depuración de valores de pago ---
//error_log("DEBUG PAGO: " . json_encode($pago));
// --- Cálculo de valores para comprobante ---
$recargo = $pago['recargo'] ?? 0;
$montoBase = $pago['montoBase'] ?? ($monto - $recargo);
$montoTotal = $montoBase + $recargo;

require_once __DIR__ . "/helpers/generarComprobanteCliente.php";

$comprobante = generarComprobanteCliente(
    $cliente['nombre'] . ' ' . $cliente['apellido'],
    $nombreServicio,
    $fechaCheck,
    $horaAgendamiento,
    $cliente['telefono'] ?? null,
    $cliente['email'] ?? null,
    $cliente['direccion'] ?? null,
    $cliente['region'] ?? null,
    $cliente['comuna'] ?? null,
    $montoBase,
    $recargo,
    $montoTotal ?? null
);
    


// Plantilla para la empresa
// --- Cálculo de valores para comprobante empresa ---
$montoBase = $pago['montoBase'] ?? $pago['monto'];
$recargo = $pago['recargo'] ?? 0;
$montoTotal = $montoBase + $recargo;

require_once __DIR__ . '/helpers/generarComprobanteEmpresa.php';

$detalleEmpresa = generarComprobanteEmpresa(
    $cliente,
    $fechaCheck,
    $bloqueCheck,
    $horaAgendamiento,
    $nombreServicio,
    $montoTotal,
    $vendedor,
    $etiquetaHora,
    $montoBase,     // <-- Agrega aquí el monto base
    $recargo        // <-- Y aquí el recargo
);

// Cliente (personaliza parámetros aquí)
enviarMail([
    'smtpHost' => $smtpHost,
    'smtpUser' => $smtpUser,
    'smtpPass' => $smtpPass,
    'smtpSecure' => $smtpSecure,
    'smtpPort' => $smtpPort,
    'fromEmail' => $fromEmail,
    'fromName' => $fromName,
    'toEmail' => $cliente['email'],
    'toName' => $cliente['nombre'] . ' ' . $cliente['apellido'],
    'subject' => 'Comprobante de Pago y Agenda de Servicio',
    'body' => $comprobante,
    'altBody' => '¡Tu pago y agendamiento han sido exitosos!'
]);

// Empresa (personaliza igual)
enviarMail([
    'smtpHost' => $smtpHost,
    'smtpUser' => $smtpUser,
    'smtpPass' => $smtpPass,
    'smtpSecure' => $smtpSecure,
    'smtpPort' => $smtpPort,
    'fromEmail' => $fromEmail,
    'fromName' => $fromName,
    'toEmail' => 'cotizacionautomotriz09@gmail.com',
    'toName' => 'Reservas Empresa',
    'subject' => 'Nueva Agenda de Servicio vía WebPay',
    'body' => $detalleEmpresa,
    'altBody' => 'Nueva reserva realizada.'
]);

// --- FLUJO PRINCIPAL ---
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Procesar notificación de Webpay (server-to-server)
    // (Todo el código de procesamiento, guardado en BD, envío de correos, etc. ya está arriba)
    // Si llegaste aquí, todo fue exitoso
    error_log('POST recibido y procesado correctamente. Enviando respuesta a Webpay.');
    echo json_encode([
        'success' => true,
        'message' => 'Pago y agendamiento exitoso.',
        'bloque' => $bloqueCheck,
        'fecha' => $fechaCheck,
        'horario' => $horario
    ]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Solo redirige al frontend (no proceses lógica ni envíes correos aquí)
    $estado = 'exitoso'; // o 'fallido', puedes mejorar esto leyendo de la BD si quieres mostrar el estado real
    error_log('GET recibido. Redirigiendo a frontend con estado: ' . $estado);
    header('Location: http://localhost:3000/resultado-pago?estado=' . $estado);
    exit;
}

// Si llega por otro método, responde con error
http_response_code(405);
echo json_encode(['success' => false, 'error' => 'Método no permitido']);
exit;
?>
