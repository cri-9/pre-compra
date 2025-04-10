<?php
header('Content-Type: application/json');

// Conexión a la base de datos
$conn = new mysqli("localhost", "root", "", "precompra_db");

// Verifica conexión
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'error' => 'Error de conexión: ' . $conn->connect_error]);
    exit;
}

// Recibe JSON desde frontend
$input = json_decode(file_get_contents('php://input'), true);
$fecha = isset($input['fecha']) ? $input['fecha'] : null;

if (!$fecha) {
    echo json_encode(['success' => false, 'error' => 'Fecha no proporcionada']);
    exit;
}

// Consulta para obtener los bloques ocupados en esa fecha
$stmt = $conn->prepare("SELECT bloque FROM agendamientos WHERE fecha = ?");
$stmt->bind_param("s", $fecha);
$stmt->execute();
$result = $stmt->get_result();

$bloquesOcupados = [];
while ($row = $result->fetch_assoc()) {
    $bloquesOcupados[] = $row['bloque'];
}

$todosLosBloques = ["AM", "PM"];
$disponibles = array_values(array_diff($todosLosBloques, $bloquesOcupados));

// Devuelve la respuesta
echo json_encode([
    "success" => true,
    "disponibles" => $disponibles
]);

$conn->close();
