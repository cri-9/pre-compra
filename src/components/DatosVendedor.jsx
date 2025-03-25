import React, { useState, useEffect } from 'react';
import { TextField, Box, FormControl, InputLabel, Select, MenuItem, Typography } from '@mui/material';

function DatosVendedor({ datos, onChange }) {
  const [tipovendedor, setTipoVendedor] = useState(datos?.tipovendedor || '');
  const [nombre, setNombre] = useState(datos?.nombre || '');
  const [telefono, setTelefono] = useState(datos?.telefono || '');
  const [direccion, setDireccion] = useState(datos?.direccion || '');
  const [region, setRegion] = useState(datos?.region || '');
  const [comuna, setComuna] = useState(datos?.comuna || '');

  const regiones = [
    { value: 'RM', label: 'Región Metropolitana' },
    { value: 'V', label: 'Valparaíso' },
    { value: 'I', label: 'O’Higgins' },
    { value: 'VI', label: 'Maule' },
    { value: 'VII', label: 'Biobío' },
    { value: 'VIII', label: 'Araucanía' },
    { value: 'IX', label: 'Los Ríos' },
    { value: 'X', label: 'Los Lagos' },
    { value: 'XI', label: 'Aysén' },
    { value: 'XII', label: 'Magallanes' },
    { value: 'XIV', label: 'Los Ríos' },
    { value: 'XV', label: 'Arica y Parinacota' },
  ];

  const comunas = {
    VIII: [
      { value: "Temuco", label: "Temuco" },
      { value: "Padre Las Casas", label: "Padre Las Casas" },
      { value: "Pucon", label: "Pucon" },
      { value: "Villarrica", label: "Villarrica" },
      { value: "Galvarino", label: "Galvarino" },
      { value: "Lautaro", label: "Lautaro" },
      { value: "Perquenco", label: "Perquenco" },
      { value: "Cunco", label: "Cunco" },
      { value: "Victoria", label: "Victoria" },
      { value: "Carahue", label: "Carahue" },
      { value: "Freire", label: "Freire" },
      { value: "Nueva Imperial", label: "Nueva Imperial" },
      { value: "Gorbea", label: "Gorbea" },
      { value: "Melipeuco", label: "Melipeuco" },
    ],
  };

  useEffect(() => {
    onChange({ tipovendedor, nombre, telefono, direccion, region, comuna });
  }, [tipovendedor, nombre, telefono, direccion, region, comuna, onChange]);

  const handleRegionChange = (e) => {
    setRegion(e.target.value);
    setComuna(''); // Reset comuna when region changes
  };

  return (
    <Box sx={{ width: '100%' }}>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="tipovendedor-label">Tipo de Vendedor</InputLabel>
        <Select
          labelId="tipovendedor-label"
          id="tipovendedor"
          value={tipovendedor}
          onChange={(e) => setTipoVendedor(e.target.value)}
          onClose={() => document.activeElement.blur()} // Forzar el foco fuera del menú
        >
          <MenuItem value="particular">Particular</MenuItem>
          <MenuItem value="empresa">Empresa</MenuItem>
        </Select>
      </FormControl>
      <TextField
        label="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        label="Teléfono"
        value={telefono}
        onChange={(e) => setTelefono(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        label="Dirección"
        value={direccion}
        onChange={(e) => setDireccion(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="region-label">Región</InputLabel>
        <Select
          labelId="region-label"
          id="region"
          value={region}
          onChange={handleRegionChange}
          onClose={() => document.activeElement.blur()} // Forzar el foco fuera del menú
        >
          {regiones.map((region) => (
            <MenuItem key={region.value} value={region.value}>
              {region.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel id="comuna-label">Comuna</InputLabel>
        <Select
          labelId="comuna-label"
          id="comuna"
          value={comuna}
          onChange={(e) => setComuna(e.target.value)}
          onClose={() => document.activeElement.blur()} // Forzar el foco fuera del menú
        >
          {comunas[region]?.map((comuna) => (
            <MenuItem key={comuna.value} value={comuna.value}>
              {comuna.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}

export default DatosVendedor;