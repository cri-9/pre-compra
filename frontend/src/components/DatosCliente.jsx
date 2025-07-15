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
    if (initialTelefono && initialTelefono.startsWith('+56') && initialTelefono.length >= 3) {
      return initialTelefono;
    }
    if (initialTelefono && /^\d+$/.test(initialTelefono)) {
      return '+56' + initialTelefono.slice(0, 9);
    }
    return '';
  });

  // Sincroniza el estado local si cambia el prop datos.telefono
  useEffect(() => {
    if (datos?.telefono && datos.telefono !== telefono) {
      if (datos.telefono.startsWith('+56') && datos.telefono.length >= 3) {
        setTelefono(datos.telefono);
      } else if (/^\d+$/.test(datos.telefono)) {
        setTelefono('+56' + datos.telefono.slice(0, 9));
      } else {
        setTelefono('');
      }
    }
    // Solo sincroniza si cambia datos.telefono
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [datos?.telefono]);
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

  // Handlers que actualizan estado y notifican al padre
  const handleNombreChange = (e) => {
    setNombre(e.target.value);
    onChange({ ...datos, nombre: e.target.value });
  };
  const handleApellidoChange = (e) => {
    setApellido(e.target.value);
    onChange({ ...datos, apellido: e.target.value });
  };
  const handleEmailChange = (e) => {
    let value = e.target.value;
    setEmail(value);
    onChange({ ...datos, email: value });
    // Sugerencias
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
  const handleTelefonoChange = (event) => {
    let inputValue = event.target.value.replace(/\D/g, '');
    if (inputValue.startsWith('56')) {
      inputValue = inputValue.slice(2);
    }
    const numerosLimitados = inputValue.slice(0, maximoDigitos);
    const nuevoTelefono = prefijo + numerosLimitados;
    setTelefono(nuevoTelefono);
    onChange({ ...datos, telefono: nuevoTelefono });
  };
  // Formatea el RUT en vivo y restringe caracteres
  const formatRut = (value) => {
    // Solo permite números y K/k
    let rut = value.replace(/[^0-9kK]/g, '').toUpperCase();
    if (rut.length === 0) return '';
    // Separa cuerpo y dígito verificador
    let cuerpo = rut.slice(0, -1);
    let dv = rut.slice(-1);
    // Agrega puntos cada 3 dígitos desde la derecha
    let cuerpoFormateado = '';
    for (let i = cuerpo.length; i > 0; i -= 3) {
      let start = Math.max(i - 3, 0);
      let part = cuerpo.substring(start, i);
      cuerpoFormateado = part + (cuerpoFormateado ? '.' + cuerpoFormateado : '');
    }
    return cuerpoFormateado + (cuerpoFormateado ? '-' : '') + dv;
  };

  const handleRutChange = (e) => {
    let input = e.target.value;
    // Elimina todo menos números y K/k
    let cleanRut = input.replace(/[^0-9kK]/g, '').toUpperCase();
    // Limita a 8 dígitos + 1 dv
    if (cleanRut.length > 9) cleanRut = cleanRut.slice(0, 9);
    // Formatea para mostrar
    let formatted = formatRut(cleanRut);
    setRut(formatted);
    // Para validación y envío, quitar puntos y guion
    let rutSinFormato = cleanRut;
    onChange({ ...datos, rut: rutSinFormato });
    if (validateRut(rutSinFormato)) {
      setRutError('');
    } else {
      setRutError('RUT inválido');
    }
  };
  const handleDireccionChange = (e) => {
    setDireccion(e.target.value);
    onChange({ ...datos, direccion: e.target.value });
  };
  const handleRegionChange = (e) => {
    setRegion(e.target.value);
    setComuna('');
    onChange({ ...datos, region: e.target.value, comuna: '' });
  };
  const handleComunaChange = (e) => {
    setComuna(e.target.value);
    onChange({ ...datos, comuna: e.target.value });
  };
  const handlePresenteChange = (e) => {
    setPresente(e.target.value);
    onChange({ ...datos, presente: e.target.value });
  };

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
    onChange({ nombre, apellido, email, telefono, rut, direccion, region, comuna, presente });
  }, [nombre, apellido, email, telefono, rut, direccion, region, comuna, presente, onChange]);

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };
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
    onChange={(e) => {
      const value = e.target.value;
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
    }}
    onBlur={() => handleBlur('email')}
    error={touched.email && (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))} // Validación de formato
    helperText={
      touched.email && (!email ? 'Campo obligatorio' : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? 'Formato inválido' : '')
    }
    fullWidth
  />
  {/* Mostrar sugerencias */}
  {suggestions.length > 0 && (
    <Box sx={{ border: '1px solid #ccc', borderRadius: 1, mt: 1, backgroundColor: '#fff' }}>
      {suggestions.map((suggestion, index) => (
        <Typography
          key={index}
          sx={{
            padding: 1,
            cursor: 'pointer',
            '&:hover': { backgroundColor: '#f0f0f0' },
          }}
          onClick={() => {
            setEmail(suggestion); // Seleccionar sugerencia
            setSuggestions([]); // Limpiar sugerencias
          }}
        >
          {suggestion}
        </Typography>
      ))}
    </Box>
  )}
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
          error={touched.rut && (!rut || !!rutError)}
          helperText={touched.rut && (!rut ? 'Campo obligatorio' : rutError)}
          fullWidth
          inputProps={{ maxLength: 12, inputMode: 'text', pattern: '[0-9kK.-]*', autoComplete: 'off' }}
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
            onBlur={() => handleBlur('comuna')}
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
        <Typography variant="body1" sx={{ fontWeight: 'bold', backgroundColor: '#f7dc6f', color: '#85929e', padding: 1, borderRadius: 1 }}>
          Perfecto, nuestro técnico se comunicará cuando llegue al lugar de la revisión.
        </Typography>
      )}
      {presente === 'no' && (
        <Typography variant="body1" sx={{ fontWeight: 'bold', backgroundColor: '#f2dede', color: '#a94442', padding: 1, borderRadius: 1 }}>
          No hay problema, nuestro técnico se comunicará con el vendedor cuando llegue al lugar.
        </Typography>
      )}
    </Box>
  );
}

export default DatosCliente;