<?php
/**
 * Formatea una fecha y hora en español de manera amigable.
 *
 * @param string $fechaYHora Fecha y hora en formato compatible con strtotime (ej: "2024-06-15 10:00")
 * @return array ['fecha' => '15 de junio de 2024', 'hora' => '10:00']
 */
function formatearFechaHoraEspanol($fechaYHora) {
    // Configurar locale para español
    setlocale(LC_TIME, 'es_ES.UTF-8', 'Spanish_Spain.1252', 'es_ES', 'esp');
    $timestamp = strtotime($fechaYHora);
    
    if ($timestamp === false) {
        return [
            'fecha' => 'Fecha inválida',
            'hora' => '--:--'
        ];
    }

    // Fecha: 15 de junio de 2024
    $fecha = strftime('%e de %B de %Y', $timestamp);
    // Hora: 10:00
    $hora = strftime('%H:%M', $timestamp);

    // Quitar espacios extra al inicio de día
    $fecha = ltrim($fecha);
    
    // Asegurar que los meses estén en minúsculas (convención en español)
    $fecha = mb_strtolower($fecha, 'UTF-8');

    return [
        'fecha' => $fecha,
        'hora' => $hora
    ];
}

/**
 * Formatea solo la fecha en español.
 *
 * @param string $fecha Fecha en formato compatible con strtotime (ej: "2024-06-15")
 * @return string Fecha formateada (ej: "15 de junio de 2024")
 */
function formatearFechaEspanol($fecha) {
    $resultado = formatearFechaHoraEspanol($fecha);
    return $resultado['fecha'];
}

/**
 * Formatea solo la hora.
 *
 * @param string $hora Hora en formato compatible con strtotime (ej: "10:00" o "2024-06-15 10:00")
 * @return string Hora formateada (ej: "10:00")
 */
function formatearHora($hora) {
    $resultado = formatearFechaHoraEspanol($hora);
    return $resultado['hora'];
}
