import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import {
    Alert,
    Box,
    Button,
    Container,
    Grid,
    Paper,
    Snackbar,
    Step,
    StepLabel,
    Stepper,
    Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoForm from '../assets/Logo_Formulario/logo_formulario.webp';
import { API_URLS } from '../config/api';
import DatosCliente from './DatosCliente';
import DatosVehiculo from './DatosVehiculo';
import DatosVendedor from './DatosVendedor';
import FechaAgendamientoModerno from './FechaAgendamientoModerno';
import Pago from './Pago';
import SeleccionServicio from './SeleccionServicio';

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

  // Evento Meta Pixel cuando se carga el formulario de agendamiento
  useEffect(() => {
    if (window.fbq) {
      window.fbq('track', 'ViewContent', {
        content_name: 'Formulario de Agendamiento',
        content_category: 'Booking Form'
      });
    }
  }, []);

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
          // Evento GA4 para inicio de proceso de pago WebPay
          if (window.gtag) {
            window.gtag('event', 'inicio_pago_webpay', {
              event_category: 'Agendamiento',
              event_label: 'Inicio Pago WebPay',
              servicio: datos.servicio.nombreServicio,
              monto: datos.servicio.monto,
              fecha_agendamiento: datos.agendamiento.fecha,
              bloque: datos.agendamiento.bloque,
              value: datos.servicio.monto
            });
          }
          
          // Evento Meta Pixel para inicio de checkout
          if (window.fbq) {
            window.fbq('track', 'InitiateCheckout', {
              content_name: datos.servicio.nombreServicio,
              content_category: 'Inspection Service',
              value: datos.servicio.monto,
              currency: 'CLP'
            });
          }
          
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
      console.log('🔍 DEBUG - datos.vendedor:', datos.vendedor);
      // Preparar todos los datos necesarios para la transferencia - VERSION 2.0 con vendedor
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
        vendedor: {
          tipo: datos.vendedor.tipovendedor,
          nombre: datos.vendedor.nombre,
          telefono: datos.vendedor.telefono,
          direccion: datos.vendedor.direccion,
          region: datos.vendedor.region,
          comuna: datos.vendedor.comuna
        },
        agendamiento: {
          fecha: datos.agendamiento.fecha || '',
          bloque: datos.agendamiento.bloque || '',
          hora_inicio: datos.agendamiento.hora_inicio || '',
          hora_fin: datos.agendamiento.hora_fin || ''
        },
        servicio: {
          nombre: datos.servicio.nombreServicio,
          //monto: datos.servicio.monto,
          //bloque: datos.agendamiento.bloque // <-- Incluye bloque también aquí si el backend lo espera en servicio
        },
        pago: {
          metodo: datos.pago.metodo,
          monto: datos.servicio.monto, // <-- AGREGA monto aquí
          codigoDescuento: datos.pago.codigoDescuento
        }
      };

      console.log('📤 DEBUG - datosEnvio completo:', JSON.stringify(datosEnvio, null, 2));
      
      const response = await fetch('/api/router.php?ruta=notificarTransferencia', {
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  },
  body: JSON.stringify(datosEnvio),
});

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        // Evento GA4 para agendamiento exitoso con transferencia
        if (window.gtag) {
          window.gtag('event', 'agendamiento_transferencia', {
            event_category: 'Agendamiento',
            event_label: 'Agendamiento con Transferencia',
            servicio: datos.servicio.nombreServicio,
            monto: datos.servicio.monto,
            fecha_agendamiento: datos.agendamiento.fecha,
            bloque: datos.agendamiento.bloque,
            metodo_pago: 'transferencia',
            value: datos.servicio.monto
          });
        }
        
        // Evento Meta Pixel para agendamiento/conversión
        if (window.fbq) {
          window.fbq('track', 'Schedule', {
            content_name: datos.servicio.nombreServicio,
            content_category: 'Bank Transfer',
            value: datos.servicio.monto,
            currency: 'CLP'
          });
        }

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
    <Box
    // Configuración de color de fondo y ancho 
    sx={{ 
    minHeight: '100vh',
    width: '100%',
    margin: 0,
    padding: 0,
    position: 'relative', // IMPORTANTE: necesario para que ::after funcione correctamente
    overflow: 'hidden', // Prevenir scroll horizontal
    backgroundColor: '#f9f9f9' // Fondo gris limpio
  }}
