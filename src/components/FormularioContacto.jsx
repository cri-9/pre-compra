import React, { useState } from 'react';
import { Box, Button, Step, StepLabel, Stepper, Typography, Paper, Container, AppBar, Toolbar, Snackbar, Alert } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DatosVehiculo from './DatosVehiculo';
import DatosCliente from './DatosCliente';
import DatosVendedor from './DatosVendedor';
import FechaAgendamiento from './FechaAgendamiento';
import Pago from './Pago';
import { useNavigate } from 'react-router-dom'; // Importa useNavegador

const pasos = ["Datos del Vehiculo", "Datos del Cliente", "Datos del Vendedor", "Fecha de Agendamiento", "Pago"];

function FormularioContacto() {
  const navigate = useNavigate(); // Hook para la navegacion
  const [pasoActual, setPasoActual] = useState(0);
  const [touched, setTouched] = useState(false);
  const [datos, setDatos] = useState({
    vehiculo: { marca: '', modelo: '', año: '', patente: '' }, // Incluye "patente"
    cliente: { nombre: '', apellido: '', email: '', telefono: '', rut: '', direccion: '', region: '', comuna: '' },
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
        fieldsToCheck = ["nombre", "apellido", "email", "telefono", "rut", "direccion", "region", "comuna"];
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
      const response = await fetch('http://localhost:8000/enviarCorreo', { // Cambia aquí
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos),
      });
  
      const resultado = await response.json();
  
      if (resultado.success) {
        setOpenExito(true);
        resetearFormulario();
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
      cliente: { nombre: '', apellido: '', email: '', telefono: '', rut: '', direccion: '', region: '' , comuna: '' },
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
      p: { xs: 2, sm: 3, md: 4 }, // Padding responsivo
      p: 3, // Padding general
      borderRadius: 3, // Bordes redondeados
      backgroundColor: '#f0f0f0', // Color de fondo
      width: '100%', // Ancho completo
      display: 'flex', //
      flexDirection: 'column', // Alineación vertical
      alignItems: 'center', // Alineación horizontal
      justifyContent: 'center', // // Justificación vertical
      minHeight: '100vh',// // Altura mínima para ocupar toda la pantalla      
    }}
  >
    {/* Contenedor interno para AppBar y Paper */}
    
      {/* Barra de navegación */}
      <AppBar position="static" sx={{ 
        backgroundColor: '#1565c0', // // Color de fondo
        mb: { xs: 3, sm: 4, md: 6 }, // Margen inferior        
        width: '100%' ,// Ancho completo        
        alignItems: 'center'}}> {/* width 100% en AppBar */}

        <Toolbar sx={{ width: '100%', maxWidth: 800 }}> {/* Alineación horizontal */}
          <Typography variant="h5"  // Título de la barra de navegación
          sx={{ 
            flexGrow: 1, // Ocupa el espacio restante
            color: '#fff', // Color del texto 
            p: { xs: 2, sm: 3 }, // Padding responsivo
            textAlign: 'center' , // Alineación centrada
            fontSize: { xs: '1.2rem', sm: '1.5rem', md: '2rem' }, // Tamaño de fuente responsivo
            }}
            >
            Formulario de Contacto
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Contenedor del formulario */}
      <Box sx={{ 
        width: '100%', // Ancho completo
        maxWidth: 800, // Ancho máximo
        display: 'flex',  // Alineación horizontal
        flexDirection: 'column',  // Alineación vertical
        alignItems: 'center' , // Alineación horizontal
        px: { xs: 1, sm: 2 }, // Padding responsivo
        }}
        > 
        {/* aseguramos alineación con la barra  */}
        <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, width: '100%' }}> {/* Ancho completo */}
          {/* Stepper visual organizado en dos filas */}
         {/* Vista normal para pantallas grandes */}
<Stepper activeStep={pasoActual} alternativeLabel sx={{ mb: 4, display: { xs: 'none', md: 'flex' } }}>
  {pasos.map((label, index) => (
    <Step key={index} completed={pasoActual > index}>
      <StepLabel>{label}</StepLabel>
    </Step>
  ))}
</Stepper>

{/* Vista para móviles (pasos en 2 filas) */}
<Box
  sx={{
    display: { xs: 'flex', md: 'none' },
    flexDirection: 'column',
    alignItems: 'center',
    gap: 2,
    mb: 4
  }}
