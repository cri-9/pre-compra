<?php
require 'conexionBD.php'; // Usamos la conexión centralizada

$data = json_decode(file_get_contents("php://input"), true);
if (!$data) {
    echo json_encode(['success' => false, 'error' => 'Datos inválidos']);
    exit;
}

// Extraer info
$cliente = $data['cliente'] ?? [];
$agendamiento = $data['agendamiento'] ?? [];
$vehiculo = $data['vehiculo'] ?? [];
$vendedor = $data['vendedor'] ?? [];
$monto = $data['pago']['monto'] ?? 0;

// Verificar si ya hay un agendamiento en esa fecha y bloque
$check = $conn->prepare("SELECT COUNT(*) FROM agendamientos WHERE fecha_agendada = :fecha AND bloque = :bloque");
$check->execute([
    ':fecha' => $agendamiento['fecha'],
    ':bloque' => $agendamiento['bloque']
]);
$count = $check->fetchColumn();

if ($count > 0) {
    echo json_encode(['success' => false, 'error' => 'Ese bloque horario ya está agendado.']);
    exit;
}

// Insertar agendamiento
$sql = "INSERT INTO agendamientos (
    marca_vehiculo, modelo_vehiculo, anio_vehiculo, patente,
    nombre_cliente, apellido_cliente, email_cliente, telefono_cliente, rut_cliente,
    direccion_cliente, region_cliente, comuna_cliente,
    tipo_vendedor, nombre_vendedor, telefono_vendedor, direccion_vendedor, region_vendedor, comuna_vendedor,
    fecha_agendada, bloque, metodo_pago
) VALUES (
    :marca, :modelo, :anio, :patente,
    :nombre, :apellido, :email, :telefono, :rut,
    :direccion, :region, :comuna,
    :tipo_vendedor, :nombre_vendedor, :telefono_vendedor, :direccion_vendedor, :region_vendedor, :comuna_vendedor,
    :fecha, :bloque, :metodo_pago
)";

$stmt = $conn->prepare($sql);
$exito = $stmt->execute([
    ':marca' => $vehiculo['marca'] ?? '',
    ':modelo' => $vehiculo['modelo'] ?? '',
    ':anio' => $vehiculo['anio'] ?? '',
    ':patente' => $vehiculo['patente'] ?? '',
    ':nombre' => $cliente['nombre'] ?? '',
    ':apellido' => $cliente['apellido'] ?? '',
    ':email' => $cliente['email'] ?? '',
    ':telefono' => $cliente['telefono'] ?? '',
    ':rut' => $cliente['rut'] ?? '',
    ':direccion' => $cliente['direccion'] ?? '',
    ':region' => $cliente['region'] ?? '',
    ':comuna' => $cliente['comuna'] ?? '',
    ':tipo_vendedor' => $vendedor['tipo'] ?? '',
    ':nombre_vendedor' => $vendedor['nombre'] ?? '',
    ':telefono_vendedor' => $vendedor['telefono'] ?? '',
    ':direccion_vendedor' => $vendedor['direccion'] ?? '',
    ':region_vendedor' => $vendedor['region'] ?? '',
    ':comuna_vendedor' => $vendedor['comuna'] ?? '',
    ':fecha' => $agendamiento['fecha'] ?? '',
    ':bloque' => $agendamiento['bloque'] ?? '',
    ':metodo_pago' => $data['pago']['metodo'] ?? 'WebPay',
]);

if ($exito) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => 'Error al guardar en BD']);
}
?>
