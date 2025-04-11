import React, { useState } from 'react';
import { Box, Button, Step, StepLabel, Stepper, Typography, Paper, Container, AppBar, Toolbar, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DatosVehiculo from './DatosVehiculo';
import DatosCliente from './DatosCliente';
import DatosVendedor from './DatosVendedor';
import FechaAgendamiento from './FechaAgendamiento';
import Pago from './Pago';

const pasos = ["Datos del Vehiculo", "Datos del Cliente", "Datos del Vendedor", "Fecha de Agendamiento", "Pago"];

function FormularioContacto() {
  const navigate = useNavigate();
  const [pasoActual, setPasoActual] = useState(0);
  const [touched, setTouched] = useState(false);
  const [datos, setDatos] = useState({
    vehiculo: { marca: '', modelo: '', año: '', patente: '' },
    cliente: { nombre: '', apellido: '', email: '', telefono: '', rut: '', direccion: '', region: '', comuna: '' },
    vendedor: { tipovendedor: '', nombre: '', telefono: '', direccion: '', region: '', comuna: '' },
    agendamiento: { fecha: '', bloque: '' },
    pago: { metodo: '' },
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [missingFields, setMissingFields] = useState([]);
  const [openExito, setOpenExito] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDatosChange = (seccion, nuevosDatos) => {
    setDatos((prevDatos) => {
      const seccionActual = prevDatos[seccion];
      if (JSON.stringify(seccionActual) !== JSON.stringify(nuevosDatos)) {
        return { ...prevDatos, [seccion]: nuevosDatos };
      }
      return prevDatos;
    });
  };

  const camposPorPaso = {
    0: ["marca", "modelo", "año", "patente"],
    1: ["nombre", "apellido", "email", "telefono", "rut", "direccion", "region", "comuna"],
    2: ["tipovendedor", "nombre", "telefono", "direccion", "region", "comuna"],
    3: ["fecha", "bloque"],
    4: ["metodo"],
  };

  const validarFormulario = (stepIndex) => {
    const campos = camposPorPaso[stepIndex] || [];
    const currentData = datos[Object.keys(datos)[stepIndex]];
    const missing = campos.filter(field => !currentData[field]);
    setMissingFields(missing);
    return missing.length === 0;
  };

  const handleSiguiente = () => {
    setTouched(true);
    if (validarFormulario(pasoActual)) {
      setPasoActual((prev) => prev + 1);
      setOpenSnackbar(false);
    } else {
      setOpenSnackbar(true);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpenSnackbar(false);
    setOpenExito(false);
  };

  const iniciarWebPay = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/webpay.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos), // ✅ Corregido: "tusDatos" -> "datos"
      });
  
      const data = await response.json(); // ✅ Usa await en lugar de .then()
  
      if (data.success) {
        window.location.href = `${data.url}?token_ws=${data.token}`;
      } else {
        alert(data.error || 'Ocurrió un error');
      }
    } catch (err) {
      console.error('Error al iniciar WebPay:', err);
      alert('Error de conexión con WebPay');
    } finally {
      setLoading(false);
    }
  };
  

  const handleEnviarFormulario = async () => {
    if (validarFormulario(pasoActual)) {
      await iniciarWebPay();
      setOpenExito(true);
      resetearFormulario();
    } else {
      setOpenSnackbar(true);
    }
  };

  const resetearFormulario = () => {
    setDatos({
      vehiculo: { marca: '', modelo: '', año: '', patente: '' },
      cliente: { nombre: '', apellido: '', email: '', telefono: '', rut: '', direccion: '', region: '', comuna: '' },
      vendedor: { tipovendedor: '', nombre: '', telefono: '', direccion: '', region: '', comuna: '' },
      agendamiento: { fecha: '', bloque: '' },
      pago: { metodo: '' },
    });
    setPasoActual(0);
  };

  const handleVolverInicio = () => {
    try {
      navigate('/');
    } catch (error) {
      console.error('Error al navegar a la página de inicio:', error);
    }
  };

  return (
    <Container sx={{ p: { xs: 2, sm: 3, md: 4 }, borderRadius: 3, backgroundColor: '#f0f0f0', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <AppBar position="static" sx={{ backgroundColor: '#1565c0', mb: { xs: 3, sm: 4, md: 6 }, width: '100%', alignItems: 'center' }}>
        <Toolbar sx={{ width: '100%', maxWidth: 800 }}>
          <Typography variant="h5" sx={{ flexGrow: 1, color: '#fff', p: { xs: 2, sm: 3 }, textAlign: 'center', fontSize: { xs: '1.2rem', sm: '1.5rem', md: '2rem' } }}>
            Formulario de Contacto
          </Typography>
        </Toolbar>
      </AppBar>
      <Box sx={{ width: '100%', maxWidth: 800, display: 'flex', flexDirection: 'column', alignItems: 'center', px: { xs: 1, sm: 2 } }}>
        <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, width: '100%' }}>
          <Stepper activeStep={pasoActual} alternativeLabel sx={{ mb: 4, display: { xs: 'none', md: 'flex' } }}>
            {pasos.map((label, index) => (
              <Step key={index} completed={pasoActual > index}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', alignItems: 'center', gap: 2, mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              {pasos.slice(0, 3).map((label, index) => (
                <Step key={index} completed={pasoActual > index}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              {pasos.slice(3).map((label, index) => (
                <Step key={index + 3} completed={pasoActual > index + 3}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Box>
          </Box>
          <Box sx={{ p: 2 }}>
            {pasoActual === 0 && <DatosVehiculo datos={datos.vehiculo} onChange={(data) => handleDatosChange('vehiculo', data)} />}
            {pasoActual === 1 && <DatosCliente datos={datos.cliente} onChange={(data) => handleDatosChange('cliente', data)} />}
            {pasoActual === 2 && <DatosVendedor datos={datos.vendedor} onChange={(data) => handleDatosChange('vendedor', data)} />}
            {pasoActual === 3 && <FechaAgendamiento datos={datos.agendamiento} onChange={(data) => handleDatosChange('agendamiento', data)} />}
            {pasoActual === 4 && <Pago datos={datos.pago} onChange={(data) => handleDatosChange('pago', data)} />}
          </Box>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'center', mt: 4, gap: 2 }}>
            {pasoActual > 0 && (
              <Button fullWidth variant="contained" color="secondary" onClick={() => setPasoActual((prev) => prev - 1)}>
                Atrás
              </Button>
            )}
            {pasoActual < pasos.length - 1 ? (
              <Button fullWidth variant="contained" color="secondary" onClick={handleSiguiente}>
                Siguiente
              </Button>
            ) : (
              <Button fullWidth variant="contained" color="success" onClick={handleEnviarFormulario}>
                Finalizar
              </Button>
            )}
          </Box>
        </Paper>
      </Box>
      <Button variant="outlined" color="primary" sx={{ mt: 4, textTransform: 'none', fontSize: { xs: '14px', sm: '16px' }, px: { xs: 2, sm: 4 } }} onClick={handleVolverInicio}>
        Volver a Inicio
      </Button>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="error">
          Por favor, complete los siguientes campos:
          <ul>
            {missingFields.map((field, index) => (
              <li key={index}>{field}</li>
            ))}
          </ul>
        </Alert>
      </Snackbar>
      <Snackbar open={openExito} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="success">
          ¡Formulario enviado exitosamente!
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default FormularioContacto;