/**
 * Recibe una hora tipo 'HH:MM' y devuelve un string como 'de 10:00 a 11:00 horas'
 * Ideal para mostrar en el comprobante/confirmación.
 */
function formateaRangoHorario(horaInicio) {
  if (!horaInicio || !/^\d{2}:\d{2}$/.test(horaInicio)) return '';
  const [h, m] = horaInicio.split(':').map(Number);
  const horaFin = (h + 1) % 24;
  const horaFinStr = horaFin.toString().padStart(2, '0');
  return `de ${horaInicio} a ${horaFinStr}:${m.toString().padStart(2, '0')} horas`;
}

// Ejemplo de uso:
// formateaRangoHorario('10:00') // => 'de 10:00 a 11:00 horas'
export default formateaRangoHorario;