<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Configuración hardcodeada para producción
$host = 'database';
$db = 'visualmecanica_prod';
$user = 'visualmecanica_user';
$pass = 'password_seguro_123';

try {
    // Obtener datos de entrada
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($input['fecha'])) {
        echo json_encode(["success" => false, "error" => "Fecha requerida"]);
        exit;
    }
    
    $fecha = $input['fecha'];
    
    if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $fecha)) {
        echo json_encode(["success" => false, "error" => "Formato de fecha inválido"]);
        exit;
    }
    
    // Conexión a BD
    $conn = new mysqli($host, $user, $pass, $db);
    
    if ($conn->connect_error) {
        echo json_encode(["success" => false, "error" => "Error de conexión BD"]);
        exit;
    }
    
    // Consulta
    $stmt = $conn->prepare("SELECT bloque FROM agendamientos WHERE fecha_agendada = ?");
    $stmt->bind_param("s", $fecha);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $ocupados = [];
    while ($row = $result->fetch_assoc()) {
        $ocupados[] = $row['bloque'];
    }
    
    $todos = ["AM", "PM"];
    $disponibles = array_diff($todos, $ocupados);
    
    echo json_encode([
        "success" => true,
        "disponibles" => array_values($disponibles)
    ]);
    
    $stmt->close();
    $conn->close();
    
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "error" => "Error: " . $e->getMessage()
    ]);
}
?>