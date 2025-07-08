<?php
// Script para actualizar CORS en todos los archivos PHP del backend

$files = [
    'webpayRespuesta.php',
    'agendarTransferencia.php',
    'enviarAgendamiento.php',
    'guardarAgendamientoCompleto.php',
    'webpay_ejemplo_token.php',
    'redireccion.php'
];

foreach ($files as $file) {
    if (file_exists($file)) {
        $content = file_get_contents($file);
        
        // Buscar la línea de CORS específica y reemplazarla
        $patterns = [
            '/header\s*\(\s*["\']Access-Control-Allow-Origin:\s*https:\/\/visualmecanica\.cl["\']\s*\);/',
            '/header\s*\(\s*["\']Access-Control-Allow-Methods:\s*[^"\']*["\']\s*\);/',
            '/header\s*\(\s*["\']Access-Control-Allow-Headers:\s*[^"\']*["\']\s*\);/'
        ];
        
        $replacement = "// Configurar cabeceras CORS automáticamente\nrequire_once 'helpers/corsHeaders.php';\nsetCorsHeaders();";
        
        // Solo reemplazar si encontramos el patrón de CORS
        if (preg_match($patterns[0], $content)) {
            $content = preg_replace($patterns, '', $content);
            
            // Buscar donde insertar el nuevo código
            if (strpos($content, '<?php') !== false) {
                $content = str_replace('<?php', "<?php\n// Configurar cabeceras CORS automáticamente\nrequire_once 'helpers/corsHeaders.php';\nsetCorsHeaders();\n", $content);
            }
            
            file_put_contents($file, $content);
            echo "Actualizado: $file\n";
        }
    }
}

echo "Actualización de CORS completada.\n";
?>
