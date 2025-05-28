<?php
// Simula recibir datos del frontend (deberías recibir esto vía $_POST o similar)
$inputJson = '{
  "pago": { "metodo": "webpay", "monto": 45000, "nombreServicio": "Servicio Semi Full", "codigoDescuento": "" }
}';
$data = json_decode($inputJson, true);

// Simula el amount que se va a enviar a Webpay (en un caso real esto podría venir de otra variable)
$amount = 1000; // ¡Reemplaza esto por la fuente real en tu código!

// Valida que monto de pago y amount coincidan
if (!isset($data['pago']['monto'])) {
    die("Error: No se recibió 'monto' en los datos de pago.");
}

if ($amount != $data['pago']['monto']) {
    error_log("[ERROR] Diferencia entre amount ($amount) y pago['monto'] ({$data['pago']['monto']})");
    // Aquí puedes mostrar un mensaje, registrar un error, evitar procesar, etc.
    echo "Error: El monto enviado a Webpay y el monto del formulario no coinciden.<br>";
    echo "Monto formulario: {$data['pago']['monto']}<br>";
    echo "Amount para Webpay: $amount<br>";
    // Opcionalmente, detener la ejecución
    // die();
} else {
    // Todo OK, continuar lógica con el pago
    echo "Los montos coinciden. ¡Puedes continuar!";
}

?>