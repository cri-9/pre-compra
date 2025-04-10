<?php
// enviarCorreo.php

// Cabeceras CORS
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Si es una solicitud OPTIONS, termina la ejecución
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Obtener los datos JSON enviados
$data = json_decode(file_get_contents('php://input'), true);

// Depuración: Imprime el contenido de $data
error_log(print_r($data, true));

// Acceder a las claves con valores predeterminados
$direccion = $data['cliente']['dirección'] ?? null;
$region = $data['cliente']['región'] ?? null;

// Verificar si faltan datos requeridos
if ($direccion === null || $region === null) {
    echo json_encode(["success" => false, "error" => "Faltan datos requeridos."]);
    exit();
}

// Cargar PHPMailer (esto debe ir ANTES de los 'use')
require 'vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$mail = new PHPMailer(true);

try {
    // Configuración del servidor SMTP
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = 'cotizacionautomotriz09@gmail.com';
    $mail->Password = 'jewckbskarnbixwf';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = 587;

    // Remitente y destinatario
    $mail->setFrom('cesar.719@gmail.com', 'Sistema de Cotizaciones Visual Mecánica');
    $mail->addAddress('cotizacionautomotriz09@gmail.com', 'Destinatario');

    // Contenido del correo
    $mail->isHTML(true);
    $mail->Subject = 'Nuevo Agendamiento';

    $body = "<h1>Datos del Agendamiento</h1>";

    $body .= "<h2>Datos del Vehículo</h2>";
    $body .= "<p><strong>Marca:</strong> " . $data['vehiculo']['marca'] . "</p>";
    $body .= "<p><strong>Modelo:</strong> " . $data['vehiculo']['modelo'] . "</p>";
    $body .= "<p><strong>Año:</strong> " . $data['vehiculo']['año'] . "</p>";
    $body .= "<p><strong>Patente:</strong> " . $data['vehiculo']['patente'] . "</p>";

    $body .= "<h2>Datos del Cliente</h2>";
    $body .= "<p><strong>Nombre:</strong> " . $data['cliente']['nombre'] . "</p>";
    $body .= "<p><strong>Apellido:</strong> " . $data['cliente']['apellido'] . "</p>";
    $body .= "<p><strong>Email:</strong> " . $data['cliente']['email'] . "</p>";
    $body .= "<p><strong>Teléfono:</strong> " . $data['cliente']['telefono'] . "</p>";
    $body .= "<p><strong>RUT:</strong> " . $data['cliente']['rut'] . "</p>";
    $body .= "<p><strong>Direccion:</strong> " . $data['cliente']['direccion'] . "</p>";
    $body .= "<p><strong>Región:</strong> " . $data['cliente']['region'] . "</p>";
    $body .= "<p><strong>Comuna:</strong> " . $data['cliente']['comuna'] . "</p>";

    $body .= "<h2>Datos del Vendedor</h2>";
    $body .= "<p><strong>Tipo de Vendedor:</strong> " . ($data['vendedor']['tipovendedor'] ?? 'No especificado') . "</p>";
    $body .= "<p><strong>Nombre:</strong> " . ($data['vendedor']['nombre'] ?? 'No especificado') . "</p>";
    $body .= "<p><strong>Teléfono:</strong> " . ($data['vendedor']['telefono'] ?? 'No especificado') . "</p>";
    $body .= "<p><strong>Direccion:</strong> " . ($data['vendedor']['direccion'] ?? 'No especificado') . "</p>";
    $body .= "<p><strong>Región:</strong> " . ($data['vendedor']['region'] ?? 'No especificado') . "</p>";
    $body .= "<p><strong>Comuna:</strong> " . ($data['vendedor']['comuna'] ?? 'No especificado') . "</p>";

    $body .= "<h2>Fecha de Agendamiento</h2>";
    $body .= "<p><strong>Fecha:</strong> " . ($data['agendamiento']['fecha'] ?? 'No especificada') . "</p>";
    $body .= "<p><strong>Bloque:</strong> " . ($data['agendamiento']['bloque'] ?? 'No especificado') . "</p>";

    $body .= "<h2>Método de Pago</h2>";
    $body .= "<p><strong>Método:</strong> " . ($data['pago']['metodo'] ?? 'No especificado') . "</p>";

    $mail->Body = $body;

    $mail->send();
    echo json_encode(['success' => true, 'message' => 'Correo enviado con éxito']);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => 'Error al enviar el correo: ' . $mail->ErrorInfo]);
}
?>
