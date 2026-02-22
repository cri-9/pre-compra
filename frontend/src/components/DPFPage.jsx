import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineSeparator,
} from "@mui/lab";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import dpfImage1 from "../assets/img_prin_dpf/img_dpf_pro_1.png";
import dpfImage2 from "../assets/img_prin_dpf/img_dpf_pro_2.jpg";
import heroImage from "../assets/img_prin_dpf/img_dpf_pro_3.jpg";
import bannerMenuImage from "../assets/img_prin_dpf/img_dpf_pro_4.jpg";
import dpfImage5 from "../assets/img_prin_dpf/img_dpf_pro_5.jpg";
import dpfImage6 from "../assets/img_prin_dpf/img_dpf_pro_6.png";
import dpfImage7 from "../assets/img_prin_dpf/img_dpf_pro_7.jpg";
import dpfImage8 from "../assets/img_prin_dpf/img_dpf_pro_8.jpg";
import '../Csspersonalizado/landingpage.css';
import BotonWhatsApp from "./BotonWhatsApp";
import Footer from "./Footer";
import Navbar from "./Navbar";
import SEO from "./SEO";

// Componente de animación para secciones
const AnimatedSection = ({ children, delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );
};

// Hero Section con imagen y glassmorphism
const HeroSection = ({ numeroWhatsApp, mensajeWhatsApp }) => {
  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: { xs: '500px', sm: '600px', md: '700px' },
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        mt: 0,
        mb: 8,
        zIndex: 0,
      }}
    >
      {/* Imagen de fondo con parallax */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(15,23,42,0.85), rgba(30,41,59,0.75))',
          }
        }}
      />

      {/* Contenido Hero */}
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Box
            sx={{
              background: 'linear-gradient(135deg, rgba(15,23,42,0.75), rgba(88,28,135,0.65))',
              borderRadius: '32px',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              boxShadow: '0 30px 70px rgba(0, 0, 0, 0.4)',
              px: { xs: 3, sm: 5, md: 7 },
              py: { xs: 5, sm: 6, md: 8 },
              backdropFilter: 'blur(16px)',
            }}
          >
            <Stack spacing={4} alignItems="center" textAlign="center">
              <Chip
                label="SERVICIO ESPECIALIZADO DPF"
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  color: '#FFFFFF',
                  fontSize: '0.95rem',
                  fontWeight: 'bold',
                  px: 3,
                  py: 2,
                  borderRadius: '50px',
                  backdropFilter: 'blur(10px)',
                }}
              />

              <Typography
                variant="h2"
                sx={{
                  fontWeight: 800,
                  color: '#FFFFFF',
                  fontSize: { xs: '2.2rem', sm: '3rem', md: '3.8rem' },
                  lineHeight: 1.2,
                  textShadow: '0 4px 20px rgba(0,0,0,0.3)',
                }}
              >
                Regeneración de Filtro de Partículas Diésel
              </Typography>

              <Typography
                variant="h5"
                sx={{
                  color: 'rgba(255,255,255,0.9)',
                  maxWidth: '800px',
                  fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' },
                  lineHeight: 1.7,
                }}
              >
                Mantén tu motor diésel funcionando de manera óptima con nuestro servicio
                profesional de limpieza y regeneración de DPF Electrónicamente 
              </Typography>

              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={3}
                sx={{ pt: 2 }}
              >
                <Button
                  variant="contained"
                  href={`https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensajeWhatsApp)}`}
                  target="_blank"
                  sx={{
                    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                    color: '#FFFFFF',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    px: 6,
                    py: 2.5,
                    borderRadius: '50px',
                    textTransform: 'none',
                    boxShadow: '0 20px 40px rgba(16, 185, 129, 0.4)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                      transform: 'translateY(-3px)',
                      boxShadow: '0 25px 50px rgba(16, 185, 129, 0.5)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Solicitar Diagnóstico
                </Button>
              </Stack>
            </Stack>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

function DPFPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const numeroWhatsApp = "56949685530";
  const mensajeWhatsApp = "Hola, me interesa el servicio de Regeneración DPF";

  return (
    <Box sx={{ width: '100%', overflowX: 'hidden', position: 'relative', backgroundColor: '#f8fafc' }}>
      {/* SEO y Canonical URL */}
      <SEO 
        title="Regeneración DPF - Filtro de Partículas Diésel | Visual Mecánica"
        description="Servicio especializado de regeneración y limpieza de filtros DPF en Temuco. Diagnóstico, mantenimiento y reparación de filtros de partículas diésel."
        canonical="https://visualmecanica.cl/dpf"
        keywords="DPF, filtro partículas diésel, regeneración DPF, limpieza DPF, Temuco, servicio diésel, mantenimiento DPF"
      />
      
      {/* Header con Navbar e imagen banner */}
      <Box
        sx={{
          position: 'relative',
          backgroundImage: `url(${bannerMenuImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          minHeight: '200px',
          pb: 3,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.5))',
          }
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Navbar />
        </Box>
      </Box>

      {/* Hero Section */}
      <HeroSection numeroWhatsApp={numeroWhatsApp} mensajeWhatsApp={mensajeWhatsApp} />

      {/* Sección: ¿Qué es un DPF? */}
      <Container maxWidth="lg" sx={{ mt: 12, mb: 12, overflowX: 'hidden' }}>
        <Box sx={{ overflow: 'hidden' }}>
          <AnimatedSection delay={0.2}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 'bold',
                mb: 6,
                textAlign: 'center',
                color: '#0f172a',
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
              }}
            >
              ¿Qué es un Filtro DPF?
            </Typography>

            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={6}>
                <Box
                  component="img"
                  src={dpfImage1}
                  alt="Filtro DPF"
                  sx={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: '24px',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Card
                  sx={{
                    background: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)',
                    borderRadius: '24px',
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
                    p: { xs: 3, sm: 4, md: 5 },
                    border: '1px solid rgba(15, 23, 42, 0.08)',
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 'bold',
                        color: '#0f172a',
                        mb: 3,
                        fontSize: { xs: '1.3rem', sm: '1.5rem' }
                      }}
                    >
                      Filtro de Partículas Diésel (DPF)
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontSize: { xs: '1rem', sm: '1.1rem' },
                        lineHeight: 1.8,
                        color: '#475569',
                        textAlign: 'justify',
                      }}
                    >
                      El <strong>DPF (Diesel Particulate Filter)</strong> es un componente 
                      esencial en los vehículos diésel modernos. Su función principal es 
                      <strong> atrapar las partículas de hollín</strong> generadas por la combustión 
                      del motor diésel, impidiendo que estas emisiones contaminantes salgan 
                      al medio ambiente. Este sistema es crucial para cumplir con las normativas 
                      de emisiones actuales y mantener el aire limpio.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </AnimatedSection>
        </Box>
      </Container>

      {/* Sección: Cómo funciona - Regeneración */}
      <Box sx={{ backgroundColor: '#0f172a', py: 12 }}>
        <Container maxWidth="lg">
          <Box sx={{ overflow: 'hidden' }}>
            <AnimatedSection delay={0.3}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 'bold',
                mb: 8,
                textAlign: 'center',
                color: '#FFFFFF',
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
              }}
            >
              ¿Cómo Funciona la Regeneración?
            </Typography>

            <Grid container spacing={4}>
              <Grid item xs={12} md={5}>
                <Box
                  component="img"
                  src={dpfImage2}
                  alt="Regeneración DPF"
                  sx={{
                    width: '100%',
                    height: { xs: 'auto', md: '100%' },
                    minHeight: { md: '500px' },
                    objectFit: 'cover',
                    borderRadius: '24px',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
                  }}
                />
              </Grid>

              <Grid item xs={12} md={7}>
                <Stack spacing={3}>
                  <Card
                    sx={{
                      background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.05))',
                      borderRadius: '20px',
                      p: 3,
                      border: '1px solid rgba(16, 185, 129, 0.2)',
                    }}
                  >
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#10B981', mb: 2 }}>
                      Proceso de Regeneración
                    </Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.9)', lineHeight: 1.8 }}>
                      Con el tiempo, el filtro se llena de hollín y necesita quemarse. El proceso 
                      de regeneración consiste en <strong>quemar este hollín a alta temperatura</strong>, 
                      convirtiéndolo en ceniza para mantener el filtro limpio y funcional.
                    </Typography>
                  </Card>

                  <Card
                    sx={{
                      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.05))',
                      borderRadius: '20px',
                      p: 3,
                      border: '1px solid rgba(59, 130, 246, 0.2)',
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#3B82F6', mb: 2 }}>
                      Regeneración Pasiva
                    </Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.9)', lineHeight: 1.8 }}>
                      Ocurre automáticamente cuando el vehículo circula a <strong>altas revoluciones</strong> 
                      (por ejemplo, en autopista), ya que la temperatura de los gases de escape 
                      es suficiente para quemar el hollín de forma natural.
                    </Typography>
                  </Card>

                  <Card
                    sx={{
                      background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.1), rgba(234, 88, 12, 0.05))',
                      borderRadius: '20px',
                      p: 3,
                      border: '1px solid rgba(249, 115, 22, 0.2)',
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#F97316', mb: 2 }}>
                      Regeneración Activa
                    </Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.9)', lineHeight: 1.8 }}>
                      Si el motor no alcanza la temperatura necesaria, la <strong>centralita (ECU)</strong> 
                      activa el proceso inyectando combustible adicional para aumentar la temperatura 
                      del escape y quemar las partículas acumuladas.
                    </Typography>
                  </Card>
                </Stack>
              </Grid>
            </Grid>
          </AnimatedSection>
          </Box>
        </Container>
      </Box>

      {/* Sección: Problemas Comunes */}
      <Container maxWidth="lg" sx={{ mt: 12, mb: 12 }}>
        <Box sx={{ overflow: 'hidden' }}>
          <AnimatedSection delay={0.4}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 'bold',
              mb: 6,
              textAlign: 'center',
              color: '#0f172a',
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
            }}
          >
            Problemas Comunes del DPF
          </Typography>

          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Card
                  sx={{
                    height: '100%',
                    background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
                    borderRadius: '24px',
                    p: 4,
                    boxShadow: '0 10px 30px rgba(239, 68, 68, 0.2)',
                  }}
                >
                  <Box
                    component="img"
                    src={dpfImage5}
                    alt="Obstrucción DPF"
                    sx={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover',
                      borderRadius: '16px',
                      mb: 3,
                    }}
                  />
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#991b1b', mb: 2 }}>
                    🚨 Obstrucción del Filtro
                  </Typography>
                  <Typography sx={{ color: '#7f1d1d', lineHeight: 1.8 }}>
                    El problema surge principalmente en los <strong>trayectos urbanos cortos</strong>, 
                    donde el motor no alcanza las temperaturas necesarias para la regeneración 
                    automática. Esto causa acumulación progresiva de hollín que puede obstruir 
                    completamente el filtro.
                  </Typography>
                </Card>
              </motion.div>
            </Grid>

            <Grid item xs={12} md={6}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Card
                  sx={{
                    height: '100%',
                    background: 'linear-gradient(135deg, #fed7aa 0%, #fdba74 100%)',
                    borderRadius: '24px',
                    p: 4,
                    boxShadow: '0 10px 30px rgba(249, 115, 22, 0.2)',
                  }}
                >
                  <Box
                    component="img"
                    src={dpfImage6}
                    alt="Interrupción regeneración"
                    sx={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover',
                      borderRadius: '16px',
                      mb: 3,
                    }}
                  />
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#9a3412', mb: 2 }}>
                    ⚠️ Interrupción del Proceso
                  </Typography>
                  <Typography sx={{ color: '#7c2d12', lineHeight: 1.8 }}>
                    <strong>Apagar el motor</strong> antes de que finalice la regeneración activa 
                    puede provocar la acumulación de hollín. En casos extremos, el combustible 
                    no quemado puede llegar al aceite del motor y contaminarlo, causando daños 
                    graves al motor.
                  </Typography>
                </Card>
              </motion.div>
            </Grid>
          </Grid>
        </AnimatedSection>
        </Box>
      </Container>

      {/* Sección: Señales y Soluciones */}
      <Box sx={{ backgroundColor: '#f1f5f9', py: 12 }}>
        <Container maxWidth="lg">
          <Box sx={{ overflow: 'hidden' }}>
            <AnimatedSection delay={0.5}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 'bold',
                mb: 8,
                textAlign: 'center',
                color: '#0f172a',
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
              }}
            >
              Señales de Advertencia y Soluciones
            </Typography>

            <Grid container spacing={3}>
              {[
                {
                  icon: '💡',
                  title: 'Luces de Advertencia',
                  desc: 'La activación de una luz en el tablero puede indicar que el filtro se está llenando y que está en proceso de regeneración. No ignore estas señales.',
                  color: '#3B82F6'
                },
                {
                  icon: '⚡',
                  title: 'Fallas Repetidas',
                  desc: 'Si la regeneración falla repetidamente, puede encenderse más de un testigo de advertencia, lo que podría requerir una regeneración forzada en un taller especializado.',
                  color: '#EF4444'
                },
                {
                  icon: '🛠️',
                  title: 'Mantenimiento Preventivo',
                  desc: 'Para prevenir problemas, se recomienda circular de vez en cuando por carretera para permitir que el filtro se regenere completamente.',
                  color: '#10B981'
                },
                {
                  icon: '⛽',
                  title: 'Combustible de Calidad',
                  desc: 'Use siempre combustible de buena calidad. El combustible de mala calidad genera más hollín y acelera la obstrucción del filtro DPF.',
                  color: '#F59E0B'
                },
              ].map((item, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card
                      sx={{
                        height: '100%',
                        background: '#FFFFFF',
                        borderRadius: '20px',
                        p: 3,
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                        border: `2px solid ${item.color}20`,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12)',
                          borderColor: item.color,
                        }
                      }}
                    >
                      <Typography sx={{ fontSize: '3rem', mb: 2, textAlign: 'center' }}>
                        {item.icon}
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 'bold',
                          color: item.color,
                          mb: 2,
                          textAlign: 'center'
                        }}
                      >
                        {item.title}
                      </Typography>
                      <Typography
                        sx={{
                          color: '#64748b',
                          lineHeight: 1.7,
                          fontSize: '0.95rem',
                          textAlign: 'center'
                        }}
                      >
                        {item.desc}
                      </Typography>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </AnimatedSection>
          </Box>
        </Container>
      </Box>

      {/* Sección: Nuestro Servicio */}
      <Container maxWidth="lg" sx={{ mt: 12, mb: 12 }}>
        <Box sx={{ overflow: 'hidden' }}>
          <AnimatedSection delay={0.6}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 'bold',
              mb: 6,
              textAlign: 'center',
              color: '#0f172a',
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
            }}
          >
            Nuestro Servicio Profesional
          </Typography>

          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Stack spacing={3}>
                <Box
                  component="img"
                  src={dpfImage7}
                  alt="Servicio DPF"
                  sx={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: '24px',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
                  }}
                />
              </Stack>
            </Grid>

            <Grid item xs={12} md={6}>
              <Timeline position="right">
                <TimelineItem>
                  <TimelineSeparator>
                    <TimelineDot sx={{ backgroundColor: '#10B981' }} />
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent>
                    <Typography variant="h6" sx={{ color: '#10B981', fontWeight: 'bold' }}>
                      Diagnóstico Completo
                    </Typography>
                    <Typography>
                      Evaluación exhaustiva del estado del filtro DPF con equipamiento especializado
                    </Typography>
                  </TimelineContent>
                </TimelineItem>

                <TimelineItem>
                  <TimelineSeparator>
                    <TimelineDot sx={{ backgroundColor: '#3B82F6' }} />
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent>
                    <Typography variant="h6" sx={{ color: '#3B82F6', fontWeight: 'bold' }}>
                      Regeneración Forzada
                    </Typography>
                    <Typography>
                      Proceso controlado de regeneración activa para eliminar el hollín acumulado
                    </Typography>
                  </TimelineContent>
                </TimelineItem>

                <TimelineItem>
                  <TimelineSeparator>
                    <TimelineDot sx={{ backgroundColor: '#F59E0B' }} />
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent>
                    <Typography variant="h6" sx={{ color: '#F59E0B', fontWeight: 'bold' }}>
                      Reporte Detallado
                    </Typography>
                    <Typography>
                      Entregamos informe completo del servicio realizado y recomendaciones de mantenimiento
                    </Typography>
                  </TimelineContent>
                </TimelineItem>                
              </Timeline>
            </Grid>
          </Grid>
        </AnimatedSection>
        </Box>
      </Container>

      {/* Galería de imágenes */}
      <Box sx={{ backgroundColor: '#0f172a', py: 12 }}>
        <Container maxWidth="lg">
          <Box sx={{ overflow: 'hidden' }}>
            <AnimatedSection delay={0.7}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 'bold',
                mb: 8,
                textAlign: 'center',
                color: '#FFFFFF',
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
              }}
            >
              Equipamiento Profesional
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box
                  component="img"
                  src={dpfImage8}
                  alt="Equipamiento DPF"
                  sx={{
                    width: '100%',
                    height: '400px',
                    objectFit: 'cover',
                    borderRadius: '24px',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Card
                  sx={{
                    height: '100%',
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.05))',
                    borderRadius: '24px',
                    p: 4,
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="h4" sx={{ color: '#10B981', fontWeight: 'bold', mb: 3 }}>
                    Tecnología de Última Generación
                  </Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.1rem', lineHeight: 1.8, mb: 3 }}>
                    Contamos con equipamiento especializado para diagnóstico y regeneración de filtros DPF:
                  </Typography>
                  <Box component="ul" sx={{ color: 'rgba(255,255,255,0.9)', pl: 3 }}>
                    <Typography component="li" sx={{ mb: 2, fontSize: '1.05rem' }}>
                      Escáner Launch X431 Pro3 para diagnóstico preciso
                    </Typography>
                    <Typography component="li" sx={{ mb: 2, fontSize: '1.05rem' }}>
                      Equipos de regeneración forzada controlada
                    </Typography>
                    
                    <Typography component="li" sx={{ fontSize: '1.05rem' }}>
                      Personal técnico certificado y capacitado
                    </Typography>
                  </Box>
                </Card>
              </Grid>
            </Grid>
          </AnimatedSection>
          </Box>
        </Container>
      </Box>

      {/* CTA Final */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
          py: 10,
          mt: 8,
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ overflow: 'hidden' }}>
            <AnimatedSection>
            <Box sx={{ textAlign: 'center' }}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 'bold',
                  color: 'white',
                  mb: 3,
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
                }}
              >
                ¿Problemas con tu Filtro DPF?
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  color: 'rgba(255,255,255,0.95)',
                  mb: 5,
                  fontSize: { xs: '1.2rem', sm: '1.4rem' }
                }}
              >
                Agenda tu diagnóstico profesional y evita daños mayores en tu motor
              </Typography>
              <Button
                component="a"
                href={`https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensajeWhatsApp)}`}
                target="_blank"
                rel="noopener"
                variant="contained"
                size="large"
                sx={{
                  backgroundColor: '#FFFFFF',
                  color: '#059669',
                  fontSize: '1.3rem',
                  px: 8,
                  py: 3,
                  borderRadius: '50px',
                  fontWeight: 'bold',
                  textTransform: 'none',
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
                  '&:hover': {
                    backgroundColor: '#f0fdf4',
                    transform: 'translateY(-3px)',
                    boxShadow: '0 15px 50px rgba(0, 0, 0, 0.3)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                WhatsApp - Servicio DPF
              </Button>
            </Box>
          </AnimatedSection>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Footer />

      {/* Botón WhatsApp flotante */}
      <BotonWhatsApp numeroTelefono={numeroWhatsApp} mensajeInicial={mensajeWhatsApp} />
    </Box>
  );
}

export default DPFPage;
