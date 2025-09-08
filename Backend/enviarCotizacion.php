<?php
/**
 * 🔒 ENVIAR COTIZACIÓN REFACTORIZADO - SEGURO
 * 
 * Versión completamente refactorizada que elimina todas las credenciales hardcodeadas
 * y utiliza la nueva infraestructura de seguridad centralizada.
 * 
 * Características:
 * - Sin credenciales hardcodeadas
 * - Configuración centralizada con SecurityConfig
 * - Envío seguro de emails con SecureMailer
 * - Simulación para desarrollo
 * - Plantillas HTML/texto mejoradas
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

// Inicializar configuración de seguridad
$security = SecurityConfig::getInstance();
$mailer = SecureMailer::getInstance();

// Log de inicio
error_log("🔒 INICIO: enviarCotizacion.php refactorizado");
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
        'servicios' => [] // Array de servicios seleccionados
    ];

    $errores = [];
    
    // Validar datos del cliente
    if (!isset($data['cliente'])) {
        $errores[] = "Sección 'cliente' faltante";
    } else {
        foreach ($camposRequeridos['cliente'] as $campo) {
            if (empty($data['cliente'][$campo])) {
                $errores[] = "Campo faltante: cliente.$campo";
            }
        }
    }

    // Validar servicios
    if (!isset($data['servicios']) || !is_array($data['servicios']) || empty($data['servicios'])) {
        $errores[] = "Debe seleccionar al menos un servicio";
    }

    if (!empty($errores)) {
        throw new Exception('Datos incompletos: ' . implode(', ', $errores));
    }

    // Extraer datos
    $cliente = $data['cliente'];
    $servicios = $data['servicios'];
    $mensaje = $data['mensaje'] ?? '';

    // Validar email
    if (!filter_var($cliente['email'], FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Email inválido: ' . $cliente['email']);
    }

    error_log("📝 Procesando cotización para: {$cliente['email']} con " . count($servicios) . " servicios");

    // === PREPARAR RESPUESTA DE CORREOS ===
    $resultadosCorreos = [];

    // === CORREO AL CLIENTE ===
    $nombreCompleto = $cliente['nombre'] . ' ' . $cliente['apellido'];
    
    $htmlCliente = generarHtmlCotizacionCliente($nombreCompleto, $servicios, $mensaje);
    $textoCliente = generarTextoCotizacionCliente($nombreCompleto, $servicios, $mensaje);

    $datosCorreoCliente = [
        'destinatario' => $cliente['email'],
        'asunto' => 'Solicitud de cotización recibida - Visual Mecánica',
        'mensajeHtml' => $htmlCliente,
        'mensajeTexto' => $textoCliente
    ];

    $resultadoCliente = $mailer->sendMail($datosCorreoCliente, $security->isDevelopment());
    $resultadosCorreos['cliente'] = $resultadoCliente;

    // === CORREO A LA EMPRESA ===
    $smtp = $security->getSmtpConfig();
    $correoEmpresa = $smtp['from_email'] ?? $smtp['username'];

    if ($correoEmpresa) {
        $htmlEmpresa = generarHtmlNotificacionEmpresa($nombreCompleto, $cliente, $servicios, $mensaje);
        $textoEmpresa = generarTextoNotificacionEmpresa($nombreCompleto, $cliente, $servicios, $mensaje);

        $datosCorreoEmpresa = [
            'destinatario' => $correoEmpresa,
            'cc' => $smtp['username'], // Copia de respaldo
            'asunto' => 'Nueva solicitud de cotización',
            'mensajeHtml' => $htmlEmpresa,
            'mensajeTexto' => $textoEmpresa
        ];

        $resultadoEmpresa = $mailer->sendMail($datosCorreoEmpresa, $security->isDevelopment());
        $resultadosCorreos['empresa'] = $resultadoEmpresa;
    }

    // === RESPUESTA FINAL ===
    $todosExitosos = $resultadosCorreos['cliente']['success'] && 
                     (!isset($resultadosCorreos['empresa']) || $resultadosCorreos['empresa']['success']);

    $respuesta = [
        'success' => $todosExitosos,
        'message' => $todosExitosos ? 'Cotización enviada correctamente' : 'Cotización enviada con advertencias',
        'correos' => $resultadosCorreos,
        'servicios_count' => count($servicios),
        'timestamp' => date('Y-m-d H:i:s')
    ];

    error_log("🎉 Cotización completada exitosamente");
    echo json_encode($respuesta);

} catch (Exception $e) {
    error_log("❌ Error en enviarCotizacion: " . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'timestamp' => date('Y-m-d H:i:s')
    ]);
}

// === FUNCIONES AUXILIARES ===

function generarHtmlCotizacionCliente($nombre, $servicios, $mensaje = '') {
    $listaServicios = '';
    foreach ($servicios as $servicio) {
        $precio = isset($servicio['precio']) && $servicio['precio'] > 0 ? 
                  '$' . number_format($servicio['precio'], 0, ',', '.') . ' CLP' : 
                  'Precio a consultar';
        
        $listaServicios .= "
        <div style='background: #f8f9fa; padding: 15px; margin: 10px 0; border-radius: 6px; border-left: 3px solid #007bff;'>
            <h4 style='margin: 0 0 5px 0; color: #333;'>{$servicio['nombre']}</h4>
            " . (!empty($servicio['descripcion']) ? "<p style='margin: 5px 0; color: #666; font-size: 14px;'>{$servicio['descripcion']}</p>" : "") . "
            <p style='margin: 5px 0 0 0; font-weight: bold; color: #007bff;'>$precio</p>
        </div>";
    }

    $seccionMensaje = '';
    if (!empty($mensaje)) {
        $seccionMensaje = "
        <div style='background: #fff3e0; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ff9800;'>
            <h3 style='color: #e65100; margin: 0 0 10px 0;'>💬 Tu Mensaje</h3>
            <p style='margin: 0; color: #333; font-style: italic;'>\"$mensaje\"</p>
        </div>";
    }

    return "
    <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;'>
        <div style='background: linear-gradient(135deg, #007bff 0%, #0056b3 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;'>
            <h1 style='margin: 0; font-size: 28px;'>💼 Solicitud de Cotización</h1>
            <p style='margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;'>Visual Mecánica</p>
        </div>
        
        <div style='background: white; padding: 30px; border: 1px solid #e0e0e0; border-radius: 0 0 10px 10px;'>
            <h2 style='color: #333; margin-top: 0;'>¡Hola $nombre!</h2>
            
            <p style='color: #666; line-height: 1.6;'>
                Hemos recibido tu solicitud de cotización. Revisaremos los servicios seleccionados 
                y te enviaremos una cotización detallada a la brevedad.
            </p>
            
            <h3 style='color: #333; margin: 25px 0 15px 0;'>🔧 Servicios Solicitados</h3>
            $listaServicios
            
            $seccionMensaje
            
            <div style='background: #e8f5e8; padding: 20px; border-radius: 8px; border-left: 4px solid #28a745; margin: 20px 0;'>
                <h3 style='color: #155724; margin: 0 0 10px 0;'>⏰ Próximos Pasos</h3>
                <p style='margin: 5px 0; color: #333;'>• Revisaremos tu solicitud en las próximas 24 horas</p>
                <p style='margin: 5px 0; color: #333;'>• Te enviaremos una cotización detallada por email</p>
                <p style='margin: 5px 0; color: #333;'>• Si tienes urgencia, contáctanos directamente</p>
            </div>
            
            <div style='background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;'>
                <h3 style='color: #1976d2; margin: 0 0 10px 0;'>📞 ¿Necesitas ayuda?</h3>
                <p style='margin: 5px 0; color: #333;'>Si tienes alguna consulta adicional o necesitas información urgente, no dudes en contactarnos.</p>
            </div>
            
            <hr style='border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;'>
            
            <p style='color: #888; font-size: 14px; text-align: center; margin: 0;'>
                Visual Mecánica - Servicio de Excelencia<br>
                <span style='font-size: 12px;'>Este es un correo automático, por favor no responder directamente.</span>
            </p>
        </div>
    </div>";
}

function generarTextoCotizacionCliente($nombre, $servicios, $mensaje = '') {
    $listaServicios = '';
    foreach ($servicios as $index => $servicio) {
        $numero = $index + 1;
        $precio = isset($servicio['precio']) && $servicio['precio'] > 0 ? 
                  '$' . number_format($servicio['precio'], 0, ',', '.') . ' CLP' : 
                  'Precio a consultar';
        
        $listaServicios .= "\n$numero. {$servicio['nombre']} - $precio";
        
        if (!empty($servicio['descripcion'])) {
            $listaServicios .= "\n   {$servicio['descripcion']}";
        }
    }

    $seccionMensaje = '';
    if (!empty($mensaje)) {
        $seccionMensaje = "\n\nTU MENSAJE:\n\"$mensaje\"";
    }

    return "
💼 SOLICITUD DE COTIZACIÓN - VISUAL MECÁNICA

¡Hola $nombre!

Hemos recibido tu solicitud de cotización. Revisaremos los servicios 
seleccionados y te enviaremos una cotización detallada a la brevedad.

🔧 SERVICIOS SOLICITADOS:$listaServicios
$seccionMensaje

⏰ PRÓXIMOS PASOS:
• Revisaremos tu solicitud en las próximas 24 horas
• Te enviaremos una cotización detallada por email
• Si tienes urgencia, contáctanos directamente

📞 ¿NECESITAS AYUDA?
Si tienes alguna consulta adicional o necesitas información urgente, 
no dudes en contactarnos.

Gracias por confiar en Visual Mecánica.

---
Visual Mecánica - Servicio de Excelencia
Este es un correo automático, por favor no responder directamente.
    ";
}

function generarHtmlNotificacionEmpresa($nombre, $cliente, $servicios, $mensaje = '') {
    $listaServicios = '';
    $totalEstimado = 0;
    $tienePrecios = false;
    
    foreach ($servicios as $servicio) {
        $precio = isset($servicio['precio']) && $servicio['precio'] > 0 ? 
                  '$' . number_format($servicio['precio'], 0, ',', '.') . ' CLP' : 
                  'A cotizar';
        
        if (isset($servicio['precio']) && $servicio['precio'] > 0) {
            $totalEstimado += $servicio['precio'];
            $tienePrecios = true;
        }
        
        $listaServicios .= "
        <tr style='border-bottom: 1px solid #e0e0e0;'>
            <td style='padding: 10px; color: #333;'>{$servicio['nombre']}</td>
            <td style='padding: 10px; color: #333; text-align: right;'>$precio</td>
        </tr>";
    }

    $seccionTotal = '';
    if ($tienePrecios && $totalEstimado > 0) {
        $seccionTotal = "
        <tr style='background: #f8f9fa; font-weight: bold;'>
            <td style='padding: 10px; color: #333;'>TOTAL ESTIMADO</td>
            <td style='padding: 10px; color: #007bff; text-align: right;'>$" . number_format($totalEstimado, 0, ',', '.') . " CLP</td>
        </tr>";
    }

    $seccionMensaje = '';
    if (!empty($mensaje)) {
        $seccionMensaje = "
        <div style='background: #fff3e0; padding: 15px; border-radius: 6px; margin: 15px 0;'>
            <h4 style='color: #e65100; margin: 0 0 10px 0;'>💬 Mensaje del Cliente</h4>
            <p style='margin: 0; color: #333; font-style: italic;'>\"$mensaje\"</p>
        </div>";
    }

    return "
    <div style='font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; padding: 20px;'>
        <div style='background: #28a745; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;'>
            <h1 style='margin: 0; font-size: 24px;'>💼 NUEVA SOLICITUD DE COTIZACIÓN</h1>
            <p style='margin: 10px 0 0 0; opacity: 0.9;'>Visual Mecánica - Sistema de Cotizaciones</p>
        </div>
        
        <div style='background: white; padding: 25px; border: 1px solid #e0e0e0; border-radius: 0 0 8px 8px;'>
            <h2 style='color: #333; margin-top: 0;'>Información del Cliente</h2>
            
            <div style='background: #e8f5e8; padding: 15px; border-radius: 6px; margin: 15px 0;'>
                <p style='margin: 5px 0; color: #333;'><strong>Nombre:</strong> {$cliente['nombre']} {$cliente['apellido']}</p>
                <p style='margin: 5px 0; color: #333;'><strong>Email:</strong> {$cliente['email']}</p>
                <p style='margin: 5px 0; color: #333;'><strong>Teléfono:</strong> {$cliente['telefono']}</p>
                " . (!empty($cliente['rut']) ? "<p style='margin: 5px 0; color: #333;'><strong>RUT:</strong> {$cliente['rut']}</p>" : "") . "
                " . (!empty($cliente['empresa']) ? "<p style='margin: 5px 0; color: #333;'><strong>Empresa:</strong> {$cliente['empresa']}</p>" : "") . "
            </div>
            
            <h3 style='color: #333;'>Servicios Solicitados</h3>
            <table style='width: 100%; border-collapse: collapse; margin: 15px 0;'>
                <thead>
                    <tr style='background: #f8f9fa;'>
                        <th style='padding: 10px; text-align: left; color: #333; border-bottom: 2px solid #007bff;'>Servicio</th>
                        <th style='padding: 10px; text-align: right; color: #333; border-bottom: 2px solid #007bff;'>Precio</th>
                    </tr>
                </thead>
                <tbody>
                    $listaServicios
                    $seccionTotal
                </tbody>
            </table>
            
            $seccionMensaje
            
            <div style='background: #e3f2fd; padding: 15px; border-radius: 6px; border-left: 4px solid #2196f3; margin: 20px 0;'>
                <h4 style='color: #1976d2; margin: 0 0 10px 0;'>📋 Acción Requerida</h4>
                <p style='margin: 5px 0; color: #333;'>• Revisar los servicios solicitados</p>
                <p style='margin: 5px 0; color: #333;'>• Preparar cotización detallada</p>
                <p style='margin: 5px 0; color: #333;'>• Contactar al cliente en las próximas 24 horas</p>
            </div>
            
            <p style='color: #666; font-size: 12px; text-align: center; margin: 20px 0 0 0;'>
                Notificación automática - " . date('Y-m-d H:i:s') . "
            </p>
        </div>
    </div>";
}

function generarTextoNotificacionEmpresa($nombre, $cliente, $servicios, $mensaje = '') {
    $listaServicios = '';
    $totalEstimado = 0;
    $tienePrecios = false;
    
    foreach ($servicios as $index => $servicio) {
        $numero = $index + 1;
        $precio = isset($servicio['precio']) && $servicio['precio'] > 0 ? 
                  '$' . number_format($servicio['precio'], 0, ',', '.') . ' CLP' : 
                  'A cotizar';
        
        if (isset($servicio['precio']) && $servicio['precio'] > 0) {
            $totalEstimado += $servicio['precio'];
            $tienePrecios = true;
        }
        
        $listaServicios .= "\n$numero. {$servicio['nombre']} - $precio";
    }

    $seccionTotal = '';
    if ($tienePrecios && $totalEstimado > 0) {
        $seccionTotal = "\n\nTOTAL ESTIMADO: $" . number_format($totalEstimado, 0, ',', '.') . " CLP";
    }

    $seccionMensaje = '';
    if (!empty($mensaje)) {
        $seccionMensaje = "\n\nMENSAJE DEL CLIENTE:\n\"$mensaje\"";
    }

    return "
💼 NUEVA SOLICITUD DE COTIZACIÓN - VISUAL MECÁNICA

INFORMACIÓN DEL CLIENTE:
• Nombre: {$cliente['nombre']} {$cliente['apellido']}
• Email: {$cliente['email']}
• Teléfono: {$cliente['telefono']}" . 
(!empty($cliente['rut']) ? "\n• RUT: {$cliente['rut']}" : "") . 
(!empty($cliente['empresa']) ? "\n• Empresa: {$cliente['empresa']}" : "") . "

SERVICIOS SOLICITADOS:$listaServicios$seccionTotal
$seccionMensaje

📋 ACCIÓN REQUERIDA:
• Revisar los servicios solicitados
• Preparar cotización detallada
• Contactar al cliente en las próximas 24 horas

Notificación automática - " . date('Y-m-d H:i:s') . "
    ";
}
?>
