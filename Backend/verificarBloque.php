<?php

// Configurar cabeceras CORS automáticamente
require_once 'helpers/corsHeaders.php';
setCorsHeaders();

// Configurar errores para desarrollo
error_reporting(E_ALL & ~E_DEPRECATED & ~E_NOTICE & ~E_WARNING);
ini_set('display_errors', 0);

// Siempre devolver JSON
header('Content-Type: application/json');

try {
    // Conexión a la base de datos usando variables de entorno
    require_once 'conexionBD.php';
    $conn = new mysqli($host, $user, $pass, $db);
    if ($conn->connect_error) {
        echo json_encode(['success' => false, 'error' => 'Error de conexión: ' . $conn->connect_error]);
        exit;
    }

    // Obtener entrada desde el cuerpo de la petición
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

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => 'Error interno: ' . $e->getMessage()
    ]);
}
?>
