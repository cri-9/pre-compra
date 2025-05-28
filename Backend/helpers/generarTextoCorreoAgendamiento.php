<?php
require_once __DIR__ . '/FormateadorHorario.php';
/**
 * Genera el texto plano para el correo de confirmación de agendamiento.
 *
 * @param string $nombreCliente
 * @param string $servicio
 * @param string $fecha
 * @param string $hora
 * @return string
 */
function generarTextoCorreoAgendamiento($nombreCliente, $servicio, $fecha, $hora) {
    return "Hola $nombreCliente, tu agendamiento para $servicio fue recibido para el $fecha a las $hora. Pronto nos pondremos en contacto contigo. Visual Mecánica.";
}