<?php

//oculta errores de deprecated y notice
error_reporting(E_ALL & ~E_DEPRECATED & ~E_NOTICE & ~E_WARNING);
ini_set('display_errors', 0);


// Cabeceras CORS
header('Access-Control-Allow-Origin: https://visualmecanica.cl');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Manejar OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Obtener y validar datos JSON
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode(["success" => false, "error" => "JSON inválido"]);
    exit();
}

// Campos obligatorios (ajusta según tus necesidades reales)
$camposRequeridos = [
    'vehiculo' => ['marca', 'modelo', 'año', 'patente'],
    'cliente' => ['nombre', 'apellido', 'email', 'telefono'],
    'agendamiento' => ['fecha', 'bloque'],
    'pago' => ['metodo']
];

$camposFaltantes = [];

foreach ($camposRequeridos as $seccion => $campos) {
    if (!isset($data[$seccion])) {
        $camposFaltantes[] = "Sección completa: $seccion";
        continue;
    }
    
    foreach ($campos as $campo) {
        if (empty($data[$seccion][$campo])) {
            $camposFaltantes[] = "$seccion.$campo";
        }
    }
}

if (!empty($camposFaltantes)) {
    echo json_encode([
        "success" => false, 
        "error" => "Faltan campos requeridos",
        "missing_fields" => $camposFaltantes
    ]);
    exit();
}

// Cargar PHPMailer
require 'vendor/autoload.php';
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$mail = new PHPMailer(true);

