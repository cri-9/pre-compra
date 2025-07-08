<?php

//oculta errores de deprecated y notice
error_reporting(E_ALL & ~E_DEPRECATED & ~E_NOTICE & ~E_WARNING);
ini_set('display_errors', 0);

// === CONFIGURACIÓN DE MODO DEBUG GLOBAL ===
$MODO_DEBUG = false; // Cambia a false para ejecución real

// Configurar cabeceras CORS automáticamente
require_once 'helpers/corsHeaders.php';
setCorsHeaders();

header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Validación del método---
if ($_SERVER['REQUEST_METHOD'] === 'POST' && 
    (!isset($_SERVER['CONTENT_TYPE']) || 
     stripos($_SERVER['CONTENT_TYPE'], 'application/json') === false)) {
    error_log("Content-Type inválido: " . ($_SERVER['CONTENT_TYPE'] ?? 'no especificado'));
    http_response_code(415);
    echo json_encode([
        "success" => false,
        "error" => "Content-Type inválido",
        "details" => "La solicitud debe ser enviada como application/json"
    ]);
    exit;
}

error_log("Iniciando notificarTransferencia.php");

// Verificar extensiones requeridas
$required_extensions = ['openssl', 'json', 'mbstring'];
$missing_extensions = [];

foreach ($required_extensions as $ext) {
    if (!extension_loaded($ext)) {
        $missing_extensions[] = $ext;
    }
}

if (!empty($missing_extensions)) {
    $missing = implode(', ', $missing_extensions);
    error_log("Error: Las siguientes extensiones de PHP no están instaladas: $missing");
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => "Error de configuración del sistema",
        "details" => "Las siguientes extensiones de PHP son requeridas pero no están instaladas: $missing"
    ]);
    exit;
}

error_log("Todas las extensiones requeridas están instaladas");

// Verificar si existe vendor/autoload.php
if (!file_exists(__DIR__ . '/vendor/autoload.php')) {
    error_log("Error: vendor/autoload.php no encontrado. Por favor ejecute 'composer install'");
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => "Error de configuración del sistema",
        "details" => "Dependencias no instaladas"
    ]);
    exit;
}

try {
    error_log("Cargando vendor/autoload.php");
    require __DIR__ . '/vendor/autoload.php';
    error_log("vendor/autoload.php cargado exitosamente");

    // La conexión a BD es opcional ya que no se usa en este endpoint
    if (file_exists(__DIR__ . '/conexionBD.php')) {
        error_log("Cargando conexionBD.php");
        @include __DIR__ . '/conexionBD.php';
        error_log("conexionBD.php cargado exitosamente");
    } else {
        error_log("conexionBD.php no encontrado - continuando sin conexión a BD");
    }
} catch (Exception $e) {
    error_log("Error al cargar dependencias: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => "Error al cargar dependencias",
        "details" => $e->getMessage()
    ]);
    exit;
}

// Cargar PHPMailer
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Cargar Google API Client
use Google\Client as Google_Client;
use Google\Service\Calendar as Google_Service_Calendar;
use Google\Service\Calendar\Event as Google_Service_Calendar_Event;
use Google\Service\Exception as Google_Service_Exception;

// --- REUTILIZAR $input del router, o leerlo si no existe ---
if (!isset($input)) {
    $input = json_decode(file_get_contents("php://input"), true);
}

if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode(["success" => false, "error" => "JSON inválido"], JSON_UNESCAPED_UNICODE);
    exit;
}

// Definir límites máximos para los campos
$maxLengths = [
    'email' => 100,
    'nombre' => 50,
    'telefono' => 15,
    'metodoPago' => 15,
    'servicio' => 30
];

