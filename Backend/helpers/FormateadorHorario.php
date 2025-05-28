<?php
/**
 * Devuelve el string "de 10:00 a 11:00 horas" a partir de una hora tipo '10:00'
 * @param string $horaInicio (formato 'HH:MM')
 * @return string
 */
function formateaRangoHorario($horaInicio) {
    if (!preg_match('/^(\d{2}):(\d{2})$/', $horaInicio, $matches)) return '';
    $h = intval($matches[1]);
    $m = intval($matches[2]);
    $horaFin = ($h + 1) % 24;
    return sprintf("de %02d:%02d a %02d:%02d horas", $h, $m, $horaFin, $m);
}

// Ejemplo de uso:
// echo formateaRangoHorario('10:00'); // de 10:00 a 11:00 horas

?>