try {
    // Configuración SMTP (mantén tus credenciales actuales)Se dejaron en el archivo .env
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = getenv('GMAIL_USERNAME');
    $mail->Password = getenv('GMAIL_PASSWORD');
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = 587;

    // Remitente y destinatario
    $mail->setFrom(getenv('GMAIL_USERNAME'), 'Sistema de Cotizaciones Visual Mecánica');
    $mail->addAddress(getenv('GMAIL_USERNAME'), 'Destinatario');

    // Contenido del correo
    $mail->isHTML(true);
    $mail->Subject = 'Nuevo Agendamiento';

    // Construir cuerpo del correo con datos disponibles
    $body = "<h1>Datos del Agendamiento</h1>";

    // Función auxiliar para mostrar datos
    function mostrarDato($valor, $default = 'No especificado') {
        return !empty($valor) ? htmlspecialchars($valor) : $default;
    }

    // Sección Vehículo
    $body .= "<h2>Datos del Vehículo</h2>";
    $body .= "<p><strong>Marca:</strong> " . mostrarDato($data['vehiculo']['marca']) . "</p>";
    $body .= "<p><strong>Modelo:</strong> " . mostrarDato($data['vehiculo']['modelo']) . "</p>";
    $body .= "<p><strong>Año:</strong> " . mostrarDato($data['vehiculo']['año']) . "</p>";
    $body .= "<p><strong>Patente:</strong> " . mostrarDato($data['vehiculo']['patente']) . "</p>";

    // Sección Cliente
    $body .= "<h2>Datos del Cliente</h2>";
    $body .= "<p><strong>Nombre:</strong> " . mostrarDato($data['cliente']['nombre']) . "</p>";
    $body .= "<p><strong>Apellido:</strong> " . mostrarDato($data['cliente']['apellido']) . "</p>";
    $body .= "<p><strong>Email:</strong> " . mostrarDato($data['cliente']['email']) . "</p>";
    $body .= "<p><strong>Teléfono:</strong> " . mostrarDato($data['cliente']['telefono']) . "</p>";
    $body .= "<p><strong>RUT:</strong> " . mostrarDato($data['cliente']['rut'] ?? null) . "</p>";
    $body .= "<p><strong>Dirección:</strong> " . mostrarDato($data['cliente']['direccion'] ?? null) . "</p>";
    $body .= "<p><strong>Región:</strong> " . mostrarDato($data['cliente']['region'] ?? null) . "</p>";
    $body .= "<p><strong>Comuna:</strong> " . mostrarDato($data['cliente']['comuna'] ?? null) . "</p>";

    // Sección Vendedor (opcional)
    if (isset($data['vendedor'])) {
        $body .= "<h2>Datos del Vendedor</h2>";
        $body .= "<p><strong>Tipo de Vendedor:</strong> " . mostrarDato($data['vendedor']['tipovendedor'] ?? null) . "</p>";
        $body .= "<p><strong>Nombre:</strong> " . mostrarDato($data['vendedor']['nombre'] ?? null) . "</p>";
        $body .= "<p><strong>Teléfono:</strong> " . mostrarDato($data['vendedor']['telefono'] ?? null) . "</p>";
        $body .= "<p><strong>Dirección:</strong> " . mostrarDato($data['vendedor']['direccion'] ?? null) . "</p>";
        $body .= "<p><strong>Región:</strong> " . mostrarDato($data['vendedor']['region'] ?? null) . "</p>";
        $body .= "<p><strong>Comuna:</strong> " . mostrarDato($data['vendedor']['comuna'] ?? null) . "</p>";
    }

    // Sección Agendamiento
    $body .= "<h2>Fecha y Hora de Agendamiento</h2>";
    $body .= "<p><strong>Fecha:</strong> <span style='color:#1976d2;font-weight:bold;'>" . mostrarDato($data['agendamiento']['fecha']) . "</span></p>";

    // Mostrar la hora exacta si está disponible y extraer solo la hora de inicio si viene como rango
    $hora_bruta = isset($data['agendamiento']['horario']) && !empty($data['agendamiento']['horario'])
        ? $data['agendamiento']['horario']
        : (isset($data['agendamiento']['hora_inicio']) && !empty($data['agendamiento']['hora_inicio'])
            ? $data['agendamiento']['hora_inicio']
            : $data['agendamiento']['bloque']);

    // Si viene como rango (ej: '16:30-19:30' o '16:30 - 19:30'), extraer solo la hora inicial
    if (preg_match('/^(\d{1,2}:\d{2})\s*-\s*\d{1,2}:\d{2}$/', trim($hora_bruta), $matches)) {
        $hora_inicio = $matches[1];
    } elseif (preg_match('/^([01]?\d|2[0-3]):([0-5]\d)$/', trim($hora_bruta))) {
        $hora_inicio = trim($hora_bruta);
    } else {
        // Si no es válido, intentar extraer solo la primera hora de cualquier string tipo '16:30-19:30'
        if (preg_match('/^(\d{1,2}:\d{2})/', trim($hora_bruta), $matches)) {
            $hora_inicio = $matches[1];
        } else {
            $hora_inicio = '';
        }
    }

    // Calcular hora_fin para Google Calendar SOLO si hay hora válida
    if (!empty($hora_inicio) && preg_match('/^([01]?\d|2[0-3]):([0-5]\d)$/', $hora_inicio)) {
        $hora_fin = date('H:i', strtotime($hora_inicio . ' +1 hour'));
    } else {
        $hora_fin = '';
    }

    // Mostrar el rango real de 1 hora en el correo
    $body .= "<p><strong>Hora:</strong> <span style='color:#1976d2;font-weight:bold;'>" . mostrarDato($hora_inicio) . " - " . mostrarDato($hora_fin) . "</span></p>";

    // Log para depuración de valores enviados a Google Calendar
    error_log('[AGENDAR] Fecha: ' . $data['agendamiento']['fecha'] . ' | hora_inicio: ' . $hora_inicio . ' | hora_fin: ' . $hora_fin . ' | hora_bruta: ' . (isset($hora_bruta) ? $hora_bruta : 'N/A'));

    // Sección Pago
    $body .= "<h2>Método de Pago</h2>";
    $body .= "<p><strong>Método:</strong> " . mostrarDato($data['pago']['metodo']) . "</p>";

    // --- Agendar en Google Calendar ---
    require_once __DIR__ . '/agendarEventoGoogleDesdeAgendamiento.php';
    $calendarResult = null;
    if (!empty($hora_inicio) && !empty($hora_fin) && preg_match('/^\d{4}-\d{2}-\d{2}$/', $data['agendamiento']['fecha'])) {
        $calendarResult = agendarEventoGoogleDesdeAgendamiento($data, $hora_inicio, $hora_fin);
    }

    $mail->Body = $body;
    $mail->send();
    
    echo json_encode([
        'success' => true,
        'message' => 'Correo enviado con éxito',
        'calendar' => $calendarResult
    ]);
    
} catch (Exception $e) {
    error_log("Error al enviar correo: " . $e->getMessage());
    echo json_encode([
        'success' => false, 
        'error' => 'Error al enviar el correo',
        'debug_info' => $e->getMessage()
    ]);
}
?>
