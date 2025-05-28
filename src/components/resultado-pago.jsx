// src/components/resultado-pago.jsx
import React, { useEffect } from 'react';
import { Box, Typography, Alert, CircularProgress, Paper } from '@mui/material';

export default function ResultadoPago() {
  const query = new URLSearchParams(window.location.search);
  const estado = query.get('estado');

  useEffect(() => {
    if (estado === 'exitoso') {
      const timer = setTimeout(() => {
        window.location.href = '/';
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [estado]);

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
      <Paper elevation={6} sx={{ p: 4, textAlign: 'center', maxWidth: 400 }}>
        {estado === 'exitoso' ? (
          <>
            <Alert severity="success" variant="filled" sx={{ mb: 3 }}>
              ¡Pago realizado con éxito!
            </Alert>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Serás redirigido al inicio en unos segundos...
            </Typography>
            <CircularProgress color="success" />
          </>
        ) : (
          <>
            <Alert severity="error" variant="filled" sx={{ mb: 3 }}>
              Hubo un problema con tu pago.
            </Alert>
            <Typography variant="body1">
              Por favor, intenta nuevamente o contacta soporte.
            </Typography>
          </>
        )}
      </Paper>
    </Box>
  );
}