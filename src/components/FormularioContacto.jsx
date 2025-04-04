import React, { useState } from 'react';
import { Box, Button, Step, StepLabel, Stepper, Typography, Paper, Container, AppBar, Toolbar, Snackbar, Alert } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DatosVehiculo from './DatosVehiculo';
import DatosCliente from './DatosCliente';
import DatosVendedor from './DatosVendedor';
import FechaAgendamiento from './FechaAgendamiento';
import Pago from './Pago';
import { useNavigate } from 'react-router-dom'; // Importa useNavegador

const pasos = ["Datos del Vehículo", "Datos del Cliente", "Datos del Vendedor", "Fecha de Agendamiento", "Pago"];

function FormularioContacto() {
  const navigate = useNavigate(); // Hook para la navegacion
  const [pasoActual, setPasoActual] = useState(0);
  const [touched, setTouched] = useState(false);
  const [datos, setDatos] = useState({
    vehiculo: { marca: '', modelo: '', año: '', patente: '' }, // Incluye "patente"
    cliente: { nombre: '', apellido: '', email: '', telefono: '', rut: '', dirección: '', región: '' },
    vendedor: { tipovendedor: '', nombre: '', telefono: '' , direccion: '', region: '' , comuna: ''},
    agendamiento: { fecha: '', bloque: '' },
    pago: { metodo: '' },
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [missingFields, setMissingFields] = useState([]);
  const [openExito, setOpenExito] = useState(false);

  // ✅ Evita ciclo infinito: Solo actualiza si los datos han cambiado
  const handleDatosChange = (seccion, nuevosDatos) => {
    setDatos((prevDatos) => {
      if (JSON.stringify(prevDatos[seccion]) !== JSON.stringify(nuevosDatos)) {
        return { ...prevDatos, [seccion]: nuevosDatos };
      }
      return prevDatos;
    });
  };
  
  // Validar formulario antes de avanzar
  const validarFormulario = (stepIndex) => {
    let fieldsToCheck = [];
    let currentData = {};

    switch (stepIndex) {
      case 0: // Datos del Vehículo
        fieldsToCheck = ["marca", "modelo", "año", "patente"]; // Incluye "patente"
        currentData = datos.vehiculo;
        break;
      case 1: // Datos del Cliente
        fieldsToCheck = ["nombre", "apellido", "email", "telefono", "rut", "direccion", "region",];
        currentData = datos.cliente;
        break;
      case 2: // Datos del Vendedor
        fieldsToCheck = ["tipovendedor", "nombre", "telefono", "direccion", "region", "comuna"];
        currentData = datos.vendedor;
        break;
      case 3: // Fecha de Agendamiento
        fieldsToCheck = ["fecha", "bloque"];
        currentData = datos.agendamiento;
        break;
      case 4: // Pago
        fieldsToCheck = ["metodo"];
        currentData = datos.pago;
        break;
      default:
        return true;
    }

    const missing = fieldsToCheck.filter(field => !currentData[field]);
    setMissingFields(missing);
    return missing.length === 0;
  };

  // Manejar el botón siguiente
  const handleSiguiente = () => {
    setTouched(true);
    if (validarFormulario(pasoActual)) {
      setPasoActual((prev) => prev + 1);
      setOpenSnackbar(false); // Cierra el Snackbar si la validación pasa
    } else {
      setOpenSnackbar(true); // Muestra el Snackbar si hay campos faltantes
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };
  //Funcion para enviar JSON: 
  const handleEnviarFormulario = async () => {
    try {
      const response = await fetch('http://localhost:8000/enviarCorreo.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos),
      });
  
      const resultado = await response.json();
  
      if (resultado.success) {
        setOpenExito(true);       // ✅ Muestra mensaje de éxito
        resetearFormulario();     // 🧼 Limpia los datos
      } else {
        alert('❌ Error al enviar: ' + resultado.error);
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      alert('❌ Error en la conexión con el servidor.');
    }
  };
  //Resetear el formulario cuando se enviar correctamente y mostrar un mensaje de éxito animado usando Snackbar de MUI

  const resetearFormulario = () => {
    setDatos({
      vehiculo: { marca: '', modelo: '', año: '', patente: '' },
      cliente: { nombre: '', apellido: '', email: '', telefono: '', rut: '', dirección: '', región: '' },
      vendedor: { tipovendedor: '', nombre: '', telefono: '' , direccion: '', region: '' , comuna: ''},
      agendamiento: { fecha: '', bloque: '' },
      pago: { metodo: '' },
    });
    setPasoActual(0);
  };

  return (
    <Container
    elevation={3}
    sx={{
      p: 3,
      borderRadius: 3,
      backgroundColor: '#f0f0f0',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      
    }}
  >
    {/* Contenedor interno para AppBar y Paper */}
    
      {/* Barra de navegación */}
      <AppBar position="static" sx={{ 
        backgroundColor: '#1565c0', 
        mb: 6, 
        width: '85%' , 
        display: '100%', 
        alignItems: 'center'}}> {/* width 100% en AppBar */}
        <Toolbar sx={{ width: '100%', maxWidth: 800 }}>
          <Typography variant="h5" sx={{ flexGrow: 1, color: '#fff', p: 3, textAlign: 'center' }}>
            Formulario de Contacto
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Contenedor del formulario */}
      <Box sx={{ width: '100%', 
        maxWidth: 800,
        display: 'flex', flexDirection: 'column', alignItems: 'center' }}> {/* aseguramos alineación con la barra  */}
        <Paper elevation={3} sx={{ p: 3, borderRadius: 3, width: '100%' }}>
          <Stepper activeStep={pasoActual} sx={{ mb: 4 }}>
            {pasos.map((label, index) => (
              <Step key={index} completed={pasoActual > index}>
                <StepLabel
                  StepIconComponent={(props) =>
                    props.completed ? (
                      <CheckCircleIcon sx={{ color: 'lightgreen' }} />
                    ) : (
                      <Typography fontSize={18} fontWeight="bold">
                        {props.icon}
                      </Typography>
                    )
                  }
                >
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Renderizar el componente del paso actual */}
          <Box sx={{ p: 2 }}>
            {pasoActual === 0 &&
              <DatosVehiculo datos={datos.vehiculo} onChange={(data) => handleDatosChange('vehiculo', data)} />}
            {pasoActual === 1 &&
              <DatosCliente datos={datos.cliente} onChange={(data) => handleDatosChange('cliente', data)} touched={touched} setTouched={setTouched} />}
            {pasoActual === 2 &&
              <DatosVendedor datos={datos.vendedor} onChange={(data) => handleDatosChange('vendedor', data)} />}
            {pasoActual === 3 &&
              <FechaAgendamiento datos={datos.agendamiento} onChange={(data) => handleDatosChange('agendamiento', data)} />}
            {pasoActual === 4 &&
              <Pago datos={datos.pago} onChange={(data) => handleDatosChange('pago', data)} />}
          </Box>

          {/* Botones de navegación */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            {pasoActual > 0 && (
              <Button variant="contained" color="secondary" onClick={() => setPasoActual((prev) => prev - 1)}>
                Atrás
              </Button>
            )}
            {pasoActual < pasos.length - 1 ? (
              <Button variant="contained" color="secondary" onClick={handleSiguiente}>
                Siguiente
              </Button>
            ) : (
              <Button variant="contained" color="success" onClick={handleEnviarFormulario}>
  Finalizar
</Button>
            )}
          </Box>
        </Paper>
      </Box>
      
      {/* Botón para volver a la Landing Page */}
      <Button
        variant="outlined"
        color="primary"
        sx={{ mt: 4, textTransform: 'none', fontSize: 16 }}
        onClick={() => navigate('/')} // Redirigir a la Landing Page
      >
        Volver a Inicio
      </Button>

      
      {/* Snackbar para mostrar el mensaje de error */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%', backgroundColor: 'white', color: 'black', border: '1px solid black' }}>
          <Typography variant="body1" color="black">
            Por favor, complete los siguientes campos:
          </Typography>
          <ul>
            {missingFields.map((field, index) => (
              <li key={index} style={{ color: 'black' }}>{field}</li>
            ))}
          </ul>
        </Alert>
      </Snackbar>
      {/* Snackbar para mostrar el mensaje de éxito */}
  <Snackbar
  open={openExito}
  autoHideDuration={6000}
  onClose={() => setOpenExito(false)}
  anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
>
  <Alert
    onClose={() => setOpenExito(false)}
    severity="success"
    sx={{ width: '100%', backgroundColor: 'white', color: 'green', border: '1px solid green' }}
  >
    ¡Formulario enviado exitosamente!
  </Alert>
</Snackbar>
    </Container>
  );
}

export default FormularioContacto;