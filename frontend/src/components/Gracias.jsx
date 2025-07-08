import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const Gracias = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        textAlign="center"
        py={4}
      >
        <CheckCircleIcon
          sx={{
            fontSize: 80,
            color: 'success.main',
            mb: 3
          }}
        />
        
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          color="success.main"
          fontWeight="bold"
        >
          ¡Gracias!
        </Typography>
        
        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          color="text.primary"
          sx={{ mb: 3 }}
        >
          Tu pago ha sido procesado exitosamente
        </Typography>
        
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mb: 4, maxWidth: 400 }}
        >
          Hemos recibido tu pago correctamente. Te enviaremos un correo de confirmación 
          con todos los detalles de tu transacción.
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/')}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '1.1rem'
            }}
          >
            Volver al Inicio
          </Button>
          
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/agenda')}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '1.1rem'
            }}
          >
            Agendar Otro Servicio
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Gracias;
