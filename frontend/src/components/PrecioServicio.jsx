import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';

// Estilos personalizados para el Badge de "Oferta"
const OfferBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -15, // Reducido para evitar desbordamiento
    top: 15,    // Reducido para mejor posicionamiento
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 6px', // Reducido padding para móviles
    backgroundColor: '#E53935', // Rojo para el badge
    color: 'white',
    fontWeight: 'bold',
    borderRadius: '12px', // Reducido para móviles
    transform: 'rotate(12deg)', // Menos rotación para mejor fit
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    fontSize: '0.75rem', // Tamaño de fuente más pequeño
    // Ajustes responsivos para pantallas pequeñas
    [theme.breakpoints.down('sm')]: {
      right: -8,
      top: 8,
      padding: '0 4px',
      fontSize: '0.65rem',
      borderRadius: '8px',
      transform: 'rotate(8deg)',
    },
  },
}));

function PrecioServicio() {
  return (
    <Box
      sx={{
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#F2F0F4', // Fondo gris claro
        py: 6, // Espaciado vertical
        px: 2, // Espaciado horizontal
        borderRadius: '16px 16px 0 0', // Solo bordes superiores redondeados
        textAlign: 'center',
        // Efecto de onda en la parte inferior con punta
        clipPath: 'polygon(0 0, 100% 0, 100% 85%, 90% 90%, 80% 85%, 70% 90%, 60% 85%, 50% 100%, 40% 85%, 30% 90%, 20% 85%, 10% 90%, 0 85%)',
        paddingBottom: '40px', // Espacio extra para acomodar la forma de onda
      }}
    >
      {/* Contenedor del título e ícono */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2, color: '#1A237E' }}>
          Valor del servicio Escaner en Temuco 
        </Typography>
        <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
          {/* Iconos emoji más pequeños */}
          <Typography variant="h5" sx={{ mr: 1, color: '#1A237E' }}>🔎</Typography>
          <Typography variant="h5" sx={{ color: '#1A237E' }}>🚗</Typography>
        </Box>
      </Box>

      {/* Card principal con el precio */}
      <OfferBadge badgeContent="¡OFERTA!" color="error" overlap="circular">
        <Card
          sx={{
            // Dimensiones responsivas para evitar desbordamiento
            width: { xs: 300, sm: 380, md: 420 }, // Responsive width
            height: { xs: 280, sm: 300, md: 320 }, // Responsive height
            margin: '0 auto',
            borderRadius: '16px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.16)',
            position: 'relative',
            p: { xs: 2, md: 3 }, // Padding responsive
            border: '2px solid #ddd',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <CardContent sx={{ p: 1.5, width: '100%', textAlign: 'center' }}>
            <Box
              sx={{
                backgroundColor: '#515DDB', // Azul oscuro para el header del precio
                color: 'white',
                borderRadius: '12px',
                p: 2, // Espaciado interno
                mb: 6, // Margen inferior
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Typography variant="h6" sx={{ textDecoration: 'line-through', color: 'rgba(255,255,255,0.8)' }}>
                $54.000
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 'light', fontStyle: 'italic' }}>
                Valor de lanzamiento escaner
              </Typography>
            </Box>

            <Typography variant="h1" sx={{ 
              fontWeight: 'bold', 
              color: '#7B1FA2', 
              fontSize: { 
                xs: '2.5rem',  // En pantallas extra pequeñas (móvil)
                sm: '3.5rem',  // En pantallas pequeñas (tablet)
                md: '4.5rem',  // En pantallas medianas (desktop) 
                } 
                }}>
              $35.000
            </Typography>
          </CardContent>
        </Card>
      </OfferBadge>
    </Box>
  );
}

export default PrecioServicio;