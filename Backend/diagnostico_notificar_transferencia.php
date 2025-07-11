<?php
// Este script verifica que todas las dependencias necesarias para notificarTransferencia.php estén disponibles

// Mostrar todos los errores para depuración
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Content-Type: text/html; charset=UTF-8");

echo "<h1>Diagnóstico de Dependencias para notificarTransferencia.php</h1>";

// Función para mostrar estado
function mostrarEstado($nombre, $estado, $detalles = "") {
    $colorEstado = $estado ? "green" : "red";
    $textoEstado = $estado ? "✅ OK" : "❌ Error";
    
    echo "<div style='margin-bottom: 10px;'>";
    echo "<strong>{$nombre}:</strong> <span style='color: {$colorEstado};'>{$textoEstado}</span>";
    
    if (!empty($detalles)) {
        echo "<div style='margin-left: 20px; font-size: 0.9em;'>{$detalles}</div>";
    }
    
    echo "</div>";
}

// 1. Verificar extensiones PHP requeridas
echo "<h2>Extensiones PHP</h2>";
$extensiones = ["json", "curl", "openssl", "mbstring", "fileinfo"];
foreach ($extensiones as $ext) {
    $instalada = extension_loaded($ext);
    mostrarEstado("Extensión {$ext}", $instalada, $instalada ? "Instalada" : "No instalada - Esta extensión es necesaria");
}

// 2. Verificar archivo de helpers
echo "<h2>Archivos de helpers</h2>";
$helpers = [
    "helpers/corsHeaders.php" => "Manejo de CORS",
    "helpers/generarHtmlCorreoTransferencia.php" => "Generación de HTML para correos",
    "helpers/generarTextoCorreoTransferencia.php" => "Generación de texto para correos",
    "enviarCorreo.php" => "Envío de correos electrónicos"
];

foreach ($helpers as $archivo => $descripcion) {
    $existe = file_exists(__DIR__ . '/' . $archivo);
    mostrarEstado("{$archivo}", $existe, $existe 
        ? "Archivo encontrado: {$descripcion}" 
        : "Archivo no encontrado - Este helper es necesario para: {$descripcion}");
}

// 3. Verificar dependencias de Composer
echo "<h2>Dependencias de Composer</h2>";
$composerExiste = file_exists(__DIR__ . '/vendor/autoload.php');
mostrarEstado("vendor/autoload.php", $composerExiste, $composerExiste 
    ? "El autoloader de Composer está disponible" 
    : "El autoloader de Composer no está disponible. Ejecuta 'composer install' en este directorio");

// Solo verificar más detalles si autoload existe
if ($composerExiste) {
    require_once __DIR__ . '/vendor/autoload.php';
    
    // Verificar PHPMailer
    $phpmailerExiste = class_exists('PHPMailer\PHPMailer\PHPMailer');
    mostrarEstado("PHPMailer", $phpmailerExiste, $phpmailerExiste 
        ? "La clase PHPMailer está disponible" 
        : "La clase PHPMailer no está disponible. Asegúrate de que phpmailer/phpmailer esté en composer.json");
    
    // Verificar Google API Client
    $googleClientExiste = class_exists('Google\Client');
    mostrarEstado("Google API Client", $googleClientExiste, $googleClientExiste 
        ? "La clase Google Client está disponible" 
        : "La clase Google Client no está disponible. Asegúrate de que google/apiclient esté en composer.json");
}

// 4. Verificar archivos de configuración de Google Calendar
echo "<h2>Configuración de Google Calendar</h2>";
$credencialesExiste = file_exists(__DIR__ . '/credenciales.json');
mostrarEstado("credenciales.json", $credencialesExiste, $credencialesExiste 
    ? "Archivo de credenciales encontrado" 
    : "Archivo de credenciales no encontrado - Necesario para autenticación con Google");

$tokenExiste = file_exists(__DIR__ . '/token.json');
mostrarEstado("token.json", $tokenExiste, $tokenExiste 
    ? "Archivo de token encontrado" 
    : "Archivo de token no encontrado - Necesario para autorización con Google");

// 5. Verificar permisos de escritura para logs
echo "<h2>Permisos de escritura</h2>";
$logDir = ini_get('error_log');
$logDir = $logDir ? dirname($logDir) : '/var/log/apache2';
$logWritable = is_writable($logDir);
mostrarEstado("Directorio de logs", $logWritable, $logWritable 
    ? "Se puede escribir en {$logDir}" 
    : "No se puede escribir en {$logDir} - Los logs de errores no se podrán guardar");

// 6. Probar la función getenv_backend
echo "<h2>Función getenv_backend</h2>";
$getenvDefinida = function_exists('getenv_backend');

if (!$getenvDefinida) {
    function getenv_backend($nombre, $default = null) {
        $valor = getenv($nombre);
        if ($valor === false) {
            return $default;
        }
        return $valor;
    }
    
    mostrarEstado("getenv_backend()", false, "La función no estaba definida y se definió una versión básica para esta prueba");
} else {
    mostrarEstado("getenv_backend()", true, "La función ya está definida");
}

// Verificar si podemos obtener variables de entorno
$devMode = getenv_backend('DEV_MODE', 'no definido');
mostrarEstado("DEV_MODE", true, "Valor: {$devMode}");

// Resumen
echo "<h2>Resumen</h2>";
echo "<p>Si hay elementos marcados en rojo, deberás corregirlos antes de que notificarTransferencia.php funcione correctamente.</p>";
echo "<p>Recuerda que además de estas dependencias, es posible que existan problemas en el código o en la comunicación con servicios externos.</p>";

// Enlaces útiles
echo "<h2>Acciones</h2>";
echo "<ul>";
echo "<li><a href='test_notificar_transferencia.php' target='_blank'>Ejecutar prueba de notificarTransferencia.php</a></li>";
echo "<li><a href='http://localhost:8080/notificarTransferencia.php' target='_blank'>Acceder directamente al endpoint</a></li>";
echo "</ul>";
?>
