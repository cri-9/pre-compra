import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, Button, TextField, Grid, MenuItem, Typography } from "@mui/material";

const Cotizacion = ({ open, handleClose }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    servicio: "",
    mensaje: "",
  });

  const servicios = [
    { value: "basico", label: "Inspección Básica - $30.000" },
    { value: "completo", label: "Inspección Completa - $45.000" },
    { value: "premium", label: "Inspección Premium - $60.000" },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Datos enviados:", formData);
    alert("Cotización enviada con éxito.");
    handleClose(); // Cierra el modal después del envío
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Solicita tu Cotización</DialogTitle>
      <DialogContent>
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
              <Button variant="contained" color="primary" type="submit" sx={{ px: 5, py: 1.5, fontSize: "1rem" }}>
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
