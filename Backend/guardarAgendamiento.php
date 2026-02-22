<?php
header('Content-Type: application/json');
header('X-Robots-Tag: noindex, nofollow, noarchive');

require_once 'conexionBD.php';

try {
    // Obtener datos JSON
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    if (!$data) {
        throw new Exception('Datos JSON inválidos');
    }

    // Extraer datos
    $vehiculo = $data['vehiculo'] ?? [];
    $cliente = $data['cliente'] ?? [];
    $vendedor = $data['vendedor'] ?? [];
    $agendamiento = $data['agendamiento'] ?? [];
    $pago = $data['pago'] ?? [];

    $sql = "INSERT INTO agendamientos (
        marca_vehiculo, modelo_vehiculo, anio_vehiculo, patente,
        nombre_cliente, apellido_cliente, email_cliente, telefono_cliente, rut_cliente, direccion_cliente, region_cliente, comuna_cliente,
        tipo_vendedor, nombre_vendedor, telefono_vendedor, direccion_vendedor, region_vendedor, comuna_vendedor,
        fecha_agendada, bloque, metodo_pago
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    $stmt = $conexion->prepare($sql);
    $stmt->bind_param('ssissssssssssssssssss',
        $vehiculo['marca'], $vehiculo['modelo'], $vehiculo['año'], $vehiculo['patente'],
        $cliente['nombre'], $cliente['apellido'], $cliente['email'], $cliente['telefono'], $cliente['rut'], $cliente['direccion'], $cliente['region'], $cliente['comuna'],
        $vendedor['tipovendedor'], $vendedor['nombre'], $vendedor['telefono'], $vendedor['direccion'], $vendedor['region'], $vendedor['comuna'],
        $agendamiento['fecha'], $agendamiento['bloque'], $pago['metodo']
    );

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'id' => $conexion->insert_id]);
    } else {
        throw new Exception($stmt->error);
    }

    $stmt->close();
    $conexion->close();

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
