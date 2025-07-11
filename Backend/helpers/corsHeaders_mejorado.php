<?php
// Archivo: Backend/helpers/corsHeaders_mejorado.php
// Versión mejorada de la configuración CORS que evita duplicación de encabezados
// y maneja correctamente diferentes entornos

/**
 * ADVERTENCIA: Este archivo es una referencia para implementación futura.
 * Para endpoints críticos, se recomienda configurar CORS directamente en el 
 * archivo del endpoint para evitar problemas de duplicación de encabezados.
 * 
 * Actualmente notificarTransferencia.php usa configuración CORS directa
 * en lugar de esta implementación compartida.
 */

/**
 * Configura las cabeceras CORS de manera segura y evitando duplicación
 * 
 * Esta función asegura que:
 * 1. Los encabezados CORS solo se envían una vez por petición
 * 2. Se respetan los orígenes permitidos según el entorno
 * 3. Se manejan correctamente las solicitudes preflight OPTIONS
 */
function setCorsHeaders() {
    // Variable estática para evitar duplicación de encabezados
    static $headersSent = false;
    if ($headersSent) {
        return;
    }
    
    // Cargar configuración del entorno desde .env
    $envFile = __DIR__ . '/../.env';
    $allowedOrigins = ['http://localhost:3001']; // Por defecto
    $isProduction = false;
    
    // Cargar variables de entorno si existe .env
    if (file_exists($envFile)) {
        $envVars = @parse_ini_file($envFile, false, INI_SCANNER_RAW);
        if ($envVars === false) {
            $envVars = parseEnvFile($envFile);
        }
        
        // Detectar entorno de producción
        $appUrl = $envVars['APP_URL'] ?? '';
        $isProduction = strpos($appUrl, 'https://') === 0;
        
        // Configurar orígenes permitidos según el entorno
        if ($isProduction) {
            $allowedOrigins = [
                'https://visualmecanica.cl', 
                'https://www.visualmecanica.cl'
            ];
            
            // Si hay orígenes adicionales definidos en .env
            if (!empty($envVars['ALLOWED_ORIGINS'])) {
                $additionalOrigins = explode(',', $envVars['ALLOWED_ORIGINS']);
                $allowedOrigins = array_merge($allowedOrigins, array_map('trim', $additionalOrigins));
            }
        } else {
            // En desarrollo, permitir localhost en varios puertos
            $allowedOrigins = [
                'http://localhost:3000',
                'http://localhost:3001',
                'http://localhost:3002',
                'http://localhost:5173',
                'http://localhost:8080'
            ];
        }
    }
    
    // Obtener el origen de la solicitud
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    
    // Verificar si el origen está permitido
    if ($origin && in_array($origin, $allowedOrigins)) {
        header("Access-Control-Allow-Origin: $origin");
    } else if (!$isProduction && preg_match('/^https?:\/\/localhost(:[0-9]+)?$/', $origin)) {
        // En desarrollo, ser más permisivo con localhost
        header("Access-Control-Allow-Origin: $origin");
    } else {
        // Origen por defecto si ninguno coincide
        header("Access-Control-Allow-Origin: " . $allowedOrigins[0]);
    }
    
    // Configurar resto de encabezados CORS
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Max-Age: 86400"); // 24 horas
    
    // Marcar que los encabezados ya se enviaron
    $headersSent = true;
    
    // Manejar solicitudes preflight OPTIONS
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit(0);
    }
}

/**
 * Función auxiliar para parsear un archivo .env manualmente
 * Útil cuando parse_ini_file falla
 */
function parseEnvFile($filePath) {
    $vars = [];
    if (file_exists($filePath)) {
        $lines = file($filePath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        foreach ($lines as $line) {
            $line = trim($line);
            // Saltar comentarios
            if (empty($line) || strpos($line, '#') === 0) {
                continue;
            }
            // Parsear variable=valor
            if (strpos($line, '=') !== false) {
                list($key, $value) = explode('=', $line, 2);
                $key = trim($key);
                $value = trim($value);
                // Eliminar comillas si existen
                if (preg_match('/^["\'](.*)["\']$/', $value, $matches)) {
                    $value = $matches[1];
                }
                $vars[$key] = $value;
            }
        }
    }
    return $vars;
}
?>
