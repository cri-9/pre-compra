import React, { useState, useEffect } from 'react';
import { TextField, Select, MenuItem, InputLabel, FormControl, Box } from '@mui/material';
import marcasModelos from './marcasModelos.json';
import FormItem from './FormItem';
import axios from 'axios'; // Asegúrate de instalar axios: npm install axios

// Array con los años de 2025 al 1900 para el selector
const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => currentYear - i);

function DatosVehiculo({ datos, onChange, onSiguiente }) {
  const [marca, setMarca] = useState(datos?.marca || '');
  const [modelo, setModelo] = useState(datos?.modelo || '');
  const [año, setAño] = useState(datos?.año || '');
  const [patente, setPatente] = useState(datos?.patente || '');
const [patenteError, setPatenteError] = useState('');
  const [marcas, setMarcas] = useState([]); // Estado para las marcas
  const [modelos, setModelos] = useState([]); // Estado para los modelos

  // Obtener marcas de la API local del json
  useEffect(() => {
    const marcasData = Object.keys(marcasModelos).map((marca) => ({
      value: marca,
      label: marca,
    }));
    setMarcas(marcasData);
  }, []);

  const handleMarcaChange = (e) => {
    const selectedMarca = e.target.value;
    setMarca(selectedMarca);
    const modelosData = marcasModelos[selectedMarca].map((modelo) => ({
      value: modelo,
      label: modelo,
    }));
    setModelos(modelosData);
  };

  useEffect(() => {
    const nuevosDatos = { marca, modelo, año, patente };

    // Compara solo si los valores realmente cambiaron antes de llamar a onChange
    if (JSON.stringify(nuevosDatos) !== JSON.stringify(datos)) {
      onChange(nuevosDatos);
    }
  }, [marca, modelo, año, patente]); // 🔥 NO INCLUYAS `onChange`

  const handleModeloChange = (e) => {
    setModelo(e.target.value);
  };

  // Nuevo handler para <Select> año
  const handleAñoChange = (e) => {
    setAño(e.target.value);
  };

  const patenteRegex = /^[A-Z0-9]{4}-[A-Z0-9]{2}$/;
const handlePatenteChange = (event) => {
  let value = event.target.value.toUpperCase(); // Convertir a mayúsculas
  value = value.replace(/[^A-Z0-9]/g, ''); // Elimina caracteres no válidos
  if (value.length > 4) {
    value = `${value.substring(0, 4)}-${value.substring(4, 6)}`;
  }
  setPatente(value);
  // Validación en tiempo real
  if (value.length === 7 && !patenteRegex.test(value)) {
    setPatenteError('Formato incorrecto. Ejemplo: ABCD-12');
  } else {
    setPatenteError('');
  }
};

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      <FormItem>
        <FormControl fullWidth>
          <InputLabel id="marca-label">
            Marca <span style={{ color: 'red' }}>*</span>
          </InputLabel>
          <Select
            labelId="marca-label"
            id="marca"
            value={marca}
            label="Marca"
            onChange={handleMarcaChange}
          >
            {marcas.map((marca, idx) => (
  <MenuItem key={marca.value + '-' + idx} value={marca.value}>
    {marca.label}
  </MenuItem>
))}
          </Select>
        </FormControl>
      </FormItem>
      <FormItem>
        <FormControl fullWidth>
          <InputLabel id="modelo-label">
            Modelo <span style={{ color: 'red' }}>*</span>
          </InputLabel>
          <Select
            labelId="modelo-label"
            id="modelo"
            value={modelo}
            label="Modelo"
            onChange={handleModeloChange}
            disabled={!marca} // Deshabilitar si no hay una marca seleccionada
          >
            {modelos.map((modelo, idx) => (
  <MenuItem key={modelo.value + '-' + idx} value={modelo.value}>
    {modelo.label}
  </MenuItem>
))}
          </Select>
        </FormControl>
      </FormItem>
      {/* Selector de Año SOLO AÑO */}
      <FormItem>
        <FormControl fullWidth>
          <InputLabel id="año-label">
            Año <span style={{ color: 'red' }}>*</span>
          </InputLabel>
          <Select
            labelId="año-label"
            id="año"
            value={año}
            label="Año"
            onChange={handleAñoChange}
            MenuProps={{ style: { maxHeight: 300 } }} // Limita altura del menú
          >
            {years.map(function (year) {
                return (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                );
              })}
          </Select>
        </FormControl>
      </FormItem>
      <FormItem>
        <TextField
          label={
            <span>
              Patente <span style={{ color: 'red' }}>*</span>
            </span>
          }
          value={patente}
          onChange={handlePatenteChange}
          error={!!patenteError}
          helperText={patenteError || 'Formato: ABCD-12'}
          inputProps={{ maxLength: 7 }}
          fullWidth
        />
      </FormItem>
    </Box>
  );
}

export default DatosVehiculo;
