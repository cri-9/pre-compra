<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

error_log("Datos recibidos: " . print_r($data, true));

if (!isset($data["nombre"], $data["email"], $data["telefono"], $data["servicio"])) {
    echo json_encode(["success" => false, "error" => "Datos incompletos"]);
    exit;
}

$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = 'cesar.719@gmail.com';
    $mail->Password = 'Martin.1201039';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS; // O PHPMailer::ENCRYPTION_SMTPS
    $mail->Port = 587; // O 465

    $mail->setFrom('cesar.719@gmail.com', 'Tu Nombre');
    $mail->addAddress('soporte.drilan@gmail.com', 'Destinatario');

    $mail->Subject = "Nueva solicitud de cotización";
    $mail->Body = "Nombre: {$data["nombre"]}\nEmail: {$data["email"]}\nTeléfono: {$data["telefono"]}\nServicio: {$data["servicio"]}\nMensaje: " . ($data["mensaje"] ?? "Sin mensaje");

    $mail->send();
    echo json_encode(["success" => true, "message" => "Correo enviado"]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "error" => $mail->ErrorInfo]);
}
?>