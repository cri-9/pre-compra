<?php
// CONFIGURAR CORS INMEDIATAMENTE
header("Access-Control-Allow-Origin: http://localhost:3001");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept");
header("Access-Control-Allow-Credentials: true");

// Manejar preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

header('Content-Type: application/json; charset=utf-8');

try {
    // Procesar datos de entrada
    $rawInput = file_get_contents("php://input");
    
    // Limpiar el input de escapes innecesarios
    $cleanInput = stripslashes($rawInput);
    $data = json_decode($cleanInput, true);
    
    // Si el JSON decode falla, intentar con el input original
    if (json_last_error() !== JSON_ERROR_NONE) {
        $data = json_decode($rawInput, true);
    }
    
    // Si aún no hay datos JSON válidos, intentar POST
    if (empty($data) && !empty($_POST)) {
        $data = $_POST;
    }
    
    // Si aún no hay datos, crear array vacío
    if (!is_array($data)) {
        $data = [];
    }
    
    // Validar datos mínimos requeridos
    if (
        empty($data["nombre"]) ||
        empty($data["email"]) ||
        empty($data["telefono"]) ||
        empty($data["servicio"])
    ) {
        echo json_encode([
            "success" => false, 
            "error" => "Datos incompletos",
            "received_data" => $data,
            "raw_input" => $rawInput
        ]);
        exit;
    }
    
    // Simular envío exitoso (sin PHPMailer por ahora)
    echo json_encode([
        "success" => true,
        "message" => "¡Tu solicitud fue recibida correctamente! (Modo prueba)",
        "data_received" => $data
    ]);
    
} catch (\Throwable $t) {
    echo json_encode([
        "success" => false,
        "error" => "Error en el servidor: " . $t->getMessage()
    ]);
}
?>