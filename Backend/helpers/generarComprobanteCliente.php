<?php
require_once __DIR__ . '/FormateadorHorario.php';

/**
 * Genera el HTML para el comprobante que se muestra al cliente después de agendar.
 *
 * @param string $nombreCliente
 * @param string $servicio
 * @param string $fecha
 * @param string $hora
 * @param string|null $telefonoContacto
 * @param string|null $email
 * @param string|null $direccion
 * @param string|null $region
 * @param string|null $comuna
 * @param float|int|null $montoBase
 * @param float|int $recargo
 * @param float|int|null $montoTotal
 * @return string
 */
function generarComprobanteCliente(
    $nombreCliente,
    $servicio,
    $fecha,
    $hora,
    $telefonoContacto = null,
    $email = null,
    $direccion = null,
    $region = null,
    $comuna = null,
    $montoBase = null,
    $recargo = 0,
    $montoTotal = null
) {
    // FORMATEO DE HORARIO
    $horaFormateada = $hora ? formateaRangoHorario($hora) : '';

    $montoFormateado   = number_format($montoBase ?? 0, 0, ',', '.');
    $recargoFormateado = number_format($recargo, 0, ',', '.');
    $totalFormateado   = number_format($montoTotal ?? (($montoBase ?? 0) + $recargo), 0, ',', '.');

    return "
    <div style='font-family: \"Segoe UI\", sans-serif; max-width: 600px; margin: 20px auto; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden; border: 1px solid #ddd;'>
        <div style='background-color: #1976d2; color: white; text-align: center; padding: 25px;'>
            <h2 style='margin: 0;'>Comprobante de Agendamiento</h2>
        </div>
        <div style='padding: 25px; background-color: #fff; font-size: 15px;'>
            <p>Estimado/a <strong>$nombreCliente</strong>,</p>
            <p>Hemos registrado tu solicitud de agendamiento vía <strong>Transferencia</strong> para el servicio:</p>

            <p><strong>Servicio:</strong> $servicio</p>

            <h3 style='margin-top: 20px; color: #555;'>Resumen de Pago</h3>
            <table style='width: 100%; border-collapse: collapse; font-size: 14px;'>
                <tr>
                    <td style='padding: 8px; background-color: #f9f9f9; border: 1px solid #ddd;'>Monto base:</td>
                    <td style='padding: 8px; background-color: #f9f9f9; border: 1px solid #ddd;'>\$${montoFormateado} CLP</td>
                </tr>
                <tr>
                    <td style='padding: 8px; background-color: #fff3e0; border: 1px solid #ddd;'>Recargo por comuna:</td>
                    <td style='padding: 8px; background-color: #fff3e0; border: 1px solid #ddd; color: #D35400; font-weight: bold;'>+ \$${recargoFormateado} CLP</td>
                </tr>
                <tr>
                    <td style='padding: 8px; background-color: #e0f7fa; border: 1px solid #ddd;'><strong>Total a pagar:</strong></td>
                    <td style='padding: 8px; background-color: #e0f7fa; border: 1px solid #ddd; font-weight: bold;'>\$${totalFormateado} CLP</td>
                </tr>
            </table>
            <h3 style='margin-top: 20px; color: #555;'>Datos de Contacto</h3>
            <table style='width: 100%; border-collapse: collapse; font-size: 14px;'>
                <tr>
                    <td style='padding:8px'><strong>Fecha:</strong></td>
                    <td style='padding:8px'>$fecha</td>
                </tr>
                <tr>
                    <td style='padding:8px'><strong>Hora:</strong></td>
                    <td style='padding:8px'>$horaFormateada</td>
                </tr>
                ".($telefonoContacto ? "<tr><td style='padding:8px'><strong>Teléfono de contacto:</strong></td><td style='padding:8px'>$telefonoContacto</td></tr>" : "")."
                ".($email ? "<tr><td style='padding:8px'><strong>Email:</strong></td><td style='padding:8px'>$email</td></tr>" : "")."
                ".($direccion ? "<tr><td style='padding:8px'><strong>Dirección:</strong></td><td style='padding:8px'>$direccion</td></tr>" : "")."
                ".($region ? "<tr><td style='padding:8px'><strong>Región:</strong></td><td style='padding:8px'>$region</td></tr>" : "")."
                ".($comuna ? "<tr><td style='padding:8px'><strong>Comuna:</strong></td><td style='padding:8px'>$comuna</td></tr>" : "")."
            </table>
            <p style='margin-top: 25px; color: #444;'>Por favor, guarda este comprobante como referencia para tu visita. Te contactaremos si hay algún cambio.</p>
        </div>
    </div>
    ";
}
?>
