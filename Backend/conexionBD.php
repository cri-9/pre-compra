<?php

$envPath = __DIR__ . '/.env';

if (file_exists($envPath)) {
    error_log("Archivo .env encontrado, cargando variables");
    $envVars = parse_ini_file($envPath);
    $host = $envVars['DB_HOST'] ?? getenv('DB_HOST') ?: 'localhost';
    $db   = $envVars['DB_NAME'] ?? getenv('DB_NAME') ?: 'precompra_db';
    $user = $envVars['DB_USER'] ?? getenv('DB_USER') ?: 'root';
    $pass = $envVars['DB_PASS'] ?? getenv('DB_PASS') ?: '';
    error_log("Variables de entorno cargadas desde .env o entorno");
} else {
    // Fallback total
    $host = getenv('DB_HOST') ?: 'localhost';
    $db   = getenv('DB_NAME') ?: 'precompra_db';
    $user = getenv('DB_USER') ?: 'root';
    $pass = getenv('DB_PASS') ?: '';
    error_log("Archivo .env no encontrado, usando variables de entorno o por defecto");
}

?>