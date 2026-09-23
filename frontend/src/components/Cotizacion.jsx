import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useState } from "react";
import { API_URLS } from '../config/api';

import axios from "axios";

const Cotizacion = ({ open, handleClose }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    servicio: "",
    mensaje: "",
  });
  const [mensajeEnviado, setMensajeEnviado] = useState(null);
  const [errores, setErrores] = useState({});
  const [loading, setLoading] = useState(false);

  const servicios = [
    { value: "segunda_llave",
      text: "Segunda llave",
      label: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ 
          color: '#7D1EA2', 
          fontWeight: '600', 
          fontSize: '16px' 
        }}>
          Segunda llave
        </span>
      </div>
    ) 
  },
    { value: "duplicacion_llave",
      text: "Duplicación de llave",
      label: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ 
          color: '#7D1EA2', 
          fontWeight: '600', 
          fontSize: '16px' 
        }}>
          Duplicación de llave
        </span>
      </div>
    ) 
  },
    { value: "clonacion_transponder",
      text: "Clonación de transponder",
      label: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ 
          color: '#7D1EA2', 
          fontWeight: '600', 
          fontSize: '16px' 
        }}>
          Clonación de transponder
        </span>
      </div>
    ) 
  },
    { value: "smart_key",
      text: "Smart Key",
      label: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ 
          color: '#7D1EA2', 
          fontWeight: '600', 
          fontSize: '16px' 
        }}>
          Smart Key
        </span>
      </div>
    ) 
  },
    { value: "control_remoto",
      text: "Control remoto",
      label: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ 
          color: '#7D1EA2', 
          fontWeight: '600', 
          fontSize: '16px' 
        }}>
          Control remoto
        </span>
      </div>
    ) 
  },
    { value: "programacion_immo_obd",
      text: "Programación IMMO / OBD",
      label: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ 
          color: '#7D1EA2', 
          fontWeight: '600', 
          fontSize: '16px' 
        }}>
          Programación IMMO / OBD
        </span>
      </div>
    ) 
  },
    { value: "inmovilizador",
      text: "Inmovilizador",
      label: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ 
          color: '#7D1EA2', 
          fontWeight: '600', 
          fontSize: '16px' 
        }}>
          Inmovilizador
        </span>
      </div>
    ) 
  },
    { value: "diagnostico_electronico",
      text: "Diagnóstico electrónico",
      label: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ 
          color: '#7D1EA2', 
          fontWeight: '600', 
          fontSize: '16px' 
        }}>
          Diagnóstico electrónico
        </span>
      </div>
    ) 
  },
    { value: "all_keys_lost",
      text: "All Keys Lost",
      label: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ 
          color: '#7D1EA2', 
          fontWeight: '600', 
          fontSize: '16px' 
        }}>
          All Keys Lost
        </span>
      </div>
    ) 
  },
    { value: "recuperacion_llave_usada",
      text: "Recuperación de llave usada",
      label: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ 
          color: '#7D1EA2', 
          fontWeight: '600', 
          fontSize: '16px' 
        }}>
          Recuperación de llave usada
        </span>
      </div>
    ) 
  },
    { value: "otro",
      text: "Otro",
      label: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ 
          color: '#7D1EA2', 
          fontWeight: '600', 
          fontSize: '16px' 
        }}>
          Otro
        </span>
      </div>
    ) 
  },
    { value: "completo",
      text: "Inspección pre-compra",
      label: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ 
          color: '#4F46E5', 
          fontWeight: '600', 
          fontSize: '16px' 
        }}>
          Inspección pre-compra
        </span>
      </div>
    ) 
  },
    { value: "tpms",
      text: "Activación TPMS",
      label: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ 
          color: '#4F46E5', 
          fontWeight: '600', 
          fontSize: '16px' 
        }}>
          Activación TPMS
        </span>
      </div>
    ) 
  },    
    { value: "escaner",
      text: "Escáner Profesional",
      label: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ 
          color: '#4F46E5', 
          fontWeight: '600', 
          fontSize: '16px' 
        }}>
          Escáner Profesional
        </span>
      </div>
    ) 
  },
    { value: "regeneracion_dpf",
      text: "Regeneración DPF",
      label: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ 
          color: '#4F46E5', 
          fontWeight: '600', 
          fontSize: '16px' 
        }}>
          Regeneración DPF
        </span>
      </div>
    ) 
  },
    
    
    { value: "consulta_general",
      text: "Consulta General",
      label: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ 
          color: '#4F46E5', 
          fontWeight: '600', 
          fontSize: '16px' 
        }}>
          Consulta General
        </span>
      </div>
    ) 
  },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Solo permitir números en el campo teléfono
    if (name === "telefono") {
      if (!/^\d*$/.test(value)) return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!formData.nombre.trim()) {
      nuevosErrores.nombre = "El nombre es obligatorio.";
    }

    if (!formData.email.trim()) {
      nuevosErrores.email = "El correo es obligatorio.";
    }

    if (!formData.telefono.trim()) {
      nuevosErrores.telefono = "El teléfono es obligatorio.";
    } else if (!/^\d{9}$/.test(formData.telefono)) {
      nuevosErrores.telefono = "Debe tener exactamente 9 dígitos.";
    }

    if (!formData.servicio) {
      nuevosErrores.servicio = "Selecciona un servicio.";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) return;

    const servicioSeleccionado = servicios.find(
      (serv) => serv.value === formData.servicio
    );

    const datosParaEnviar = {
      ruta: "enviarCotizacion",
      ...formData,
      telefono: "+56" + formData.telefono,
      servicio: servicioSeleccionado
        ? servicioSeleccionado.text
        : "Servicio desconocido",
    };

    setLoading(true);
    setMensajeEnviado(null);

    try {
      // Enviar como FormData para máxima compatibilidad con PHP
      const form = new FormData();
      Object.entries(datosParaEnviar).forEach(([key, value]) => {
        form.append(key, value);
      });

      const response = await axios.post(
        API_URLS.ENVIAR_COTIZACION,
        form,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      console.log(response); // Para depuración

      if (response.data.success) {
        // Evento GA4 para envío de cotización exitoso
        if (window.gtag) {
          window.gtag('event', 'envio_cotizacion', {
            event_category: 'Formulario',
            event_label: 'Formulario de Cotización',
            servicio_seleccionado: formData.servicio,
            value: 1
          });
        }
        
        // Evento Meta Pixel para lead/cotización enviada
        if (window.fbq) {
          window.fbq('track', 'Lead', {
            content_name: 'Cotización Enviada',
            content_category: servicioSeleccionado ? servicioSeleccionado.label : 'Unknown Service'
          });
        }

        setMensajeEnviado({
          tipo: "success",
          texto: response.data.message || "Cotización enviada con éxito.",
        });
        setFormData({
          nombre: "",
          email: "",
          telefono: "",
          servicio: "",
          mensaje: "",
        });
        setErrores({});
        setTimeout(() => {
          handleClose();
          setMensajeEnviado(null);
        }, 2500);
      } else {
        setMensajeEnviado({
          tipo: "error",
          texto: response.data.error || "Error al enviar la cotización.",
        });
      }
    } catch (error) {
      console.log(error); // Para depuración
      setMensajeEnviado({
        tipo: "error",
        texto: "Error en la conexión con el servidor.",
      });
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Solicita tu Cotización</DialogTitle>
      <DialogContent>
        {loading && (
          <Box display="flex" alignItems="center" justifyContent="center" my={2}>
            <CircularProgress color="secondary" size={28} sx={{ mr: 2 }} />
            <Typography color="secondary">Enviando solicitud...</Typography>
          </Box>
        )}
        {mensajeEnviado && (
          <Alert
            severity={mensajeEnviado.tipo}
            sx={{
              mb: 2,
              fontWeight: "bold",
              fontSize: "1.1em",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            <span dangerouslySetInnerHTML={{ __html: mensajeEnviado.texto }} />
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nombre Completo"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                error={!!errores.nombre}
                helperText={errores.nombre}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Correo Electrónico"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={!!errores.email}
                helperText={errores.email}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Teléfono"
                name="telefono"
                type="tel"
                value={formData.telefono}
                onChange={handleChange}
                inputProps={{ maxLength: 9 }}
                error={!!errores.telefono}
                helperText={errores.telefono || "Ej: 912345678 (sin +56)"}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">+56</InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={7}>
              <TextField
                select
                fullWidth
                label="Seleccione un Servicio"
                name="servicio"
                value={formData.servicio}
                onChange={handleChange}
                error={!!errores.servicio}
                helperText={errores.servicio}
                required
              >
                {servicios.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Mensaje (Opcional)"
                name="mensaje"
                multiline
                rows={4}
                value={formData.mensaje}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sx={{ textAlign: "center", mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                sx={{
                  backgroundColor: "#7B1FA2",
                  px: 5,
                  py: 1.5,
                  fontSize: "1rem",
                  "&:hover": {
                    backgroundColor: "#ffb64d", // <--- Aquí defines el color de hover
                  },
                }}
                disabled={loading}
              >
                Enviar Cotización
              </Button>             
            </Grid>
          </Grid>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default Cotizacion;
