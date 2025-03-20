import React, { useState, useEffect } from 'react';
import { TextField, Button, Select, MenuItem, InputLabel, FormControl, RadioGroup, FormControlLabel, Radio } from '@mui/material';

function DatosCliente({ datos, onChange, onSiguiente, onAnterior }) {
  const [tipoCliente, setTipoCliente] = useState(datos?.tipoCliente || '');
  const [nombre, setNombre] = useState(datos?.nombre || '');
  const [email, setEmail] = useState(datos?.email || '');
  const [telefono, setTelefono] = useState(datos?.telefono || '');
  const [rut, setRut] = useState(datos?.rut || '');
  const [direccion, setDireccion] = useState(datos?.direccion || '');
  const [region, setRegion] = useState(datos?.region || '');
  const [comuna, setComuna] = useState(datos?.comuna || '');
  const [inspeccion, setInspeccion] = useState(datos?.inspeccion || 'no');

  const tiposCliente = [
    { value: 'Persona', label: 'Persona' },
    { value: 'Empresa', label: 'Empresa' },
  ];

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
    onChange({
      ...datos,
      tipoCliente,
      nombre,
      email,
      telefono,
      rut,
      direccion,
      region,
      comuna,
      inspeccion,
    });
  }, [tipoCliente, nombre, email, telefono, rut, direccion, region, comuna, inspeccion, datos]);

  const handleTipoClienteChange = (e) => {
    setTipoCliente(e.target.value);
  };

  const handleNombreChange = (e) => {
    setNombre(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleTelefonoChange = (e) => {
    setTelefono(e.target.value);
  };

  const handleRutChange = (e) => {
    setRut(e.target.value);
  };

  const handleDireccionChange = (e) => {
    setDireccion(e.target.value);
  };

  const handleRegionChange = (e) => {
    setRegion(e.target.value);
    setComuna(''); // Reset comuna when region changes
  };

  const handleComunaChange = (e) => {
    setComuna(e.target.value);
  };

  const handleInspeccionChange = (e) => {
    setInspeccion(e.target.value);
  };

  return (
    <div>
      <FormControl fullWidth>
        <InputLabel id="tipo-cliente-label">Tipo de Cliente</InputLabel>
        <Select labelId="tipo-cliente-label" id="tipo-cliente" value={tipoCliente} label="Tipo de Cliente" onChange={handleTipoClienteChange}>
          {tiposCliente.map((tipo) => (
            <MenuItem key={tipo.value} value={tipo.value}>
              {tipo.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField label="Nombre" value={nombre} onChange={handleNombreChange} fullWidth />
      <TextField label="Email" value={email} onChange={handleEmailChange} fullWidth />
      <TextField label="Teléfono" value={telefono} onChange={handleTelefonoChange} fullWidth />
      <TextField label="RUT" value={rut} onChange={handleRutChange} fullWidth />
      <TextField label="Dirección" value={direccion} onChange={handleDireccionChange} fullWidth />
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
      <FormControl fullWidth>
        <InputLabel id="comuna-label">Comuna</InputLabel>
        <Select labelId="comuna-label" id="comuna" value={comuna} onChange={handleComunaChange}>
          {comunas[region]?.map((comuna) => (
            <MenuItem key={comuna.value} value={comuna.value}>
              {comuna.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl component="fieldset">
        <RadioGroup row aria-label="inspeccion" name="inspeccion" value={inspeccion} onChange={handleInspeccionChange}>
          <FormControlLabel value="si" control={<Radio />} label="Sí" />
          <FormControlLabel value="no" control={<Radio />} label="No" />
        </RadioGroup>
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

export default DatosCliente;