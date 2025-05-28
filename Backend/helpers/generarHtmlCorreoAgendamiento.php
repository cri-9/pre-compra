<?php
require_once __DIR__ . '/FormateadorHorario.php';
/**
 * Genera el HTML para el correo de confirmación de agendamiento con desglose de monto y recargo.
 *
 * @param string $nombreCliente
 * @param string $servicio
 * @param string $fecha  
 * @param string $hora
 * @param string $correoContacto
 * @param float|int|null $montoBase
 * @param float|int $recargo
 * @param float|int|null $montoTotal
 * @return string
 */
function generarHtmlCorreoAgendamiento(
    $nombreCliente, 
    $servicio, 
    $fecha, 
    $hora, 
    $correoContacto = 'contacto@visualmecanica.cl', 
    $montoBase = null, 
    $recargo = 0, 
    $montoTotal = null
) {
    $bloqueMonto = '';

    if ($montoBase !== null) {
        $montoFormateado   = number_format($montoBase, 0, ',', '.');
        $recargoFormateado = number_format($recargo, 0, ',', '.');
        $totalFormateado   = number_format($montoTotal ?? ($montoBase + $recargo), 0, ',', '.');

        $bloqueMonto = "
            <table style='width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 14px;'>
                <tr style='background-color: #e0f7fa;'>
                    <td style='padding: 10px;'><strong>Monto base:</strong></td>
                    <td style='padding: 10px;'>\$${montoFormateado} CLP</td>
                </tr>" .
                ($recargo > 0 ? "
                <tr style='background-color: #fff3e0;'>
                    <td style='padding: 10px;'><strong>Recargo por comuna:</strong></td>
                    <td style='padding: 10px; color: #D35400; font-weight: bold;'>+ \$${recargoFormateado} CLP</td>
                </tr>" : "") . "
                <tr style='background-color: #e6e6e6;'>
                    <td style='padding: 10px;'><strong>Total a pagar:</strong></td>
                    <td style='padding: 10px; font-weight: bold;'>\$${totalFormateado} CLP</td>
                </tr>
            </table>
        ";
    }

    return "
    <div style='font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #dddddd; border-radius: 6px; overflow: hidden;'>
        <div style='background-color: #f5f5f5; text-align: center; padding: 20px;'>
            <img src='https://www.visualmecanica.cl/assets/logo-small.png' alt='Visual Mecánica' style='width: 50px;'/>
            <h2 style='display: inline-block; color: #1976d2; margin-left: 10px;'>¡Gracias por tu reserva!</h2>
        </div>
        <div style='padding: 20px; font-size: 15px;'>
            <p>Hola <strong>$nombreCliente</strong>,</p>
            <p>Tu agendamiento para el servicio <strong>$servicio</strong> fue recibido exitosamente.</p>

            <table style='width: 100%; border-collapse: collapse; margin-top: 15px;'>
                <tr style='background-color: #e6e6e6;'>
                    <td style='padding: 10px;'><strong>Fecha:</strong></td>
                    <td style='padding: 10px;'>$fecha</td>
                </tr>
                <tr style='background-color: #f9f9f9;'>
                    <td style='padding: 10px;'><strong>Hora:</strong></td>
                    <td style='padding: 10px;'>$hora</td>
                </tr>
            </table>

            $bloqueMonto

            <p style='margin-top: 25px;'>Nos pondremos en contacto contigo pronto. Si tienes preguntas, escríbenos a <a href='mailto:$correoContacto'>$correoContacto</a>.</p>
        </div>
        <div style='background-color: #f5f5f5; text-align: center; padding: 12px; font-size: 12px; color: #888;'>
            Visual Mecánica - $correoContacto
        </div>
    </div>
    ";
}
?>