// Validar campos obligatorios y sus longitudes
$requiredFields = ['email', 'nombre', 'telefono', 'metodoPago'];
foreach ($requiredFields as $field) {
    if (empty($input[$field]) || (is_string($input[$field]) && trim($input[$field]) === '')) {
        error_log("Campo requerido faltante o vacío: $field");
        echo json_encode([
            "success" => false, 
            "error" => "Campo requerido faltante o vacío", 
            "details" => "El campo '$field' es obligatorio y no puede estar vacío"
        ]);
        exit;
    }
    
    if (strlen($input[$field]) > $maxLengths[$field]) {
        error_log("Campo excede longitud máxima: $field");
        echo json_encode([
            "success" => false,
            "error" => "Campo demasiado largo",
            "details" => "El campo '$field' no puede exceder {$maxLengths[$field]} caracteres"
        ]);
        exit;
    }
}

// Validar nombre
$nombre = trim($input['nombre']);
if (strlen($nombre) < 3) {
    error_log("Nombre demasiado corto: " . $nombre);
    echo json_encode([
        "success" => false,
        "error" => "Nombre inválido",
        "details" => "El nombre debe tener al menos 3 caracteres"
    ]);
    exit;
}

// Validar caracteres especiales en el nombre
if (!preg_match('/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/', $nombre)) {
    error_log("Nombre contiene caracteres inválidos: " . $nombre);
    echo json_encode([
        "success" => false,
        "error" => "Nombre inválido",
        "details" => "El nombre solo puede contener letras y espacios"
    ]);
    exit;
}

$input['nombre'] = $nombre;

if (!filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
    error_log("Formato de email inválido: " . $input['email']);
    echo json_encode([
        "success" => false,
        "error" => "Formato de email inválido",
        "details" => "Por favor ingrese una dirección de correo válida"
    ]);
    exit;
}

$email_parts = explode('@', $input['email']);
$domain = $email_parts[1];
if (!checkdnsrr($domain, 'MX')) {
    error_log("Dominio de email inválido: " . $domain);
    echo json_encode([
        "success" => false,
        "error" => "Dominio de email inválido",
        "details" => "Por favor ingrese una dirección de correo con un dominio válido"
    ]);
    exit;
}

$input['email'] = filter_var($input['email'], FILTER_SANITIZE_EMAIL);

$telefono = preg_replace('/[^0-9]/', '', $input['telefono']);
if (!preg_match('/^(\+?56|0)?[9][0-9]{8}$/', $telefono)) {
    error_log("Número de teléfono inválido: " . $input['telefono']);
    echo json_encode([
        "success" => false,
        "error" => "Número de teléfono inválido",
        "details" => "Por favor ingrese un número de teléfono móvil chileno válido (9 dígitos comenzando con 9)"
    ]);
    exit;
}

$input['telefono'] = '+56' . substr($telefono, -9);

// Validar monto base (precio del servicio)
if (!isset($input['monto']) || !is_numeric($input['monto']) || $input['monto'] <= 0) {
    error_log("Monto inválido: " . ($input['monto'] ?? 'no especificado'));
    echo json_encode([
        "success" => false,
        "error" => "Monto inválido",
        "details" => "El monto debe ser un número mayor a 0"
    ]);
    exit;
}

$precios_servicios = [
    'Servicio Básico' => 30000,
    'Servicio Semi Full' => 45000,
    'Servicio Full' => 65000
];

if (!isset($precios_servicios[$input['servicio']]) || $input['monto'] != $precios_servicios[$input['servicio']]) {
    error_log("Monto base no corresponde al servicio: Servicio={$input['servicio']}, Monto base={$input['monto']}");
    echo json_encode([
        "success" => false,
        "error" => "Monto base inválido",
        "details" => "El monto base no corresponde al precio del servicio seleccionado"
    ]);
    exit;
}

// Validar recargo y descuento
$recargo = isset($input['recargo']) ? (int)$input['recargo'] : 0;
$descuento = isset($input['descuento']) ? (int)$input['descuento'] : 0;
$total = isset($input['total']) ? (int)$input['total'] : ($input['monto'] + $recargo - $descuento);

