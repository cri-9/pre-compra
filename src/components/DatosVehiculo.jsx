import React, { useState, useEffect } from 'react';
import { TextField, Select, MenuItem, InputLabel, FormControl, Box } from '@mui/material';
import FormItem from './FormItem';

function DatosVehiculo({ datos, onChange, onSiguiente }) {
  const [marca, setMarca] = useState(datos?.marca || '');
  const [modelo, setModelo] = useState(datos?.modelo || '');
  const [año, setAño] = useState(datos?.año || '');
  const [patente, setPatente] = useState(datos?.patente || '');

  const marcas = [
    { value: 'Toyota', label: 'Toyota' },
    { value: 'Honda', label: 'Honda' },
    // ... más marcas
  ];

  const modelos = {
    Toyota: [{ value: 'Corolla', label: 'Corolla' }],
    Honda: [{ value: 'Civic', label: 'Civic' }],
    // ... modelos por marca
  };

  useEffect(() => {
    const nuevosDatos = { marca, modelo, año, patente };
  
    // Compara solo si los valores realmente cambiaron antes de llamar a onChange
    if (JSON.stringify(nuevosDatos) !== JSON.stringify(datos)) {
      onChange(nuevosDatos);
    }
  }, [marca, modelo, año, patente]); // 🔥 NO INCLUYAS `onChange`
  
  const handleMarcaChange = (e) => {
    setMarca(e.target.value);
  };

  const handleModeloChange = (e) => {
    setModelo(e.target.value);
  };

  const handleAñoChange = (e) => {
    setAño(e.target.value);
  };

  const handlePatenteChange = (e) => {
    setPatente(e.target.value);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      <FormItem>
        <FormControl fullWidth>
          <InputLabel id="marca-label">Marca <span style={{ color: 'red' }}>*</span> 
          </InputLabel>
          <Select labelId="marca-label" id="marca" value={marca} label="Marca" onChange={handleMarcaChange}>
            {marcas.map((marca) => (
              <MenuItem key={marca.value} value={marca.value}>
                {marca.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </FormItem>
      <FormItem>
        <FormControl fullWidth>
          <InputLabel id="modelo-label">Modelo <span style={{ color: 'red' }}>*</span> 
          </InputLabel>
          <Select labelId="modelo-label" id="modelo" value={modelo} label="Modelo" onChange={handleModeloChange}>
            {modelos[marca]?.map((modelo) => (
              <MenuItem key={modelo.value} value={modelo.value}>
                {modelo.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </FormItem>
      <FormItem>
        <TextField label="Año" type="number" value={año} onChange={handleAñoChange} fullWidth />
      </FormItem>
      <FormItem>
        <TextField 
        label={ <span>
          Patente <span style={{ color: 'red' }}>*</span>
        </span>
        }
        value={patente} onChange={handlePatenteChange} fullWidth />
      </FormItem>
    </Box>
  );
}

export default DatosVehiculo;