<?php
// Recibir el JSON del frontend (ejemplo)
$json = file_get_contents("php://input");
$data = json_decode($json, true);

// VALIDACIÓN: Asegurarse que existe el monto 
if (!isset($data['pago']['monto'])) {
    die("Error: No se recibió el monto de pago");
}

// ASIGNA CORRECTAMENTE amount
$amount = $data['pago']['monto'];

// -- Desde este punto SIEMPRE usar $amount --
// Ejemplo de uso:
echo "El amount para Webpay es: $amount<br>";

// Si usas Webpay:
$params = [
    'buyOrder' => uniqid(),
    'sessionId' => session_id(),
    'amount' => $amount, // <-- Siempre el que llegó del frontend
    // ...otros parámetros...
];

// Aquí puedes debuggear:
file_put_contents('debug_amount.log', print_r($params, true), FILE_APPEND);
?>