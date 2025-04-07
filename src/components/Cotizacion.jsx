import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, Button, TextField, Grid, MenuItem, Typography } from "@mui/material";
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

  const servicios = [
    { value: "basico", label: "Servicio Escaner - $30.000" },
    { value: "completo", label: "Inspección Completa - $45.000" },
    { value: "premium", label: "Inspección Premium - $65.000" },
  ];

  // Función para manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convertir el "value" del servicio a su "label"
    const servicioSeleccionado = servicios.find(
      (serv) => serv.value === formData.servicio
    );

    const datosParaEnviar = {
      ...formData,
      servicio: servicioSeleccionado ? servicioSeleccionado.label : "Servicio desconocido",
    };

    try {
      const response = await axios.post("http://localhost:8000/enviarCotizacion.php", datosParaEnviar);
      if (response.data.success) {
        setMensajeEnviado("Cotización enviada con éxito.");
        setFormData({ nombre: "", email: "", telefono: "", servicio: "", mensaje: "" });
        handleClose();
      } else {
        setMensajeEnviado("Error al enviar la cotización.");
      }
    } catch (error) {
      setMensajeEnviado("Error en la conexión con el servidor.");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Solicita tu Cotización</DialogTitle>
      <DialogContent>
        {mensajeEnviado && <Typography>{mensajeEnviado}</Typography>}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} sx={{ p: 2 }}>
            {/* Campo Nombre */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nombre Completo"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
            </Grid>

            {/* Campo Email */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Correo Electrónico"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Grid>

            {/* Campo Teléfono */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Teléfono"
                name="telefono"
                type="tel"
                value={formData.telefono}
                onChange={handleChange}
                required
              />
            </Grid>

            {/* Campo Servicio */}
            <Grid item xs={12} sm={7}>
              <TextField
                select
                fullWidth
                label="Seleccione un Servicio"
                name="servicio"
                value={formData.servicio}
                onChange={handleChange}
                required
              >
                {servicios.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Campo Mensaje */}
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
              <Button variant="contained" color="primary" type="submit" sx={{ backgroundColor: '#7B1FA2' , px: 5, py: 1.5, fontSize: "1rem" }}>
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

