import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// Estilos personalizados para el Badge de "Oferta"
const OfferBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -15,
    top: 15,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 8px',
    backgroundColor: '#E53935',
    color: 'white',
    fontWeight: 'bold',
    borderRadius: '12px',
    transform: 'rotate(12deg)',
    boxShadow: '0 4px 12px rgba(229, 57, 53, 0.4)',
    fontSize: '0.8rem',
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

// Tarjeta mejorada con efecto glassmorphism
const PriceCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255,255,255,0.3)',
  borderRadius: '20px',
  overflow: 'hidden',
  position: 'relative',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-12px)',
    boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
    borderColor: 'rgba(255,255,255,0.5)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '2px',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
  },
}));

// Contenedor con gradiente elegante
const GradientContainer = styled(Box)(({ theme, bgColor = '#F2F0F4' }) => ({
  width: '100%',
  position: 'relative',
  overflow: 'hidden',
  background: `linear-gradient(135deg, ${bgColor} 0%, ${bgColor}dd 50%, ${bgColor}99 100%)`,
  py: { xs: 5, md: 8 },
  px: { xs: 2, md: 4 },
  borderRadius: '24px',
  textAlign: 'center',
}));

function PrecioServicio() {
  const serviciosPrincipales = [
    {
      id: 1,
      nombre: 'Escáner',
      icono: '🔎',
      iconoLargo: '🚗',
      precioAnterior: 45000,
      precioActual: 35000,
      descripcion: 'Escáner Automotriz Profesional',
      caracteristicas: ['Diagnóstico completo', 'Análisis de sistemas', 'Reporte detallado'],
      color: '#515DDB',
      oferta: true,
    },
    {
      id: 4,
      nombre: 'Inspección Full',
      icono: '📋',
      iconoLargo: '🔍',
      precioAnterior: 79000,
      precioActual: 62500,
      descripcion: 'Inspección Automotriz Completa',
      caracteristicas: ['+ de 150 puntos de revisión', 'Revisión interior/exterior', 'Informe Electrónico OBD2', 'Informe técnico', 'Revisión de pintura (micras)', 'Prueba de ruta', 'Revisión Mecánica', 'Fotografias'],
      color: '#FFB64D',
      oferta: true,
    },
  ];

  const nuevosServicios = [
    {
      id: 2,
      nombre: 'Mantenimiento TPMS',
      icono: '🔧',
      iconoLargo: '⚙️',
      precioAnterior: 125000,
      precioActual: 75000,
      descripcion: 'Sistema de Monitoreo de Presión',
      caracteristicas: ['Diagnóstico', 'Instalación', 'Activación', 'Programación', 'Garantía'],
      color: '#7B1FA2',
      oferta: true,
    },
    {
      id: 3,
      nombre: 'Regeneración DPF',
      icono: '💨',
      iconoLargo: '🌱',
      precioAnterior: 80000,
      precioActual: 60000,
      descripcion: 'Regeneración Electrónica de Filtro de Partículas',
      caracteristicas: ['Diagnóstico con escáner', 'Regeneración electrónica', 'Reset de error', 'Prueba'],
      color: '#BA3216',
      oferta: true,
    },
  ];

  const MotionCard = motion(PriceCard);

  return (
    <Box
      sx={{
        width: '100%',
        py: { xs: 4, md: 8 },
        px: { xs: 2, md: 4 },
        background: 'linear-gradient(180deg, #FAFAFA 0%, #F5F5F5 100%)',
      }}
    >
      {/* Sección de título con efecto */}
      <Box sx={{ mb: 8, textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <Typography
          variant="h4"
            component="h1"// Cambiado a h2 para semántica
            gutterBottom // Agregar más separación debajo del título
            sx={{
              color: '#1848B9',
              fontWeight: 'bold',
              textAlign: 'center',
              mb: 4, // Más separación debajo del título
            }}
        >
          Nuestros Servicios de Inspección Pre-Compra<br /> Escáner y Mantenimiento TPMS y DPF
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: '#666',
            fontWeight: 300,
            mb: 1,
            fontSize: { xs: '0.95rem', md: '1.1rem' },
          }}
        >
          Ofertas profesionales con la mejor calidad
        </Typography>
        {/* Línea decorativa */}
        <Box
          sx={{
            height: '4px',
            width: '80px',
            background: 'linear-gradient(90deg, #7B1FA2, #00897B)',
            margin: '20px auto 0',
            borderRadius: '2px',
          }}
        />
      </Box>

      {/* Contenedor principal de tarjetas - Todos los servicios */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { 
            xs: '1fr', 
            sm: '1fr 1fr', 
            md: 'repeat(4, 1fr)' 
          },
          gap: { xs: 3, sm: 2.5, md: 2, lg: 2.5, xl: 3 },
          maxWidth: { xs: '100%', sm: '100%', md: '100%', lg: '1400px', xl: '1600px' },
          margin: '0 auto',
          alignItems: 'stretch',
          px: { xs: 2, sm: 2, md: 1.5, lg: 2, xl: 2 },
          mb: 8,
        }}
      >
        {[...serviciosPrincipales, ...nuevosServicios].map((servicio, index) => (
          <MotionCard
            key={servicio.id}
            initial={{ opacity: 1, y: 0 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            viewport={{ once: true }}
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `radial-gradient(circle at 30% 20%, ${servicio.color}08, transparent 50%)`,
                pointerEvents: 'none',
              },
            }}
          >
            {/* Badge de oferta */}
            {servicio.oferta && (
              <OfferBadge badgeContent="¡OFERTA!" color="error" overlap="circular">
                <Box sx={{ width: 0, height: 0 }} />
              </OfferBadge>
            )}

            <CardContent sx={{ p: { xs: 2.5, md: 3 }, pb: 3, flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>
              {/* Iconos decorativos */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 1,
                  mb: 2.5,
                  fontSize: { xs: '1.4rem', md: '1.6rem' },
                  fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                }}
              >
                <Typography sx={{ fontSize: 'inherit', fontFamily: 'inherit' }}>{servicio.icono}</Typography>
                <Typography sx={{ fontSize: 'inherit', fontFamily: 'inherit' }}>{servicio.iconoLargo}</Typography>
              </Box>

              {/* Nombre del servicio */}
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 'bold',
                  mb: 0.5,
                  color: servicio.color,
                  fontSize: { xs: '1.4rem', md: '1.6rem' },
                }}
              >
                {servicio.nombre}
              </Typography>

              {/* Descripción */}
              <Typography
                variant="body2"
                sx={{
                  color: '#666',
                  mb: 2.5,
                  fontWeight: 300,
                  fontSize: '0.95rem',
                  minHeight: '2.5rem',
                }}
              >
                {servicio.descripcion}
              </Typography>

              {/* Sección de precios */}
              <Box
                sx={{
                  backgroundColor: `${servicio.color}08`,
                  border: `2px solid ${servicio.color}20`,
                  borderRadius: '16px',
                  p: 2.5,
                  mb: 2.5,
                  textAlign: 'center',
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    textDecoration: 'line-through',
                    color: '#a51a1aff',
                    fontSize: '0.9rem',
                    mb: 1,
                    fontWeight: 400,
                  }}
                >
                  ${servicio.precioAnterior.toLocaleString('es-CL')}
                </Typography>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 'bold',
                    color: servicio.color,
                    fontSize: { xs: '2.2rem', md: '2.8rem' },
                    lineHeight: 1,
                  }}
                >
                  ${servicio.precioActual.toLocaleString('es-CL')}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: '#999',
                    fontSize: '0.8rem',
                    mt: 1,
                    display: 'block',
                    fontStyle: 'italic',
                  }}
                >
                  {Math.round(((servicio.precioAnterior - servicio.precioActual) / servicio.precioAnterior) * 100)}% descuento
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: '#331812',
                    fontSize: '0.9rem',
                  }}
                >
                  valor c/iva
                </Typography>
              </Box>

              {/* Características */}
              <Box sx={{ mb: 2.5, flex: 1 }}>
                {servicio.caracteristicas.map((caracteristica, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      mb: 1,
                      color: '#555',
                      fontSize: '0.9rem',
                      fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                    }}
                  >
                    <Box
                      sx={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: servicio.color,
                        mr: 1.5,
                      }}
                    />
                    {caracteristica}
                  </Box>
                ))}
              </Box>

              {/* Botón CTA */}
              <Button
                component={servicio.id === 2 || servicio.id === 3 ? 'a' : Link}
                {...(servicio.id === 2 || servicio.id === 3 
                  ? {
                      href: `https://wa.me/56949685530?text=Hola%2C%20me%20interesa%20el%20servicio%20de%20${encodeURIComponent(servicio.nombre)}`,
                      target: '_blank',
                      rel: 'noopener noreferrer'
                    }
                  : { to: '/agendar' }
                )}
                variant="contained"
                sx={{
                  backgroundColor: servicio.color,
                  color: 'white',
                  fontWeight: 'bold',
                  borderRadius: '12px',
                  py: 1.5,
                  fontSize: '0.95rem',
                  textTransform: 'none',
                  transition: 'all 0.3s ease',
                  textDecoration: 'none',
                  display: 'block',
                  '&:hover': {
                    backgroundColor: servicio.color,
                    transform: 'translateY(-2px)',
                    boxShadow: `0 8px 24px ${servicio.color}40`,
                  },
                  '&:active': {
                    transform: 'translateY(0)',
                  },
                }}
              >
                {servicio.id === 2 || servicio.id === 3 ? 'Contactar por WhatsApp' : 'Agendar'}
              </Button>
            </CardContent>
          </MotionCard>
        ))}
      </Box>

    </Box>
  );
}

export default PrecioServicio;