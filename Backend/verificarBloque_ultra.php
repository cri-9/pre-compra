<?php
header('X-Debug-PHP: yes');
// Función para enviar headers CORS y Content-Type siempre
function send_cors_headers() {
    header("Access-Control-Allow-Origin: http://localhost:3001");
    header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
    header("Access-Control-Allow-Credentials: true");
    header('Content-Type: application/json');
}

// Enviar headers CORS y Content-Type al inicio
send_cors_headers();

// Manejar solicitudes OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Limpiar cualquier output previo
if (ob_get_level()) {
    ob_clean();
}

// Configurar errores
error_reporting(0);
ini_set('display_errors', 0);

try {
    // Variables de conexión directas (para evitar includes)
    $host = 'mysql';  // nombre del contenedor Docker
    $db = 'precompra_db';
    $user = 'user';
    $pass = 'pass';
    
    $conn = new mysqli($host, $user, $pass, $db);
    
    if ($conn->connect_error) {
        send_cors_headers();
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Error de conexión']);
        exit;
    }

    // Obtener datos
    $rawInput = file_get_contents('php://input');
    $input = json_decode($rawInput, true);

    if (!isset($input['fecha'])) {
        send_cors_headers();
        http_response_code(400);
        echo json_encode(["success" => false, "error" => "No se envió la fecha"]);
        exit;
    }

    $fecha = $input['fecha'];

    if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $fecha)) {
        send_cors_headers();
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Fecha no válida']);
        exit;
    }

    // Consulta bloques ocupados
    $stmt = $conn->prepare("SELECT bloque FROM agendamientos WHERE fecha_agendada = ?");
    if (!$stmt) {
        send_cors_headers();
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Error en la consulta']);
        exit;
    }
    
    $stmt->bind_param("s", $fecha);
    $stmt->execute();
    $result = $stmt->get_result();

    $bloquesOcupados = [];
    while ($row = $result->fetch_assoc()) {
        $bloquesOcupados[] = $row['bloque'];
    }

    $todosLosBloques = ["AM", "PM"];
    $disponibles = array_values(array_diff($todosLosBloques, $bloquesOcupados));

    // Respuesta final
    send_cors_headers();
    http_response_code(200);
    echo json_encode([
        "success" => true,
        "disponibles" => $disponibles
    ]);

    $stmt->close();
    $conn->close();

} catch (Exception $e) {
    send_cors_headers();
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Error interno'
    ]);
}
?>
