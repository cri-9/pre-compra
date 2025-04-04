<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

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
    !isset($data["cliente"]["nombre"]) ||
    !isset($data["cliente"]["email"]) ||
    !isset($data["cliente"]["telefono"]) ||
    !isset($data["vehiculo"]["marca"])
) {
    echo json_encode(["success" => false, "error" => "Datos incompletos o desconocidos"]);
    exit;
}

$mail = new PHPMailer(true);

try {
    // Configuración del servidor SMTP
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = 'cesar.719@gmail.com';
    $mail->Password = 'Martin.1201039';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = 587;

    // Remitente y destinatario
    $mail->setFrom('cesar.719@gmail.com', 'Sistema Pre-Compra');
    $mail->addAddress('soporte.drilan@gmail.com', 'Destinatario');

    // Asunto y cuerpo del mensaje
    $mail->Subject = "Nueva solicitud de agendamiento";
    $mail->Body =
        "🚗 DATOS DEL VEHÍCULO\n" .
        "Marca: {$data["vehiculo"]["marca"]}\n" .
        "Modelo: {$data["vehiculo"]["modelo"]}\n" .
        "Año: {$data["vehiculo"]["año"]}\n" .
        "Patente: {$data["vehiculo"]["patente"]}\n\n" .

        "👤 DATOS DEL CLIENTE\n" .
        "Nombre: {$data["cliente"]["nombre"]} {$data["cliente"]["apellido"]}\n" .
        "Email: {$data["cliente"]["email"]}\n" .
        "Teléfono: {$data["cliente"]["telefono"]}\n" .
        "RUT: {$data["cliente"]["rut"]}\n" .
        "Dirección: {$data["cliente"]["dirección"]}\n" .
        "Región: {$data["cliente"]["región"]}\n\n" .

        "🧑‍💼 DATOS DEL VENDEDOR\n" .
        "Tipo: {$data["vendedor"]["tipovendedor"]}\n" .
        "Nombre: {$data["vendedor"]["nombre"]}\n" .
        "Teléfono: {$data["vendedor"]["telefono"]}\n" .
        "Dirección: {$data["vendedor"]["direccion"]}\n" .
        "Comuna: {$data["vendedor"]["comuna"]}\n" .
        "Región: {$data["vendedor"]["region"]}\n\n" .

        "🗓️ AGENDAMIENTO\n" .
        "Fecha: {$data["agendamiento"]["fecha"]}\n" .
        "Bloque: {$data["agendamiento"]["bloque"]}\n\n" .

        "💳 MÉTODO DE PAGO\n" .
        "Método: {$data["pago"]["metodo"]}";

    // Enviar correo
    $mail->send();
    echo json_encode(["success" => true, "message" => "Correo enviado correctamente."]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "error" => $mail->ErrorInfo]);
}
?>
