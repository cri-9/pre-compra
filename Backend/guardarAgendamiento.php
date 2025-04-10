<?php
header('Content-Type: application/json');

// Conexión a la base de datos
$conn = new mysqli("localhost", "root", "", "precompra_db");

if ($conn->connect_error) {
    echo json_encode(['success' => false, 'error' => 'Error de conexión: ' . $conn->connect_error]);
    exit;
}

// Recibe JSON del frontend
$input = json_decode(file_get_contents('php://input'), true);

// Extrae y valida los datos
$nombre = $input['nombre'] ?? null;
$correo = $input['correo'] ?? null;
$telefono = $input['telefono'] ?? null;
$fecha = $input['fecha'] ?? null;
$bloque = $input['bloque'] ?? null;
$direccion = $input['direccion'] ?? null;

if (!$nombre || !$correo || !$telefono || !$fecha || !$bloque || !$direccion) {
    echo json_encode(['success' => false, 'error' => 'Faltan datos obligatorios']);
    exit;
}

// Verifica que no exista un agendamiento en esa fecha y bloque
$checkStmt = $conn->prepare("SELECT id FROM agendamientos WHERE fecha = ? AND bloque = ?");
$checkStmt->bind_param("ss", $fecha, $bloque);
$checkStmt->execute();
$checkStmt->store_result();

if ($checkStmt->num_rows > 0) {
    echo json_encode(['success' => false, 'error' => 'Ese bloque ya está agendado. Elige otro.']);
    exit;
}

// Inserta el nuevo agendamiento
$insertStmt = $conn->prepare("INSERT INTO agendamientos (nombre, correo, telefono, fecha, bloque, direccion) VALUES (?, ?, ?, ?, ?, ?)");
$insertStmt->bind_param("ssssss", $nombre, $correo, $telefono, $fecha, $bloque, $direccion);

// Ejecuta la consulta
if ($insertStmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Agendamiento guardado correctamente.']);
} else {
    echo json_encode(['success' => false, 'error' => 'Error al guardar el agendamiento.']);
}

    // Llama a Google Calendar aquí
    // ----------------------------
    require_once 'agregarEvento.php';

$titulo = "Inspección para $nombre";
$horaInicio = $bloque === "AM" ? "08:00:00" : "14:00:00";
$horaFin = $bloque === "AM" ? "14:00:00" : "20:00:00";
$fechaInicio = $fecha . 'T' . $horaInicio;
$fechaFin = $fecha . 'T' . $horaFin;

$evento = agregarEventoGoogleCalendar([
    'summary' => $titulo,
    'location' => $direccion,
    'description' => "Cliente: $nombre, Teléfono: $telefono, Correo: $correo",
    'start' => $fechaInicio,
    'end' => $fechaFin
]);

if ($evento['success']) {
    echo json_encode(['success' => true, 'message' => 'Agendado y añadido a Google Calendar']);
} else {
    echo json_encode(['success' => true, 'message' => 'Agendado, pero hubo un error en Google Calendar', 'calendar_error' => $evento['error']]);
}

$conn->close();
