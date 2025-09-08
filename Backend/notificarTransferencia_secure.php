<?php
/**
 * 🔒 NOTIFICAR TRANSFERENCIA REFACTORIZADO - SEGURO
 * 
 * Versión refactorizada que elimina todas las credenciales hardcodeadas
 * y usa la nueva infraestructura de seguridad centralizada.
 * 
 * Versión: 2.0
 * Fecha: 8 de septiembre de 2025
 */

// Configurar manejo de errores
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// Cargar infraestructura de seguridad
require_once __DIR__ . '/helpers/SecurityConfig.php';
require_once __DIR__ . '/helpers/SecureMailer.php';
require_once __DIR__ . '/helpers/SecureDatabase.php';

// Inicializar configuración de seguridad
$security = SecurityConfig::getInstance();
$mailer = SecureMailer::getInstance();
$database = SecureDatabase::getInstance();

// Log de inicio
error_log("🔒 INICIO: notificarTransferencia.php refactorizado");
$security->logConfiguration();

// Configurar CORS
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (preg_match('/^https?:\/\/localhost(:[0-9]+)?$/', $origin)) {
    header("Access-Control-Allow-Origin: $origin");
} else {
    header("Access-Control-Allow-Origin: " . $security->getFrontendUrl());
}
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");

// Manejar preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

header("Content-Type: application/json; charset=UTF-8");

// Validar método
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'error' => 'Método no permitido. Use POST.'
    ]);
    exit;
}

try {
    // Obtener y validar datos JSON
    $inputJSON = file_get_contents('php://input');
    if (!$inputJSON) {
        throw new Exception('No se recibieron datos');
    }

    $data = json_decode($inputJSON, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('JSON inválido: ' . json_last_error_msg());
    }

    // Validar estructura de datos requerida
    $camposRequeridos = [
        'cliente' => ['nombre', 'apellido', 'email', 'telefono'],
        'agendamiento' => ['fecha', 'bloque'],
        'pago' => ['metodo', 'monto'],
        'servicio' => ['nombre']
    ];

    $errores = [];
    foreach ($camposRequeridos as $seccion => $campos) {
        if (!isset($data[$seccion])) {
            $errores[] = "Sección faltante: $seccion";
            continue;
        }
        
        foreach ($campos as $campo) {
            if (empty($data[$seccion][$campo])) {
                $errores[] = "Campo faltante: $seccion.$campo";
            }
        }
    }

    if (!empty($errores)) {
        throw new Exception('Datos incompletos: ' . implode(', ', $errores));
    }

    // Extraer datos
    $cliente = $data['cliente'];
    $agendamiento = $data['agendamiento'];
    $pago = $data['pago'];
    $servicio = $data['servicio'];

    // Validar email
    if (!filter_var($cliente['email'], FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Email inválido: ' . $cliente['email']);
    }

    error_log("📝 Procesando notificación para: {$cliente['email']}");

    // === GUARDAR EN BASE DE DATOS ===
    $datosAgendamiento = [
        'cliente_nombre' => $cliente['nombre'],
        'cliente_apellido' => $cliente['apellido'],
        'cliente_email' => $cliente['email'],
        'cliente_telefono' => $cliente['telefono'],
        'cliente_rut' => $cliente['rut'] ?? null,
        'agendamiento_fecha' => $agendamiento['fecha'],
        'agendamiento_bloque' => $agendamiento['bloque'],
        'servicio_nombre' => $servicio['nombre'],
        'pago_metodo' => $pago['metodo'],
        'pago_monto' => $pago['monto'],
        'estado' => 'pendiente',
        'created_at' => date('Y-m-d H:i:s')
    ];

    try {
        $agendamientoId = $database->insert('agendamientos', $datosAgendamiento);
        error_log("✅ Agendamiento guardado con ID: $agendamientoId");
    } catch (Exception $e) {
        error_log("⚠️ Error al guardar en BD (continuando): " . $e->getMessage());
        $agendamientoId = null;
    }

    // === PREPARAR RESPUESTA DE CORREOS ===
    $resultadosCorreos = [];

    // === CORREO AL CLIENTE ===
    $nombreCompleto = $cliente['nombre'] . ' ' . $cliente['apellido'];
    $fechaFormateada = date('d/m/Y', strtotime($agendamiento['fecha']));
    
    $htmlCliente = generarHtmlCorreoCliente($nombreCompleto, $servicio['nombre'], $fechaFormateada, $agendamiento['bloque'], $pago['monto']);
    $textoCliente = generarTextoCorreoCliente($nombreCompleto, $servicio['nombre'], $fechaFormateada, $agendamiento['bloque'], $pago['monto']);

    $datosCorreoCliente = [
        'destinatario' => $cliente['email'],
        'asunto' => 'Confirmación de agendamiento - Visual Mecánica',
        'mensajeHtml' => $htmlCliente,
        'mensajeTexto' => $textoCliente
    ];

    $resultadoCliente = $mailer->sendMail($datosCorreoCliente, $security->isDevelopment());
    $resultadosCorreos['cliente'] = $resultadoCliente;

    // === CORREO A LA EMPRESA ===
    $smtp = $security->getSmtpConfig();
    $correoEmpresa = $smtp['from_email'] ?? $smtp['username'];

    if ($correoEmpresa) {
        $htmlEmpresa = generarHtmlCorreoEmpresa($nombreCompleto, $cliente, $servicio, $agendamiento, $pago);
        $textoEmpresa = generarTextoCorreoEmpresa($nombreCompleto, $cliente, $servicio, $agendamiento, $pago);

        $datosCorreoEmpresa = [
            'destinatario' => $correoEmpresa,
            'cc' => $smtp['username'], // Copia de respaldo
            'asunto' => 'Nueva solicitud de agendamiento por transferencia',
            'mensajeHtml' => $htmlEmpresa,
            'mensajeTexto' => $textoEmpresa
        ];

        $resultadoEmpresa = $mailer->sendMail($datosCorreoEmpresa, $security->isDevelopment());
        $resultadosCorreos['empresa'] = $resultadoEmpresa;
    }

    // === AGENDAR EN GOOGLE CALENDAR (si está configurado) ===
    $resultadoCalendar = null;
    if (!$security->shouldSimulateCalendar()) {
        $googleConfig = $security->getGoogleConfig();
        if (!empty($googleConfig['client_id'])) {
            try {
                require_once __DIR__ . '/agendarEventoGoogleDesdeAgendamiento.php';
                $resultadoCalendar = agendarEventoGoogleDesdeAgendamiento($data, $agendamiento['bloque'], null);
            } catch (Exception $e) {
                error_log("⚠️ Error en Google Calendar: " . $e->getMessage());
                $resultadoCalendar = ['success' => false, 'error' => $e->getMessage()];
            }
        }
    } else {
        $resultadoCalendar = ['success' => true, 'message' => 'Calendar simulado en modo desarrollo'];
    }

    // === RESPUESTA FINAL ===
    $todosExitosos = $resultadosCorreos['cliente']['success'] && 
                     (!isset($resultadosCorreos['empresa']) || $resultadosCorreos['empresa']['success']);

    $respuesta = [
        'success' => $todosExitosos,
        'message' => $todosExitosos ? 'Notificación enviada correctamente' : 'Notificación enviada con advertencias',
        'agendamiento_id' => $agendamientoId,
        'correos' => $resultadosCorreos,
        'calendar' => $resultadoCalendar,
        'timestamp' => date('Y-m-d H:i:s')
    ];

    error_log("🎉 Notificación completada exitosamente");
    echo json_encode($respuesta);

} catch (Exception $e) {
    error_log("❌ Error en notificarTransferencia: " . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'timestamp' => date('Y-m-d H:i:s')
    ]);
}

