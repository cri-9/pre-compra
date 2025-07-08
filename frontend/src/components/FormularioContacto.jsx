import React, { useState, useEffect } from 'react';
import { Box, Button, Step, StepLabel, Stepper, Typography, Paper, Container, AppBar, Toolbar, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { API_URLS } from '../config/api';
import DatosVehiculo from './DatosVehiculo';
import DatosCliente from './DatosCliente';
import DatosVendedor from './DatosVendedor';
import FechaAgendamiento from './FechaAgendamiento';
import SeleccionServicio from './SeleccionServicio';
import Pago from './Pago';

const pasos = ["Datos del Vehiculo", "Datos del Cliente", "Datos del Vendedor", "Fecha de Agendamiento", "Seleccion de Servicio", "Pago"];

import { useTheme } from '@mui/material/styles';

//Colores de los iconos de los pasos
function CustomStepIcon(props) {
  const { active, completed, icon, colorIndex } = props;
  const theme = useTheme();
  // Only color steps 0-4 (first five)
  const isTertiary = colorIndex < 5;
  const color = isTertiary ? theme.palette.tertiary.main : theme.palette.text.disabled;
  return (
    <span
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 32,
        height: 32,
        borderRadius: '50%',
        backgroundColor: active || completed ? color : '#fff',
        color: active || completed ? '#fff' : color,
        fontWeight: 'bold',
        fontSize: 18,
        border: `2px solid ${color}`,
        transition: 'background 0.2s',
      }}
    >
      {icon}
    </span>
  );
}

