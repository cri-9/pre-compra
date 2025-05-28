<?php
/**
 * Helper: comprobante de pago al cliente (adaptado)
 *
 * @param string $nombreCliente
 * @param string $servicio
 * @param string $fecha
 * @param string $bloque
 * @param string $hora
 * @param float|int $monto
 * @param string $etiquetaHora   // Nuevo argumento: "Hora" o "Hora de inicio"
 * @return string
 */
function generarComprobanteCliente($nombreCliente, $servicio, $fecha, $bloque, $hora, $monto, $etiquetaHora = 'Hora', $montoBase = null, $recargo = 0) {
    return "
    <div style='font-family: Arial, sans-serif; max-width: 650px; margin: auto; border: 1px solid #c6c6c6; border-radius: 6px; overflow: hidden;'>
    <div style='background-color: #c4e2f2; text-align: center; padding: 20px;'>
        <h2 style='margin:0; color:#17548b;'>Comprobante de Pago y Agendamiento</h2>
    </div>
    <div style='padding: 22px;'>
        <p style='font-size: 16px;'>Hola <strong>" . htmlspecialchars($nombreCliente) . "</strong>,</p>
        <p style='font-size: 15px;'>Tu pago para el servicio <strong>" . htmlspecialchars($servicio) . "</strong> fue procesado exitosamente.</p>

        <h3 style='color: #17548b; margin-top: 30px;'>Detalles del Agendamiento</h3>
        <table style='width:100%; border-collapse:collapse; margin-bottom:12px; font-size: 14px;'>
            <tr style='background-color:#e8f5e9;'>
                <td style='padding:10px;'><b>Fecha Agendada:</b></td>
                <td style='padding:10px;'>" . htmlspecialchars($fecha) . "</td>
            </tr>
            <tr>
                <td style='padding:10px;'><b>Bloque:</b></td>
                <td style='padding:10px;'>" . htmlspecialchars($bloque) . "</td>
            </tr>
            <tr style='background-color:#e8f5e9;'>
                <td style='padding:10px;'><b>" . htmlspecialchars($etiquetaHora) . ":</b></td>
                <td style='padding:10px;'>" . htmlspecialchars($hora) . "</td>
            </tr>
            <tr>
                <td style='padding:10px;'><b>Servicio:</b></td>
                <td style='padding:10px;'>" . htmlspecialchars($servicio) . "</td>
            </tr>
            <tr style='background-color:#e8f5e9;'>
                <td style='padding:10px;'><b>Monto base:</b></td>
                <td style='padding:10px;'>$" . number_format($montoBase ?? $monto, 0, ',', '.') . "</td>
            </tr>
            " . ($recargo > 0 ? "
            <tr>
                <td style='padding:10px;'><b>Recargo por comuna:</b></td>
                <td style='padding:10px; color: #D35400; font-weight: bold;'>+$" . number_format($recargo, 0, ',', '.') . "</td>
            </tr>
            " : "") . "
            <tr style='background-color:#e8f5e9;'>
                <td style='padding:10px;'><b>Total Pagado:</b></td>
                <td style='padding:10px;'>$" . number_format($monto, 0, ',', '.') . "</td>
            </tr>
        </table>

        <p style='font-size: 14px;'>¡Nos pondremos en contacto contigo pronto con más detalles!</p>
    </div>
    <div style='background-color: #f1f1f1; text-align: center; padding: 12px;'>
        <p style='font-size: 12px; color: #555;'>Visual Mecánica - Este es un comprobante generado automáticamente</p>
    </div>
</div>
    ";
}

