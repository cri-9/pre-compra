import React, { useState, useEffect } from "react";
import {
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
  Box,
} from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import FormItem from "./FormItem";

function FechaAgendamiento({ datos, onChange, onSiguiente, onAnterior }) {
  const [fecha, setFecha] = useState(datos?.fecha ? new Date(datos.fecha) : new Date());
  const [bloque, setBloque] = useState(datos?.bloque || "");
  const [bloquesDisponibles, setBloquesDisponibles] = useState([]);
  const [cargandoBloques, setCargandoBloques] = useState(false);
  const [fetchRealizado, setFetchRealizado] = useState(false);
  const [fechaSeleccionadaPorUsuario, setFechaSeleccionadaPorUsuario] = useState(false);




  const todosLosBloques = [
    { value: "AM", label: "8:00 - 14:00 AM" },
    { value: "PM", label: "14:00 - 20:00 PM" },
  ];

  const fetchBloquesDisponibles = async (fechaISO) => {
    try {
      setCargandoBloques(true);
      const response = await fetch("http://localhost:8000/verificarBloque", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fecha: fechaISO }),
      })
      
  
      const data = await response.json();      

    console.log("Respuesta de backend:", data); // Verifica la respuesta del backend

      // Verifica si la respuesta contiene la propiedad "success" y si "disponibles" es un array
      if (data.success && Array.isArray(data.disponibles)) {
        setBloquesDisponibles(data.disponibles);  
          } else {
          setBloquesDisponibles([]);
}

    } catch (error) {
      console.error("Error al obtener bloques:", error);
      setBloquesDisponibles([]);
    } finally {
      setCargandoBloques(false);
    }
  };

  useEffect(() => {
    if (fecha) {
      const fechaISO = fecha.toISOString().split("T")[0];
      fetchBloquesDisponibles(fechaISO);
    }
  }, [fecha]);

  // Este efecto se ejecuta cuando la fecha seleccionada por el usuario cambia y no hay bloques disponibles
  useEffect(() => {
    if (
      !cargandoBloques &&
      fechaSeleccionadaPorUsuario &&
      bloquesDisponibles.length === 0
    ) {
      window.alert("No hay bloques disponibles para la fecha seleccionada. Por favor elige otra.");
    }
  }, [bloquesDisponibles, cargandoBloques, fechaSeleccionadaPorUsuario]);
  
  
  // Este efecto se ejecuta cuando la fecha cambia y no hay bloques disponibles handler actuando como un "debounce"
  const handleFechaChange = (date) => {
    setFecha(date);
    setBloque("");
    setFechaSeleccionadaPorUsuario(true); // ✅ activamos el "modo usuario"
    onChange({ fecha: date.toISOString(), bloque: "" });
  };
  

  const handleBloqueChange = (event) => {
    setBloque(event.target.value);
    onChange({ fecha, bloque: event.target.value });
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Selecciona la fecha y bloque de tu agendamiento
      </Typography>

      <FormItem label="Fecha">
        <DatePicker
          selected={fecha}
          onChange={handleFechaChange}
          dateFormat="yyyy-MM-dd"
          minDate={new Date()}
        />
      </FormItem>

      <FormItem label="Bloque horario">
      <FormControl fullWidth variant="outlined" size="small" sx={{ mb: 2 }}>
  <InputLabel id="bloque-label">Bloque horario</InputLabel>
  <Select
    labelId="bloque-label"
    value={bloque}
    onChange={handleBloqueChange}
    label="Bloque horario"
  >
    {bloquesDisponibles.map((bloque) => (
      <MenuItem key={bloque} value={bloque}>
        {bloque}
      </MenuItem>
    ))}
  </Select>
</FormControl>

</FormItem>


      <Box mt={3} display="flex" justifyContent="space-between">
        <Button variant="outlined" onClick={onAnterior}>
          Atrás
        </Button>
        <Button
        onClick={onSiguiente}
        disabled={!bloque || bloquesDisponibles.length === 0}
>
       Siguiente
        </Button>
      </Box>
    </Box>
  );
}

export default FechaAgendamiento;
