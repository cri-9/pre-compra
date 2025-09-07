<?php
// Configurar cabeceras CORS directamente
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (strpos($_SERVER['HTTP_HOST'], 'visualmecanica.cl') !== false) {
    header("Access-Control-Allow-Origin: https://visualmecanica.cl");
    header("Access-Control-Allow-Origin: https://www.visualmecanica.cl");
} elseif (preg_match('/^https?:\/\/localhost(:[0-9]+)?$/', $origin)) {
    header("Access-Control-Allow-Origin: $origin");
} else {
    header("Access-Control-Allow-Origin: *");
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
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// Siempre devolver JSON
header('Content-Type: application/json');

try {
    // Intentar cargar variables de entorno, con fallbacks
    $host = 'localhost';
    $db = 'precompra_db';
    $user = 'root';
    $pass = '';
    
    // Intentar cargar desde .env si existe
    if (file_exists(__DIR__ . '/.env')) {
        $envContent = file_get_contents(__DIR__ . '/.env');
        if ($envContent) {
            $lines = explode("\n", $envContent);
            foreach ($lines as $line) {
                $line = trim($line);
                if (strpos($line, 'DB_HOST=') === 0) {
                    $host = trim(str_replace('DB_HOST=', '', $line));
                }
                if (strpos($line, 'DB_NAME=') === 0) {
                    $db = trim(str_replace('DB_NAME=', '', $line));
                }
                if (strpos($line, 'DB_USER=') === 0) {
                    $user = trim(str_replace('DB_USER=', '', $line));
                }
                if (strpos($line, 'DB_PASS=') === 0) {
                    $pass = trim(str_replace('DB_PASS=', '', $line));
                }
            }
        }
    }
    
    // Log para debug
    error_log("Conectando a BD: host=$host, db=$db, user=$user");
    
    // Conexión a la base de datos
    $conn = new mysqli($host, $user, $pass, $db);
    if ($conn->connect_error) {
        error_log("Error de conexión BD: " . $conn->connect_error);
        echo json_encode(['success' => false, 'error' => 'Error de conexión a la base de datos']);
        exit;
    }

    // Obtener entrada desde el cuerpo de la petición
    $rawInput = file_get_contents('php://input');
    $input = json_decode($rawInput, true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        error_log("Error JSON: " . json_last_error_msg());
        echo json_encode(['success' => false, 'error' => 'JSON inválido']);
        exit;
    }

    // Verificación de datos
    if (!isset($input['fecha'])) {
        error_log("Fecha no enviada");
        echo json_encode(["success" => false, "error" => "No se envió la fecha"]);
        exit;
    }

    $fecha = $input['fecha'];

    if (!$fecha || !preg_match('/^\d{4}-\d{2}-\d{2}$/', $fecha)) {
        error_log("Fecha inválida: " . $fecha);
        echo json_encode(['success' => false, 'error' => 'Fecha no válida']);
        exit;
    }

    // Consulta bloques ocupados
    $stmt = $conn->prepare("SELECT bloque FROM agendamientos WHERE fecha_agendada = ?");
    if (!$stmt) {
        error_log("Error preparando consulta: " . $conn->error);
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

    error_log("Bloques disponibles para $fecha: " . implode(', ', $disponibles));

    // Respuesta
    http_response_code(200);
    echo json_encode([
        "success" => true,
        "disponibles" => $disponibles
    ]);

    $stmt->close();
    $conn->close();

} catch (Exception $e) {
    error_log("Excepción en verificarBloque: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'error' => 'Error interno del servidor'
    ]);
} catch (Error $e) {
    error_log("Error fatal en verificarBloque: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'error' => 'Error fatal del servidor'
    ]);
}
?>