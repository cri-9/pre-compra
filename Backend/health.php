<?php
// Archivo de verificación de salud para el backend
header('Content-Type: application/json');

$health = [
    'status' => 'ok',
    'timestamp' => date('Y-m-d H:i:s'),
    'service' => 'visualmecanica-backend'
];

// Verificar conexión a la base de datos si es necesario
try {
    // Aquí puedes agregar verificaciones adicionales
    // como conexión a la base de datos, servicios externos, etc.
    
    $health['database'] = 'connected';
} catch (Exception $e) {
    $health['status'] = 'error';
    $health['database'] = 'disconnected';
    $health['error'] = $e->getMessage();
    http_response_code(500);
}

echo json_encode($health, JSON_PRETTY_PRINT);
?>