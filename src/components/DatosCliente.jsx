import React, { useState, useEffect } from 'react';
import { TextField, Box, FormControl, InputLabel, Select, MenuItem, Typography, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import FormItem from './FormItem';

function DatosCliente({ datos, onChange }) {
  const [nombre, setNombre] = useState(datos?.nombre || '');
  const [apellido, setApellido] = useState(datos?.apellido || '');
  const [email, setEmail] = useState(datos?.email || '');
  const [suggestions, setSuggestions] = useState([]);
  const [telefono, setTelefono] = useState(() => {
    const initialTelefono = datos?.telefono || '';
    if (initialTelefono && /^\d+$/.test(initialTelefono)) {
      return '+56' + initialTelefono.slice(0, 9);
    }
    return '';
  });
  const maximoDigitos = 9;
  const prefijo = '+56';
  const [rut, setRut] = useState(datos?.rut || '');
  const [direccion, setDireccion] = useState(datos?.direccion || '');
  const [region, setRegion] = useState(datos?.region || '');
  const [comuna, setComuna] = useState(datos?.comuna || '');
  const [presente, setPresente] = useState(datos?.presente || '');
  const [rutError, setRutError] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [touched, setTouched] = useState({});

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
    onChange({ nombre, apellido, email, telefono, rut, direccion, region, comuna, presente });
  }, [nombre, apellido, email, telefono, rut, direccion, region, comuna, presente, onChange]);

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };
//formato celular 
const handleTelefonoChange = (event) => {
  let inputValue = event.target.value.replace(/\D/g, ''); // Eliminar todo lo que no sea número

  // Eliminar prefijo si ya existe y el usuario intenta escribirlo
  if (inputValue.startsWith('56')) {
    inputValue = inputValue.slice(2);
  }

  // Limitar a 9 dígitos después del prefijo
  const numerosLimitados = inputValue.slice(0, maximoDigitos);

  // Actualizar el estado con el prefijo fijo
  setTelefono(prefijo + numerosLimitados);
};
//FIn Configuración de celular

//Con Email segú extención
const emailDomains = ["gmail.com", "hotmail.com", "yahoo.com", "outlook.com"];

  const handleChange = (e) => {
    let value = e.target.value;
    setEmail(value);

    // Mostrar sugerencias si el usuario escribe "@"
    if (value.includes("@")) {
      const [localPart, domainPart] = value.split("@");
      setSuggestions(
        emailDomains
          .filter((domain) => domain.startsWith(domainPart))
          .map((domain) => `${localPart}@${domain}`)
      );
    } else {
      setSuggestions([]);
    }
  };

  const handleRegionChange = (e) => {
    setRegion(e.target.value);
    setComuna(''); // Reset comuna when region changes
  };

  const handlePresenteChange = (e) => {
    setPresente(e.target.value);
  };
//Inicio conf Rut
  const handleRutChange = (e) => {
    const newRut = e.target.value.replace(/\./g, '').replace(/-/g, ''); // Quita puntos y guión
    setRut(newRut);

    if (validateRut(newRut)) {
      setRutError('');
    } else {
      setRutError('RUT inválido');
    }
  };

  const validateRut = (rut) => {
    rut = rut.replace(/\./g, '').replace(/-/g, '');
    if (rut.length < 8) return false;

    const dv = rut.slice(-1).toUpperCase();
    const cuerpo = rut.slice(0, -1);

    let suma = 0;
    let multiplo = 2;
    for (let i = cuerpo.length - 1; i >= 0; i--) {
      suma += multiplo * parseInt(cuerpo.charAt(i), 10);
      multiplo = multiplo < 7 ? multiplo + 1 : 2;
    }

    const dvEsperado = 11 - (suma % 11);
    const dvCalculado = dvEsperado === 11 ? '0' : dvEsperado === 10 ? 'K' : dvEsperado.toString();

    return dv === dvCalculado;
  };
// Fin conf Rut

  return (
    <Box sx={{ width: '100%' }}>
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
      <FormItem>
        <TextField
          label="Apellido Cliente *"
          value={apellido}
          onChange={(e) => setApellido(e.target.value)}
          onBlur={() => handleBlur('apellido')}
          error={touched.apellido && !apellido}
          helperText={touched.apellido && !apellido ? 'Campo obligatorio' : ''}
          fullWidth
        />
      </FormItem>
      <FormItem>
        <TextField
          label="Correo Electrónico *"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => handleBlur('email')}
          error={touched.email && !email}
          helperText={touched.email && !email ? 'Campo obligatorio' : ''}
          fullWidth
        />
      </FormItem>
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
      <FormItem>
        <TextField
          label="Rut *"
          value={rut}
          onChange={handleRutChange}
          onBlur={() => handleBlur('rut')}
          error={touched.rut && (!rut || rutError)}
          helperText={touched.rut && (!rut ? 'Campo obligatorio' : rutError)}
          fullWidth
        />
      </FormItem>
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
              <MenuItem key={region.value} value={region.value}>
                {region.label}
              </MenuItem>
            ))}
          </Select>
          {touched.region && !region && <Typography color="error" variant="caption">Campo obligatorio</Typography>}
        </FormControl>
      </FormItem>
      <FormItem>
        <FormControl fullWidth error={touched.comuna && !comuna}>
          <InputLabel id="comuna-label">Comuna</InputLabel>
          <Select
            labelId="comuna-label"
            id="comuna"
            value={comuna}
            label="Comuna"
            onChange={(e) => setComuna(e.target.value)}
            onBlur={() => handleBlur('comuna')}
          >
            {comunas[region]?.map((comuna) => (
              <MenuItem key={comuna.value} value={comuna.value}>
                {comuna.label}
              </MenuItem>
            ))}
          </Select>
          {touched.comuna && !comuna && <Typography color="error" variant="caption">Campo obligatorio</Typography>}
        </FormControl>
      </FormItem>
      <FormItem>
        <FormControl component="fieldset" sx={{ textAlign: 'center' }}>
          ¿Estarás presente en la inspección?
          <RadioGroup row value={presente} onChange={handlePresenteChange} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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