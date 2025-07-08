<?php

//oculta errores de deprecated y notice
error_reporting(E_ALL & ~E_DEPRECATED & ~E_NOTICE & ~E_WARNING);
ini_set('display_errors', 0);

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

//tildes y caracteres especiales
header('Content-Type: text/html; charset=utf-8');
require 'vendor/autoload.php';

// Configurar cabeceras CORS automáticamente
require_once 'helpers/corsHeaders.php';
setCorsHeaders();
header("Content-Type: application/json");

// Recibir datos del JSON
$data = json_decode(file_get_contents("php://input"), true);
error_log("Datos recibidos: " . print_r($data, true));

// Validar datos mínimos requeridos
if (
    !isset($data["nombre"]) ||
    !isset($data["email"]) ||
    !isset($data["telefono"]) ||
    !isset($data["servicio"])
) {
    echo json_encode(["success" => false, "error" => "Datos incompletos o desconocidos"]);
    exit;
}
// Verificar el valor del servicio
error_log("Servicio solicitado: " . $data["servicio"]); // Verifica que el valor esté presente

$mail = new PHPMailer(true);

try {
    // Configuración del servidor SMTP
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = 'cotizacionautomotriz09@gmail.com'; // Cambia esto por tu correo
    $mail->Password = 'jewckbskarnbixwf'; // Cambia esto por tu contraseña
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = 587;

    // Remitente y destinatario
    $mail->setFrom('cesar.719@gmail.com', 'Sistema de Cotizaciones Visual Mecánica'); // Cambia esto por tu correo
    $mail->addAddress('cotizacionautomotriz09@gmail.com', 'Destinatario'); // Cambia esto por el correo del destinatario

    // Asunto y cuerpo del mensaje
    $mail->Subject = "Nueva solicitud de cotizacion";
    $mail->Body =
        "👤 DATOS DEL CLIENTE\n" .
        "Nombre: {$data["nombre"]}\n" .
        "Email: {$data["email"]}\n" .
        "Teléfono: {$data["telefono"]}\n\n" .
        
        "📋 SERVICIO SOLICITADO\n" .
        "Servicio: {$data["servicio"]}\n\n" . // Asegúrate de que este campo esté correctamente referenciado

        "📝 MENSAJE\n" .
        "Mensaje: " . (isset($data["mensaje"]) ? $data["mensaje"] : "No se proporcionó mensaje.");

    // Enviar correo
    $mail->send();
    // Simula un pequeño retraso para UX (puedes quitarlo si no lo deseas)
    usleep(2000000); // 2 segundos
    echo json_encode([
        "success" => true,
        "message" => "¡Tu solicitud fue enviada exitosamente!<br>En breve recibirás una respuesta.<br><span style='color:#4CAF50;font-weight:bold;'>Visual Mecánica</span>"
    ]);
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "error" => "<span style='color:#F44336;font-weight:bold;'>Error al enviar el correo:</span> " . $mail->ErrorInfo
    ]);
}
?>