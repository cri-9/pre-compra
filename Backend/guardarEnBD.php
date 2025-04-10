<?php
$host = 'localhost';
$db = 'precompra';
$user = 'root';
$pass = ' ' ;

// Create connection
try {
    $conn = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => 'Error de conexión: ' . $e->getMessage()]);
    exit;
}

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
$check = $conn->prepare("SELECT COUNT(*) FROM agendamientos WHERE fecha = :fecha AND bloque = :bloque");
$check->execute([
    ':fecha' => $agendamiento['fecha'],
    ':bloque' => $agendamiento['bloque']
]);
$count = $check->fetchColumn();

if ($count > 0) {
    echo json_encode(['success' => false, 'error' => 'Ese bloque horario ya está agendado.']);
    exit;
}

// Insertar agendamiento si está disponible
$sql = "INSERT INTO agendamientos (nombre_cliente, correo_cliente, telefono_cliente, fecha, bloque, vehiculo, vendedor, monto, estado_pago)
        VALUES (:nombre, :correo, :telefono, :fecha, :bloque, :vehiculo, :vendedor, :monto, 'Pagado')";

$stmt = $conn->prepare($sql);
$exito = $stmt->execute([
    ':nombre' => $cliente['nombre'] ?? '',
    ':correo' => $cliente['correo'] ?? '',
    ':telefono' => $cliente['telefono'] ?? '',
    ':fecha' => $agendamiento['fecha'] ?? '',
    ':bloque' => $agendamiento['bloque'] ?? '',
    ':vehiculo' => json_encode($vehiculo),
    ':vendedor' => $vendedor['nombre'] ?? '',
    ':monto' => $monto,
]);

if ($exito) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => 'Error al guardar en BD']);
}
?>