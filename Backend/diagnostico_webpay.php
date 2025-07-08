<?php
// Archivo de prueba para verificar la configuración
require_once __DIR__ . '/helpers/env.php';

echo "=== DIAGNÓSTICO DE CONFIGURACIÓN WEBPAY ===\n";

// Verificar que el archivo .env existe
$envPath = __DIR__ . '/.env';
echo "Archivo .env existe: " . (file_exists($envPath) ? "SÍ" : "NO") . "\n";

if (file_exists($envPath)) {
    echo "Ruta del archivo .env: " . realpath($envPath) . "\n";
    
    // Verificar las variables de entorno
    $apiKey = getenv_backend('WEBPAY_API_KEY');
    $commerceCode = getenv_backend('WEBPAY_COMMERCE_CODE');
    $environment = getenv_backend('WEBPAY_ENVIRONMENT', 'integration');
    $baseUrl = getenv_backend('APP_URL', 'http://localhost/pre-compra/Backend');
    
    echo "WEBPAY_API_KEY: " . ($apiKey ? "CONFIGURADO" : "NO CONFIGURADO") . "\n";
    echo "WEBPAY_COMMERCE_CODE: " . ($commerceCode ? $commerceCode : "NO CONFIGURADO") . "\n";
    echo "WEBPAY_ENVIRONMENT: " . $environment . "\n";
    echo "APP_URL: " . $baseUrl . "\n";
    
    // Verificar autoload de Composer
    echo "\n=== VERIFICACIÓN DE DEPENDENCIAS ===\n";
    $autoloadPath = __DIR__ . '/vendor/autoload.php';
    echo "Autoload existe: " . (file_exists($autoloadPath) ? "SÍ" : "NO") . "\n";
    
    if (file_exists($autoloadPath)) {
        require_once $autoloadPath;
        echo "Autoload cargado correctamente\n";
        
        // Verificar clase Transbank
        if (class_exists('Transbank\Webpay\WebpayPlus\Transaction')) {
            echo "Clase Transaction de Transbank: DISPONIBLE\n";
        } else {
            echo "Clase Transaction de Transbank: NO DISPONIBLE\n";
        }
        
        if (class_exists('Transbank\Webpay\Options')) {
            echo "Clase Options de Transbank: DISPONIBLE\n";
        } else {
            echo "Clase Options de Transbank: NO DISPONIBLE\n";
        }
    }
}

echo "\n=== CONFIGURACIÓN PHP ===\n";
echo "Versión PHP: " . phpversion() . "\n";
echo "Display errors: " . ini_get('display_errors') . "\n";
echo "Error reporting: " . error_reporting() . "\n";

// Verificar extensiones necesarias
$extensiones = ['json', 'curl', 'openssl'];
foreach ($extensiones as $ext) {
    echo "Extensión $ext: " . (extension_loaded($ext) ? "CARGADA" : "NO CARGADA") . "\n";
}
?>
