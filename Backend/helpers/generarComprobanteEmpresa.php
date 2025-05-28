<?php
require_once __DIR__ . '/FormateadorHorario.php';
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
    // Calcular monto base si no viene (para compatibilidad)
    if ($montoBase === null) {
        $montoBase = $monto - $recargo;
    }
    $montoBaseFormateado = number_format($montoBase, 0, ',', '.');
    $recargoFormateado = number_format($recargo, 0, ',', '.');
    $montoFormateado = number_format($monto, 0, ',', '.');

    $resumenPago = "
        <h3 style='margin-top: 24px; color: #555;'>Resumen de Pago</h3>
        <table style='width: 100%; border-collapse: collapse; font-size: 14px;'>
            <tr>
                <td style='padding: 8px; background-color: #f9f9f9; border: 1px solid #ddd;'>Monto base:</td>
                <td style='padding: 8px; background-color: #f9f9f9; border: 1px solid #ddd;'>\$${montoBaseFormateado} CLP</td>
            </tr>
            <tr>
                <td style='padding: 8px; background-color: #fff3e0; border: 1px solid #ddd;'>Recargo por comuna:</td>
                <td style='padding: 8px; background-color: #fff3e0; border: 1px solid #ddd; color: #D35400; font-weight: bold;'>+ \$${recargoFormateado} CLP</td>
            </tr>
            <tr>
                <td style='padding: 8px; background-color: #e0f7fa; border: 1px solid #ddd;'><strong>Total a pagar:</strong></td>
                <td style='padding: 8px; background-color: #e0f7fa; border: 1px solid #ddd; font-weight: bold;'>\$${montoFormateado} CLP</td>
            </tr>
        </table>
    ";

    $vendedorHTML = "";
    if (!empty($vendedor)) {
        $vendedorHTML = "
        <h3 style='border-bottom: 1px solid #ccc; padding-bottom: 8px;'>Datos del Vendedor</h3>
        <table style='width:100%; border-collapse:collapse; margin-bottom:16px;'>
            <tr><td><strong>Nombre:</strong></td><td>" . htmlspecialchars($vendedor['nombre'] ?? '') . "</td></tr>
            <tr><td><strong>Tipo:</strong></td><td>" . htmlspecialchars($vendedor['tipo'] ?? '') . "</td></tr>
            <tr><td><strong>Teléfono:</strong></td><td>" . htmlspecialchars($vendedor['telefono'] ?? '') . "</td></tr>
            <tr style='background-color:#eef6f0;'><td><strong>Dirección:</strong></td><td>" . htmlspecialchars($vendedor['direccion'] ?? '') . "</td></tr>
            <tr><td><strong>Región:</strong></td><td>" . htmlspecialchars($vendedor['region'] ?? '') . "</td></tr>
            <tr style='background-color:#eef6f0;'><td><strong>Comuna:</strong></td><td>" . htmlspecialchars($vendedor['comuna'] ?? '') . "</td></tr>
        </table>";
    }

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

        $resumenPago
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

        $vendedorHTML
    </div>
</div>
    ";
}

?>
