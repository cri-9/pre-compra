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

  const handlePatenteChange = (event) => {
    let value = event.target.value.toUpperCase(); // Convertir a mayúsculas

    //Elimina cualquier carácter que no sea una letra o un numero
    value = value.replace(/[^A-Z0-9]/g, '');

    //Aplica el formato xxxx-nn
    if (value.length > 4) {
      value = `${value.substring(0, 4)}-${value.substring(4, 6)}`;
    } else if (value.length > 4 && value.length < 6) {
      value = `${value.substring(0, 4)}-${value.substring(4)}`;
    } else if (value.length > 0 && value.length <= 4) {
      // No agregar guion hasta que se ingresen 4 caracteres
    }
    setPatente(value);
  };
  const handleNumeroChange = (event) => {
    const inputValue = event.target.value;
    // Usamos una expresión regular para permitir solo dígitos (0-9)
    const numericValue = inputValue.replace(/[^0-9]/g, '');
    setNumero(numericValue);
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
        
      <TextField
  label="Año"
  variant="outlined"
  inputProps={{
    inputMode: "numeric",
    pattern: "[0-9]{4}",
    maxLength: 4
  }}
  onChange={(e) => {
    let value = e.target.value.replace(/\D/g, ""); // Elimina caracteres no numéricos
    if (value.length > 4) value = value.slice(0, 4); // Limita a 4 dígitos
    setAño(value); // ✅ Actualiza el estado 'año' con el valor modificado
  }}
  fullWidth
/>
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