// === FUNCIONES AUXILIARES ===

function generarHtmlCorreoCliente($nombre, $servicio, $fecha, $bloque, $monto) {
    return "
    <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;'>
        <div style='background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;'>
            <h1 style='margin: 0; font-size: 28px;'>Visual Mecánica</h1>
            <p style='margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;'>Confirmación de Agendamiento</p>
        </div>
        
        <div style='background: white; padding: 30px; border: 1px solid #e0e0e0; border-radius: 0 0 10px 10px;'>
            <h2 style='color: #333; margin-top: 0;'>¡Hola $nombre!</h2>
            
            <p style='color: #666; line-height: 1.6;'>
                Hemos recibido tu solicitud de agendamiento. A continuación los detalles:
            </p>
            
            <div style='background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;'>
                <h3 style='color: #495057; margin: 0 0 15px 0;'>📋 Detalles del Agendamiento</h3>
                <p style='margin: 8px 0; color: #333;'><strong>Servicio:</strong> $servicio</p>
                <p style='margin: 8px 0; color: #333;'><strong>Fecha:</strong> $fecha</p>
                <p style='margin: 8px 0; color: #333;'><strong>Horario:</strong> $bloque</p>
                <p style='margin: 8px 0; color: #333;'><strong>Monto:</strong> $" . number_format($monto, 0, ',', '.') . " CLP</p>
            </div>
            
            <div style='background: #e3f2fd; padding: 20px; border-radius: 8px; border-left: 4px solid #2196f3;'>
                <h3 style='color: #1976d2; margin: 0 0 10px 0;'>💡 Próximos Pasos</h3>
                <p style='margin: 5px 0; color: #333;'>• Confirmaremos tu agendamiento en las próximas horas</p>
                <p style='margin: 5px 0; color: #333;'>• Te contactaremos para coordinar los detalles</p>
                <p style='margin: 5px 0; color: #333;'>• Recibirás recordatorios antes de tu cita</p>
            </div>
            
            <hr style='border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;'>
            
            <p style='color: #888; font-size: 14px; text-align: center; margin: 0;'>
                Visual Mecánica - Servicio de Excelencia<br>
                Este es un correo automático, por favor no responder directamente.
            </p>
        </div>
    </div>";
}

