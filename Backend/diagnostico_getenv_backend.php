<?php
// Archivo de prueba para diagnosticar getenv_backend
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<!DOCTYPE html>
<html>
<head>
    <title>Diagnóstico getenv_backend</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        h1 { color: #333; }
        .success { color: green; }
        .error { color: red; }
        pre { background-color: #f5f5f5; padding: 10px; border-radius: 5px; }
        .box { border: 1px solid #ddd; padding: 15px; margin: 15px 0; border-radius: 5px; }
    </style>
</head>
<body>
    <h1>Diagnóstico de getenv_backend</h1>";

// Verificar si existe el archivo env.php
echo "<div class='box'>";
echo "<h2>Archivo env.php</h2>";
if (file_exists(__DIR__ . '/helpers/env.php')) {
    echo "<p class='success'>✅ El archivo helpers/env.php existe</p>";
    // Incluir el archivo
    include_once __DIR__ . '/helpers/env.php';
} else {
    echo "<p class='error'>❌ El archivo helpers/env.php no existe</p>";
}
echo "</div>";

// Verificar si la función getenv_backend está definida
echo "<div class='box'>";
echo "<h2>Función getenv_backend</h2>";
if (function_exists('getenv_backend')) {
    echo "<p class='success'>✅ La función getenv_backend está definida</p>";
    
    // Intentar usar la función
    try {
        $valor = getenv_backend('DEV_MODE', 'valor_predeterminado');
        echo "<p>Valor de DEV_MODE: <strong>$valor</strong></p>";
    } catch (Throwable $e) {
        echo "<p class='error'>❌ Error al ejecutar getenv_backend: {$e->getMessage()}</p>";
    }
} else {
    echo "<p class='error'>❌ Error: La función getenv_backend no está definida</p>";
    
    // Definir una versión básica para esta prueba
    echo "<p>Definiendo una versión básica para esta prueba...</p>";
    function getenv_backend($clave, $default = null) {
        return $default;
    }
}
echo "</div>";

// Verificar si existe el archivo .env
echo "<div class='box'>";
echo "<h2>Archivo .env</h2>";
$envPath = __DIR__ . '/.env';
if (file_exists($envPath)) {
    echo "<p class='success'>✅ El archivo .env existe</p>";
    
    // Intentar leer algunas líneas del archivo
    echo "<p>Primeras líneas del archivo .env:</p>";
    $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    echo "<pre>";
    $count = 0;
    foreach ($lines as $line) {
        // Ocultar valores sensibles
        if (preg_match('/password|secret|key/i', $line)) {
            $parts = explode('=', $line, 2);
            if (count($parts) > 1) {
                echo htmlspecialchars($parts[0] . "=******") . "\n";
            } else {
                echo "[valor sensible oculto]\n";
            }
        } else {
            echo htmlspecialchars($line) . "\n";
        }
        
        $count++;
        if ($count >= 5) break; // Mostrar solo las primeras 5 líneas
    }
    echo "</pre>";
} else {
    echo "<p class='error'>❌ El archivo .env no existe</p>";
}
echo "</div>";

// Verificar permisos
echo "<div class='box'>";
echo "<h2>Permisos de archivos</h2>";
$files = [
    __DIR__ . '/helpers',
    __DIR__ . '/helpers/env.php',
    __DIR__ . '/.env'
];

foreach ($files as $file) {
    if (file_exists($file) || is_dir($file)) {
        $perms = fileperms($file);
        $permsOctal = substr(sprintf('%o', $perms), -4);
        $isReadable = is_readable($file) ? '✅ Legible' : '❌ No legible';
        $isWritable = is_writable($file) ? '✅ Escribible' : '❌ No escribible';
        
        echo "<p><strong>" . basename($file) . "</strong>: Permisos $permsOctal | $isReadable | $isWritable</p>";
    } else {
        echo "<p class='error'>❌ {$file} no existe</p>";
    }
}
echo "</div>";

// Verificar inclusión de helpers/corsHeaders.php
echo "<div class='box'>";
echo "<h2>Archivo corsHeaders.php</h2>";
if (file_exists(__DIR__ . '/helpers/corsHeaders.php')) {
    echo "<p class='success'>✅ El archivo helpers/corsHeaders.php existe</p>";
    
    // Verificar sintaxis de corsHeaders.php
    $output = [];
    $returnVar = 0;
    exec("php -l " . __DIR__ . "/helpers/corsHeaders.php", $output, $returnVar);
    
    if ($returnVar === 0) {
        echo "<p class='success'>✅ El archivo corsHeaders.php no tiene errores de sintaxis</p>";
    } else {
        echo "<p class='error'>❌ El archivo corsHeaders.php tiene errores de sintaxis:</p>";
        echo "<pre>" . implode("\n", $output) . "</pre>";
    }
} else {
    echo "<p class='error'>❌ El archivo helpers/corsHeaders.php no existe</p>";
}
echo "</div>";

echo "</body></html>";
?>
