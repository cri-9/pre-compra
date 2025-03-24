import React, { useState } from 'react';
import { Box, Button, Step, StepLabel, Stepper, Grid, Container, Paper, AppBar, Toolbar, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // Ícono de check
import DatosVehiculo from './DatosVehiculo';
import DatosCliente from './DatosCliente';
import DatosVendedor from './DatosVendedor';
import FechaAgendamiento from './FechaAgendamiento';
import FormItem from './FormItem';
import Pago from './Pago';

const pasos = ["Datos del Vehículo", "Datos del Cliente", "Datos del Vendedor", "Fecha de Agendamiento", "Pago"];

function FormularioContacto() {
  const [pasoActual, setPasoActual] = useState(0);
  const [datos, setDatos] = useState({
    vehiculo: {},
    cliente: {},
    vendedor: {},
    agendamiento: {},
    pago: {},
  });
  const [error, setError] = useState('');

  const handleSiguientePaso = () => setPasoActual((prev) => prev + 1);
  const handlePasoAnterior = () => setPasoActual((prev) => prev - 1);
  const handleDatosChange = (seccion, nuevosDatos) => {
    setDatos((prevDatos) => {

      const handleSiguiente = () => {
        setTouched(true); // Activa el estado de validación
        if (validateForm()) {
          handleSiguientePaso();
        }
      };
      // Compara los datos previos con los nuevos antes de actualizar
      if (JSON.stringify(prevDatos[seccion]) !== JSON.stringify(nuevosDatos)) {
        return { ...prevDatos, [seccion]: nuevosDatos };
      }
      return prevDatos;
    });
  };
  

  // Personalizar el ícono del Stepper para que muestre un check cuando se complete el paso
  const StepIconComponent = ({ active, completed, icon }) => (
    completed ? <CheckCircleIcon sx={{ color: 'lightgreen' }} fontSize="large" /> : <Typography fontSize={20} fontWeight="bold">{icon}</Typography>
  );

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: '#333', width: '100%' }}>
        <Toolbar>
          <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
            Formulario de Contacto
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <Box sx={{ width: '100%' }}>
          <Stepper activeStep={pasoActual} alternativeLabel sx={{ mb: 4 }}>
            {pasos.map((label, index) => (
              <Step key={index} completed={pasoActual > index}>
                <StepLabel StepIconComponent={(props) => <StepIconComponent {...props} icon={index + 1} />}>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {error && (
            <Typography variant="body2" color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}

          <Paper elevation={3} sx={{ p: 5, borderRadius: 3, minHeight: '500px', width: '100%' }}>
            <Grid container spacing={3}>
              {pasoActual === 0 && (
                <DatosVehiculo
                  datos={datos.vehiculo}
                  onChange={(nuevosDatos) => handleDatosChange('vehiculo', nuevosDatos)}
                  onSiguiente={handleSiguientePaso}
                />
              )}
              {pasoActual === 1 && (
                <DatosCliente
                  datos={datos.cliente}
                  onChange={(nuevosDatos) => handleDatosChange('cliente', nuevosDatos)}
                  onSiguiente={handleSiguientePaso}
                  onAnterior={handlePasoAnterior}
                  setError={setError}
                />
              )}
              {pasoActual === 2 && (
                <DatosVendedor
                  datos={datos.vendedor}
                  onChange={(nuevosDatos) => handleDatosChange('vendedor', nuevosDatos)}
                  onSiguiente={handleSiguientePaso}
                  onAnterior={handlePasoAnterior}
                />
              )}
              {pasoActual === 3 && (
                <FechaAgendamiento
                  datos={datos.agendamiento}
                  onChange={(nuevosDatos) => handleDatosChange('agendamiento', nuevosDatos)}
                  onSiguiente={handleSiguientePaso}
                  onAnterior={handlePasoAnterior}
                />
              )}
              {pasoActual === 4 && (
                <Pago datos={datos.pago} onAnterior={handlePasoAnterior} />
              )}
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              {pasoActual > 0 && (
                <Button variant="outlined" onClick={handlePasoAnterior}>
                  Anterior
                </Button>
              )}
              {pasoActual < pasos.length - 1 ? (
                <Button variant="contained" onClick={handleSiguientePaso}>
                  Siguiente
                </Button>
              ) : (
                <Button variant="contained" color="success">
                  Finalizar
                </Button>
              )}
            </Box>
          </Paper>
        </Box>
      </Container>
    </>
  );
}

export default FormularioContacto;