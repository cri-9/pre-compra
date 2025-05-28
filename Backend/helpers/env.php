<?php
// Archivo: /Backend/helpers/env.php

/**
 * Carga y guarda variables de entorno del archivo .env
 */
function getenv_backend($clave, $default = null) {
    static $env = null;
    if ($env === null) {
        $ruta = __DIR__ . '/../.env';
        if (file_exists($ruta)) {
            $env = parse_ini_file($ruta);
        } else {
            $env = [];
        }
    }
    return $env[$clave] ?? $default;
}
?>