import React, { useState, useEffect } from "react";
import { Button, Select, MenuItem, InputLabel, FormControl, Typography, Box } from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import FormItem from "./FormItem";

function FechaAgendamiento({ datos, onChange, onSiguiente, onAnterior }) {
  const [fecha, setFecha] = useState(datos?.fecha ? new Date(datos.fecha) : new Date());
  const [bloque, setBloque] = useState(datos?.bloque || "");

  const bloques = [
    { value: "AM", label: "8:00 - 14:00 AM" },
    { value: "PM", label: "14:00 - 20:00 PM" },
  ];

  
  // Sincronizar cambios si `datos` cambia (por ejemplo, si se confirma el agendamiento)
  useEffect(() => {
    if (datos?.fecha) {
      setFecha(new Date(datos.fecha));
    }
    if (datos?.bloque) {
      setBloque(datos.bloque);
    }
  }, [datos]);

  const handleFechaChange = (date) => {
    setFecha(date);
    onChange({ fecha: date.toISOString(), bloque }); // Guardar en formato válido
  };

  const handleBloqueChange = (event) => {
    setBloque(event.target.value);
    onChange({ fecha, bloque: event.target.value });
  };

  return (
    <Box sx={{ width: "100%" }}>
      <FormItem>
        <Typography variant="body1" sx={{ mb: 2, backgroundColor: "#f0f0f0", padding: 1, borderRadius: 1 }}>
          Seleccionar la fecha para la cita
        </Typography>
        <FormControl fullWidth>
          <DatePicker
            selected={fecha}
            onChange={handleFechaChange}
            customInput={<Button variant="outlined" fullWidth>{fecha.toLocaleDateString()}</Button>}
          />
        </FormControl>
      </FormItem>
      <Typography variant="body1" sx={{ mb: 2, backgroundColor: "#f0f0f0", padding: 1, borderRadius: 1 }}>
        Seleccionar si la visita la quieres en horario mañana o tarde
      </Typography>
      <FormItem>
        <FormControl fullWidth>
          <InputLabel id="bloque-label">Bloque</InputLabel>
          <Select labelId="bloque-label" id="bloque" value={bloque} label="Bloque" onChange={handleBloqueChange}>
            {bloques.map((bloque) => (
              <MenuItem key={bloque.value} value={bloque.value}>
                {bloque.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </FormItem>
      <Typography
        variant="body1"
        sx={{ mt: 2, backgroundColor: "#c5d5e8", padding: 1, borderRadius: 1, textAlign: "center" }}
      >
        Recuerda que al pagar y finalizar el agendamiento te llegará una notificación y un ejecutivo se pondra en contacto con usted. Gracias por preferirnos.
      </Typography>
    </Box>
  );
}

export default FechaAgendamiento;
