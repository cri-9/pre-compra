<?php
// Archivo: /Backend/helpers/env.php

/**
 * Carga y guarda variables de entorno del archivo .env
 */
function getenv_backend($clave, $default = null) {
    static $env = null;
    if ($env === null) {
        $ruta = __DIR__ . '/../.env';
        $env = [];
        
        if (file_exists($ruta)) {
            error_log("Cargando archivo .env desde: $ruta");
            
            // Intentar con parse_ini_file primero
            $parsed = @parse_ini_file($ruta);
            if ($parsed !== false) {
                $env = $parsed;
                error_log("Variables cargadas con parse_ini_file: " . count($env) . " variables");
            } else {
                // Si parse_ini_file falla, leer línea por línea
                error_log("parse_ini_file falló, leyendo línea por línea");
                $lines = file($ruta, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
                foreach ($lines as $line) {
                    $line = trim($line);
                    if (strpos($line, '#') === 0 || empty($line)) {
                        continue; // Saltar comentarios y líneas vacías
                    }
                    if (strpos($line, '=') !== false) {
                        list($key, $value) = explode('=', $line, 2);
                        $key = trim($key);
                        $value = trim($value);
                        // Remover comillas si existen
                        if ((substr($value, 0, 1) === '"' && substr($value, -1) === '"') ||
                            (substr($value, 0, 1) === "'" && substr($value, -1) === "'")) {
                            $value = substr($value, 1, -1);
                        }
                        $env[$key] = $value;
                    }
                }
                error_log("Variables cargadas manualmente: " . count($env) . " variables");
            }
        } else {
            error_log("Archivo .env no encontrado en: $ruta");
        }
    }
    
    $valor = $env[$clave] ?? $default;
    if ($valor === $default) {
        error_log("Variable $clave no encontrada, usando default: " . ($default ?? 'null'));
    }
    
    return $valor;
}
?>