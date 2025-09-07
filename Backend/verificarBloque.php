<?php
// Configurar cabeceras CORS directamente
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (strpos($_SERVER['HTTP_HOST'], 'visualmecanica.cl') !== false) {
    header("Access-Control-Allow-Origin: https://visualmecanica.cl");
} elseif (preg_match('/^https?:\/\/localhost(:[0-9]+)?$/', $origin)) {
    header("Access-Control-Allow-Origin: $origin");
} else {
    header("Access-Control-Allow-Origin: http://localhost:3001");
}

header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept");
header("Access-Control-Allow-Credentials: true");

// Manejar preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

// Configurar errores
error_reporting(E_ALL & ~E_DEPRECATED & ~E_NOTICE & ~E_WARNING);
ini_set('display_errors', 0);

// Siempre devolver JSON
header('Content-Type: application/json');

try {
    // Detectar entorno y usar configuración apropiada
    $isProduction = strpos($_SERVER['HTTP_HOST'], 'visualmecanica.cl') !== false;
    
    if ($isProduction) {
        // Configuración para producción (hardcodeada)
        $host = 'database';  // nombre del servicio en docker-compose.prod.yml
        $db = 'visualmecanica_prod';
        $user = 'visualmecanica_user';
        $pass = 'password_seguro_123';
    } else {
        // Configuración para desarrollo (desde .env)
        require_once __DIR__ . '/helpers/env.php';
        $host = getenv_backend('DB_HOST', 'localhost');
        $db = getenv_backend('DB_NAME', 'precompra_db');
        $user = getenv_backend('DB_USER', 'root');
        $pass = getenv_backend('DB_PASS', '');
    }
    
    // Conexión a la base de datos
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
    error_log("Error en verificarBloque: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'error' => 'Error interno: ' . $e->getMessage()
    ]);
}
?>