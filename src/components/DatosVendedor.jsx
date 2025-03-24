import React, { useState, useEffect } from 'react';
import { TextField, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import FormItem from './FormItem';

function DatosVendedor({ datos, onChange, onSiguiente, onAnterior }) {
  const [tipoVendedor, setTipoVendedor] = useState(datos?.tipoVendedor || '');
  const [nombreVendedor, setNombreVendedor] = useState(datos?.nombreVendedor || '');
  const [telefonoVendedor, setTelefonoVendedor] = useState(datos?.telefonoVendedor || '');
  const [direccionVendedor, setDireccionVendedor] = useState(datos?.direccionVendedor || '');
  const [regionVendedor, setRegionVendedor] = useState(datos?.regionVendedor || '');
  const [comunaVendedor, setComunaVendedor] = useState(datos?.comunaVendedor || '');

  const tiposVendedor = [
    { value: 'Particular', label: 'Particular' },
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
      tipoVendedor,
      nombreVendedor,
      telefonoVendedor,
      direccionVendedor,
      regionVendedor,
      comunaVendedor,
    });
  }, [tipoVendedor, nombreVendedor, telefonoVendedor, direccionVendedor, regionVendedor, comunaVendedor, datos, onChange]);

  const handleTipoVendedorChange = (e) => {
    setTipoVendedor(e.target.value);
  };

  const handleNombreVendedorChange = (e) => {
    setNombreVendedor(e.target.value);
  };

  const handleTelefonoVendedorChange = (e) => {
    setTelefonoVendedor(e.target.value);
  };

  const handleDireccionVendedorChange = (e) => {
    setDireccionVendedor(e.target.value);
  };

  const handleRegionVendedorChange = (e) => {
    setRegionVendedor(e.target.value);
    setComunaVendedor(''); // Reset comuna when region changes
  };

  const handleComunaVendedorChange = (e) => {
    setComunaVendedor(e.target.value);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <FormItem>
        <FormControl fullWidth>
          <InputLabel id="tipo-vendedor-label">Tipo de Vendedor <span style={{ color: 'red' }}>*</span>
          </InputLabel>
          <Select labelId="tipo-vendedor-label" id="tipo-vendedor" value={tipoVendedor} label="Tipo de Vendedor" onChange={handleTipoVendedorChange}>
            {tiposVendedor.map((tipo) => (
              <MenuItem key={tipo.value} value={tipo.value}>
                {tipo.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </FormItem>
      <FormItem>
        <TextField label={
          <span>Nombre Vendedor
            <span style={{ color: 'red' }}>*</span>
          </span>
        } 
        value={nombreVendedor} onChange={handleNombreVendedorChange} fullWidth />
      </FormItem>
      <FormItem>
        <TextField label={
          <span>Telefono Vendedor
            <span style={{ color: 'red' }}>*</span>
            </span>
        } 
        value={telefonoVendedor} onChange={handleTelefonoVendedorChange} fullWidth />
      </FormItem>
      <FormItem>
        <TextField label={
          <span>Direccion Vendedor
            <span style={{ color: 'red' }}>*</span>
            </span>
        } 
        value={direccionVendedor} onChange={handleDireccionVendedorChange} fullWidth />
      </FormItem>
      <FormItem>
        <FormControl fullWidth>
          <InputLabel id="region-vendedor-label">Región Vendedor <span style={{ color: 'red'}}>*</span>
          </InputLabel>
          <Select labelId="region-vendedor-label" id="region-vendedor" value={regionVendedor} label="Región Vendedor" onChange={handleRegionVendedorChange}>
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
          <InputLabel id="comuna-vendedor-label">Comuna Vendedor<span style={{ color: 'red'}}>*</span>
          </InputLabel>
          <Select labelId="comuna-vendedor-label" id="comuna-vendedor" value={comunaVendedor} label="Comuna Vendedor" onChange={handleComunaVendedorChange}>
            {comunas[regionVendedor]?.map((comuna) => (
              <MenuItem key={comuna.value} value={comuna.value}>
                {comuna.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </FormItem>
    </Box>
  );
}

export default DatosVendedor;