<?php
session_start();
require 'vendor/autoload.php';

use Transbank\Webpay\Webpay;
use Transbank\Webpay\Configuration;

// Configura WebPay
$config = new Configuration();
$config->setCommerceCode('TU_CODIGO_COMERCIO');
$config->setPrivateKey('TU_LLAVE_PRIVADA');
$config->setPublicCert('TU_CERTIFICADO_PUBLICO');
$config->setWebpayCert('CERTIFICADO_WEBPAY');

$webpay = new Webpay($config);
$token = $_POST['token_ws'] ?? null;

if ($token) {
    $result = $webpay->getNormalTransaction()->getTransactionResult($token);
    $responseCode = $result->detailOutput->responseCode;

    if ($responseCode === 0) { // Éxito
        // Recuperar datos del agendamiento (simulación)
        // En producción, los datos deben estar guardados en sesión o BD
        $datos = $_SESSION['datos_agendamiento'] ?? null;

        if ($datos) {
            // Llama a agregarEvento.php internamente
            $ch = curl_init('http://localhost/agregarEvento.php');
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($datos));
            curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
            $result = curl_exec($ch);
            curl_close($ch);

            // Guardar en base de datos
            $ch2 = curl_init('http://localhost/guardarEnBD.php');
            curl_setopt($ch2, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch2, CURLOPT_POSTFIELDS, json_encode($datos));
            curl_setopt($ch2, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
            $resultBD = curl_exec($ch2);
            curl_close($ch2);

            $_SESSION['mensaje'] = "¡Pago exitoso y cita agendada!";
        } else {
            $_SESSION['mensaje'] = "Pago exitoso, pero no se encontraron los datos del agendamiento.";
        }
    } else {
        $_SESSION['mensaje'] = "El pago fue rechazado por WebPay.";
    }
} else {
    $_SESSION['mensaje'] = "Error al procesar el pago.";
}

header("Location: redireccion.php");
exit;
?>