> 
    
      {/* Contenido principal dividido en dos columnas */}
      <Container maxWidth="xl" sx={{ py: 4, px: { xs: 2, sm: 3 }, position: 'relative', zIndex: 2 }}>
        <Grid container spacing={4} sx={{ minHeight: '100vh' }}>

           {/* Columna izquierda - Información */}
        <Grid item xs={12} md={5}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            height: '100%',
            px: { xs: 2, md: 3 },
            mt: { xs: 1, md: 1 } // Menor margen superior
          }}>
            {/* Logo */}
            <Box sx={{ mb: 4, textAlign: 'center' }}>
              <img 
                src={logoForm} 
                alt="Visual Mecánica Logo" 
                style={{ 
                  maxWidth: '200px', 
                  height: 'auto',
                  width: '80%'
                }} 
              />
            </Box>

            {/* Información del proceso - NUEVO TEXTO */}
            <Paper elevation={3} sx={{ p: 3, borderRadius: 3, width: '100%', fontFamily: 'roboto, helvetica, arial, sans-serif' }}>
              <Typography variant="h4" component="h2" sx={{
                mb: 2,
                color: 'primary.main',
                fontWeight: 'bold',
                textAlign: 'center',
                fontSize: { xs: '1.5rem', md: '2rem' },
                lineHeight: 1.4,
                fontFamily: 'roboto, helvetica, arial, sans-serif'
              }}>
                Reserva tu Inspección Precompra de forma rápida y segura
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, textAlign: 'justify', color: 'text.secondary', fontFamily: 'roboto, helvetica, arial, sans-serif' }}>
                <strong>¿Estás a punto de comprar un vehículo?</strong> Asegura tu inversión con nuestra inspección técnica precompra. Reserva en minutos y recibe un diagnóstico profesional antes de cerrar el trato.
              </Typography>

              <Typography variant="h5" component="h3" sx={{
                mb: 2,
                color: 'primary.main',
                fontWeight: 'bold',
                fontSize: { xs: '1.2rem', md: '1.4rem' },
                fontFamily: 'roboto, helvetica, arial, sans-serif'
              }}>
                ¿Cómo solicitar tu inspección?
              </Typography>
              <Box component="ol" sx={{ pl: 2, mb: 3, fontFamily: 'roboto, helvetica, arial, sans-serif', '& li': { mb: 2, textAlign: 'justify', color: 'text.secondary', fontFamily: 'roboto, helvetica, arial, sans-serif' } }}>
                <li>
                  <strong>Completa el formulario online</strong><br/>
                  Ingresa tus datos personales y la información del vehículo y del vendedor.
                </li>
                <li>
                  <strong>Validación y contacto personalizado</strong><br/>
                  Una vez recibido el formulario, nuestro equipo técnico verificará la disponibilidad y te contactará por correo electrónico o WhatsApp con los datos para realizar la transferencia bancaria.
                </li>
                <li>
                  <strong>Confirma tu reserva con el pago</strong><br/>
                  Realiza el pago dentro de la hora siguiente y envíanos el comprobante de transferencia. Esto garantizará tu lugar en la agenda.
                </li>
                <li>
                  <strong>Recibe tu confirmación</strong><br/>
                  Al validar el pago, recibirás un mensaje de confirmación con la fecha y hora exacta de tu inspección.
                </li>
              </Box>           
            </Paper>
          </Box>
        </Grid>

          {/* Columna derecha - Formulario */}
          <Grid item xs={12} md={7}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              height: '100%',
              px: { xs: 1, md: 2 },
              mt: { xs: 2, md: 4 }
            }}>
              {/* Título del formulario FUERA del Paper */}
              <Box sx={{
                width: '100%',
                backgroundColor: 'primary.main',
                borderRadius: 2,
                mb: 5, //Mayor separación entre el título y el formulario
                px: 2,
                py: 2,
                textAlign: 'center'
              }}>
                <Typography
                  variant="h5"
                  sx={{
                    color: '#fff',
                    fontSize: { xs: '1.2rem', sm: '1.5rem', md: '2rem' },
                    fontWeight: 'bold'
                  }}
                >
                  Formulario de Contacto
                </Typography>
              </Box>
              
              <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, width: '100%' }}>
                {/* Header del formulario */}                
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
                  {pasoActual === 3 && <FechaAgendamientoModerno datos={datos.agendamiento} onChange={(data) => handleDatosChange('agendamiento', data)} />}
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
                        bloque: datos.agendamiento.bloque,
                        fecha: datos.agendamiento.fecha,
                        horario: datos.agendamiento.horario,
                        datosVendedor: {
                          ...datos.vendedor,  
                          tipo: datos.vendedor.tipovendedor
                        }
                      }}
                      datosCliente={datos.cliente}
                      onChange={(data) => handleDatosChange('pago', data)}   
                      iniciarWebPay={iniciarWebPay}
                      loading={loading}
                      nombreServicio={datos.servicio.nombreServicio}
                      pagoDeshabilitado={!datos.agendamiento.fecha || !datos.agendamiento.bloque}
                    />
                  )}
                </Box>
                
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'center', mt: 4, gap: 2 }}>
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
                  {/* 👇  Se agrega este bloque justo dentro del Paper */}
                <Box sx={{ mt: 2 }}>
                <Button
                variant="outlined"
                color="primary"
                fullWidth
                onClick={handleVolverInicio}
                startIcon={<DirectionsCarIcon />}
                >
                Volver a Inicio
                </Button>
                </Box>
              </Paper>             
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Snackbars */}
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
    </Box>
  );
}

export default FormularioContacto;