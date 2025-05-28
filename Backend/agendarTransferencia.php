<?php

//oculta errores de deprecated y notice
error_reporting(E_ALL & ~E_DEPRECATED & ~E_NOTICE & ~E_WARNING);
ini_set('display_errors', 0);


// Encabezados CORS
header("Access-Control-Allow-Origin: https://visualmecanica.cl");   
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Manejar solicitud OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Conexión a la base de datos
require 'conexionBD.php';

function sanitizeInput($input) {
    if (is_array($input)) {
        return array_map('sanitizeInput', $input);
    }
    return htmlspecialchars(trim($input), ENT_QUOTES, 'UTF-8');
}

try {
    // Leer y validar JSON
    $inputJSON = file_get_contents('php://input');
    if (!$inputJSON) {
        throw new Exception('No se recibieron datos');
    }

    $input = json_decode($inputJSON, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('JSON inválido: ' . json_last_error_msg());
    }

    // Sanitizar todos los datos
    $input = sanitizeInput($input);

    // Validar estructura básica de datos
    $estructuraRequerida = [
        'vehiculo' => ['marca', 'modelo', 'año', 'patente'],
        'cliente' => ['nombre', 'apellido', 'email', 'telefono'],
        'agendamiento' => ['fecha', 'bloque'],
        'pago' => ['metodo']
    ];

    foreach ($estructuraRequerida as $seccion => $campos) {
        if (!isset($input[$seccion])) {
            throw new Exception("Falta la sección: $seccion");
        }
        
        foreach ($campos as $campo) {
            if (empty($input[$seccion][$campo])) {
                throw new Exception("Falta el campo: $seccion.$campo");
            }
        }
    }

    // Validaciones específicas
    if (!filter_var($input['cliente']['email'], FILTER_VALIDATE_EMAIL)) {
        throw new Exception("Formato de email inválido");
    }

    // Comenzar transacción
    $conn->beginTransaction();

    try {
        // Insertar en base de datos
        $stmt = $conn->prepare("
        INSERT INTO agendamientos (
            marca_vehiculo, modelo_vehiculo, anio_vehiculo, patente,
            nombre_cliente, apellido_cliente, email_cliente, telefono_cliente, rut_cliente,
            direccion_cliente, region_cliente, comuna_cliente,
            tipo_vendedor, nombre_vendedor, telefono_vendedor, direccion_vendedor, region_vendedor, comuna_vendedor,
            fecha_agendada, bloque, metodo_pago,
            nombre_servicio, monto_servicio
        ) VALUES (
            :marca, :modelo, :anio, :patente,
            :nombre, :apellido, :email, :telefono, :rut,
            :direccion, :region, :comuna,
            :tipovendedor, :nombreV, :telefonoV, :direccionV, :regionV, :comunaV,
            :fechaAgendada, :bloque, :metodo,
            :nombreServicio, :montoServicio
        )");

        $params = [
            // Datos del vehículo
            ':marca' => $input['vehiculo']['marca'],
            ':modelo' => $input['vehiculo']['modelo'],
            ':anio' => $input['vehiculo']['año'],
            ':patente' => $input['vehiculo']['patente'],

            // Datos del cliente
            ':nombre' => $input['cliente']['nombre'],
            ':apellido' => $input['cliente']['apellido'],
            ':email' => $input['cliente']['email'],
            ':telefono' => $input['cliente']['telefono'],
            ':rut' => $input['cliente']['rut'] ?? null,
            ':direccion' => $input['cliente']['direccion'] ?? null,
            ':region' => $input['cliente']['region'] ?? null,
            ':comuna' => $input['cliente']['comuna'] ?? null,

            // Datos del vendedor (opcionales)
            ':tipovendedor' => $input['vendedor']['tipovendedor'] ?? null,
            ':nombreV' => $input['vendedor']['nombre'] ?? null,
            ':telefonoV' => $input['vendedor']['telefono'] ?? null,
            ':direccionV' => $input['vendedor']['direccion'] ?? null,
            ':regionV' => $input['vendedor']['region'] ?? null,
            ':comunaV' => $input['vendedor']['comuna'] ?? null,

            // Agendamiento
            ':fechaAgendada' => $input['agendamiento']['fecha'],
            ':bloque' => $input['agendamiento']['bloque'],
            
            // Pago
            ':metodo' => $input['pago']['metodo'],
            
            // Servicio
            ':nombreServicio' => $input['servicio']['nombre'] ?? null,
            ':montoServicio' => $input['servicio']['monto'] ?? null
        ];

        if (!$stmt->execute($params)) {
            throw new Exception("Error al ejecutar la consulta");
        }

        // Obtener ID del nuevo agendamiento
        $agendamientoId = $conn->lastInsertId();

        // Confirmar transacción
        $conn->commit();

        // Respuesta exitosa
        echo json_encode([
            'success' => true,
            'mensaje' => 'Agendamiento exitoso',
            'agendamientoId' => $agendamientoId
        ]);

    } catch (Exception $e) {
        $conn->rollBack();
        throw new Exception("Error en transacción: " . $e->getMessage());
    }

} catch (Exception $e) {
    error_log("Error en agendarTransferencia: " . $e->getMessage());
    http_response_code(400);
    echo json_encode([
        'success' => false, 
        'error' => $e->getMessage()
    ]);
}
