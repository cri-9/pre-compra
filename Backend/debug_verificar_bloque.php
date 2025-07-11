<?php
// Archivo de debug para verificar bloque
header('Content-Type: application/json');

// Configurar cabeceras CORS automáticamente
require_once 'helpers/corsHeaders.php';
setCorsHeaders();

// Configurar errores para desarrollo
error_reporting(E_ALL & ~E_DEPRECATED & ~E_NOTICE & ~E_WARNING);
ini_set('display_errors', 0);

try {
    // Conexión a la base de datos usando variables de entorno
    require_once 'conexionBD.php';
    $conn = new mysqli($host, $user, $pass, $db);
    
    if ($conn->connect_error) {
        echo json_encode([
            'success' => false, 
            'error' => 'Error de conexión: ' . $conn->connect_error,
            'debug' => 'Conexión fallida'
        ]);
        exit;
    }

    // Verificar si existe la tabla agendamientos
    $result = $conn->query("SHOW TABLES LIKE 'agendamientos'");
    if ($result->num_rows == 0) {
        echo json_encode([
            'success' => false,
            'error' => 'La tabla agendamientos no existe',
            'debug' => 'Tabla no encontrada'
        ]);
        exit;
    }

    // Obtener entrada desde el cuerpo de la petición
    $rawInput = file_get_contents('php://input');
    $input = json_decode($rawInput, true);

    // Debug: mostrar lo que recibimos
    if (!$input) {
        echo json_encode([
            'success' => false,
            'error' => 'No se recibieron datos JSON válidos',
            'debug' => [
                'raw_input' => $rawInput,
                'method' => $_SERVER['REQUEST_METHOD'],
                'content_type' => $_SERVER['CONTENT_TYPE'] ?? 'No Content-Type'
            ]
        ]);
        exit;
    }

    // Verificación de datos
    if (!isset($input['fecha'])) {
        echo json_encode([
            'success' => false, 
            'error' => 'No se envió la fecha',
            'debug' => [
                'received_data' => $input,
                'expected' => ['fecha' => 'YYYY-MM-DD']
            ]
        ]);
        exit;
    }

    $fecha = $input['fecha'];

    if (!$fecha || !preg_match('/^\d{4}-\d{2}-\d{2}$/', $fecha)) {
        echo json_encode([
            'success' => false, 
            'error' => 'Fecha no válida',
            'debug' => [
                'received_fecha' => $fecha,
                'expected_format' => 'YYYY-MM-DD'
            ]
        ]);
        exit;
    }

    // Consulta bloques ocupados
    $stmt = $conn->prepare("SELECT bloque FROM agendamientos WHERE fecha_agendada = ?");
    $stmt->bind_param("s", $fecha);
    $stmt->execute();
    $result = $stmt->get_result();

    $bloquesOcupados = [];
    while ($row = $result->fetch_assoc()) {
        $bloquesOcupados[] = $row['bloque'];
    }

    $todosLosBloques = ["AM", "PM"];
    $disponibles = array_values(array_diff($todosLosBloques, $bloquesOcupados));

    // Respuesta exitosa con debug
    echo json_encode([
        'success' => true,
        'disponibles' => $disponibles,
        'debug' => [
            'fecha_consultada' => $fecha,
            'bloques_ocupados' => $bloquesOcupados,
            'todos_los_bloques' => $todosLosBloques,
            'tabla_existe' => true,
            'conexion' => 'OK'
        ]
    ]);

    $stmt->close();
    $conn->close();

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => 'Error interno: ' . $e->getMessage(),
        'debug' => [
            'exception' => $e->getMessage(),
            'file' => $e->getFile(),
            'line' => $e->getLine()
        ]
    ]);
}
?>
