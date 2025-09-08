<?php
/**
 * 🔒 ENVIAR AGENDAMIENTO REFACTORIZADO - SEGURO
 * 
 * Versión completamente refactorizada que elimina todas las credenciales hardcodeadas
 * y utiliza la nueva infraestructura de seguridad centralizada.
 * 
 * Características:
 * - Sin credenciales hardcodeadas
 * - Configuración centralizada con SecurityConfig
 * - Envío seguro de emails con SecureMailer
 * - Integración con base de datos segura
 * - Simulación para desarrollo
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
error_log("🔒 INICIO: enviarAgendamiento.php refactorizado");
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
    $servicio = $data['servicio'];

    // Validar email
    if (!filter_var($cliente['email'], FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Email inválido: ' . $cliente['email']);
    }

    error_log("📝 Procesando agendamiento para: {$cliente['email']}");

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
        'servicio_precio' => $servicio['precio'] ?? null,
        'estado' => 'agendado',
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
    
    $htmlCliente = generarHtmlCorreoConfirmacionCliente($nombreCompleto, $servicio['nombre'], $fechaFormateada, $agendamiento['bloque']);
    $textoCliente = generarTextoCorreoConfirmacionCliente($nombreCompleto, $servicio['nombre'], $fechaFormateada, $agendamiento['bloque']);

    $datosCorreoCliente = [
        'destinatario' => $cliente['email'],
        'asunto' => 'Agendamiento confirmado - Visual Mecánica',
        'mensajeHtml' => $htmlCliente,
        'mensajeTexto' => $textoCliente
    ];

    $resultadoCliente = $mailer->sendMail($datosCorreoCliente, $security->isDevelopment());
    $resultadosCorreos['cliente'] = $resultadoCliente;

    // === CORREO A LA EMPRESA ===
    $smtp = $security->getSmtpConfig();
    $correoEmpresa = $smtp['from_email'] ?? $smtp['username'];

    if ($correoEmpresa) {
        $htmlEmpresa = generarHtmlCorreoNotificacionEmpresa($nombreCompleto, $cliente, $servicio, $agendamiento);
        $textoEmpresa = generarTextoCorreoNotificacionEmpresa($nombreCompleto, $cliente, $servicio, $agendamiento);

        $datosCorreoEmpresa = [
            'destinatario' => $correoEmpresa,
            'cc' => $smtp['username'], // Copia de respaldo
            'asunto' => 'Nuevo agendamiento confirmado',
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
        'message' => $todosExitosos ? 'Agendamiento procesado correctamente' : 'Agendamiento procesado con advertencias',
        'agendamiento_id' => $agendamientoId,
        'correos' => $resultadosCorreos,
        'calendar' => $resultadoCalendar,
        'timestamp' => date('Y-m-d H:i:s')
    ];

    error_log("🎉 Agendamiento completado exitosamente");
    echo json_encode($respuesta);

} catch (Exception $e) {
    error_log("❌ Error en enviarAgendamiento: " . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'timestamp' => date('Y-m-d H:i:s')
    ]);
}

// === FUNCIONES AUXILIARES ===

function generarHtmlCorreoConfirmacionCliente($nombre, $servicio, $fecha, $bloque) {
    return "
    <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;'>
        <div style='background: linear-gradient(135deg, #4caf50 0%, #388e3c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;'>
            <h1 style='margin: 0; font-size: 28px;'>✅ Agendamiento Confirmado</h1>
            <p style='margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;'>Visual Mecánica</p>
        </div>
        
        <div style='background: white; padding: 30px; border: 1px solid #e0e0e0; border-radius: 0 0 10px 10px;'>
            <h2 style='color: #333; margin-top: 0;'>¡Hola $nombre!</h2>
            
            <p style='color: #666; line-height: 1.6;'>
                Tu agendamiento ha sido <strong style='color: #4caf50;'>confirmado exitosamente</strong>. 
                A continuación los detalles de tu cita:
            </p>
            
            <div style='background: #e8f5e8; padding: 25px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4caf50;'>
                <h3 style='color: #2e7d32; margin: 0 0 15px 0;'>📅 Detalles de tu Cita</h3>
                <p style='margin: 10px 0; color: #333; font-size: 16px;'><strong>Servicio:</strong> $servicio</p>
                <p style='margin: 10px 0; color: #333; font-size: 16px;'><strong>Fecha:</strong> $fecha</p>
                <p style='margin: 10px 0; color: #333; font-size: 16px;'><strong>Horario:</strong> $bloque</p>
            </div>
            
            <div style='background: #fff3e0; padding: 20px; border-radius: 8px; border-left: 4px solid #ff9800;'>
                <h3 style='color: #f57c00; margin: 0 0 10px 0;'>📌 Información Importante</h3>
                <p style='margin: 5px 0; color: #333;'>• Llega 10 minutos antes de tu hora agendada</p>
                <p style='margin: 5px 0; color: #333;'>• Si necesitas reprogramar, contáctanos con 24 horas de anticipación</p>
                <p style='margin: 5px 0; color: #333;'>• Recibirás un recordatorio 1 día antes de tu cita</p>
            </div>
            
            <div style='background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;'>
                <h3 style='color: #1976d2; margin: 0 0 10px 0;'>📞 ¿Necesitas ayuda?</h3>
                <p style='margin: 5px 0; color: #333;'>Si tienes alguna consulta o necesitas modificar tu agendamiento, no dudes en contactarnos.</p>
            </div>
            
            <hr style='border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;'>
            
            <p style='color: #888; font-size: 14px; text-align: center; margin: 0;'>
                Visual Mecánica - Servicio de Excelencia<br>
                <span style='font-size: 12px;'>Este es un correo automático, por favor no responder directamente.</span>
            </p>
        </div>
    </div>";
}

function generarTextoCorreoConfirmacionCliente($nombre, $servicio, $fecha, $bloque) {
    return "
✅ AGENDAMIENTO CONFIRMADO - VISUAL MECÁNICA

¡Hola $nombre!

Tu agendamiento ha sido CONFIRMADO exitosamente.

DETALLES DE TU CITA:
📅 Servicio: $servicio
📅 Fecha: $fecha  
📅 Horario: $bloque

INFORMACIÓN IMPORTANTE:
• Llega 10 minutos antes de tu hora agendada
• Si necesitas reprogramar, contáctanos con 24 horas de anticipación
• Recibirás un recordatorio 1 día antes de tu cita

¿NECESITAS AYUDA?
Si tienes alguna consulta o necesitas modificar tu agendamiento, 
no dudes en contactarnos.

Gracias por confiar en Visual Mecánica.

---
Visual Mecánica - Servicio de Excelencia
Este es un correo automático, por favor no responder directamente.
    ";
}

function generarHtmlCorreoNotificacionEmpresa($nombre, $cliente, $servicio, $agendamiento) {
    $fecha = date('d/m/Y', strtotime($agendamiento['fecha']));
    
    return "
    <div style='font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; padding: 20px;'>
        <div style='background: #2196f3; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;'>
            <h1 style='margin: 0; font-size: 24px;'>📅 NUEVO AGENDAMIENTO CONFIRMADO</h1>
            <p style='margin: 10px 0 0 0; opacity: 0.9;'>Visual Mecánica - Sistema de Agendamientos</p>
        </div>
        
        <div style='background: white; padding: 25px; border: 1px solid #e0e0e0; border-radius: 0 0 8px 8px;'>
            <h2 style='color: #333; margin-top: 0;'>Información del Cliente</h2>
            
            <div style='background: #e8f5e8; padding: 15px; border-radius: 6px; margin: 15px 0;'>
                <p style='margin: 5px 0; color: #333;'><strong>Nombre:</strong> {$cliente['nombre']} {$cliente['apellido']}</p>
                <p style='margin: 5px 0; color: #333;'><strong>Email:</strong> {$cliente['email']}</p>
                <p style='margin: 5px 0; color: #333;'><strong>Teléfono:</strong> {$cliente['telefono']}</p>
                " . (!empty($cliente['rut']) ? "<p style='margin: 5px 0; color: #333;'><strong>RUT:</strong> {$cliente['rut']}</p>" : "") . "
            </div>
            
            <h3 style='color: #333;'>Detalles del Agendamiento</h3>
            <div style='background: #e3f2fd; padding: 15px; border-radius: 6px; margin: 15px 0;'>
                <p style='margin: 5px 0; color: #333;'><strong>Servicio:</strong> {$servicio['nombre']}</p>
                <p style='margin: 5px 0; color: #333;'><strong>Fecha:</strong> $fecha</p>
                <p style='margin: 5px 0; color: #333;'><strong>Horario:</strong> {$agendamiento['bloque']}</p>
                " . (!empty($servicio['precio']) ? "<p style='margin: 5px 0; color: #333;'><strong>Precio:</strong> $" . number_format($servicio['precio'], 0, ',', '.') . " CLP</p>" : "") . "
            </div>
            
            <div style='background: #fff3e0; padding: 15px; border-radius: 6px; border-left: 4px solid #ff9800; margin: 20px 0;'>
                <h4 style='color: #e65100; margin: 0 0 10px 0;'>📋 Recordatorio</h4>
                <p style='margin: 5px 0; color: #333;'>• Confirmar disponibilidad del técnico</p>
                <p style='margin: 5px 0; color: #333;'>• Preparar materiales/herramientas necesarias</p>
                <p style='margin: 5px 0; color: #333;'>• Programar recordatorio para el cliente</p>
            </div>
            
            <p style='color: #666; font-size: 12px; text-align: center; margin: 20px 0 0 0;'>
                Notificación automática - " . date('Y-m-d H:i:s') . "
            </p>
        </div>
    </div>";
}

function generarTextoCorreoNotificacionEmpresa($nombre, $cliente, $servicio, $agendamiento) {
    $fecha = date('d/m/Y', strtotime($agendamiento['fecha']));
    
    return "
📅 NUEVO AGENDAMIENTO CONFIRMADO - VISUAL MECÁNICA

INFORMACIÓN DEL CLIENTE:
• Nombre: {$cliente['nombre']} {$cliente['apellido']}
• Email: {$cliente['email']}
• Teléfono: {$cliente['telefono']}" . 
(!empty($cliente['rut']) ? "\n• RUT: {$cliente['rut']}" : "") . "

DETALLES DEL AGENDAMIENTO:
• Servicio: {$servicio['nombre']}
• Fecha: $fecha
• Horario: {$agendamiento['bloque']}" .
(!empty($servicio['precio']) ? "\n• Precio: $" . number_format($servicio['precio'], 0, ',', '.') . " CLP" : "") . "

📋 RECORDATORIO:
• Confirmar disponibilidad del técnico
• Preparar materiales/herramientas necesarias
• Programar recordatorio para el cliente

Notificación automática - " . date('Y-m-d H:i:s') . "
    ";
}
?>