if ($total !== ($input['monto'] + $recargo - $descuento) || $total <= 0) {
    error_log("Total inválido: Base={$input['monto']}, Recargo={$recargo}, Descuento={$descuento}, Total={$total}");
    echo json_encode([
        "success" => false,
        "error" => "Total inválido",
        "details" => "El total debe ser igual a monto base + recargo - descuento y mayor a 0"
    ]);
    exit;
}

// Guardar en input para uso posterior
$input['recargo'] = $recargo;
$input['descuento'] = $descuento;
$input['total'] = $total;

$input['monto'] = (int)$input['monto'];

$servicios_permitidos = [
    'Servicio Básico',
    'Servicio Semi Full',
    'Servicio Full'
];

if (empty($input['servicio']) || !in_array($input['servicio'], $servicios_permitidos)) {
    error_log("Servicio inválido: " . ($input['servicio'] ?? 'no especificado'));
    echo json_encode([
        "success" => false,
        "error" => "Servicio inválido",
        "details" => "Por favor seleccione uno de los servicios disponibles: " . implode(', ', $servicios_permitidos)
    ]);
    exit;
}

$input['servicio'] = htmlspecialchars($input['servicio'], ENT_QUOTES, 'UTF-8');

if (!in_array($input['metodoPago'], ['Transferencia', 'WebPay'])) {
    error_log("Método de pago inválido: " . $input['metodoPago']);
    echo json_encode([
        "success" => false,
        "error" => "Método de pago inválido",
        "details" => "El método de pago debe ser Transferencia o WebPay"
    ]);
    exit;
}

// Validar campos obligatorios adicionales
$requiredAdditionalFields = ['direccion', 'region', 'comuna'];
$missingFields = [];
foreach ($requiredAdditionalFields as $field) {
    if (empty($input[$field])) {
        $missingFields[] = $field;
    }
}
if (!empty($missingFields)) {
    error_log("Campos requeridos faltantes: " . implode(', ', $missingFields));
    echo json_encode([
        "success" => false, 
        "error" => "Campos requeridos faltantes", 
        "details" => "Faltan los siguientes campos: " . implode(', ', $missingFields)
    ]);
    exit;
}

// Variables clave
$email      = $input['email'];
$nombre     = $input['nombre'];
$telefono   = $input['telefono'];
$direccion  = trim($input['direccion']);
$region     = trim($input['region']);
$comuna     = trim($input['comuna']);
$metodoPago = $input['metodoPago'];
$servicio   = $input['servicio'];
$monto      = $input['monto'];

// Log para debug
error_log("Datos recibidos - Dirección: " . $direccion . ", Región: " . $region . ", Comuna: " . $comuna);

require_once __DIR__ . '/helpers/generarHtmlCorreoTransferencia.php';
require_once __DIR__ . '/helpers/generarTextoCorreoTransferencia.php';
require_once __DIR__ . '/enviarCorreo.php';

