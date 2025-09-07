import React from 'react';
import { Box, Container, Typography, Stack } from '@mui/material';
import EngineeringIcon from '@mui/icons-material/Engineering';

// Importar imágenes locales
import logoMantencion from '../assets/Logo_mantencion/logo_mantencion.webp';
import imgFondo from '../assets/Logo_mantencion/img_fondo.webp';

const MantenimientoPage = () => {
  return (
    <Box
      sx={{
        // Contenedor principal a pantalla completa
        height: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        // Imagen de fondo
        backgroundImage: `url(${imgFondo})`, // CAMBIO: Usando imagen de fondo local importada
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Capa de superposición oscura inspirada en tu web */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(10, 25, 41, 0.85)', // Tonalidad azul oscura de tu web
          zIndex: 1,
        }}
      />

      {/* Contenido centrado */}
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
        <Stack spacing={4} alignItems="center">
          
          {/* 1. Logo */}
          <Box
            component="img"
            src={logoMantencion} // CAMBIO: Usando logo local importado
            alt="Logo de Visual Mecánica"
            sx={{
              height: 'auto',
              maxWidth: '250px',
              marginBottom: 2,
            }}
          />
            
          {/* 2. Ícono de Mantenimiento */}
          <EngineeringIcon sx={{ fontSize: '6rem', color: '#FFB64D' }} />

          {/* 3. Título Principal */}
          <Typography 
            variant="h2" 
            component="h1" 
            sx={{ 
              fontWeight: 'bold', 
              color: 'white',
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)' 
            }}
          >
            Estamos en Mantenimiento
          </Typography>

          {/* 4. Mensaje Secundario */}
          <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            Estamos realizando mejoras importantes en nuestro sitio.
            <br />
            Disculpa las molestias, volveremos a estar en línea muy pronto.
          </Typography>
          
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
            Para consultas urgentes: contacto@visualmecanica.cl
        </Typography>
        </Stack>
      </Container>
    </Box>
  );
};

export default MantenimientoPage;