<?php

require 'vendor/autoload.php';

function agregarEvento($data) {
    $client = new Google_Client(); // Autenticación con Google
    $client->setApplicationName('Visual Mecánica'); // Cambia esto por el nombre de tu aplicación
    $client->setScopes(Google_Service_Calendar::CALENDAR); // Permiso para acceder a la API de Google Calendar
    $client->setAuthConfig('credenciales.json'); // Archivo de credenciales
    $client->setAccessType('offline'); // Cambia esto si es necesario

    $service = new Google_Service_Calendar($client);

    $event = new Google_Service_Calendar_Event(array(
        'summary' => 'Agendamiento', // Cambia esto por el título del evento
        'location' => 'Ubicación', // Cambia esto por la ubicación del evento
        'description' => 'Descripción del evento', // Cambia esto por la descripción del evento
        'start' => array( // Fecha y hora de inicio
            'dateTime' => $data['agendamiento']['fecha'] . 'T' . $data['agendamiento']['bloque'] . ':00', // Cambia esto por la fecha y hora de inicio
            'timeZone' => 'America/Santiago', // Zona horaria
        ),
        'end' => array(
            'dateTime' => $data['agendamiento']['fecha'] . 'T' . (intval($data['agendamiento']['bloque']) + 1) . ':00', // Cambia esto por la fecha y hora de fin
            'timeZone' => 'America/Santiago', // Zona horaria
        ),
    ));

    $calendarId = 'primary';
    $event = $service->events->insert($calendarId, $event);
    return $event->htmlLink;
}

$data = json_decode(file_get_contents('php://input'), true);
$eventLink = agregarEvento($data);

if ($eventLink) {
    echo json_encode(['success' => true, 'eventLink' => $eventLink]);
} else {
    echo json_encode(['success' => false, 'error' => 'Error al agregar el evento']);
}
?>