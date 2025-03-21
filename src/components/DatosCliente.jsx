import React, { useState, useEffect } from 'react';
import { TextField, Box, FormControl, InputLabel, Select, MenuItem, Typography, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import FormItem from './FormItem';

function DatosCliente({ datos, onChange, onSiguiente, onAnterior }) {
  const [nombre, setNombre] = useState(datos?.nombre || '');
  const [apellido, setApellido] = useState(datos?.apellido || '');
  const [email, setEmail] = useState(datos?.email || '');
  const [telefono, setTelefono] = useState(datos?.telefono || '');
  const [rut, setRut] = useState(datos?.rut || '');
  const [direccion, setDireccion] = useState(datos?.direccion || '');
  const [region, setRegion] = useState(datos?.region || '');
  const [comuna, setComuna] = useState(datos?.comuna || '');
  const [presente, setPresente] = useState(datos?.presente || '');

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
    // Agrega las comunas para las otras regiones aquí
  };

  useEffect(() => {
    onChange({ nombre, apellido, email, telefono, rut, direccion, region, comuna, presente });
  }, [nombre, apellido, email, telefono, rut, direccion, region, comuna, presente, onChange]);

  const handleRegionChange = (e) => {
    setRegion(e.target.value);
    setComuna(''); // Reset comuna when region changes
  };

  const handlePresenteChange = (e) => {
    setPresente(e.target.value);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <FormItem>
        <TextField label="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} fullWidth />
      </FormItem>
      <FormItem>
        <TextField label="Apellido" value={apellido} onChange={(e) => setApellido(e.target.value)} fullWidth />
      </FormItem>
      <FormItem>
        <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth />
      </FormItem>
      <FormItem>
        <TextField label="Teléfono" value={telefono} onChange={(e) => setTelefono(e.target.value)} fullWidth />
      </FormItem>
      <FormItem>
        <TextField label="RUT" value={rut} onChange={(e) => setRut(e.target.value)} fullWidth />
      </FormItem>
      <FormItem>
        <TextField label="Dirección" value={direccion} onChange={(e) => setDireccion(e.target.value)} fullWidth />
      </FormItem>
      <FormItem>
        <FormControl fullWidth>
          <InputLabel id="region-label">Región</InputLabel>
          <Select labelId="region-label" id="region" value={region} label="Región" onChange={handleRegionChange}>
            {regiones.map((region) => (
              <MenuItem key={region.value} value={region.value}>
                {region.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </FormItem>
      <FormItem>
        <FormControl fullWidth>
          <InputLabel id="comuna-label">Comuna</InputLabel>
          <Select labelId="comuna-label" id="comuna" value={comuna} label="Comuna" onChange={(e) => setComuna(e.target.value)}>
            {comunas[region]?.map((comuna) => (
              <MenuItem key={comuna.value} value={comuna.value}>
                {comuna.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </FormItem>
      <FormItem>
        <FormControl component="fieldset">
          <RadioGroup row value={presente} onChange={handlePresenteChange}>
            <FormControlLabel value="si" control={<Radio />} label="Sí" />
            <FormControlLabel value="no" control={<Radio />} label="No" />
          </RadioGroup>
        </FormControl>
      </FormItem>
      {presente === 'si' && (
        <Typography variant="body1" sx={{ backgroundColor: '#dff0d8', color: '#3c763d', padding: 1, borderRadius: 1 }}>
          Perfecto, el inspector se comunicará cuando llegue al lugar de la revisión.
        </Typography>
      )}
      {presente === 'no' && (
        <Typography variant="body1" sx={{ backgroundColor: '#f2dede', color: '#a94442', padding: 1, borderRadius: 1 }}>
          No hay problema, el inspector se comunicará con el vendedor cuando llegue al lugar.
        </Typography>
      )}
    </Box>
  );
}

export default DatosCliente;