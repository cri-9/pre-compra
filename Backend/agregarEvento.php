<?php

require 'vendor/autoload.php';

function agregarEventoGoogleCalendar($datos) {
    try {
        $client = new Google_Client();
        $client->setApplicationName('Visual Mecánica');
        $client->setScopes(Google_Service_Calendar::CALENDAR);
        $client->setAuthConfig('credenciales.json');
        $client->setAccessType('offline');

        $service = new Google_Service_Calendar($client);

        $event = new Google_Service_Calendar_Event([
            'summary'     => $datos['summary'],
            'location'    => $datos['location'],
            'description' => $datos['description'],
            'start' => [
                'dateTime' => $datos['start'],
                'timeZone' => 'America/Santiago'
            ],
            'end' => [
                'dateTime' => $datos['end'],
                'timeZone' => 'America/Santiago'
            ],
        ]);

        $createdEvent = $service->events->insert('primary', $event);

        return [
            'success' => true,
            'eventLink' => $createdEvent->htmlLink
        ];

    } catch (Exception $e) {
        return [
            'success' => false,
            'error' => $e->getMessage()
        ];
    }
}
