import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio'

import FormItem from './FormItem';

function DatosVendedor({ datos, onChange }) {
  const [tipovendedor, setTipoVendedor] = useState(datos?.tipovendedor || '');
  const [nombre, setNombre] = useState(datos?.nombre || '');
  const [telefono, setTelefono] = useState(() => {
      const initialTelefono = datos?.telefono || '';
      if (initialTelefono && initialTelefono.startsWith('+56') && initialTelefono.length >= 3) {
        return initialTelefono;
      }
      if (initialTelefono && /^\d+$/.test(initialTelefono)) {
        return '+56' + initialTelefono.slice(0, 9);
      }
      return '';
    });
    
   
  const [direccion, setDireccion] = useState(datos?.direccion || '');
  const [region, setRegion] = useState(datos?.region || '');
  const [comuna, setComuna] = useState(datos?.comuna || '');
  const [touched, setTouched] = useState({});

  const regiones = [  
  { value: 'V', label: 'Región de Valparaíso' },
  { value: 'RM', label: 'Región Metropolitana de Santiago' },
  { value: 'VI', label: 'Región del Libertador General Bernardo O’Higgins' },
  { value: 'VII', label: 'Región del Maule' },
  { value: 'XVI', label: 'Región de Ñuble' },
  { value: 'VIII', label: 'Región del Biobío' },
  { value: 'IX', label: 'Región de La Araucanía' },
  { value: 'XIV', label: 'Región de Los Ríos' },
  { value: 'X', label: 'Región de Los Lagos' },  
];

  const comunas = {
    IX: [
      { value: "Temuco", label: "Temuco" },
      { value: "Padre Las Casas", label: "Padre Las Casas" },
      { value: "Lautaro", label: "Lautaro" },
      { value: "Perquenco", label: "Perquenco" },
      { value: "Freire", label: "Freire" },
      { value: "Pucon", label: "Pucon" },
      { value: "Villarrica", label: "Villarrica" },
      { value: "Galvarino", label: "Galvarino" },      
      { value: "Victoria", label: "Victoria" },
      { value: "Nueva Imperial", label: "Nueva Imperial" },
      { value: "Gorbea", label: "Gorbea" },     
    ],
  };

  useEffect(() => {
    onChange({ tipovendedor, nombre, telefono, direccion, region, comuna });
  }, [tipovendedor, nombre, telefono, direccion, region, comuna, onChange]);

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  //formato celular 
  const prefijo = "+56";
  const maximoDigitos = 9;
  
  const handleTelefonoChange = (event) => {
    let inputValue = event.target.value.replace(/\D/g, ''); // Elimina todo lo que no sea número
  
    // Si el número empieza con 56, lo eliminamos
    if (inputValue.startsWith("56")) {
      inputValue = inputValue.slice(2);
    }
  
    // Limitamos a 9 dígitos
    const numerosLimitados = inputValue.slice(0, maximoDigitos);
  
    // Actualizamos el estado con el prefijo fijo
    setTelefono(prefijo + numerosLimitados);
  };

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

      { /* Estilo Nombre */}
      <FormItem>
        <TextField
          label="Nombre Cliente *"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          onBlur={() => handleBlur('nombre')}
          error={touched.nombre && !nombre} // Solo muestra error si el campo ha sido tocado y está vacío
          helperText={touched.nombre && !nombre ? 'Campo obligatorio' : ''}
          fullWidth
        />
      </FormItem>

      { /* Estilo Telefono */}
      <FormItem>
        <TextField
          label="Teléfono"
          value={telefono}
          onChange={handleTelefonoChange}
          fullWidth
          inputProps={{
            maxLength: prefijo.length + maximoDigitos, // Limitar la longitud total en el input
        }}
      />
    </FormItem>

    { /* Estilo Dirección */}
      <FormItem>
        <TextField
          label="Dirección"
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
          onBlur={() => handleBlur('direccion')}
          error={touched.direccion && !direccion}
          helperText={touched.direccion && !direccion ? 'Campo obligatorio' : ''}
          fullWidth
        />
      </FormItem>
      
      {/*Estilo Lista de Regiones*/}
      <FormItem>
        <FormControl fullWidth error={touched.region && !region}>
          <InputLabel id="region-label">Región</InputLabel>
          <Select
            labelId="region-label"
            id="region"
            value={region}
            label="Región"
            onChange={handleRegionChange}
            onBlur={() => handleBlur('region')}
          >
            {regiones.map((region) => (
          <MenuItem
          key={region.value}
          value={region.value}
          sx={region.value === 'IX' ? { color: 'purple', fontWeight: 'bold' } : {}} // Cambia el color y el peso de la fuente para la región IX
          >
          {region.label}
          </MenuItem>
            ))}
          </Select>
          {touched.region && !region && <Typography color="error" variant="caption">Campo obligatorio</Typography>}
        </FormControl>
      </FormItem>

      {/*Estilo Lista de Comunas*/}
      <FormItem>
      <FormControl fullWidth error={touched.comuna && !comuna}>
        <InputLabel id="comuna-label">Comuna</InputLabel>
        <Select
          labelId="comuna-label"
          id="comuna"
          value={comuna}
          label="Comuna"
          onChange={(e) => setComuna(e.target.value)}
          onBlur={() => handleBlur('comuna')} // Forzar el foco fuera del menú
        >         
          {comunas[region]?.map((comuna) => (
            <MenuItem 
            key={comuna.value} 
            value={comuna.value}
            sx={comuna.value === 'Temuco' ? { color: 'purple', fontWeight: 'bold' } : {}} // Cambia el color y el peso de la fuente para la comuna "Temuco"
            >
              {comuna.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      </FormItem>

      {/* Alerta de recargo para comunas específicas de la Región IX */}
      {region === 'IX' && [
        "Pucon", "Villarrica", "Villarrica", "Galvarino", "Victoria", "Nueva Imperial", "Gorbea"
      ].includes(comuna) && (
        <Box sx={{ 
            my: 2,
            backgroundColor: '#f7dc6f',
            color: '#b2babb',
            padding: 1,
            borderRadius: 1,
            textAlign: 'center'
            }}>
          <strong style={{ color: '#5D6D7E' }}>
            Recuerde: El cliente deberá pagar un recargo extra de 15.000 CLP por la comuna seleccionada.
          </strong>
        </Box>
      )}

    </Box>
  );
}

export default DatosVendedor;