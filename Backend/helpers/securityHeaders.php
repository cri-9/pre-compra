<?php
// securityHeaders.php
// Configurar cabeceras CORS automáticamente
require_once __DIR__ . '/corsHeaders.php';
setCorsHeaders();

header('Referrer-Policy: no-referrer-when-downgrade');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: SAMEORIGIN');
header('X-XSS-Protection: 1; mode=block');
header("Content-Security-Policy: default-src 'self'; img-src *; style-src 'self' 'unsafe-inline';");
header('Strict-Transport-Security: max-age=31536000; includeSubDomains; preload');
?>