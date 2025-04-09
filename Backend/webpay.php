<?php
session_start(); // Inicia la sesión para guardar los datos del agendamiento

// Cargar las dependencias de Composer (si no lo has hecho antes)
require 'vendor/autoload.php'; 

use Transbank\Webpay\Webpay;
use Transbank\Webpay\Configuration;

// Configuración de Webpay
$config = new Configuration();
$config->setCommerceCode('TU_CODIGO_COMERCIO'); // Cambia esto por tu código de comercio
$config->setPrivateKey('TU_LLAVE_PRIVADA'); // Cambia esto por tu llave privada
$config->setPublicCert('TU_CERTIFICADO_PUBLICO'); // Cambia esto por tu certificado público
$config->setWebpayCert('CERTIFICADO_WEBPAY'); // Cambia esto por el certificado WebPay de tu comercio

// Inicializa Webpay con la configuración
$webpay = new Webpay($config);

// Obtener los datos del frontend (React) a través de una solicitud POST
$data = json_decode(file_get_contents("php://input"), true);

// Verificar que los datos estén presentes
if (isset($data['datos'])) {
    // Guardamos los datos de agendamiento en la sesión para usarlos después
    $_SESSION['datos_agendamiento'] = $data['datos'];
} else {
    echo json_encode(['success' => false, 'error' => 'Datos de agendamiento no recibidos']);
    exit;
}

// Monto de la transacción (puedes cambiarlo según la lógica de tu aplicación)
$amount = 35000; // Ejemplo, puedes obtenerlo de los datos enviados
$buyOrder = uniqid("ORDER_"); // Crea una orden única
$sessionId = session_id(); // Usamos el ID de la sesión como identificador
$returnUrl = "http://localhost/webpayRespuesta.php"; // URL donde WebPay redirigirá después de procesar la transacción
$finalUrl = "http://localhost/paginaPrincipal.php"; // URL donde redirigirás al usuario después de que se complete la transacción

// Inicia la transacción de pago
$transaction = $webpay->getNormalTransaction()->initTransaction($amount, $buyOrder, $sessionId, $returnUrl, $finalUrl);

// Verifica si la transacción se creó exitosamente
if ($transaction) {
    // Responde con la URL de pago y el token necesario para completar la transacción
    echo json_encode([
        'success' => true,
        'url' => $transaction->getUrl(),
        'token' => $transaction->getToken()
    ]);
} else {
    // En caso de error, devuelve un mensaje
    echo json_encode(['success' => false, 'error' => 'No se pudo crear la transacción.']);
}
?>