function FormularioContacto() {
  const navigate = useNavigate();
  const [pasoActual, setPasoActual] = useState(0);
  const [touched, setTouched] = useState(false);
  // Inicializa la fecha con la de hoy (siempre valor por defecto)
  const hoyISO = new Date().toISOString().split("T")[0];
  const [datos, setDatos] = useState({
    vehiculo: { marca: '', modelo: '', año: '', patente: '' }, //
    cliente: { nombre: '', apellido: '', email: '', telefono: '', rut: '', direccion: '', region: '', comuna: '' }, //
    vendedor: { tipovendedor: '', nombre: '', telefono: '', direccion: '', region: '', comuna: '' },
    agendamiento: {
      fecha: hoyISO,           // <--- SIEMPRE inicializado!
      bloque: '',
      hora_inicio: '',
      hora_fin: ''
    },
    servicio: { servicioId: null, nombreServicio: "", monto: 0 }, // <-- Cambia 'servicio' por 'servicioId'
    pago: { codigoDescuento: "",  metodo: "WebPay" }
  });

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [missingFields, setMissingFields] = useState([]);
  const [openExito, setOpenExito] = useState(false);
  const [loading, setLoading] = useState(false);
  const [autoDateMsg, setAutoDateMsg] = useState('');

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
    3: ["fecha", "bloque"], // Agregamos horario 
    4: ["servicioId", "nombreServicio", "monto"], // <-- Asegúrate de usar 'servicioId'
    5: ["metodo"],
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
      if (pasoActual === 4) {
        // When moving from service selection to payment, update pago with service info
        setDatos(prevDatos => ({
          ...prevDatos,
          pago: {
            ...prevDatos.pago,
            nombreServicio: prevDatos.servicio.nombreServicio,
            monto: prevDatos.servicio.monto
          }
        }));
      }
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

  const handleAutoDateMsgClose = () => {
    setAutoDateMsg('');
  };
  /**
   * Inicia el proceso de pago con WebPay
   * 
   * Esta función realiza varias validaciones antes de iniciar el pago:
   * 1. Verifica que la fecha y bloque estén presentes
   * 2. Auto-corrige la fecha si está vacía
   * 3. Prepara los datos en el formato esperado por el backend
   * 4. Maneja errores y respuestas del servidor de forma robusta
   */
  const iniciarWebPay = async () => {
    let fechaActual = datos.agendamiento.fecha;
    let bloqueActual = datos.agendamiento.bloque;
  
    // 1. Si fecha vacía, corrige y actualiza UI:
    if (!fechaActual || fechaActual.trim() === "") {
      fechaActual = new Date().toISOString().split("T")[0];
      setDatos(prev => ({
        ...prev,
        agendamiento: {
          ...prev.agendamiento,
          fecha: fechaActual
        }
      }));
      // Muestra mensaje personalizado para la fecha autocorregida
      setAutoDateMsg("La fecha estaba vacía y fue corregida automáticamente a la fecha de hoy. Por favor revisa antes de continuar.");
      return; // Detén aquí para que el usuario vea el cambio antes de continuar
    }
    // 2. Si bloque vacío, muestra error
    if (!bloqueActual || bloqueActual.trim() === "") {
      setOpenSnackbar(true);
      setMissingFields(['bloque']);
      return;
    }
  
    setLoading(true);
    try {
      // Paso 4: Preparamos todos los datos necesarios para el backend
      const datosWebPay = {
        ...datos,
        agendamiento: {
          ...datos.agendamiento,
          fecha: fechaActual,
          bloque: bloqueActual,
          hora_inicio: datos.agendamiento.hora_inicio || "",
          hora_fin: datos.agendamiento.hora_fin || ""
        },
        servicio: datos.servicio.servicioId || "",
        nombreServicio: datos.servicio.nombreServicio,
        monto: datos.servicio.monto
      };

      // Paso 5: Log detallado para depuración antes del envío
      console.log("Datos enviados a WebPay backend:", {
        agendamiento: datosWebPay.agendamiento,
        servicio: datosWebPay.servicio,
        nombreServicio: datosWebPay.nombreServicio,
        monto: datosWebPay.monto,
        cliente: datos.cliente // Incluimos datos del cliente para mejor depuración
      });

      // Paso 6: Realizamos la petición al backend
      const response = await fetch(API_URLS.WEBPAY, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosWebPay),
        credentials: 'include'
      });
  
      // Paso 7: Capturamos la respuesta en texto crudo para mejor depuración
      const text = await response.text();
      console.log('Texto crudo del backend:', text);
  
      try {
        // Paso 8: Intentamos parsear la respuesta como JSON
        const data = JSON.parse(text);
        console.log('Response JSON:', data);
  
        // Paso 9: Extraemos URL y token según la estructura de respuesta
        const url = data.url || (data.response && data.response.url);
        const token = data.token || (data.response && data.response.token);
  
        // Paso 10: Logs adicionales para verificar el flujo de WebPay
        console.log("Token recibido del backend:", token);
        console.log("Debería existir archivo: tmp_datosform_" + token + ".json en Backend");
  
        // Paso 11: Redirigimos al usuario a la página de pago si todo está correcto
        if (data.success && url && token) {
          window.location.href = `${url}?token_ws=${token}`;
        } else {
          alert(data.error || 'Error en la respuesta del servidor de pagos');
        }
      } catch (e) {
        console.error("Error parseando respuesta del backend:", e, text);
        alert('Respuesta inesperada del servidor. Por favor, intente nuevamente.');
      }
    } catch (err) {
      console.error("Error de red al conectar con WebPay:", err);
      alert("No se pudo iniciar el proceso de pago. Verifique su conexión e intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };
  
  
//modiificación de tipo de pago en este caso transferencia bancaria
const handleEnviarFormulario = async () => {
  if (validarFormulario(pasoActual)) {
    setLoading(true);
    try {
      // Preparar todos los datos necesarios para la transferencia
      const datosEnvio = {
        vehiculo: {
          marca: datos.vehiculo.marca,
          modelo: datos.vehiculo.modelo,
          año: datos.vehiculo.año,
          patente: datos.vehiculo.patente
        },
        cliente: {
          nombre: datos.cliente.nombre,
          apellido: datos.cliente.apellido,
          email: datos.cliente.email,
          telefono: datos.cliente.telefono,
          rut: datos.cliente.rut,
          direccion: datos.cliente.direccion,
          region: datos.cliente.region,
          comuna: datos.cliente.comuna
        },
        agendamiento: {
          fecha: datos.agendamiento.fecha || '',
          bloque: datos.agendamiento.bloque || '',
          hora_inicio: datos.agendamiento.hora_inicio || '',
          hora_fin: datos.agendamiento.hora_fin || ''
        },
        servicio: {
          nombre: datos.servicio.nombreServicio,
          monto: datos.servicio.monto,
          bloque: datos.agendamiento.bloque // <-- Incluye bloque también aquí si el backend lo espera en servicio
        },
        pago: {
          metodo: datos.pago.metodo,
          codigoDescuento: datos.pago.codigoDescuento
        }
      };

      const response = await fetch('http://localhost:3000/agendarTransferencia', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token') // Si usas autenticación
        },
        body: JSON.stringify(datosEnvio),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setOpenExito(true);
        resetearFormulario();
        // Redirigir después de 3 segundos
        setTimeout(() => navigate('/'), 3000);
      } else {
        throw new Error(result.error || 'Error desconocido al agendar');
      }
    } catch (error) {
      console.error('Error al enviar los datos:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  } else {
    setOpenSnackbar(true);
    // Mostrar campos faltantes específicos
    const camposFaltantes = camposPorPaso[pasoActual].filter(
      field => !datos[Object.keys(datos)[pasoActual]][field]
    );
    setMissingFields(camposFaltantes);
  }
};


  const resetearFormulario = () => {
    setDatos({
      vehiculo: { marca: '', modelo: '', año: '', patente: '' },
      cliente: { nombre: '', apellido: '', email: '', telefono: '', rut: '', direccion: '', region: '', comuna: '' },
      vendedor: { tipovendedor: '', nombre: '', telefono: '', direccion: '', region: '', comuna: '' },
      agendamiento: {
        fecha: '',
        bloque: '',
        hora_inicio: '',
        hora_fin: ''
      },
      servicio: { servicioId: null, nombreServicio: "", monto: 0 }, // <-- Agregado para mantener consistencia
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
    <Container sx={{ p: { xs: 2, sm: 3, md: 4 }, borderRadius: 3, backgroundColor: '#f8f9f9', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <AppBar position="static" sx={{ backgroundColor: 'primary.main', mb: { xs: 3, sm: 4, md: 6 }, width: '100%', alignItems: 'center' }}>
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
      <StepLabel StepIconComponent={(stepProps) => {
        // Custom step icon for first five steps
        if (index < 5) {
          return (
            <CustomStepIcon {...stepProps} colorIndex={index} />
          );
        } else {
          // Default icon for step 6 (Pago)
          const DefaultStepIcon = stepProps.icon;
          return <span>{DefaultStepIcon}</span>;
        }
      }}>{label}</StepLabel>
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
            {pasoActual === 4 && <SeleccionServicio datos={datos.servicio} onChange={(data) => handleDatosChange('servicio', data)} />}
            {pasoActual === 5 && (
  <Pago   
    datos={{
      ...datos.pago,
      email: datos.cliente.email,
      nombre: datos.cliente.nombre,
      telefono: datos.cliente.telefono,
      nombreServicio: datos.servicio.nombreServicio,
      monto: datos.servicio.monto,
      bloque: datos.agendamiento.bloque, // <-- Asegura que bloque se pase como prop
      fecha: datos.agendamiento.fecha, // <-- Asegura que fecha se pase como prop
      horario: datos.agendamiento.horario, // <-- Asegura que horario se pase como prop
      datosVendedor: {
        ...datos.vendedor,  
        tipo: datos.vendedor.tipovendedor
      }
    }}
    datosCliente={datos.cliente}
    onChange={(data) => handleDatosChange('pago', data)}   
    iniciarWebPay={iniciarWebPay} // La función ya incluye todas las validaciones necesarias
    loading={loading}
    nombreServicio={datos.servicio.nombreServicio}
    pagoDeshabilitado={!datos.agendamiento.fecha || !datos.agendamiento.bloque} // <-- NUEVO: deshabilita si falta fecha o bloque
  />
)}
          </Box>
          
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'center', mt: 4, gap: 2 }}>{/*Boton Pagar y finalizar*/}
          {pasoActual > 0 && (
          <Button fullWidth 
          variant="contained" 
          color="secondary" 
          onClick={() => setPasoActual((prev) => prev - 1)}>
          Atrás
        </Button>
        )}
        {pasoActual < pasos.length - 1 && (
        <Button fullWidth variant="contained" color="secondary" onClick={handleSiguiente}>
        Siguiente
        </Button>
        )}     
        </Box>
        </Paper>
      </Box>
      <Button variant="contained" color="primary" sx={{ mt: 4, textTransform: 'none', fontSize: { xs: '14px', sm: '16px' }, px: { xs: 2, sm: 4 } }} onClick={handleVolverInicio}>
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
      <Snackbar
        open={!!autoDateMsg}
        autoHideDuration={5000}
        onClose={handleAutoDateMsgClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleAutoDateMsgClose} severity="info" sx={{ width: '100%' }}>
          {autoDateMsg}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default FormularioContacto;
