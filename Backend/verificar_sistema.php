<?php
// Archivo: verificar_sistema.php
// Este script verifica que todos los componentes necesarios para el sistema
// estén configurados y funcionando correctamente.

error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('log_errors', 1);

// Encabezado HTML para una salida más amigable
echo '<!DOCTYPE html>
<html>
<head>
    <title>Verificación del Sistema</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        h1, h2 { color: #333; }
        .success { color: green; }
        .error { color: red; }
        .warning { color: orange; }
        pre { background-color: #f5f5f5; padding: 10px; border-radius: 5px; overflow-x: auto; }
        .section { border: 1px solid #ddd; padding: 15px; margin: 15px 0; border-radius: 5px; }
    </style>
</head>
<body>
    <h1>Verificación del Sistema Pre-Compra</h1>';

function mostrarResultado($titulo, $exitoso, $mensaje = "", $detalles = null) {
    echo '<div class="section">';
    echo "<h2>$titulo</h2>";
    if ($exitoso) {
        echo '<p class="success">✅ ' . ($mensaje ?: 'Correcto') . '</p>';
    } else {
        echo '<p class="error">❌ ' . ($mensaje ?: 'Error') . '</p>';
    }
    if ($detalles) {
        echo '<pre>' . htmlspecialchars(is_array($detalles) || is_object($detalles) ? json_encode($detalles, JSON_PRETTY_PRINT) : $detalles) . '</pre>';
    }
    echo '</div>';
}

// 1. Verificar archivo .env
$envPath = __DIR__ . '/.env';
$envExiste = file_exists($envPath);
$envContenido = $envExiste ? file_get_contents($envPath) : 'Archivo no encontrado';
mostrarResultado('1. Archivo .env', $envExiste, 
    $envExiste ? 'El archivo .env existe' : 'El archivo .env no existe', 
    $envExiste ? 'Primeras líneas: ' . substr($envContenido, 0, 200) . '...' : 'N/A');

// 2. Verificar helpers/env.php
$envHelperPath = __DIR__ . '/helpers/env.php';
$envHelperExiste = file_exists($envHelperPath);
mostrarResultado('2. Archivo helpers/env.php', $envHelperExiste, 
    $envHelperExiste ? 'El archivo helpers/env.php existe' : 'El archivo helpers/env.php no existe');

// 3. Verificar función getenv_backend
$getenvDefinida = function_exists('getenv_backend');
if (!$getenvDefinida && $envHelperExiste) {
    // Intentar incluir el archivo para definir la función
    include_once($envHelperPath);
    $getenvDefinida = function_exists('getenv_backend');
}
mostrarResultado('3. Función getenv_backend', $getenvDefinida, 
    $getenvDefinida ? 'La función getenv_backend está definida' : 'La función getenv_backend no está definida');

// 4. Verificar CORS
$corsHelperPath = __DIR__ . '/helpers/corsHeaders.php';
$corsHelperExiste = file_exists($corsHelperPath);
$corsEnNotificar = false;

// Verificar si notificarTransferencia.php tiene configuración CORS directa
$notificarTransferenciaPath = __DIR__ . '/notificarTransferencia.php';
if (file_exists($notificarTransferenciaPath)) {
    $contenido = file_get_contents($notificarTransferenciaPath);
    $corsEnNotificar = strpos($contenido, 'Access-Control-Allow-Origin') !== false;
}

// Verificar .htaccess para CORS
$htaccessPath = __DIR__ . '/.htaccess';
$htaccessExiste = file_exists($htaccessPath);
$corsEnHtaccess = false;
$corsComentadoEnHtaccess = false;

if ($htaccessExiste) {
    $htaccessContenido = file_get_contents($htaccessPath);
    $corsEnHtaccess = strpos($htaccessContenido, 'Header always set Access-Control-Allow-Origin') !== false;
    $corsComentadoEnHtaccess = strpos($htaccessContenido, '# Header always set Access-Control-Allow-Origin') !== false;
}

$corsEstado = '';
if ($corsEnNotificar && !$corsEnHtaccess) {
    $corsEstado = 'CORS configurado correctamente solo en PHP';
} else if ($corsEnNotificar && $corsEnHtaccess && !$corsComentadoEnHtaccess) {
    $corsEstado = 'ADVERTENCIA: CORS configurado tanto en PHP como en .htaccess (posible duplicación)';
} else if ($corsEnNotificar && $corsComentadoEnHtaccess) {
    $corsEstado = 'CORS configurado en PHP y desactivado en .htaccess';
} else {
    $corsEstado = 'Configuración CORS no encontrada o incompleta';
}

mostrarResultado('4. Configuración CORS', 
    $corsEnNotificar && (!$corsEnHtaccess || $corsComentadoEnHtaccess), 
    $corsEstado, 
    $htaccessExiste ? 'Estado .htaccess: ' . ($corsComentadoEnHtaccess ? 'CORS comentado (correcto)' : ($corsEnHtaccess ? 'CORS activo (posible conflicto)' : 'Sin configuración CORS')) : 'Archivo .htaccess no encontrado');

// Versión mejorada
$corsMejoradoPath = __DIR__ . '/helpers/corsHeaders_mejorado.php';
$corsMejoradoExiste = file_exists($corsMejoradoPath);
if ($corsMejoradoExiste) {
    echo '<p class="success">✅ Versión mejorada corsHeaders_mejorado.php disponible como referencia</p>';
}

// 5. Verificar endpoints
$endpoints = [
    'test_notificar_transferencia_simple.php' => 'Endpoint de prueba simplificado',
    'notificarTransferencia_fix.php' => 'Endpoint de prueba corregido',
    'notificarTransferencia.php' => 'Endpoint principal'
];

echo '<div class="section"><h2>5. Endpoints</h2>';
foreach ($endpoints as $endpoint => $descripcion) {
    $endpointPath = __DIR__ . '/' . $endpoint;
    $endpointExiste = file_exists($endpointPath);
    echo '<div style="margin-bottom: 10px;">';
    if ($endpointExiste) {
        echo '<p class="success">✅ ' . $descripcion . ' (' . $endpoint . ') existe</p>';
    } else {
        echo '<p class="error">❌ ' . $descripcion . ' (' . $endpoint . ') no existe</p>';
    }
    echo '</div>';
}
echo '</div>';

// 6. Verificar conexión a base de datos (si se requiere)
echo '<div class="section"><h2>6. Conexión a Base de Datos</h2>';
if (file_exists(__DIR__ . '/conexionBD.php')) {
    echo '<p>Intentando probar conexión a base de datos...</p>';
    try {
        // Capturar salida para evitar problemas de "headers already sent"
        ob_start();
        include_once(__DIR__ . '/conexionBD.php');
        $output = ob_get_clean();
        
        // Verificar si hay variables definidas por conexionBD.php
        $conexionCorrecta = isset($host) && isset($db) && isset($user);
        if ($conexionCorrecta) {
            echo '<p class="success">✅ Archivo conexionBD.php cargado correctamente</p>';
            echo '<p>Configuración de conexión:</p>';
            echo '<pre>Host: ' . htmlspecialchars($host) . "\n";
            echo 'DB: ' . htmlspecialchars($db) . "\n";
            echo 'User: ' . htmlspecialchars($user) . '</pre>';
        } else {
            echo '<p class="warning">⚠️ Archivo conexionBD.php cargado pero no define todas las variables necesarias</p>';
        }
    } catch (Exception $e) {
        echo '<p class="error">❌ Error al cargar conexionBD.php: ' . htmlspecialchars($e->getMessage()) . '</p>';
    }
} else {
    echo '<p class="error">❌ El archivo conexionBD.php no existe</p>';
}
echo '</div>';

// 7. Resumen
$problemas = [];
if (!$envExiste) $problemas[] = 'Archivo .env no encontrado';
if (!$envHelperExiste) $problemas[] = 'Archivo helpers/env.php no encontrado';
if (!$getenvDefinida) $problemas[] = 'Función getenv_backend no definida';
if (!$corsHelperExiste) $problemas[] = 'Archivo helpers/corsHeaders.php no encontrado';

echo '<div class="section"><h2>7. Resumen</h2>';
if (empty($problemas)) {
    echo '<p class="success">✅ Todos los componentes básicos del sistema están presentes y configurados correctamente.</p>';
    echo '<p>Para probar los endpoints de manera interactiva, utilice la página <a href="test_api.html">test_api.html</a>.</p>';
} else {
    echo '<p class="error">❌ Se encontraron los siguientes problemas:</p>';
    echo '<ul>';
    foreach ($problemas as $problema) {
        echo '<li>' . htmlspecialchars($problema) . '</li>';
    }
    echo '</ul>';
    echo '<p>Corrija estos problemas antes de intentar utilizar el sistema.</p>';
}
echo '</div>';

echo '</body></html>';
?>
