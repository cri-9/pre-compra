<?php
// Este script se puede incluir desde enviarAgendamiento.php para agendar en Google Calendar
require_once __DIR__ . '/agregarEvento.php';

function agendarEventoGoogleDesdeAgendamiento($data, $hora_inicio, $hora_fin) {
    // Preparar los datos para el evento
    $fecha = $data['agendamiento']['fecha'];
    $servicio = $data['pago']['nombreServicio'] ?? ($data['servicio'] ?? 'Servicio Visual Mecánica');
    $cliente = $data['cliente']['nombre'] . ' ' . $data['cliente']['apellido'];
    $email = $data['cliente']['email'];
    
    // Formato: 2024-06-15T10:00:00-04:00
    $startDateTime = $fecha . 'T' . $hora_inicio . ':00-04:00';
    $endDateTime = $fecha . 'T' . $hora_fin . ':00-04:00';

    $evento = [
        'summary' => 'Agendamiento: ' . $servicio,
        'location' => 'Taller Visual Mecánica',
        'description' => 'Cliente: ' . $cliente . ', Email: ' . $email,
        'start' => $startDateTime,
        'end' => $endDateTime
    ];
    
    return agregarEvento($evento);
}
