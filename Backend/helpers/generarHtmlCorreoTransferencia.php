<?php
require_once __DIR__ . '/FormateadorHorario.php';
/**
 * Genera el cuerpo HTML del correo para confirmación de pago por transferencia con estilo MUI.
 *
 * @param array $datos Array asociativo con los datos del cliente y la transacción
 * @return string HTML diseñado con estilo moderno
 */
function generarHtmlCorreoTransferencia($datos) {
    // Valores por defecto para todos los campos
    $nombre = $datos['nombre'] ?? 'Cliente';
    $email = $datos['email'] ?? '';
    $telefono = $datos['telefono'] ?? '';
    $servicio = $datos['servicio'] ?? 'Servicio no especificado';
    $metodoPago = $datos['metodoPago'] ?? 'Transferencia bancaria';
    $monto = $datos['monto'] ?? 0;
    $direccion = $datos['direccion'] ?? 'No informado';
    $region = $datos['region'] ?? 'No informado';
    $comuna = $datos['comuna'] ?? 'No informado';
    $montoBase = $datos['montoBase'] ?? null;
    $recargo = $datos['recargo'] ?? 0;
    $descuento = $datos['descuento'] ?? 0;
    $montoFormateado = number_format($monto, 0, ',', '.');
    $montoBaseFormateado = $montoBase !== null ? number_format($montoBase, 0, ',', '.') : null;
    $recargoFormateado = number_format($recargo, 0, ',', '.');
    $descuentoFormateado = number_format($descuento, 0, ',', '.');
    $totalCalculado = ($montoBase ?? 0) + ($recargo ?? 0) - ($descuento ?? 0);
    $totalFormateado = number_format($totalCalculado, 0, ',', '.');

    // Generar el HTML del correo
    $html = '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #dddddd; border-radius: 5px; overflow: hidden;">
    <div style="background-color: #1976d2; color: white; text-align: center; padding: 24px;">
    <h2 style="margin: 0; font-size: 22px;">Nueva solicitud de transferencia recibida</h2>
</div>
    <div style="padding: 20px;">
        <p>Estimado/a <strong>' . htmlspecialchars($nombre) . '</strong>,</p>
        <p>Hemos registrado tu solicitud de agendamiento vía <b>' . htmlspecialchars($metodoPago) . '</b> para el servicio:</p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
            <tr style="background-color: #e6e6e6;">
                <td style="padding: 8px;"><b>Servicio:</b></td><td style="padding: 8px;">' . htmlspecialchars($servicio) . '</td>
            </tr>';
    if ($montoBase !== null) {
    $html .= '<tr style="background-color: #f5f5f5;"><td style="padding: 8px;"><b>Monto base:</b></td><td style="padding: 8px;">$' . $montoBaseFormateado . ' CLP</td></tr>';
    if ($recargo > 0) {
        $html .= '<tr style="background-color: #e6e6e6;"><td style="padding: 8px;"><b>Recargo por comuna:</b></td><td style="padding: 8px; color: #D35400; font-weight: bold;">+$' . $recargoFormateado . ' CLP</td></tr>';
    }
    if ($descuento > 0) {
        $html .= '<tr style="background-color: #ffe6e6;"><td style="padding: 8px;"><b>Descuento:</b></td><td style="padding: 8px; color: #27ae60; font-weight: bold;">-$' . $descuentoFormateado . ' CLP</td></tr>';
    }
    $html .= '<tr style="background-color: #e0f7fa;"><td style="padding: 8px;"><b>Total a pagar:</b></td><td style="padding: 8px; font-weight: bold;">$' . $totalFormateado . ' CLP</td></tr>';
} else {
    $html .= '<tr style="background-color: #f5f5f5;"><td style="padding: 8px;"><b>Monto:</b></td><td style="padding: 8px;">$' . $montoFormateado . ' CLP</td></tr>';
}
    $html .= '<tr style="background-color: #e6e6e6;"><td style="padding: 8px;"><b>Teléfono de contacto:</b></td><td style="padding: 8px;">' . htmlspecialchars($telefono) . '</td></tr>';
    $html .= '<tr style="background-color: #f5f5f5;"><td style="padding: 8px;"><b>Email:</b></td><td style="padding: 8px;">' . htmlspecialchars($email) . '</td></tr>';
    $html .= '<tr style="background-color: #e6e6e6;"><td style="padding: 8px;"><b>Dirección:</b></td><td style="padding: 8px;">' . htmlspecialchars($direccion) . '</td></tr>';
    $html .= '<tr style="background-color: #f5f5f5;"><td style="padding: 8px;"><b>Región:</b></td><td style="padding: 8px;">' . htmlspecialchars($region) . '</td></tr>';
    $html .= '<tr style="background-color: #e6e6e6;"><td style="padding: 8px;"><b>Comuna:</b></td><td style="padding: 8px;">' . htmlspecialchars($comuna) . '</td></tr>';
    $html .= '</table>
        <p><b>Un ejecutivo se pondrá en contacto contigo para entregar los datos de transferencia y así confirmar el servicio.</b></p>
        <p>Gracias por confiar en Visual Mecánica.</p>
    </div>
    <div style="background-color: #f5f5f5; text-align: center; padding: 10px;">
        <small style="color: #888;">Este mensaje es generado automáticamente, por favor no responder a este correo.</small>
    </div>
    </div>';

    // Si por alguna razón el HTML queda vacío, loguear y retornar un mensaje simple
    if (empty($html) || strlen(trim(strip_tags($html))) < 10) {
        error_log("[generarHtmlCorreoTransferencia] HTML generado vacío o muy corto. Datos: " . json_encode($datos));
        return '<div style="font-family: Arial, sans-serif; color: red;">Hubo un error generando el comprobante. Por favor contacta a soporte.</div>';
    }
    return $html;

    // Extraer datos del array
    $nombre = $datos['nombre'] ?? 'Cliente';
    $email = $datos['email'] ?? '';
    $telefono = $datos['telefono'] ?? '';    
    $servicio = $datos['servicio'] ?? 'Servicio no especificado';
    $metodoPago = $datos['metodoPago'] ?? 'Transferencia bancaria';
    $monto = $datos['monto'] ?? 0;
    $direccion = $datos['direccion'] ?? 'No informado';
    $region = $datos['region'] ?? 'No informado';
    $comuna = $datos['comuna'] ?? 'No informado';
    
    // Formatear el monto con separadores de miles
    $montoFormateado = number_format($monto, 0, ',', '.');
    $montoBase = $datos['montoBase'] ?? null;
    $recargo = $datos['recargo'] ?? 0;
    $montoBaseFormateado = $montoBase !== null ? number_format($montoBase, 0, ',', '.') : null;
    $recargoFormateado = number_format($recargo, 0, ',', '.');
    
    // Generar el HTML del correo
$html = '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #dddddd; border-radius: 5px; overflow: hidden;">
<div style="background-color: #f5f5f5; text-align: center; padding: 20px;">
    <img src="../assets/logo_visual1.2.png" alt="Visual Mecánica" style="width: 50px; vertical-align: middle;"/>
    <h2 style="display: inline; color: #265cff; margin-left: 10px;">Confirmación de solicitud de pago</h2>
</div>
<div style="padding: 20px;">
    <p>Estimado/a <strong>' . htmlspecialchars($nombre) . '</strong>,</p>
    <p>Hemos registrado tu solicitud de agendamiento vía <b>' . htmlspecialchars($metodoPago) . '</b> para el servicio:</p>
    <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
        <tr style="background-color: #e6e6e6;">
            <td style="padding: 8px;"><b>Servicio:</b></td><td style="padding: 8px;">' . htmlspecialchars($servicio) . '</td>
        </tr>';

if ($montoBase !== null) {
$html .= '<tr style="background-color: #f5f5f5;"><td style="padding: 8px;"><b>Monto base:</b></td><td style="padding: 8px;">$' . $montoBaseFormateado . ' CLP</td></tr>';
if ($recargo > 0) {
    $html .= '<tr style="background-color: #e6e6e6;"><td style="padding: 8px;"><b>Recargo por comuna:</b></td><td style="padding: 8px; color: #D35400; font-weight: bold;">+$' . $recargoFormateado . ' CLP</td></tr>';
}
$html .= '<tr style="background-color: #f5f5f5;"><td style="padding: 8px;"><b>Total a pagar:</b></td><td style="padding: 8px; font-weight: bold;">$' . $montoFormateado . ' CLP</td></tr>';
} else {
$html .= '<tr style="background-color: #f5f5f5;"><td style="padding: 8px;"><b>Monto:</b></td><td style="padding: 8px;">$' . $montoFormateado . ' CLP</td></tr>';
}

$html .= '<tr style="background-color: #e6e6e6;"><td style="padding: 8px;"><b>Teléfono de contacto:</b></td><td style="padding: 8px;">' . htmlspecialchars($telefono) . '</td></tr>
        <tr style="background-color: #f5f5f5;">
            <td style="padding: 8px;"><b>Email:</b></td><td style="padding: 8px;">' . htmlspecialchars($email) . '</td>
        </tr>
        <tr style="background-color: #e6e6e6;">
            <td style="padding: 8px;"><b>Dirección:</b></td><td style="padding: 8px;">' . htmlspecialchars($direccion) . '</td>
        </tr>
        <tr style="background-color: #f5f5f5;">
            <td style="padding: 8px;"><b>Región:</b></td><td style="padding: 8px;">' . htmlspecialchars($region) . '</td>
        </tr>
        <tr style="background-color: #e6e6e6;">
            <td style="padding: 8px;"><b>Comuna:</b></td><td style="padding: 8px;">' . htmlspecialchars($comuna) . '</td>
        </tr>
    </table>
    <p><b>Un ejecutivo se pondrá en contacto contigo para entregar los datos de transferencia y así confirmar el servicio.</b></p>
    <p>Gracias por confiar en Visual Mecánica.</p>
</div>
<div style="background-color: #f5f5f5; text-align: center; padding: 10px;">
    <small style="color: #888;">Este mensaje es generado automáticamente, por favor no responder a este correo.</small>
</div>
</div>';
}
?>