try {
    // --- Generar el HTML y el texto plano del correo usando array (cliente)---
    $datosTransfer = [
        'nombre'      => $nombre,
        'email'       => $email,
        'telefono'    => $telefono,
        'servicio'    => $servicio,
        'metodoPago'  => $metodoPago,
        'monto'       => (int)($input['monto'] ?? 0),
        'montoBase'   => (int)($input['montoBase'] ?? 0), // <-- Agregado si lo usas en el helper
        'recargo'     => (int)($input['recargo'] ?? 0),
        'descuento'   => (int)($input['descuento'] ?? 0),
        'total'       => (int)($input['total'] ?? 0),
        'direccion'   => $direccion,
        'region'      => $region,
        'comuna'      => $comuna
    ];

    $mensajeHtml     = generarHtmlCorreoTransferencia($datosTransfer);
    $mensajeTexto    = generarTextoCorreoTransferencia($nombre, $email, $telefono, $direccion, $region, $comuna, $servicio, $metodoPago, (int)$monto);

    // --- 1. Envío de correo al CLIENTE ---
    $datosCorreoCliente = [
        'destinatario' => $email,
        'asunto'       => 'Confirmación de Pago y Agendamiento - Visual Mecánica',
        'mensajeHtml'  => $mensajeHtml,
        'mensajeTexto' => $mensajeTexto,
    ];
    error_log("Intentando enviar correo al cliente: $email");
    $mailResult = enviarCorreo($datosCorreoCliente, $MODO_DEBUG);
    error_log("Resultado del envío de correo al cliente ($email): " . json_encode($mailResult));

    // --- 2. Envío de correo a la EMPRESA ----
    $correoEmpresa = 'cotizacionautomotriz09@gmail.com';

    $mensajeHtmlEmpresa = '
        <h2>Nueva solicitud de transferencia recibida</h2>
        <ul>
            <li><strong>Nombre:</strong> ' . htmlspecialchars($nombre) . '</li>
            <li><strong>Email:</strong> ' . htmlspecialchars($email) . '</li>
            <li><strong>Teléfono:</strong> ' . htmlspecialchars($telefono) . '</li>
            <li><strong>Dirección:</strong> ' . htmlspecialchars($direccion) . '</li>
            <li><strong>Región:</strong> ' . htmlspecialchars($region) . '</li>
            <li><strong>Comuna:</strong> ' . htmlspecialchars($comuna) . '</li>
            <li><strong>Servicio:</strong> ' . htmlspecialchars($servicio) . '</li>
            <li><strong>Método de pago:</strong> ' . htmlspecialchars($metodoPago) . '</li>
            <li><strong>Monto:</strong> $' . number_format((int)$monto, 0, ',', '.') . ' CLP</li>
            <li><strong>Fecha:</strong> ' . date('Y-m-d H:i:s') . '</li>
        </ul>
        <hr>
        <small>Este mensaje es una notificación interna automática del sistema de agendamientos.</small>
    ';
    $mensajeTextoEmpresa = 
        "Nueva solicitud de transferencia recibida:\n".
        "Nombre: $nombre\n".
        "Email: $email\n".
        "Teléfono: $telefono\n".
        "Dirección: $direccion\n".
        "Región: $region\n".
        "Comuna: $comuna\n".
        "Servicio: $servicio\n".
        "Método de pago: $metodoPago\n".
        "Monto: $" . number_format((int)$monto, 0, ',', '.') . " CLP\n".
        "Fecha: ".date('Y-m-d H:i:s')."\n";

    $datosCorreoEmpresa = [
        'destinatario' => $correoEmpresa,
        'asunto'       => 'Alerta: Solicitud de Agendamiento vía transferencia de parte del cliente',
        'mensajeHtml'  => $mensajeHtmlEmpresa,
        'mensajeTexto' => $mensajeTextoEmpresa,
    ];

    $mailResultEmpresa = enviarCorreo($datosCorreoEmpresa, $MODO_DEBUG);
    error_log("Resultado del envío de correo A LA EMPRESA: " . json_encode($mailResultEmpresa));

 
    // 2. Crear evento en Google Calendar (opcional)
    try {
        error_log("Intentando crear evento en Google Calendar" . ($MODO_DEBUG ? " (MODO DEBUG)" : ""));
        $calendarResult = crearEventoCalendar($nombre, $telefono, $email, $servicio, (int)$monto, $MODO_DEBUG);
        error_log("Resultado de Google Calendar: " . json_encode($calendarResult));
    } catch (Exception $e) {
        error_log("Error al crear evento en Google Calendar: " . $e->getMessage());
        $calendarResult = [
            "success" => false,
            "error" => "Error al crear evento en Google Calendar",
            "details" => $e->getMessage()
        ];
    }

} catch (Exception $e) {
    error_log("Error general: " . $e->getMessage());
}

