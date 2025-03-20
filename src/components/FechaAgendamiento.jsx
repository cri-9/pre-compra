import React, { useState} from "react";
import { Button, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function FechaAgendamiento({onChange, onSiguiente, onAnterior}) {
    const [fecha, setFecha] = useState(new Date());
    const [bloque, setBloque] = useState('');

    const bloques = [
        { value: ' AM ', label: '8:00 - 14:00 AM' },
        { value: 'PM', label: '14:00 - 20:00 PM' },
    ]; 

    const handleFechaChange = (date) => {
        setFecha(date);
        onChange({ fecha: date, bloque });
    };

    const handleBloqueChange = (selectedOption) => {
        setBloque(selectedOption.value);
        onChange({ fecha, bloque: selectedOption.value });
    };

    return (
        <div>
          <DatePicker selected={fecha} onChange={handleFechaChange} />
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
          <Button variant="contained" onClick={onAnterior}>
            Anterior

          </Button>

          <Button variant="contained" onClick={onSiguiente}>
            Continuar
          </Button>
        </div>
      );
    }
    
    export default FechaAgendamiento;