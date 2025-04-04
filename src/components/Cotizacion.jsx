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
    { value: "basico", label: "Servicio Escaner - $25.000" },
    { value: "completo", label: "Inspección Completa - $45.000" },
    { value: "premium", label: "Inspección Premium - $65.000" },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/enviarCorreo.php", formData);
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
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Nombre Completo" name="nombre" value={formData.nombre} onChange={handleChange} required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Correo Electrónico" name="email" type="email" value={formData.email} onChange={handleChange} required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Teléfono" name="telefono" type="tel" value={formData.telefono} onChange={handleChange} required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField select fullWidth label="Seleccione un Servicio" name="servicio" value={formData.servicio} onChange={handleChange} required>
                {servicios.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Mensaje (Opcional)" name="mensaje" multiline rows={4} value={formData.mensaje} onChange={handleChange} />
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

