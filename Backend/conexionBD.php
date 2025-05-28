<?php

//oculta errores de deprecated y notice
error_reporting(E_ALL & ~E_DEPRECATED & ~E_NOTICE & ~E_WARNING);
ini_set('display_errors', 0);


error_log("Iniciando conexión a la base de datos");

// Load environment variables if .env file exists
if (file_exists(__DIR__ . '/.env')) {
    error_log("Archivo .env encontrado, cargando variables");
    $envVars = parse_ini_file(__DIR__ . '/.env');
    $host = $envVars['DB_HOST'] ?? 'localhost';
    $db = $envVars['DB_NAME'] ?? 'precompra_db';
    $user = $envVars['DB_USER'] ?? 'root';
    $pass = $envVars['DB_PASS'] ?? '';
    error_log("Variables de entorno cargadas: host=$host, db=$db, user=$user");
} else {
    error_log("Archivo .env no encontrado, usando valores por defecto");
    $host = 'localhost';
    $db = 'precompra_db';
    $user = 'root';
    $pass = '';
}

try {
    error_log("Intentando conectar a MySQL: host=$host, db=$db");
    $conn = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    error_log("Conexión a la base de datos establecida exitosamente");
} catch (PDOException $e) {
    error_log("Error detallado de conexión a la base de datos: " . $e->getMessage());
    error_log("Código de error MySQL: " . $e->getCode());
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'error' => 'Error de conexión a la base de datos',
        'details' => $e->getMessage()
    ]);
    exit;
}
?>

