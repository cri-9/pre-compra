<?php
require_once __DIR__ . '/helpers/env.php';

/**
 * Wrapper genérico para agregar un evento a Google Calendar.
 * Recibe un array con los datos del evento (summary, location, description, start, end).
 * Permite compatibilidad con scripts que esperan la función agregarEvento.
 */
function agregarEvento($datos, $modoDebug = false) {
    return agregarEventoGoogleCalendar($datos, $modoDebug);
}

//oculta errores de deprecated y notice
error_reporting(E_ALL & ~E_DEPRECATED & ~E_NOTICE & ~E_WARNING);
ini_set('display_errors', 0);


require 'vendor/autoload.php';


function agregarEventoGoogleCalendar($datos, $modoDebug = false) {
    try {
        error_log("INICIO agregarEventoGoogleCalendar");

        // Verificar si estamos en modo de desarrollo y simulación de calendar
        $devMode = in_array(getenv_backend('DEV_MODE', 'false'), ['true', '1', 'yes', 'on']);
        $simulateCalendar = in_array(getenv_backend('SIMULATE_CALENDAR', 'false'), ['true', '1', 'yes', 'on']);
        $esModoSimulacion = $modoDebug || ($devMode && $simulateCalendar);

        if ($esModoSimulacion) {
            error_log("MODO SIMULACIÓN ACTIVADO: No se conecta a Google Calendar.");
            error_log("Datos del evento simulado: " . json_encode([
                'summary' => $datos['summary'] ?? 'Sin título',
                'location' => $datos['location'] ?? 'Sin ubicación',
                'description' => $datos['description'] ?? 'Sin descripción',
                'start' => $datos['start'] ?? 'Sin fecha inicio',
                'end' => $datos['end'] ?? 'Sin fecha fin'
            ]));
            // Simula una respuesta exitosa sin llamar a Google Calendar
            return [
                'success' => true,
                'eventLink' => 'https://calendar.google.com/fake-event-link-desarrollo',
                'debug' => 'Evento simulado (no creado realmente) - Modo desarrollo'
            ];
        }

        error_log("Creando cliente de Google...");
        $client = new Google_Client();
        $client->setApplicationName('Visual Mecánica');
        $client->setScopes(Google_Service_Calendar::CALENDAR_EVENTS);
        $client->setAuthConfig('credenciales.json');
        $client->setAccessType('offline');

        // Cargar token de acceso
        $tokenPath = __DIR__ . '/token.json';
        if (!file_exists($tokenPath)) {
            error_log('No hay token de acceso');
            return [
                'success' => false,
                'error' => 'No hay token de acceso para Google Calendar.'
            ];
        }
        $accessToken = json_decode(file_get_contents($tokenPath), true);
        $client->setAccessToken($accessToken);

        // Log del token antes de refrescar
        error_log('Token antes de refrescar: ' . json_encode($client->getAccessToken()));

        // Renovar token si expiró
        if ($client->isAccessTokenExpired()) {
            $refreshToken = $client->getRefreshToken();
            if ($refreshToken) {
                error_log('Intentando refrescar token con refresh_token: ' . $refreshToken);
                $newToken = $client->fetchAccessTokenWithRefreshToken($refreshToken);
                $client->setAccessToken($newToken);
                file_put_contents($tokenPath, json_encode($client->getAccessToken()));
                error_log('Token después de refrescar: ' . json_encode($client->getAccessToken()));
            } else {
                error_log('Token expirado y sin refresh token');
                return [
                    'success' => false,
                    'error' => 'Token expirado y sin refresh token'
                ];
            }
        }

        // Log final del token usado
        error_log('Token FINAL usado por Google Client: ' . json_encode($client->getAccessToken()));

        error_log("Instanciando servicio de Google Calendar...");
        $service = new Google_Service_Calendar($client);

        error_log("Preparando evento...");
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

        error_log("Insertando evento en Google Calendar...");
        $createdEvent = $service->events->insert('primary', $event);

        if (!$createdEvent || !isset($createdEvent->htmlLink)) {
            error_log("No se pudo crear el evento en Google Calendar.");
            return [
                'success' => false,
                'error' => 'No se pudo crear el evento en Google Calendar. Por favor, intenta nuevamente o contacta soporte.'
            ];
        }

        error_log("Evento creado exitosamente: " . $createdEvent->htmlLink);

        return [
            'success' => true,
            'eventLink' => $createdEvent->htmlLink
        ];

    } catch (Exception $e) {
        error_log("ERROR en agregarEventoGoogleCalendar: " . $e->getMessage());
        return [
            'success' => false,
            'error' => $e->getMessage()
        ];
    }
}
