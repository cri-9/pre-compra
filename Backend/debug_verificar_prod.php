<?php
// Debug específico para verificarBloque en producción
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('log_errors', 1);

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$debug = [];

try {
    $debug['step'] = 'inicio';
    $debug['php_version'] = phpversion();
    $debug['method'] = $_SERVER['REQUEST_METHOD'];
    
    // Test 1: Verificar si helpers/env.php existe
    $envPath = __DIR__ . '/helpers/env.php';
    $debug['env_file_exists'] = file_exists($envPath);
    
    if ($debug['env_file_exists']) {
        $debug['step'] = 'cargando_env';
        require_once $envPath;
        $debug['env_loaded'] = true;
        
        // Test 2: Verificar variables de entorno
        $debug['step'] = 'verificando_variables';
        $debug['db_host'] = getenv_backend('DB_HOST', 'NO_ENCONTRADO');
        $debug['db_name'] = getenv_backend('DB_NAME', 'NO_ENCONTRADO');
        $debug['db_user'] = getenv_backend('DB_USER', 'NO_ENCONTRADO');
        
        // Test 3: Intentar conexión a BD
        $debug['step'] = 'conectando_bd';
        $host = getenv_backend('DB_HOST', 'localhost');
        $db = getenv_backend('DB_NAME', 'precompra_db');
        $user = getenv_backend('DB_USER', 'root');
        $pass = getenv_backend('DB_PASS', '');
        
        $debug['connection_params'] = [
            'host' => $host,
            'db' => $db,
            'user' => $user,
            'pass_length' => strlen($pass)
        ];
        
        $conn = new mysqli($host, $user, $pass, $db);
        if ($conn->connect_error) {
            $debug['connection_error'] = $conn->connect_error;
            $debug['connection_success'] = false;
        } else {
            $debug['connection_success'] = true;
            $debug['step'] = 'conexion_exitosa';
            
            // Test 4: Verificar si tabla existe
            $result = $conn->query("SHOW TABLES LIKE 'agendamientos'");
            $debug['table_exists'] = $result && $result->num_rows > 0;
            
            $conn->close();
        }
    } else {
        $debug['env_error'] = 'Archivo helpers/env.php no encontrado';
    }
    
    $debug['final_status'] = 'success';
    
} catch (Exception $e) {
    $debug['error'] = $e->getMessage();
    $debug['error_line'] = $e->getLine();
    $debug['error_file'] = $e->getFile();
    $debug['final_status'] = 'error';
} catch (Error $e) {
    $debug['fatal_error'] = $e->getMessage();
    $debug['error_line'] = $e->getLine();
    $debug['error_file'] = $e->getFile();
    $debug['final_status'] = 'fatal_error';
}

echo json_encode($debug, JSON_PRETTY_PRINT);
?>