function generarTextoCorreoCliente($nombre, $servicio, $fecha, $bloque, $monto) {
    return "
VISUAL MECÁNICA - Confirmación de Agendamiento

¡Hola $nombre!

Hemos recibido tu solicitud de agendamiento con los siguientes detalles:

DETALLES DEL AGENDAMIENTO:
• Servicio: $servicio
• Fecha: $fecha
• Horario: $bloque
• Monto: $" . number_format($monto, 0, ',', '.') . " CLP

PRÓXIMOS PASOS:
• Confirmaremos tu agendamiento en las próximas horas
• Te contactaremos para coordinar los detalles
• Recibirás recordatorios antes de tu cita

Gracias por confiar en Visual Mecánica.

---
Visual Mecánica - Servicio de Excelencia
Este es un correo automático, por favor no responder directamente.
    ";
}

function generarHtmlCorreoEmpresa($nombre, $cliente, $servicio, $agendamiento, $pago) {
    $fecha = date('d/m/Y', strtotime($agendamiento['fecha']));
    
    return "
    <div style='font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; padding: 20px;'>
        <div style='background: #d32f2f; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;'>
            <h1 style='margin: 0; font-size: 24px;'>🚨 NUEVA SOLICITUD DE TRANSFERENCIA</h1>
            <p style='margin: 10px 0 0 0; opacity: 0.9;'>Visual Mecánica - Sistema de Agendamientos</p>
        </div>
        
        <div style='background: white; padding: 25px; border: 1px solid #e0e0e0; border-radius: 0 0 8px 8px;'>
            <h2 style='color: #333; margin-top: 0;'>Detalles del Cliente</h2>
            
            <div style='background: #fff3e0; padding: 15px; border-radius: 6px; margin: 15px 0;'>
                <p style='margin: 5px 0; color: #333;'><strong>Nombre:</strong> {$cliente['nombre']} {$cliente['apellido']}</p>
                <p style='margin: 5px 0; color: #333;'><strong>Email:</strong> {$cliente['email']}</p>
                <p style='margin: 5px 0; color: #333;'><strong>Teléfono:</strong> {$cliente['telefono']}</p>
                " . (!empty($cliente['rut']) ? "<p style='margin: 5px 0; color: #333;'><strong>RUT:</strong> {$cliente['rut']}</p>" : "") . "
            </div>
            
            <h3 style='color: #333;'>Servicio Solicitado</h3>
            <div style='background: #e8f5e8; padding: 15px; border-radius: 6px; margin: 15px 0;'>
                <p style='margin: 5px 0; color: #333;'><strong>Servicio:</strong> {$servicio['nombre']}</p>
                <p style='margin: 5px 0; color: #333;'><strong>Fecha:</strong> $fecha</p>
                <p style='margin: 5px 0; color: #333;'><strong>Horario:</strong> {$agendamiento['bloque']}</p>
            </div>
            
            <h3 style='color: #333;'>Información de Pago</h3>
            <div style='background: #e3f2fd; padding: 15px; border-radius: 6px; margin: 15px 0;'>
                <p style='margin: 5px 0; color: #333;'><strong>Método:</strong> {$pago['metodo']}</p>
                <p style='margin: 5px 0; color: #333;'><strong>Monto:</strong> $" . number_format($pago['monto'], 0, ',', '.') . " CLP</p>
            </div>
            
            <div style='background: #ffebee; padding: 15px; border-radius: 6px; border-left: 4px solid #f44336; margin: 20px 0;'>
                <h4 style='color: #c62828; margin: 0 0 10px 0;'>⚠️ Acción Requerida</h4>
                <p style='margin: 5px 0; color: #333;'>• Contactar al cliente para confirmar agendamiento</p>
                <p style='margin: 5px 0; color: #333;'>• Verificar disponibilidad en el horario solicitado</p>
                <p style='margin: 5px 0; color: #333;'>• Confirmar detalles del servicio</p>
            </div>
            
            <p style='color: #666; font-size: 12px; text-align: center; margin: 20px 0 0 0;'>
                Notificación automática - " . date('Y-m-d H:i:s') . "
            </p>
        </div>
    </div>";
}

function generarTextoCorreoEmpresa($nombre, $cliente, $servicio, $agendamiento, $pago) {
    $fecha = date('d/m/Y', strtotime($agendamiento['fecha']));
    
    return "
🚨 NUEVA SOLICITUD DE TRANSFERENCIA - VISUAL MECÁNICA

DETALLES DEL CLIENTE:
• Nombre: {$cliente['nombre']} {$cliente['apellido']}
• Email: {$cliente['email']}
• Teléfono: {$cliente['telefono']}" . 
(!empty($cliente['rut']) ? "\n• RUT: {$cliente['rut']}" : "") . "

SERVICIO SOLICITADO:
• Servicio: {$servicio['nombre']}
• Fecha: $fecha
• Horario: {$agendamiento['bloque']}

INFORMACIÓN DE PAGO:
• Método: {$pago['metodo']}
• Monto: $" . number_format($pago['monto'], 0, ',', '.') . " CLP

⚠️ ACCIÓN REQUERIDA:
• Contactar al cliente para confirmar agendamiento
• Verificar disponibilidad en el horario solicitado
• Confirmar detalles del servicio

Notificación automática - " . date('Y-m-d H:i:s') . "
    ";
}
?>
