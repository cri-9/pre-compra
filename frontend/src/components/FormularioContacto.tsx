import { FC, useState } from 'react';
import config from '../config/environment';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';
import {
  FormData,
  Styles,
  FormStep,
  ValidationResult,
  AgendarRequest,
  WebPayResponse,
  AgendarResponse,
  VehiculoData,
  ClienteData,
  VendedorData,
  AgendamientoData,
  ServicioData,
  PagoData
} from '../types';
import DatosVehiculo from './DatosVehiculo';
import DatosCliente from './DatosCliente';
import DatosVendedor from './DatosVendedor';
import FechaAgendamientoModerno from './FechaAgendamientoModerno';
import SeleccionServicio from './SeleccionServicio';
import Pago from './Pago';

const pasos: FormStep[] = [
  { label: "Datos del Vehiculo", fields: ["marca", "modelo", "año", "patente"] },
  { label: "Datos del Cliente", fields: ["nombre", "apellido", "email", "telefono", "rut", "direccion", "region", "comuna"] },
  { label: "Datos del Vendedor", fields: ["tipovendedor", "nombre", "telefono", "direccion", "region", "comuna"] },
  { label: "Fecha de Agendamiento", fields: ["fecha", "bloque"] },
  { label: "Seleccion de Servicio", fields: ["servicioId", "nombreServicio", "monto"] },
  { label: "Pago", fields: ["metodo"] }
];

const styles: Styles = {
  container: {
    p: { xs: 2, sm: 3, md: 4 },
    borderRadius: 3,
    backgroundColor: '#f0f0f0',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh'
  },
  appBar: {
    backgroundColor: '#1565c0',
    mb: { xs: 3, sm: 4, md: 6 },
    width: '100%',
    alignItems: 'center'
  },
  toolbar: {
    width: '100%',
    maxWidth: 800
  },
  title: {
    flexGrow: 1,
    color: '#fff',
    p: { xs: 2, sm: 3 },
    textAlign: 'center',
    fontSize: { xs: '1.2rem', sm: '1.5rem', md: '2rem' }
  },
  formBox: {
    width: '100%',
    maxWidth: 800,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    px: { xs: 1, sm: 2 }
  },
  paper: {
    p: { xs: 2, sm: 3 },
    borderRadius: 3,
    width: '100%'
  }
};

