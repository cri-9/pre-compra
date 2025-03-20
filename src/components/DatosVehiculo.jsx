import React, { useState, useEffect } from 'react';
import { TextField, Button, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { styled } from '@mui/material/styles';

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
    onChange({ marca, modelo, año, patente });
  }, [marca, modelo, año, patente, onChange]);

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
    <div>
      <FormControl fullWidth>
        <InputLabel id="marca-label">Marca</InputLabel>
        <Select labelId="marca-label" id="marca" value={marca} label="Marca" onChange={handleMarcaChange}>
          {marcas.map((marca) => (
            <MenuItem key={marca.value} value={marca.value}>
              {marca.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel id="modelo-label">Modelo</InputLabel>
        <Select labelId="modelo-label" id="modelo" value={modelo} label="Modelo" onChange={handleModeloChange}>
          {modelos[marca]?.map((modelo) => (
            <MenuItem key={modelo.value} value={modelo.value}>
              {modelo.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField label="Año" type="number" value={año} onChange={handleAñoChange} fullWidth />
      <TextField label="Patente" value={patente} onChange={handlePatenteChange} fullWidth />
      
      <Button variant="contained" style={{ backgroundColor: '#007bff', color: '#fff', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer' }} onClick={onSiguiente}>
    Continuar
</Button>
    </div>
  );
}

export default DatosVehiculo; // Asegúrate de que esta línea esté al nivel superior de los componentes