import React, { useState, useEffect } from 'react';
import { TextField, Select, MenuItem, InputLabel, FormControl, Box } from '@mui/material';
import marcasModelos from './marcasModelos.json';
import FormItem from './FormItem';
import axios from 'axios'; // Asegúrate de instalar axios: npm install axios

function DatosVehiculo({ datos, onChange, onSiguiente }) {
  const [marca, setMarca] = useState(datos?.marca || '');
  const [modelo, setModelo] = useState(datos?.modelo || '');
  const [año, setAño] = useState(datos?.año || '');
  const [patente, setPatente] = useState(datos?.patente || '');
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

  const handleAñoChange = (e) => {
    let value = e.target.value.replace(/\D/g, ''); // Elimina caracteres no numéricos
    if (value.length > 4) value = value.slice(0, 4); // Limita a 4 dígitos
    setAño(value);
  };

  const handlePatenteChange = (event) => {
    let value = event.target.value.toUpperCase(); // Convertir a mayúsculas
    value = value.replace(/[^A-Z0-9]/g, ''); // Elimina caracteres no válidos
    if (value.length > 4) {
      value = `${value.substring(0, 4)}-${value.substring(4, 6)}`;
    }
    setPatente(value);
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
            {modelos.map((modelo) => (
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
            inputMode: 'numeric',
            pattern: '[0-9]{4}',
            maxLength: 4,
          }}
          onChange={handleAñoChange}
          value={año}
          fullWidth
        />
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
          fullWidth
        />
      </FormItem>
    </Box>
  );
}

export default DatosVehiculo;