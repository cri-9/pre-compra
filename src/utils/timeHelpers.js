// Suma minutos a una hora en formato "HH:MM"
export function sumarMinutosAHora(hora, minutosASumar) {
    const [h, m] = hora.split(':').map(Number);
    const date = new Date();
    date.setHours(h, m, 0, 0);
    date.setMinutes(date.getMinutes() + minutosASumar);
    // Asegura formato 2 dígitos
    const hh = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    return `${hh}:${mm}`;
  }