function crearEventoCalendar($nombre, $telefono, $email, $servicio, $monto, $modoDebug = false) {
    // Verificar si estamos en modo de desarrollo y simulación de calendar
    $devMode = in_array(getenv_backend('DEV_MODE', 'false'), ['true', '1', 'yes', 'on']);
    $simulateCalendar = in_array(getenv_backend('SIMULATE_CALENDAR', 'false'), ['true', '1', 'yes', 'on']);
    $esModoSimulacion = $modoDebug || ($devMode && $simulateCalendar);
    
    // Si estamos en modo simulación, simular la creación del evento
    if ($esModoSimulacion) {
        error_log("[MODO SIMULACIÓN] Simulando creación de evento en Google Calendar");
        error_log("[MODO SIMULACIÓN] Datos: Nombre={$nombre}, Email={$email}, Servicio={$servicio}");
        
        // Simular éxito con datos ficticios
        return [
            "success" => true,
            "message" => "[SIMULADO] Evento creado en Google Calendar",
            "eventLink" => "https://calendar.google.com/calendar/event?eid=SIMULADO",
            "eventId" => "simulado_event_id_" . time(),
            "debug_mode" => true,
            "simulated" => true
        ];
    }
    
    try {
        // 1. Configuración inicial del cliente Google
        $client = new Google_Client();
        $client->setApplicationName('Agendamiento Visual Mecánica');
        $client->setScopes(Google_Service_Calendar::CALENDAR_EVENTS);
        
        // 2. Verificación y carga de credenciales
        $credentialsPath = __DIR__ . '/credenciales.json';
        if (!file_exists($credentialsPath)) {
            error_log("Error: Archivo de credenciales no encontrado en $credentialsPath");
            return [
                "success" => false,
                "error" => "Error de configuración del sistema",
                "details" => "Archivo de credenciales no encontrado"
            ];
        }

        try {
            $client->setAuthConfig($credentialsPath);
        } catch (Exception $e) {
            error_log("Error al cargar credenciales: " . $e->getMessage());
            return [
                "success" => false,
                "error" => "Error al cargar credenciales",
                "details" => $e->getMessage()
            ];
        }
        
        // 3. Configuración crítica del OAuth 2.0
        $client->setAccessType('offline');
        $client->setRedirectUri('http://localhost:8000/callback');
        $client->setPrompt('consent');
        
        // 4. Manejo del token
        $tokenPath = __DIR__ . '/token.json';
        if (!file_exists($tokenPath)) {
            error_log("Error: Archivo token.json no encontrado en $tokenPath");
            return [
                "success" => false,
                "error" => "Error de configuración del sistema",
                "details" => "Archivo token.json no encontrado"
            ];
        }

        try {
            $accessToken = json_decode(file_get_contents($tokenPath), true);
            if (json_last_error() !== JSON_ERROR_NONE) {
                error_log("Error: token.json contiene JSON inválido");
                return [
                    "success" => false,
                    "error" => "Error de configuración del sistema",
                    "details" => "token.json contiene JSON inválido"
                ];
            }
            $client->setAccessToken($accessToken);
        } catch (Exception $e) {
            error_log("Error al cargar token: " . $e->getMessage());
            return [
                "success" => false,
                "error" => "Error al cargar token",
                "details" => $e->getMessage()
            ];
        }
        
        // 5. Renovación del token si es necesario
        if ($client->isAccessTokenExpired()) {
            error_log("Token expirado, intentando renovar");
            try {
                if ($client->getRefreshToken()) {
                    $client->fetchAccessTokenWithRefreshToken($client->getRefreshToken());
                    if (!file_put_contents($tokenPath, json_encode($client->getAccessToken()))) {
                        error_log("Error: No se pudo escribir el nuevo token en token.json");
                        return [
                            "success" => false,
                            "error" => "Error al actualizar token",
                            "details" => "No se pudo escribir el nuevo token"
                        ];
                    }
                    error_log("Token renovado exitosamente");
                } else {
                    $authUrl = $client->createAuthUrl();
                    error_log("Nueva autenticación requerida: $authUrl");
                    return [
                        "success" => false,
                        "error" => "Se requiere nueva autenticación",
                        "details" => "Token expirado y no hay refresh token disponible"
                    ];
                }
            } catch (Exception $e) {
                error_log("Error al renovar token: " . $e->getMessage());
                return [
                    "success" => false,
                    "error" => "Error al renovar token",
                    "details" => $e->getMessage()
                ];
            }
        }
        
        // 6. Creación del servicio y evento
        $service = new Google_Service_Calendar($client);
        
        $event = new Google_Service_Calendar_Event([
            'summary' => "Servicio para $nombre: $servicio",
            'location' => 'Visual Mecánica',
            'description' => "Cliente: $nombre\nTeléfono: $telefono\nEmail: $email\nMonto: $" . number_format($monto, 0, ',', '.') . " CLP",
            'start' => [
                'dateTime' => date('c', strtotime('+1 day 10:00:00')),
                'timeZone' => 'America/Santiago',
            ],
            'end' => [
                'dateTime' => date('c', strtotime('+1 day 11:00:00')),
                'timeZone' => 'America/Santiago',
            ],
            'reminders' => [
                'useDefault' => true,
            ],
        ]);
        
        // 7. Inserción del evento
        $event = $service->events->insert('primary', $event);
        
        return [
            "success" => true,
            "message" => "Evento creado en Google Calendar",
            "eventLink" => $event->htmlLink,
            "eventId" => $event->id
        ];
        
    } catch (Google_Service_Exception $e) {
        $errorDetails = json_decode($e->getMessage(), true);
        error_log("Error de Google API: " . print_r($errorDetails, true));
        return [
            "success" => false,
            "error" => "Error en Google Calendar API",
            "details" => $errorDetails['error']['message'] ?? $e->getMessage()
        ];
        
    } catch (Exception $e) {
        error_log("Error general: " . $e->getMessage());
        return [
            "success" => false,
            "error" => "Error al conectar con Google Calendar",
            "details" => $e->getMessage()
        ];
    }
}

