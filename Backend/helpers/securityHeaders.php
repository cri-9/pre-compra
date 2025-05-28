<?php
// securityHeaders.php
header('Access-Control-Allow-Origin: https://visualmecanica.cl'); // Cambia al dominio de producción
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Referrer-Policy: no-referrer-when-downgrade');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: SAMEORIGIN');
header('X-XSS-Protection: 1; mode=block');
header("Content-Security-Policy: default-src 'self'; img-src *; style-src 'self' 'unsafe-inline';");
header('Strict-Transport-Security: max-age=31536000; includeSubDomains; preload');
?>