/**
* Helper: comprobante para la empresa vía WebPay (adaptado)
*
* @param array $cliente
* @param string $fecha
* @param string $bloque
* @param string $hora
* @param string $servicio
* @param string|int|float $monto
* @param array $vendedor
* @param string $etiquetaHora   // Nuevo argumento: "Hora" o "Hora de inicio"
* @return string
*/
function generarComprobanteEmpresa($cliente, $fecha, $bloque, $hora, $servicio, $monto, $vendedor = [], $etiquetaHora = 'Hora', $montoBase = null, $recargo = 0) {
    return "
    <div style='font-family: Roboto, Arial, sans-serif; max-width: 700px; margin: auto; border: 1px solid #d1d1d1; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);'>
    <div style='background-color: #1976d2; color: white; text-align: center; padding: 24px;'>
        <h2 style='margin: 0; font-size: 22px;'>Nueva Reserva Recibida vía WebPay</h2>
    </div>
    <div style='padding: 26px 30px; background-color: #f9f9f9;'>
        <h3 style='border-bottom: 1px solid #ccc; padding-bottom: 8px; margin-top: 0;'>Datos del Cliente</h3>
        <table style='width:100%; border-collapse:collapse; margin-bottom:16px;'>
            <tr><td><strong>Nombre:</strong></td><td>" . htmlspecialchars(($cliente['nombre']??'').' '.($cliente['apellido']??'')) . "</td></tr>
            <tr><td><strong>Email:</strong></td><td>" . htmlspecialchars($cliente['email'] ?? '') . "</td></tr>
            <tr><td><strong>Teléfono:</strong></td><td>" . htmlspecialchars($cliente['telefono'] ?? '') . "</td></tr>
            <tr><td><strong>RUT:</strong></td><td>" . htmlspecialchars($cliente['rut'] ?? '') . "</td></tr>
            <tr style='background-color:#eef6f0;'><td><strong>Dirección:</strong></td><td>" . htmlspecialchars($cliente['direccion'] ?? '') . "</td></tr>
            <tr><td><strong>Región:</strong></td><td>" . htmlspecialchars($cliente['region'] ?? '') . "</td></tr>
            <tr style='background-color:#eef6f0;'><td><strong>Comuna:</strong></td><td>" . htmlspecialchars($cliente['comuna'] ?? '') . "</td></tr>
        </table>

        <h3 style='border-bottom: 1px solid #ccc; padding-bottom: 8px;'>Datos de Agendamiento</h3>
        <table style='width:100%; border-collapse:collapse; margin-bottom:16px;'>
            <tr><td><strong>Fecha Agendada:</strong></td><td>" . htmlspecialchars($fecha) . "</td></tr>
            <tr><td><strong>Bloque:</strong></td><td>" . htmlspecialchars($bloque) . "</td></tr>
            <tr><td><strong>$etiquetaHora:</strong></td><td>" . htmlspecialchars($hora) . "</td></tr>
        </table>

        <h3 style='border-bottom: 1px solid #ccc; padding-bottom: 8px;'>Datos del Servicio</h3>
        <table style='width:100%; border-collapse:collapse; margin-bottom:16px;'>
        <tr><td><strong>Servicio:</strong></td><td>" . htmlspecialchars($servicio) . "</td></tr>
        </table>

        " . (
            !empty($vendedor) ? "
            <h3 style='border-bottom: 1px solid #ccc; padding-bottom: 8px;'>Datos del Vendedor</h3>
            <table style='width:100%; border-collapse:collapse; margin-bottom:16px;'>
                <tr><td><strong>Nombre:</strong></td><td>" . htmlspecialchars($vendedor['nombre'] ?? '') . "</td></tr>
                <tr><td><strong>Tipo:</strong></td><td>" . htmlspecialchars($vendedor['tipo'] ?? '') . "</td></tr>
                <tr><td><strong>Teléfono:</strong></td><td>" . htmlspecialchars($vendedor['telefono'] ?? '') . "</td></tr>
                <tr style='background-color:#eef6f0;'><td><strong>Dirección:</strong></td><td>" . htmlspecialchars($vendedor['direccion'] ?? '') . "</td></tr>
                <tr><td><strong>Región:</strong></td><td>" . htmlspecialchars($vendedor['region'] ?? '') . "</td></tr>
                <tr style='background-color:#eef6f0;'><td><strong>Comuna:</strong></td><td>" . htmlspecialchars($vendedor['comuna'] ?? '') . "</td></tr>
            </table>
            " : ""
        ) . "
    </div>
</div>
    ";
}
?>