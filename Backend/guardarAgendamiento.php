<?php
header('Content-Type: application/json');
require 'conexionBD.php'; // Conexión a la base de datos

// Obtener y decodificar los datos JSON del cuerpo del POST
$datosJSON = file_get_contents("php://input");
$datos = json_decode($datosJSON, true);

if (!$datos) {
    echo json_encode(['success' => false, 'error' => 'No se recibieron datos válidos.']);
    exit;
}

// Desglose de los datos del formulario
$vehiculo   = $datos['vehiculo'];
$cliente    = $datos['cliente'];
$vendedor   = $datos['vendedor'];
$agendamiento = $datos['agendamiento'];
$pago       = $datos['pago'];

// Preparar la consulta SQL (ajusta los campos según tu tabla)
$sql = "INSERT INTO agendamientos (
    marca_vehiculo, modelo_vehiculo, anio_vehiculo, patente,
    nombre_cliente, apellido_cliente, email_cliente, telefono_cliente, rut_cliente, direccion_cliente, region_cliente, comuna_cliente,
    tipo_vendedor, nombre_vendedor, telefono_vendedor, direccion_vendedor, region_vendedor, comuna_vendedor,
    fecha_agendada, bloque, metodo_pago, fecha_creacion
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())";

$stmt = $conexion->prepare($sql);
if (!$stmt) {
    echo json_encode(['success' => false, 'error' => 'Error al preparar consulta: ' . $conexion->error]);
    exit;
}

$stmt->bind_param(
    'sssssssssssssssssss',
    $vehiculo['marca'],
    $vehiculo['modelo'],
    $vehiculo['año'],
    $vehiculo['patente'],
    $cliente['nombre'],
    $cliente['apellido'],
    $cliente['email'],
    $cliente['telefono'],
    $cliente['rut'],
    $cliente['direccion'],
    $cliente['region'],
    $cliente['comuna'],
    $vendedor['tipovendedor'],
    $vendedor['nombre'],
    $vendedor['telefono'],
    $vendedor['direccion'],
    $vendedor['region'],
    $vendedor['comuna'],
    $agendamiento['fecha'],
    $agendamiento['bloque'],
    $pago['metodo']
);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'mensaje' => 'Agendamiento guardado correctamente.']);
} else {
    echo json_encode(['success' => false, 'error' => 'Error al insertar datos: ' . $stmt->error]);
}

$stmt->close();
$conexion->close();
