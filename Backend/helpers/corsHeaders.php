<?php
// Archivo: Backend/helpers/corsHeaders.php
// Configuración automática de cabeceras CORS para desarrollo y producción
// Compatible automáticamente - NO requiere cambios manuales entre entornos

function setCorsHeaders() {
    // Verificar si ya se han enviado los encabezados para evitar duplicación
    static $headersSent = false;
    if ($headersSent) {
        return;
    }
    
    // Detectar automáticamente el entorno
    $isLocalDevelopment = (
        // Localhost directo
        $_SERVER['SERVER_NAME'] === 'localhost' || 
        $_SERVER['SERVER_NAME'] === '127.0.0.1' ||
        // Host contiene localhost
        strpos($_SERVER['HTTP_HOST'], 'localhost') !== false ||
        strpos($_SERVER['HTTP_HOST'], '127.0.0.1') !== false ||
        // Puerto de desarrollo común
        strpos($_SERVER['HTTP_HOST'], ':8080') !== false ||
        strpos($_SERVER['HTTP_HOST'], ':3000') !== false ||
        strpos($_SERVER['HTTP_HOST'], ':8000') !== false ||
        // Variables de entorno de desarrollo
        (isset($_SERVER['ENVIRONMENT']) && $_SERVER['ENVIRONMENT'] === 'development') ||
        // Detectar XAMPP/WAMP/MAMP
        strpos($_SERVER['DOCUMENT_ROOT'], 'xampp') !== false ||
        strpos($_SERVER['DOCUMENT_ROOT'], 'wamp') !== false ||
        strpos($_SERVER['DOCUMENT_ROOT'], 'mamp') !== false
    );
    
    // Obtener el origen de la petición
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    
    if ($isLocalDevelopment) {
        // DESARROLLO: Permitir localhost y dominios de desarrollo
        if (preg_match('/^https?:\/\/(localhost|127\.0\.0\.1)(:[0-9]+)?$/', $origin)) {
            // Permitir cualquier puerto de localhost
            header("Access-Control-Allow-Origin: $origin");
        } elseif (preg_match('/^https?:\/\/.*\.local(:[0-9]+)?$/', $origin)) {
            // Permitir dominios .local para desarrollo
            header("Access-Control-Allow-Origin: $origin");
        } else {
            // Fallback para desarrollo - permitir los puertos más comunes
            header("Access-Control-Allow-Origin: http://localhost:3001");
        }
    } else {
        // PRODUCCIÓN: Configuración segura
        $allowedOrigins = [
            'https://visualmecanica.cl',
            'https://www.visualmecanica.cl',
            // Agregar aquí otros dominios de producción si es necesario
        ];
        
        if (in_array($origin, $allowedOrigins)) {
            header("Access-Control-Allow-Origin: $origin");
        } else {
            // Por defecto en producción
            header("Access-Control-Allow-Origin: https://visualmecanica.cl");
        }
    }
    
    // Headers comunes para ambos entornos
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept");
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Max-Age: 86400"); // Cache preflight por 24 horas
    
    // Marcar que los encabezados ya se enviaron
    $headersSent = true;
    
    // Manejar preflight OPTIONS
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit(0);
    }
}

// Función auxiliar para logging (opcional)
function logCorsInfo() {
    $logFile = __DIR__ . '/../cors_debug.log';
    $info = [
        'timestamp' => date('Y-m-d H:i:s'),
        'SERVER_NAME' => $_SERVER['SERVER_NAME'] ?? 'N/A',
        'HTTP_HOST' => $_SERVER['HTTP_HOST'] ?? 'N/A',
        'HTTP_ORIGIN' => $_SERVER['HTTP_ORIGIN'] ?? 'N/A',
        'REQUEST_METHOD' => $_SERVER['REQUEST_METHOD'] ?? 'N/A',
        'DOCUMENT_ROOT' => $_SERVER['DOCUMENT_ROOT'] ?? 'N/A'
    ];
    file_put_contents($logFile, json_encode($info) . "\n", FILE_APPEND);
}
?>
