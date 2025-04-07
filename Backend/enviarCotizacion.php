<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

//tildes y caracteres especiales
header('Content-Type: text/html; charset=utf-8');
require 'vendor/autoload.php';


// Cabeceras CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
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
    echo json_encode(["success" => true, "message" => "Correo enviado correctamente."]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "error" => $mail->ErrorInfo]);
}
?>