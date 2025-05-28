import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  TextField,
  Grid,
  MenuItem,
  Typography,
  InputAdornment,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
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
    { value: "basico", label: "Servicio Escaner - $30.000" },
    { value: "completo", label: "Inspección Completa - $45.000" },
    { value: "premium", label: "Inspección Premium - $65.000" },
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
      ...formData,
      telefono: "+56" + formData.telefono,
      servicio: servicioSeleccionado
        ? servicioSeleccionado.label
        : "Servicio desconocido",
    };

    setLoading(true);
    setMensajeEnviado(null);

    try {
      const response = await axios.post(
        "http://localhost/pre-compra/Backend/enviarCotizacion.php",
        datosParaEnviar
      );
      if (response.data.success) {
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
        // Opcional: cerrar el diálogo tras unos segundos
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





