import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';

import { API_URLS, buildApiUrl } from '../config/api';

const RetornoPago = () => {
  const navigate = useNavigate();
  const [estado, setEstado] = useState('cargando');
  const [mensaje, setMensaje] = useState('');
  const [detalle, setDetalle] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token_ws');

    if (token) {
      console.log('Token recibido:', token);
      fetch(`${API_URLS.WEBPAY_RESPUESTA}?token_ws=${encodeURIComponent(token)}`)
        .then(async (res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          let data;
          const textResponse = await res.text();
          console.log('Respuesta raw del servidor:', textResponse);
          
          try {
            data = JSON.parse(textResponse);
          } catch (e) {
            console.error('Error al parsear JSON:', e);
            setEstado('error');
            setMensaje('Respuesta inesperada del servidor (no es JSON válido)');
            setDetalle(null);
            return;
          }
          
          console.log('Respuesta backend procesada:', data);

          if (data.success) {
            setEstado('exito');
            setMensaje(data.message || '¡Pago exitoso!');
            setDetalle(data);
          } else {
            console.error('Error en la respuesta:', data);
            setEstado('error');
            
            // Manejar diferentes tipos de errores
            if (data.message === "Ese bloque ya está reservado. Elige otro.") {
              setMensaje(data.message);
              setDetalle(null);
              setTimeout(() => {
                navigate('/agenda');
              }, 3000);
            } else if (data.message === "Datos de fecha o bloque no válidos.") {
              setMensaje("Error en los datos del agendamiento. Por favor, intenta agendar nuevamente.");
              setDetalle(null);
              setTimeout(() => {
                navigate('/agenda');
              }, 3000);
            } else {
              setMensaje(data.message || 'Hubo un problema con el pago.');
              setDetalle(null);
            }
          }
        })
        .catch(err => {
          setEstado('error');
          setMensaje('Error al comunicarse con el servidor.');
          setDetalle(null);
          console.error(err);
        });
    } else {
      setEstado('error');
      setMensaje('No se encontró el token de transacción en la URL.');
      setDetalle(null);
    }
  }, []);

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoAgenda = () => {
    navigate('/agenda');
  };

  return (
    <Container maxWidth="sm">
      <Box mt={10} textAlign="center">
        {estado === 'cargando' && (
          <>
            <CircularProgress />
            <Typography variant="h6" mt={2}>Procesando tu pago...</Typography>
          </>
        )}
        {estado === 'exito' && (
          <>
            <Alert severity="success" variant="filled" sx={{ mb: 3 }}>
              {mensaje}
            </Alert>
            {detalle && (
              <Box sx={{ textAlign: 'left', mb: 3 }}>
                <Typography variant="subtitle1"><b>Resumen de tu agendamiento:</b></Typography>
                <Divider sx={{my: 1}}/>
                {/* Puedes mostrar los campos que mande el backend */}
                <Typography variant="body1"><b>Nombre:</b> {detalle.cliente?.nombre} {detalle.cliente?.apellido}</Typography>
                <Typography variant="body1"><b>Email:</b> {detalle.cliente?.email}</Typography>
                <Typography variant="body1"><b>Servicio:</b> {detalle.pago?.nombreServicio ?? '-'}</Typography>
                <Typography variant="body1" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                  <b>Fecha:</b> {detalle.agendamiento?.fecha ?? mensaje}
                </Typography>
                <Typography variant="body1" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                  <b>Hora:</b> {detalle.agendamiento?.bloque ?? mensaje}
                </Typography>
                <Typography variant="body1"><b>Método de pago:</b> {detalle.pago?.metodo}</Typography>
              </Box>
            )}
            <Box sx={{mt: 2}}>
              <Button variant="contained" color="primary" onClick={handleGoHome} sx={{mr: 2}}>
                Ir al inicio
              </Button>
              <Button variant="outlined" onClick={handleGoAgenda}>
                Agendar otro servicio
              </Button>
            </Box>
          </>
        )}
        {estado === 'error' && (
          <Alert severity="error" variant="filled" sx={{ mb: 3 }}>
            {mensaje}
            {/* Mostrar aviso de redirección solo si el mensaje es exactamente el esperado */}
            {mensaje === "Ese bloque ya está reservado. Elige otro." && (
              <Typography variant="body2" sx={{ mt: 2 }}>
                El bloque fue reservado por otra persona justo antes de finalizar tu pago. Serás redirigido para elegir otro bloque...
              </Typography>
            )}
          </Alert>
        )}
      </Box>
    </Container>
  );
};

export default RetornoPago;
