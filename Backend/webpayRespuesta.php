<?php
session_start();
require 'conexionBD.php';
require_once __DIR__ . '/vendor/autoload.php';

use Transbank\Webpay\WebpayPlus\Transaction;

$token = $_GET['token_ws'] ?? null;
$responseHtml = '';

function renderPage($title, $message, $color, $icon, $button = true) {
    return "
    <!DOCTYPE html>
    <html lang='es'>
    <head>
        <meta charset='UTF-8'>
        <title>{$title}</title>
        <meta name='viewport' content='width=device-width, initial-scale=1'>
        <style>
            body {
                font-family: 'Segoe UI', sans-serif;
                background-color: #f9f9f9;
                margin: 0;
                padding: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                text-align: center;
            }
            .card {
                background: white;
                padding: 2rem;
                border-radius: 16px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.1);
                max-width: 400px;
                width: 90%;
            }
            .icon {
                font-size: 3rem;
                color: {$color};
                margin-bottom: 1rem;
            }
            .title {
                font-size: 1.5rem;
                margin-bottom: 0.5rem;
                color: #333;
            }
            .message {
                font-size: 1rem;
                color: #555;
                margin-bottom: 1.5rem;
            }
            .button {
                padding: 0.75rem 1.5rem;
                background-color: #7B1FA2;
                color: white;
                border: none;
                border-radius: 8px;
                font-size: 1rem;
                cursor: pointer;
                text-decoration: none;
            }
            .button:hover {
                background-color: #6a168c;
            }
        </style>
    </head>
    <body>
        <div class='card'>
            <div class='icon'>{$icon}</div>
            <div class='title'>{$title}</div>
            <div class='message'>{$message}</div>
            " . ($button ? "<a href='/' class='button'>Volver al inicio</a>" : "") . "
        </div>
    </body>
    </html>";
}

if (!$token) {
    echo renderPage('Error en el pago', 'No se recibió el token de pago. Intenta nuevamente.', '#f44336', '❌');
    exit;
}

try {
    $response = (new Transaction)->commit($token);

    if ($response->getStatus() !== 'AUTHORIZED') {
        echo renderPage('Pago Rechazado', 'Tu pago no fue autorizado por Transbank.', '#f44336', '❌');
        exit;
    }

    if (!isset($_SESSION['datos_formulario'])) {
        echo renderPage('Datos faltantes', 'No se encontraron los datos del agendamiento.', '#ff9800', '⚠️');
        exit;
    }

    $data = $_SESSION['datos_formulario'];

    // Recolectar datos
    $cliente = $data['cliente'] ?? [];
    $agendamiento = $data['agendamiento'] ?? [];
    $vehiculo = $data['vehiculo'] ?? [];
    $vendedor = $data['vendedor'] ?? [];
    $monto = $data['pago']['monto'] ?? 0;
    $metodo = $data['pago']['metodo'] ?? 'WebPay';

    // Verificar duplicidad de bloque
    $check = $conn->prepare("SELECT COUNT(*) FROM agendamientos WHERE fecha_agendada = :fecha AND bloque = :bloque");
    $check->execute([
        ':fecha' => $agendamiento['fecha'],
        ':bloque' => $agendamiento['bloque']
    ]);
    if ($check->fetchColumn() > 0) {
        echo renderPage('Bloque ocupado', 'Ese horario ya fue reservado. Por favor elige otro.', '#ff9800', '⏰');
        exit;
    }

    // Guardar en base de datos
    $stmt = $conn->prepare("INSERT INTO agendamientos (
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
    )");

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
        ':metodo_pago' => $metodo
    ]);

    if ($exito) {
        unset($_SESSION['datos_formulario']);
        echo renderPage('¡Pago Exitoso!', 'Tu inspección fue agendada correctamente. ¡Gracias por confiar en nosotros!', '#4CAF50', '✅');
    } else {
        echo renderPage('Error al guardar', 'El pago fue aprobado pero no pudimos registrar el agendamiento.', '#ff9800', '⚠️');
    }

} catch (Exception $e) {
    echo renderPage('Error inesperado', htmlspecialchars($e->getMessage()), '#f44336', '❌');
}
