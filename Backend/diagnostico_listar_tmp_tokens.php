<?php
// Script de diagnóstico para ver archivos temporales 'tmp_datosform_*.json'

header('Content-Type: text/plain');
$dir = __DIR__;
$files = glob($dir . '/tmp_datosform_*.json');

if (empty($files)) {
    echo "No existen archivos temporales de datos de formulario ('tmp_datosform_*.json').\n";
    exit;
}

echo "Archivos temporales encontrados:\n";
foreach ($files as $file) {
    $basename = basename($file);
    echo "- $basename (modificado " . date("Y-m-d H:i:s", filemtime($file)) . ")\n";
}
?>