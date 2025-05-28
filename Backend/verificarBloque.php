<?php

require_once __DIR__ . '/helpers/env.php';
require_once __DIR__ . '/helpers/rateLimiter.php';

rateLimit();
//oculta errores de deprecated y notice
error_reporting(E_ALL & ~E_DEPRECATED & ~E_NOTICE & ~E_WARNING);
ini_set('display_errors', 0);


ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: https://visualmecanica.cl");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");

// Conexión a la base de datos
$conn = new mysqli("localhost", "root", "", "precompra_db");
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'error' => 'Error de conexión: ' . $conn->connect_error]);
    exit;
}

// Obtener entrada desde router.php
$rawInput = file_get_contents('php://input');
$input = json_decode($rawInput, true);

// Verificación de datos
if (!isset($input['fecha'])) {
    echo json_encode(["success" => false, "error" => "No se envió la fecha"]);
    exit;
}

$fecha = $input['fecha'];

if (!$fecha || !preg_match('/^\d{4}-\d{2}-\d{2}$/', $fecha)) {
    echo json_encode(['success' => false, 'error' => 'Fecha no válida']);
    exit;
}

// Consulta bloques ocupados
$stmt = $conn->prepare("SELECT bloque FROM agendamientos WHERE fecha_agendada = ?");
$stmt->bind_param("s", $fecha);
$stmt->execute();
$result = $stmt->get_result();

$bloquesOcupados = [];
while ($row = $result->fetch_assoc()) {
    $bloquesOcupados[] = $row['bloque'];
}

$todosLosBloques = ["AM", "PM"];
$disponibles = array_values(array_diff($todosLosBloques, $bloquesOcupados));

// Respuesta
http_response_code(200);
echo json_encode([
    "success" => true,
    "disponibles" => $disponibles
]);

$stmt->close();
$conn->close();
