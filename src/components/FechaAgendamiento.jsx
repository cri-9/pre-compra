import React, { useState, useEffect } from "react";
import {
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import FormItem from "./FormItem";
import { sumarMinutosAHora } from "../utils/timeHelpers";

function FechaAgendamiento({ datos, onChange }) {
  // El estado local solo para loading, error y bloques
  const [bloquesDisponibles, setBloquesDisponibles] = useState([]);
  const [cargandoBloques, setCargandoBloques] = useState(false);
  const [errorBloques, setErrorBloques] = useState(null);
  const [fechaInicializada, setFechaInicializada] = useState(false);


  // Const para traducir fecha string a objeto Date
  const fechaAsDate = datos?.fecha ? new Date(datos.fecha) : new Date();

  // DatePicker con botón personalizado
  const ExampleCustomInput = React.forwardRef(({ value, onClick, className }, ref) => (
    <button className={className} onClick={onClick} ref={ref} style={{
      background: '#fff',
      border: '1px solid #1976d2',
      borderRadius: '6px',
      padding: '8px 18px',
      fontSize: '1rem',
      color: '#1976d2',
      cursor: 'pointer',
      fontWeight: 500
    }}>
      {value}
    </button>
  ));

  const handleDateChange = (date) => {
    const fechaISO = date.toISOString().split("T")[0];
    fetchBloquesDisponibles(fechaISO); // Recarga los bloques disponibles
    onChange({ ...datos, fecha: fechaISO, bloque: "", horario: "" }); // Limpia bloque y horario al cambiar fecha
  };


  const horariosPorBloque = {
    AM: ["10:00", "11:00", "13:00"],
    PM: ["16:30", "17:30", "18:30", "19:30"],
  };

  // --- Calendario de selección de fecha ---
  // Puedes poner esto donde quieras mostrar el calendario en el return principal:
  // <FormItem>
  //   <DatePicker
  //     selected={fechaAsDate}
  //     onChange={handleDateChange}
  //     customInput={<ExampleCustomInput className="example-custom-input" />}
  //     dateFormat="yyyy-MM-dd"
  //     minDate={new Date()}
  //     locale="es"
  //   />
  // </FormItem>

  // NOTIFICAR FECHA INICIAL AL PADRE SIEMPRE SI ESTA VACÍA
  useEffect(() => {
    if (!fechaInicializada && (!datos?.fecha || datos.fecha === "")) {
      const hoyISO = new Date().toISOString().split("T")[0];
      onChange({ ...datos, fecha: hoyISO });
      fetchBloquesDisponibles(hoyISO);
      setFechaInicializada(true);
    } else if (!fechaInicializada) {
      fetchBloquesDisponibles(datos.fecha);
      setFechaInicializada(true);
    }
    // eslint-disable-next-line
  }, []);

  const fetchBloquesDisponibles = async (fechaISO) => {
    try {
      setCargandoBloques(true);
      setErrorBloques(null);

      const response = await fetch('http://localhost/pre-compra/Backend/verificarBloque.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fecha: fechaISO })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response from server:", errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (!data || !Array.isArray(data.disponibles)) {
        setBloquesDisponibles(['AM', 'PM']);
        return;
      }

      setBloquesDisponibles(data.disponibles.length > 0 ? data.disponibles : []);
    } catch (error) {
      setErrorBloques("No se pudo cargar los bloques. Intenta más tarde.");
      setBloquesDisponibles([]);
    } finally {
      setCargandoBloques(false);
    }
  };

  const handleFechaChange = (date) => {
    const fechaISO = date.toISOString().split("T")[0];
    fetchBloquesDisponibles(fechaISO);
    onChange({ ...datos, fecha: fechaISO, bloque: "", horario: "" });
  };

  const validarBloqueDisponible = async (fechaISO, bloqueSeleccionado) => {
    try {
      const response = await fetch('http://localhost/pre-compra/Backend/verificarBloque.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fecha: fechaISO })
      });
      if (!response.ok) return false;
      const data = await response.json();
      return data.disponibles && data.disponibles.includes(bloqueSeleccionado);
    } catch {
      return false;
    }
  };

  const bloqueToHorario = (bloque) => {
    if (bloque === "AM") return "10:00 - 13:00";
    if (bloque === "PM") return "16:30 - 19:30";
    return "";
  };

  // Cambia para que al seleccionar bloque, NO asigne horario, sino que espere selección de hora exacta
  const handleBloqueChange = async (e) => {
    const nuevoBloque = e.target.value;
    const fechaISO = datos?.fecha ? datos.fecha : new Date().toISOString().split("T")[0];
    const disponible = await validarBloqueDisponible(fechaISO, nuevoBloque);
    if (!disponible) {
      setErrorBloques("Este bloque ya fue reservado por otra persona. Por favor, elige otro.");
      onChange({ ...datos, bloque: "", horario: "" });
      fetchBloquesDisponibles(fechaISO);
      return;
    }
    // Ahora no asignamos horario, esperamos que el usuario elija la hora exacta
    onChange({ ...datos, bloque: nuevoBloque, horario: "" });
  };

  // Nuevo handler para seleccionar la hora exacta
  const handleHoraChange = (e) => {
    const horaSeleccionada = e.target.value;
    // Calcula hora_fin sumando 1 hora
    const [h, m] = horaSeleccionada.split(':').map(Number);
    const date = new Date();
    date.setHours(h, m);
    date.setMinutes(date.getMinutes() + 60); // Suma 60 minutos
    const horaFin = date.toTimeString().slice(0, 5); // "HH:MM"
    onChange({
      ...datos,
      horario: horaSeleccionada,
      hora_inicio: horaSeleccionada,
      hora_fin: horaFin
    });
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Selecciona la fecha y bloque de tu agendamiento
      </Typography>

      <FormItem label="Fecha">
        <DatePicker
           selected={fechaAsDate}
           onChange={handleDateChange}
           customInput={<ExampleCustomInput className="example-custom-input" />}
           dateFormat="yyyy-MM-dd"
           minDate={new Date()}
           locale="es"
        />
      </FormItem>

      <FormItem label="Bloque horario">
        {errorBloques && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorBloques}
          </Alert>
        )}
        {cargandoBloques ? (
          <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: 56 }}>
            <CircularProgress size={24} />
          </Box>
        ) : bloquesDisponibles.length === 0 ? (
          <Alert severity="warning" sx={{ mb: 2, fontWeight: 'bold', fontSize: 16 }}>
            No hay bloques disponibles para la fecha seleccionada. Por favor, elige otra fecha.
          </Alert>
        ) : (
          <>
            <FormControl fullWidth variant="outlined" size="small" sx={{ mb: 2 }}>
              <InputLabel id="bloque-label">Bloque horario</InputLabel>
              <Select
                labelId="bloque-label"
                value={datos.bloque || ""}
                onChange={handleBloqueChange}
                label="Bloque horario"
              >
                <MenuItem value="">
                  <em>Selecciona un bloque</em>
                </MenuItem>
                {bloquesDisponibles.map((b) => (
                  <MenuItem key={b} value={b}>
                    {b === "AM" ? "AM (10:00 - 13:00)" : b === "PM" ? "PM (16:30 - 19:30)" : b}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Selector de hora exacta dentro del bloque */}
            {datos?.bloque && horariosPorBloque[datos.bloque] && (
              <FormControl fullWidth margin="normal" variant="outlined" size="small">
                <InputLabel id="hora-label">Hora exacta</InputLabel>
                <Select
                  labelId="hora-label"
                  value={datos.horario || ""}
                  onChange={handleHoraChange}
                  label="Hora exacta"
                >
                  <MenuItem value="">
                    <em>Selecciona una hora</em>
                  </MenuItem>
                  {horariosPorBloque[datos.bloque].map((hora) => (
                    <MenuItem key={hora} value={hora}>
                      {hora}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </>
        )}
      </FormItem>      
    </Box>
  );
}

export default FechaAgendamiento;
