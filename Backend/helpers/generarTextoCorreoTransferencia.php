<?php
require_once __DIR__ . '/FormateadorHorario.php';

function mostrarValorOCampoNoInformado($valor) {
    return !empty($valor) ? $valor : "No informado";
}

/**
 * Genera el texto del correo de transferencia con los datos de agendamiento.
 * @param array $agendamiento Debe incluir 'nombre', 'email', 'telefono', 'direccion', 'region', 'comuna', 'servicio', 'metodoPago', 'monto', 'montoBase', 'recargo', 'fecha_agendada', 'bloque', 'horario'
 * @return string
 */
function generarTextoCorreoTransferencia($agendamiento) {
    $nombre = isset($agendamiento['nombre']) ? $agendamiento['nombre'] : '';
    $email = isset($agendamiento['email']) ? $agendamiento['email'] : '';
    $telefono = isset($agendamiento['telefono']) ? $agendamiento['telefono'] : '';
    $direccion = isset($agendamiento['direccion']) ? $agendamiento['direccion'] : '';
    $region = isset($agendamiento['region']) ? $agendamiento['region'] : '';
    $comuna = isset($agendamiento['comuna']) ? $agendamiento['comuna'] : '';
    $servicio = isset($agendamiento['servicio']) ? $agendamiento['servicio'] : '';
    $metodoPago = isset($agendamiento['metodoPago']) ? $agendamiento['metodoPago'] : '';
    $monto = isset($agendamiento['monto']) ? $agendamiento['monto'] : 0;
    $montoBase = isset($agendamiento['montoBase']) ? $agendamiento['montoBase'] : null;
    $recargo = isset($agendamiento['recargo']) ? $agendamiento['recargo'] : 0;
    $fecha = isset($agendamiento['fecha_agendada']) ? $agendamiento['fecha_agendada'] : '';
    $bloque = isset($agendamiento['bloque']) ? $agendamiento['bloque'] : '';
    $hora = isset($agendamiento['horario']) ? $agendamiento['horario'] : '';

    // Formatear horario usando el helper
    $horarioTexto = $hora ? formateaRangoHorario($hora) : ($bloque === 'AM' ? '10:00 - 13:00' : ($bloque === 'PM' ? '16:30 - 19:30' : ''));

    $texto = "Estimado $nombre,\n\n"
        . "Hemos registrado tu solicitud de agendamiento $metodoPago por el servicio $servicio.\n";

    // Datos de agendamiento
    $texto .= "\n<b>Datos de Agendamiento</b>\n";
    $texto .= "<b>Fecha Agendada:</b> $fecha\n";
    $texto .= "<b>Bloque:</b> $bloque\n";
    $texto .= "<b>Hora:</b> $horarioTexto\n";

    if ($montoBase !== null) {
        $texto .= "Monto base: $" . number_format($montoBase, 0, ',', '.') . " CLP\n";
        if ($recargo > 0) {
            $texto .= "Recargo por comuna: +$" . number_format($recargo, 0, ',', '.') . " CLP\n";
        }
        $texto .= "Total a pagar: $" . number_format($monto, 0, ',', '.') . " CLP\n";
    } else {
        $texto .= "Monto: $" . number_format($monto, 0, ',', '.') . " CLP\n";
    }
    $texto .= "Teléfono de contacto: " . mostrarValorOCampoNoInformado($telefono) . "\n"
        . "Dirección: " . mostrarValorOCampoNoInformado($direccion) . "\n"
        . "Región: " . mostrarValorOCampoNoInformado($region) . "\n"
        . "Comuna: " . mostrarValorOCampoNoInformado($comuna) . "\n"
        . "Correo: " . mostrarValorOCampoNoInformado($email) . "\n\n"
        . "Nos pondremos en contacto contigo para finalizar la transacción.\n"
        . "Gracias por confiar en Visual Mecánica.";
    return $texto;
}
?>