// Determinar el éxito global basado en el correo, ignorando temporalmente el calendario
$mailSuccess = $mailResult['success'];
$calendarSuccess = $calendarResult['success'] ?? false;

// Verificar si estamos en modo de desarrollo y simulación
$devMode = in_array(getenv_backend('DEV_MODE', 'false'), ['true', '1', 'yes', 'on']);
$simulateEmail = in_array(getenv_backend('SIMULATE_EMAIL', 'false'), ['true', '1', 'yes', 'on']);
$simulateCalendar = in_array(getenv_backend('SIMULATE_CALENDAR', 'false'), ['true', '1', 'yes', 'on']);
$mailSimulated = $MODO_DEBUG || ($devMode && $simulateEmail) || isset($mailResult['debug']);
$calendarSimulated = $MODO_DEBUG || ($devMode && $simulateCalendar) || isset($calendarResult['simulated']);

// Si el correo se envió correctamente, consideramos la operación exitosa
// aunque el calendario haya fallado
$globalSuccess = $mailSuccess;

$response = [
    "success" => $globalSuccess,
    "message" => $globalSuccess 
        ? "Solicitud registrada correctamente. Revisa tu correo para más detalles." 
        : "Error en el proceso",
    "debug_mode" => $MODO_DEBUG,
    "mail" => [
        "success" => $mailSuccess,
        "error" => $mailSuccess ? null : ($mailResult['error'] ?? "Error desconocido"),
        "details" => $mailSuccess ? null : ($mailResult['details'] ?? null),
        "simulated" => $mailSimulated
    ],
    "calendar" => [
        "success" => $calendarSuccess,
        "error" => $calendarSuccess ? null : ($calendarResult['error'] ?? "Error desconocido"),
        "details" => $calendarSuccess ? null : ($calendarResult['details'] ?? null),
        "simulated" => $calendarSimulated
    ]
];

// Si el correo se envió pero el calendario falló, aún retornamos 200
$httpStatus = $mailSuccess ? 200 : 500;

// Limpieza de buffer y envío de respuesta
while (ob_get_level()) ob_end_clean();
header('Content-Type: application/json');
http_response_code($httpStatus);
echo json_encode($response);
exit;
?>