const FormularioContacto: FC = () => {
  const navigate = useNavigate();
  const [pasoActual, setPasoActual] = useState<number>(0);
  const [datos, setDatos] = useState<FormData>({
    vehiculo: { marca: '', modelo: '', año: '', patente: '' },
    cliente: { nombre: '', apellido: '', email: '', telefono: '', rut: '', direccion: '', region: '', comuna: '' },
    vendedor: { tipovendedor: '', nombre: '', telefono: '', direccion: '', region: '', comuna: '' },
    agendamiento: { fecha: '', bloque: '' },
    servicio: { servicio: null, nombreServicio: "", monto: 0 },
    pago: { codigoDescuento: "", metodo: "WebPay" }
  });

  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [openExito, setOpenExito] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleDatosChange = <K extends keyof FormData>(
    seccion: K,
    nuevosDatos: FormData[K]
  ): void => {
    if (seccion === 'cliente') {
      console.log('Cliente datos updated:', nuevosDatos);
    }
    setDatos(prevDatos => {
      const newDatos = {
        ...prevDatos,
        [seccion]: nuevosDatos
      };
      if (seccion === 'cliente') {
        console.log('Updated cliente state:', newDatos.cliente);
      }
      return newDatos;
    });
  };

  const validarFormulario = (stepIndex: number): ValidationResult => {
    const campos = pasos[stepIndex].fields;
    const currentData = datos[Object.keys(datos)[stepIndex] as keyof FormData];
    const missing = campos.filter(field => !currentData[field as keyof typeof currentData]);
    setMissingFields(missing);
    return { isValid: missing.length === 0, missingFields: missing };
  };

  const handleSiguiente = (): void => {
    const { isValid } = validarFormulario(pasoActual);
    if (isValid) {
      if (pasoActual === 4) {
        setDatos(prevDatos => ({
          ...prevDatos,
          pago: {
            ...prevDatos.pago,
            nombreServicio: prevDatos.servicio.nombreServicio,
            monto: prevDatos.servicio.monto
          }
        }));
      }
      setPasoActual(prev => prev + 1);
      setOpenSnackbar(false);
    } else {
      setOpenSnackbar(true);
    }
  };

  const handleSnackbarClose = (_event?: React.SyntheticEvent | Event, reason?: string): void => {
    if (reason === 'clickaway') return;
    setOpenSnackbar(false);
    setOpenExito(false);
  };

  const iniciarWebPay = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await fetch(`${config.apiUrl}/webpay.php`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(datos),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: WebPayResponse = await response.json();

      if (data.success && data.url && data.token) {
        window.location.href = `${data.url}?token_ws=${data.token}`;
      } else {
        setOpenSnackbar(true);
        setMissingFields([data.error || 'Error al procesar el pago']);
      }
    } catch (err) {
      console.error('Error al iniciar WebPay:', err);
      setOpenSnackbar(true);
      setMissingFields(['Error de conexión con el servidor de pagos. Por favor, intente nuevamente.']);
    } finally {
      setLoading(false);
    }
  };

  const handleEnviarFormulario = async (): Promise<void> => {
    const { isValid } = validarFormulario(pasoActual);
    if (isValid) {
      setLoading(true);
      try {
        // Validar campos obligatorios del cliente
        if (!datos.cliente.direccion || !datos.cliente.region || !datos.cliente.comuna) {
          throw new Error("Por favor complete los datos de dirección, región y comuna");
        }

        const datosEnvio: AgendarRequest = {
          nombre: datos.cliente.nombre,
          telefono: datos.cliente.telefono,
          correo: datos.cliente.email,
          direccion: datos.cliente.direccion,
          region: datos.cliente.region,
          comuna: datos.cliente.comuna,
          fechaAgendada: datos.agendamiento.fecha,
          metodo: datos.pago.metodo,
          servicio: datos.servicio.nombreServicio,
          monto: datos.servicio.monto,
        };

        console.log('Enviando datos al servidor:', datosEnvio);

        const response = await fetch(`${config.apiUrl}/agendarTransferencia.php`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(datosEnvio),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: AgendarResponse = await response.json();

        if (result.success) {
          setOpenExito(true);
          resetearFormulario();
          setTimeout(() => {
            handleVolverInicio();
          }, 3000);
        } else {
          setOpenSnackbar(true);
          setMissingFields([result.error || 'Error al procesar el agendamiento']);
        }
      } catch (error) {
        console.error('Error al enviar los datos:', error);
        setOpenSnackbar(true);
        setMissingFields(['Error de conexión con el servidor. Por favor, intente más tarde.']);
      } finally {
        setLoading(false);
      }
    } else {
      setOpenSnackbar(true);
    }
  };

  const resetearFormulario = (): void => {
    setDatos({
      vehiculo: { marca: '', modelo: '', año: '', patente: '' },
      cliente: { nombre: '', apellido: '', email: '', telefono: '', rut: '', direccion: '', region: '', comuna: '' },
      vendedor: { tipovendedor: '', nombre: '', telefono: '', direccion: '', region: '', comuna: '' },
      agendamiento: { fecha: '', bloque: '' },
      servicio: { servicio: null, nombreServicio: "", monto: 0 },
      pago: { codigoDescuento: "", metodo: "WebPay" }
    });
    setPasoActual(0);
  };

  const handleVolverInicio = (): void => {
    navigate('/');
  };

  return (
    <Container sx={styles.container}>
      <AppBar position="static" sx={styles.appBar}>
        <Toolbar sx={styles.toolbar}>
          <Typography variant="h5" sx={styles.title}>
            Formulario de Contacto
          </Typography>
        </Toolbar>
      </AppBar>
      <Box sx={styles.formBox}>
        <Paper elevation={3} sx={styles.paper}>
          <Stepper activeStep={pasoActual} alternativeLabel sx={{ mb: 4, display: { xs: 'none', md: 'flex' } }}>
            {pasos.map((paso, index) => (
              <Step key={index} completed={pasoActual > index}>
                <StepLabel>{paso.label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <Box sx={{ p: 2 }}>
            {pasoActual === 0 && (
              <DatosVehiculo
                datos={datos.vehiculo}
                onChange={(data: VehiculoData) => handleDatosChange('vehiculo', data)}
                onSiguiente={handleSiguiente}
              />
            )}
            {pasoActual === 1 && (
              <DatosCliente
                datos={datos.cliente}
                onChange={(data: ClienteData) => handleDatosChange('cliente', data)}
              />
            )}
            {pasoActual === 2 && (
              <DatosVendedor
                datos={datos.vendedor}
                onChange={(data: VendedorData) => handleDatosChange('vendedor', data)}
              />
            )}
            {pasoActual === 3 && (
              <FechaAgendamientoModerno
                datos={datos.agendamiento}
                onChange={(data: AgendamientoData) => handleDatosChange('agendamiento', data)}
              />
            )}
            {pasoActual === 4 && (
              <SeleccionServicio
                datos={datos.servicio}
                onChange={(data: ServicioData) => handleDatosChange('servicio', data)}
              />
            )}
            {pasoActual === 5 && (
              <Pago
                datos={{
                  ...datos.pago,
                  email: datos.cliente.email,
                  nombre: datos.cliente.nombre
                }}
                datosCliente={datos.cliente}
                onChange={(data: PagoData) => handleDatosChange('pago', data)}
                iniciarWebPay={iniciarWebPay}
                loading={loading}
                nombreServicio={datos.servicio.nombreServicio} onGoToAgendamiento={undefined}              />
            )}
          </Box>
          
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'center', mt: 4, gap: 2 }}>
            {pasoActual > 0 && (
              <Button
                fullWidth
                variant="contained"
                color="secondary"
                onClick={() => setPasoActual(prev => prev - 1)}
              >
                Atrás
              </Button>
            )}
            {pasoActual < pasos.length - 1 && (
              <Button
                fullWidth
                variant="contained"
                color="secondary"
                onClick={handleSiguiente}
              >
                Siguiente
              </Button>
            )}
            {pasoActual === pasos.length - 1 && (
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleEnviarFormulario}
                disabled={loading}
              >
                {loading ? 'Procesando...' : 'Finalizar'}
              </Button>
            )}
          </Box>
        </Paper>
      </Box>
      <Button
        variant="outlined"
        color="primary"
        sx={{ mt: 4, textTransform: 'none', fontSize: { xs: '14px', sm: '16px' }, px: { xs: 2, sm: 4 } }}
        onClick={handleVolverInicio}
      >
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
};

export default FormularioContacto;
