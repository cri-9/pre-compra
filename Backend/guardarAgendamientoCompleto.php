<?php
// --- INCLUDES Y REQUERIMIENTOS ---
require_once __DIR__ . '/helpers/generarHtmlCorreoAgendamiento.php';
require_once __DIR__ . '/helpers/generarTextoCorreoAgendamiento.php';
require_once __DIR__ . '/helpers/generarComprobanteEmpresa.php';
require_once __DIR__ . '/helpers/generarComprobanteCliente.php';
require_once __DIR__ . '/helpers/generarHtmlCorreoTransferencia.php';
require_once __DIR__ . '/helpers/generarTextoCorreoTransferencia.php';
require_once __DIR__ . '/helpers/formatearFechaHoraEspanol.php';
require_once __DIR__ . '/helpers/comprobantes_actualizados.php';
require_once __DIR__ . '/enviarCorreo.php';
require_once __DIR__ . '/agregarEvento.php';

// CORS y encabezados
header('Access-Control-Allow-Origin: https://visualmecanica.cl');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Recibe los datos del frontend (JSON POST)
$input = json_decode(file_get_contents('php://input'), true);

// Validaciones básicas de los datos de entrada
if (
    !isset($input['nombre'], $input['email'], $input['servicio'], $input['fechaYHora']) ||
    empty($input['nombre']) || empty($input['email']) || empty($input['servicio']) || empty($input['fechaYHora'])
) {
    echo json_encode([
        'success' => false,
        'error' => 'Faltan datos requeridos para el agendamiento.'
    ]);
    exit;
}

// --- DATOS DEL CLIENTE Y SERVICIO ---
$nombreCliente = $input['nombre'];
$emailCliente = $input['email'];
$servicio = $input['servicio'];
$fechaYHora = $input['fechaYHora']; // Ejemplo: "2024-06-15 10:00"

// --- FORMATEO DE FECHA Y HORA ---
$fechaHoraFormateada = formatearFechaHoraEspanol($fechaYHora);
$fecha = $fechaHoraFormateada['fecha'];
$hora = $fechaHoraFormateada['hora'];

// --- GENERACIÓN DE MENSAJES ---
$mensajeHtml = generarHtmlCorreoAgendamiento($nombreCliente, $servicio, $fecha, $hora);
$mensajeTexto = generarTextoCorreoAgendamiento($nombreCliente, $servicio, $fecha, $hora);

// --- ARMADO DE DATOS PARA EL CORREO ---
$datosCorreo = [
    'destinatario' => $emailCliente,
    // 'nombreDestinatario' => $nombreCliente, // Opcional, si tu función lo soporta
    'asunto' => 'Confirmación de agendamiento',
    'mensajeHtml' => $mensajeHtml,
    'mensajeTexto' => $mensajeTexto,
    'cc' => 'auditoria@visualmecanica.cl', // Opcional: copia
    'bcc' => 'soporte@visualmecanica.cl' // Opcional: copia oculta
];

// --- VALIDACIÓN DE EMAIL ---
if (!filter_var($datosCorreo['destinatario'], FILTER_VALIDATE_EMAIL)) {
    echo json_encode([
        'success' => false,
        'error' => 'El correo del destinatario no es válido.'
    ]);
    exit;
}

// --- ENVÍO DE CORREO ---
$mailResult = enviarCorreo($datosCorreo);

// --- CREACIÓN DE EVENTO EN GOOGLE CALENDAR ---
$startDateTime = date('c', strtotime($fechaYHora));
$endDateTime = date('c', strtotime("$fechaYHora +1 hour")); // Ejemplo: 1 hora de duración
$datosEvento = [
    'summary' => "Agendamiento: $servicio",
    'location' => "Taller Visual Mecánica",
    'description' => "Cliente: $nombreCliente, Email: $emailCliente",
    'start' => $startDateTime,
    'end' => $endDateTime
];

// Puedes activar modo debug para pruebas: $modoDebug = true;
$modoDebug = false;
$calendarResult = agregarEvento($datosEvento);

// --- RESPUESTA FINAL ---
echo json_encode([
    "success" => $mailResult['success'] && $calendarResult['success'],
    "mail" => $mailResult,
    "calendar" => $calendarResult
]);