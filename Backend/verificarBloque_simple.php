<?php
// Configurar cabeceras CORS para producción
header("Access-Control-Allow-Origin: https://visualmecanica.cl");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept");
header("Access-Control-Allow-Credentials: true");

// Manejar preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

// Configurar errores
error_reporting(0);
ini_set('display_errors', 0);

// Siempre devolver JSON
header('Content-Type: application/json');

try {
    // Configuración de BD para producción (ajustar según tu configuración)
    $host = 'database';  // nombre del servicio en docker-compose
    $db = 'visualmecanica_prod';
    $user = 'visualmecanica_user';
    $pass = 'password_seguro_123';
    
    // Conexión a la base de datos
    $conn = new mysqli($host, $user, $pass, $db);
    if ($conn->connect_error) {
        echo json_encode(['success' => false, 'error' => 'Error de conexión']);
        exit;
    }

    // Obtener entrada
    $rawInput = file_get_contents('php://input');
    $input = json_decode($rawInput, true);

    if (!isset($input['fecha'])) {
        echo json_encode(["success" => false, "error" => "No se envió la fecha"]);
        exit;
    }

    $fecha = $input['fecha'];

    if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $fecha)) {
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

    echo json_encode([
        "success" => true,
        "disponibles" => $disponibles
    ]);

    $stmt->close();
    $conn->close();

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => 'Error interno'
    ]);
}
?>