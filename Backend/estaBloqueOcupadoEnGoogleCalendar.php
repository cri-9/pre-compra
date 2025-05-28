<?php
require_once __DIR__ . '/vendor/autoload.php';

/**
 * Consulta si un bloque horario está ocupado en Google Calendar.
 * @param string $fechaInicio (ej: '2025-05-20T10:00:00-04:00')
 * @param string $fechaFin    (ej: '2025-05-20T11:00:00-04:00')
 * @return array ['ocupado' => bool, 'eventos' => array]
 */
function estaBloqueOcupadoEnGoogleCalendar($fechaInicio, $fechaFin) {
    try {
        $client = new Google_Client();
$client->setApplicationName('Visual Mecánica');
$client->setScopes(Google_Service_Calendar::CALENDAR_EVENTS);
$client->setAuthConfig(__DIR__ . '/credenciales.json');
$client->setAccessType('offline');

// Cargar token de acceso
$tokenPath = __DIR__ . '/token.json';
if (!file_exists($tokenPath)) {
    error_log('No hay token de acceso');
    return ['ocupado' => false, 'eventos' => [], 'error' => 'No hay token de acceso'];
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
        return ['ocupado' => false, 'eventos' => [], 'error' => 'Token expirado y sin refresh token'];
    }
}

// Log final del token usado
error_log('Token FINAL usado por Google Client: ' . json_encode($client->getAccessToken()));

        $service = new Google_Service_Calendar($client);
        $optParams = [
            'timeMin' => $fechaInicio,
            'timeMax' => $fechaFin,
            'singleEvents' => 'true',    // <-- como string
            'orderBy' => 'startTime',
        ];
        // Validación y log para depuración
        error_log('Google Calendar optParams: ' . json_encode($optParams));
        if (empty($fechaInicio) || empty($fechaFin)) {
            throw new Exception("Fechas para consulta de eventos no definidas correctamente: fechaInicio=[$fechaInicio], fechaFin=[$fechaFin]");
        }
        $events = $service->events->listEvents('primary', $optParams);
        $ocupado = false;
        $eventos = [];
        foreach ($events->getItems() as $event) {
            $ocupado = true;
            $eventos[] = $event->getSummary();
        }
        return ['ocupado' => $ocupado, 'eventos' => $eventos];
    } catch (Exception $e) {
        error_log('Error en estaBloqueOcupadoEnGoogleCalendar: ' . $e->getMessage());
        return ['ocupado' => false, 'eventos' => [], 'error' => $e->getMessage()];
    }
}
