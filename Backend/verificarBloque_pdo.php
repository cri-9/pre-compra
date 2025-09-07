<?php
// Configurar cabeceras CORS directamente
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (preg_match('/^https?:\/\/localhost(:[0-9]+)?$/', $origin)) {
    header("Access-Control-Allow-Origin: $origin");
} elseif (strpos($_SERVER['HTTP_HOST'], 'visualmecanica.cl') !== false) {
    header("Access-Control-Allow-Origin: https://visualmecanica.cl");
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

// Configurar errores para desarrollo
error_reporting(E_ALL & ~E_DEPRECATED & ~E_NOTICE & ~E_WARNING);
ini_set('display_errors', 0);

// Siempre devolver JSON
header('Content-Type: application/json');

try {
    // Cargar variables de entorno
    require_once __DIR__ . '/helpers/env.php';
    
    // Obtener variables de conexión
    $host = getenv_backend('DB_HOST', 'localhost');
    $db = getenv_backend('DB_NAME', 'precompra_db');
    $user = getenv_backend('DB_USER', 'root');
    $pass = getenv_backend('DB_PASS', '');
    
    // Conexión a la base de datos usando PDO
    $dsn = "mysql:host=$host;dbname=$db;charset=utf8mb4";
    $pdo = new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);

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

    // Consulta bloques ocupados usando PDO
    $stmt = $pdo->prepare("SELECT bloque FROM agendamientos WHERE fecha_agendada = ?");
    $stmt->execute([$fecha]);
    $rows = $stmt->fetchAll();

    $bloquesOcupados = [];
    foreach ($rows as $row) {
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

} catch (Exception $e) {
    error_log("Error en verificarBloque: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'error' => 'Error interno: ' . $e->getMessage()
    ]);
}
?>