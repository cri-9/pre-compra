<?php
// Archivo: Backend/helpers/corsHeaders.php
// Configuración automática de cabeceras CORS para desarrollo y producción

function setCorsHeaders() {
    // Cargar configuración del entorno
    $envFile = __DIR__ . '/../.env';
    $isProduction = false;
    
    if (file_exists($envFile)) {
        // Suprimir warnings temporalmente para parse_ini_file
        $envVars = @parse_ini_file($envFile, false, INI_SCANNER_RAW);
        if ($envVars === false) {
            // Si falla, intentar línea por línea
            $envVars = [];
            $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
            foreach ($lines as $line) {
                $line = trim($line);
                if (strpos($line, '#') === 0) continue; // Skip comments
                if (strpos($line, '=') !== false) {
                    list($key, $value) = explode('=', $line, 2);
                    $envVars[trim($key)] = trim($value);
                }
            }
        }
        $appUrl = $envVars['APP_URL'] ?? '';
        $isProduction = strpos($appUrl, 'https://') === 0;
    }
    
    if ($isProduction) {
        // Producción: Solo permitir el dominio específico
        header("Access-Control-Allow-Origin: https://visualmecanica.cl");
    } else {
        // Desarrollo: Permitir localhost en cualquier puerto
        $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
        if (preg_match('/^https?:\/\/localhost(:[0-9]+)?$/', $origin)) {
            header("Access-Control-Allow-Origin: $origin");
        } else {
            header("Access-Control-Allow-Origin: http://localhost:3001");
        }
    }
    
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
    header("Access-Control-Allow-Credentials: true");
    
    // Manejar preflight OPTIONS
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit(0);
    }
}
?>