>
  {/* Fila 1: pasos 1 al 3 */}
  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
    {[0, 1, 2].map((index) => (
      <Box key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box
          sx={{
            width: 30,
            height: 30,
            borderRadius: '50%',
            backgroundColor: pasoActual > index ? 'lightgreen' : '#ccc',
            color: '#000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            mb: 1
          }}
        >
          {index + 1}
        </Box>
        <Typography variant="caption" align="center">
          {pasos[index]}
        </Typography>
      </Box>
    ))}
  </Box>

  {/* Fila 2: pasos 4 y 5 */}
  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
    {[3, 4].map((index) => (
      <Box key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box
          sx={{
            width: 30,
            height: 30,
            borderRadius: '50%',
            backgroundColor: pasoActual > index ? 'lightgreen' : '#ccc',
            color: '#000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            mb: 1
          }}
        >
          {index + 1}
        </Box>
        <Typography variant="caption" align="center">
          {pasos[index]}
        </Typography>
      </Box>
    ))}
  </Box>
</Box>


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
<Box sx={{ 
     display: 'flex', // Alineación horizontal
        flexDirection: { xs: 'column', sm: 'row' }, // Alineación vertical en móviles
           justifyContent: 'space-between', // Espacio entre elementos
           alignItems: 'center', // Alineación horizontal
         mt: 4, // Margen superior
          gap: 2, // Espacio entre botones   
        }}
      >
            {pasoActual > 0 && (
              <Button 
              fullWidth={true} // Ancho completo
              variant="contained" // Tipo de botón
              color="secondary" // Color del botón
              onClick={() => setPasoActual((prev) => prev - 1)}> {/* Volver al paso anterior */}
                Atrás
              </Button>
            )}
            {pasoActual < pasos.length - 1 ? (
              <Button 
              fullWidth={true} // Ancho completo
              variant="contained" // Tipo de botón
              color="secondary" // Color del botón
              onClick={handleSiguiente}> {/* Ir al paso siguiente */}
                Siguiente
              </Button>
            ) : (
              <Button 
              fullWidth={true} // Ancho completo
              variant="contained" // Tipo de botón
              color="success"   // Color del botón
              onClick={handleEnviarFormulario} // Enviar formulario
              >
              Finalizar
              </Button>
            )}
          </Box>
        </Paper>
      </Box>
      
      {/* Botón para volver a la Landing Page */}
      <Button
        variant="outlined" // Tipo de botón
        color="primary" // Color del botón
        sx={{ 
          mt: 4,  // Margen superior
          textTransform: 'none',  // Sin mayúsculas
          fontSize: { xs: '14px', sm: '16px' }, // Tamaño de fuente responsivo
        px: { xs: 2, sm: 4 }, // // Padding responsivo
        }}
        onClick={() => navigate('/')} // Redirigir a la Landing Page
      >
        Volver a Inicio
      </Button>

      
      {/* Snackbar para mostrar el mensaje de error */}
      <Snackbar
      open={openSnackbar}
      autoHideDuration={6000}
      onClose={handleCloseSnackbar}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} // Posición del snackbar
    >
      <Alert
        onClose={handleCloseSnackbar} // Cerrar snackbar
        severity="error" // Tipo de alerta
        sx={{
          width: '100%', // Ancho del snackbar
          backgroundColor: 'white',  // Color de fondo
          color: 'black', // Color del texto
          border: '1px solid black', // Bordes del snackbar
        }}
      >
        <Typography variant="body1" color="black"> 
          Por favor, complete los siguientes campos:
        </Typography>
        <ul>
          {missingFields.map((field, index) => (
            <li key={index} style={{ color: 'black' }}> {/* Color del texto */}
              {field}
            </li>
          ))}
        </ul>
      </Alert>
    </Snackbar>

    {/* Snackbar Éxito */}
    <Snackbar
      open={openExito} // Estado del snackbar
      autoHideDuration={6000} // Tiempo de apertura del snackbar
      onClose={() => setOpenExito(false)} // Cerrar snackbar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} // Posición del snackbar
    >
      <Alert
        onClose={() => setOpenExito(false)} // Cerrar snackbar
        severity="success" // Tipo de alerta
        sx={{  // Estilos del snackbar
          width: '100%', // Ancho del snackbar
          backgroundColor: 'white', // Color de fondo
          color: 'green', // Color del texto
          border: '1px solid green',  // Bordes del snackbar
        }}
      >
        ¡Formulario enviado exitosamente!
      </Alert>
    </Snackbar>
  </Container>
  );
}

export default FormularioContacto;