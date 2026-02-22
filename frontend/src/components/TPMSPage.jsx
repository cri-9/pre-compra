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
import bannerMenuImage from "../assets/img_menu_superior_tpms/img_banner_menu.webp";
import videoTPMS from "../assets/img_tpms/img_cuerpo.mp4";
import sensorImage from "../assets/img_tpms/img_tpms_que_es.png";
import sensorImage1 from "../assets/img_tpms/img_tpms_que_es_3.png";
import tpmsIcono from "../assets/img_tpms/tpms_presion_llanta.png";
import '../Csspersonalizado/landingpage.css';
import BotonWhatsApp from "./BotonWhatsApp";
import Footer from "./Footer";
import Navbar from "./Navbar";
import SEO from "./SEO"; // Componente para SEO y canonical URLs

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

// Componente de video con animación zoom
const VideoHeader = ({ numeroWhatsApp, mensajeWhatsApp }) => {
  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: { xs: '400px', sm: '500px', md: '600px' },
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        mt: 0,
        mb: 6,
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        zIndex: 0,
      }}
    >
      <motion.div
        initial={{ scale: 1.2 }}
        animate={{ scale: 1 }}
        transition={{
          duration: 2,
          ease: "easeOut"
        }}
        style={{
          width: '100%',
          height: '100%',
          willChange: 'transform'
        }}
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        >
          <source src={videoTPMS} type="video/mp4" />
        </video>
      </motion.div>
      
      {/* Overlay oscuro con estilo Material */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.6))',
          backdropFilter: 'brightness(0.8)',
        }}
      />

      {/* Contenido sobre el video */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 2,
          width: { xs: '92%', sm: '85%', md: '70%' },
          maxWidth: '920px',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={{ overflow: 'visible', willChange: 'transform' }}
        >
          <Box
            sx={{
              background: 'linear-gradient(135deg, rgba(15,23,42,0.78), rgba(88,28,135,0.72))',
              borderRadius: '28px',
              border: '1px solid rgba(148, 163, 184, 0.25)',
              boxShadow: '0 25px 60px rgba(15, 12, 41, 0.35)',
              px: { xs: 3, sm: 5, md: 6 },
              py: { xs: 4, sm: 5, md: 6 },
              backdropFilter: 'blur(10px)',
            }}
          >
            <Stack
              spacing={{ xs: 2.5, md: 3 }}
              sx={{ textAlign: { xs: 'center', md: 'left' } }}
              alignItems={{ xs: 'center', md: 'flex-start' }}
            >
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{ width: '100%', justifyContent: { xs: 'center', md: 'flex-start' } }}
              >
                <Box
                  sx={{
                    width: 62,
                    height: 62,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.35), rgba(255,255,255,0.08))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 14px 30px rgba(0,0,0,0.25)',
                    border: '1px solid rgba(255,255,255,0.35)',
                  }}
                >
                  <Box
                    component="img"
                    src={tpmsIcono}
                    alt="Ícono TPMS"
                    sx={{ width: '60%', height: '60%', objectFit: 'contain' }}
                  />
                </Box>
                <Typography
                  variant="overline"
                  sx={{
                    fontSize: { xs: '0.75rem', sm: '0.8rem' },
                    letterSpacing: 4,
                    textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.75)',
                  }}
                >
                  Servicio TPMS
                </Typography>
              </Stack>

              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  lineHeight: 1.2,
                  color: '#FFFFFF',
                  fontSize: { xs: '2rem', sm: '2.4rem', md: '3rem' },
                }}
              >
                Te aparecio una alerta en tu tablero del vehiculo? <br /> y no sabes que significa.
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: 'rgba(255,255,255,0.85)',
                  maxWidth: { xs: '100%', md: '640px' },
                  fontSize: { xs: '1rem', sm: '1.1rem' },
                  lineHeight: 1.7,
                }}
              >
                Estas en el lugar correcto para realizar y poder solucionar tus inquietudes al respecto de este error.
                Tenemos los mejores especialistas y herramientas para ayudarte.

              </Typography>

              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                alignItems={{ xs: 'center', md: 'flex-start' }}
                justifyContent={{ xs: 'center', md: 'flex-start' }}
                sx={{
                  width: '100%',
                  flexWrap: 'wrap',
                  rowGap: 1,
                  columnGap: '12px',
                  '& > *': {
                    flexBasis: { xs: '100%', sm: 'calc(50% - 12px)', md: 'auto' },
                    flexGrow: { xs: 1, sm: 0 },
                    minWidth: 0,
                  }
                }}
              >
                <Chip
                  label="Lectura profesional con escáner especializado"
                  sx={{
                    backgroundColor: 'rgba(255,255,255,0.12)',
                    color: 'rgba(255,255,255,0.9)',
                    borderRadius: '999px',
                    px: 2,
                    py: 1,
                    fontSize: '0.85rem',
                    letterSpacing: 0.3,
                    backdropFilter: 'blur(6px)',
                    whiteSpace: 'normal',
                    textAlign: 'center',
                  }}
                />
                <Chip
                  label="Compatibilidad con casi todos los vehículos del mercado"
                  sx={{
                    backgroundColor: 'rgba(255,255,255,0.12)',
                    color: 'rgba(255,255,255,0.9)',
                    borderRadius: '999px',
                    px: 2,
                    py: 1,
                    fontSize: '0.85rem',
                    letterSpacing: 0.3,
                    backdropFilter: 'blur(6px)',
                    whiteSpace: 'normal',
                    textAlign: 'center',
                  }}
                />
                <Chip
                  label="Programación de sensores"
                  sx={{
                    backgroundColor: 'rgba(255,255,255,0.12)',
                    color: 'rgba(255,255,255,0.9)',
                    borderRadius: '999px',
                    px: 2,
                    py: 1,
                    fontSize: '0.85rem',
                    letterSpacing: 0.3,
                    backdropFilter: 'blur(6px)',
                    whiteSpace: 'normal',
                    textAlign: 'center',
                  }}
                />
                <Chip
                  label="Calibración por cada rueda con valores de fábrica"
                  sx={{
                    backgroundColor: 'rgba(255,255,255,0.12)',
                    color: 'rgba(255,255,255,0.9)',
                    borderRadius: '999px',
                    px: 2,
                    py: 1,
                    fontSize: '0.85rem',
                    letterSpacing: 0.3,
                    backdropFilter: 'blur(6px)',
                    whiteSpace: 'normal',
                    textAlign: 'center',
                  }}
                />
              </Stack>

              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                alignItems={{ xs: 'center', md: 'flex-start' }}
                justifyContent={{ xs: 'center', md: 'flex-start' }}
                sx={{
                  width: '100%',
                  flexWrap: 'wrap',
                  rowGap: 2,
                  columnGap: '16px',
                  '& > *': {
                    flexBasis: { xs: '100%', sm: 'calc(50% - 16px)', md: 'auto' },
                    flexGrow: { xs: 1, sm: 0 },
                    minWidth: 0,
                  }
                }}
              >
                <Button
                  variant="contained"
                  href={`https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensajeWhatsApp)}`}
                  target="_blank"
                  sx={{
                    background: 'linear-gradient(135deg, #7B1FA2 0%, #9C27B0 100%)',
                    color: '#ffffff',
                    fontSize: { xs: '0.95rem', sm: '1rem' },
                    fontWeight: 'bold',
                    px: { xs: 4, sm: 5 },
                    py: 1.8,
                    borderRadius: '40px',
                    textTransform: 'none',
                    boxShadow: '0 18px 35px rgba(123, 31, 162, 0.38)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #6A1891 0%, #8E24AA 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 20px 50px rgba(110, 20, 150, 0.45)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Agenda tu asesoría TPMS
                </Button>

                <Typography
                  variant="body2"
                  sx={{
                    color: 'rgba(255,255,255,0.7)',
                    width: '100%',
                    maxWidth: { xs: '100%', md: 320 },
                    fontSize: { xs: '0.9rem', sm: '0.95rem' },
                    textAlign: { xs: 'center', sm: 'left' }
                  }}
                >
                  Atención personalizada por especialistas certificados. 
                  Coordinamos visita en terreno con nuestro técnico.
                </Typography>
              </Stack>
            </Stack>
          </Box>
        </motion.div>
      </Box>
    </Box>
  );
};

function TPMSPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const numeroWhatsApp = "56949685530";
  const mensajeWhatsApp = "Hola, me interesa el servicio de TPMS";

  return (
    <Box sx={{ width: '100%', overflowX: 'hidden', position: 'relative', backgroundColor: '#f9f6fc' }}>
      {/* SEO y Canonical URL */}
      <SEO 
        title="Servicio TPMS - Sistema de Monitoreo de Presión de Neumáticos | Visual Mecánica"
        description="Servicio especializado de diagnóstico y calibración TPMS en Temuco. Sistema de monitoreo de presión de neumáticos. Sensores, reprogramación y mantenimiento profesional."
        canonical="https://visualmecanica.cl/tpms"
        keywords="TPMS, monitoreo presión neumáticos, sensores TPMS, calibración TPMS, Temuco, servicio automotriz, presión neumáticos"
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
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.4))',
          }
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Navbar />
        </Box>
      </Box>

      {/* Video Header con animación - ancho completo */}
      <Box sx={{ mt: { xs: 2, sm: 3 } }}>
        <VideoHeader numeroWhatsApp={numeroWhatsApp} mensajeWhatsApp={mensajeWhatsApp} />
      </Box>

     

      {/* Sección: ¿Qué es un TPMS? */}
      <Container maxWidth="lg" sx={{ mt: 12, mb: 12, overflowX: 'hidden' }}>
        <Box sx={{ overflow: 'hidden' }}>
          <AnimatedSection delay={0.2}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 'bold',
              mb: 6,
              textAlign: 'center',
              color: '#1848B9',
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
            }}
          >
            ¿Qué es un TPMS?
          </Typography>

          <Grid container spacing={4} alignItems="center" sx={{ overflow: 'hidden' }}>
            <Grid item xs={12} md={5}>
              <Box
                component="img"
                src={sensorImage}
                alt="Sensor TPMS"
                sx={{
                  width: '100%',
                  maxWidth: '400px',
                  height: 'auto',
                  borderRadius: '20px',
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
                  display: 'block',
                  margin: '0 auto',
                }}
              />
            </Grid>
            <Grid item xs={12} md={7}>
              <Card
                sx={{
                  backgroundColor: '#EDE7F6',
                  borderRadius: '20px',
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)',
                  p: { xs: 3, sm: 4 },
                }}
              >
                <CardContent>
                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
                      lineHeight: 1.8,
                      color: '#424242',
                      textAlign: 'justify',
                    }}
                  >
                    Un sensor <strong>TPMS (Tire Pressure Monitoring System)</strong> es un 
                    dispositivo que monitorea la presión de los neumáticos de un vehículo 
                    para alertar al conductor cuando está baja, mejorando la seguridad, 
                    la eficiencia del combustible y la vida útil del neumático.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          </AnimatedSection>
        </Box>
      </Container>

      {/* Sección: ¿Para qué sirve? */}
      <Container maxWidth="lg" sx={{ mt: 12, mb: 12, overflowX: 'hidden' }}>
        <Box sx={{ overflow: 'hidden' }}>
          <AnimatedSection delay={0.3}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 'bold',
              mb: 6,
              textAlign: 'center',
              color: '#1848B9',
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
            }}
          >
            ¿Para qué sirve?
          </Typography>

          <Grid
            container
            spacing={4}
            alignItems="center"
            direction={isMobile ? 'column-reverse' : 'row'}
            sx={{ overflow: 'hidden' }}
          >
            <Grid item xs={12} md={7}>
              <Card
                sx={{
                  backgroundColor: '#DBD6E1',
                  borderRadius: '20px',
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)',
                  p: { xs: 3, sm: 4 },
                }}
              >
                <CardContent>
                  <Box component="ul" sx={{ pl: 2 }}>
                    {[
                      { title: 'Aumenta la seguridad', desc: 'Previene accidentes causados por neumáticos desinflados' },
                      { title: 'Ahorra combustible', desc: 'Neumáticos con presión correcta reducen el consumo' },
                      { title: 'Prolonga la vida de los neumáticos', desc: 'Mantiene el desgaste uniforme' },
                      { title: 'Avisa de forma proactiva', desc: 'Alerta antes de que sea un problema grave' }
                    ].map((item, index) => (
                      <Box
                        component="li"
                        key={index}
                        sx={{
                          mb: 3,
                          listStyle: 'none',
                          position: 'relative',
                          pl: 3,
                          '&::before': {
                            content: '"•"',
                            position: 'absolute',
                            left: 0,
                            color: '#7B1FA2',
                            fontSize: '1.5rem',
                            fontWeight: 'bold',
                          }
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 'bold',
                            color: '#7B1FA2',
                            mb: 0.5,
                            fontSize: { xs: '1.1rem', sm: '1.2rem' }
                          }}
                        >
                          {item.title}
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            color: '#555',
                            fontSize: { xs: '0.95rem', sm: '1rem' }
                          }}
                        >
                          {item.desc}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={5}>
              <Box
                component="img"
                src={sensorImage1}
                alt="Sensor TPMS"
                sx={{
                  width: '100%',
                  maxWidth: '600px',
                  height: 'auto',                  
                  borderRadius: '20px',
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
                  display: 'block',
                  margin: '0 auto',
                }}
              />
            </Grid>
          </Grid>
          </AnimatedSection>
        </Box>
      </Container>

      {/* === Sección: Proceso del servicio TPMS === */}
      <Box
        sx={{
          py: 8,
          px: { xs: 2, md: 6 },
          backgroundColor: "#DBD6E1",
          color: "#A35F00",
          borderRadius: 3,
          mt: 12,
          mb: 12,
        }}
      >
        <Typography
          variant="h3"
          sx={{
            textAlign: "center",
            mb: 6,
            fontWeight: "bold",
            color: "#1848B9",
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
          }}
        >
          ¿Cómo funciona nuestro servicio TPMS?
        </Typography>

        <Timeline position="alternate">
          {/* Paso 1 */}
          <TimelineItem>
            <TimelineSeparator>
              <TimelineDot sx={{ backgroundColor: "#50455E" }} />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <Typography variant="h6" sx={{ color: "#50455E" }}>
                1. Contacto inicial
              </Typography>
              <Typography>
                El cliente se comunica con Visual Mecánica para solicitar revisión del sistema TPMS.
              </Typography>
            </TimelineContent>
          </TimelineItem>

          {/* Paso 2 */}
          <TimelineItem>
            <TimelineSeparator>
              <TimelineDot sx={{ backgroundColor: "#7B1FA2" }} />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <Typography variant="h6" sx={{ color: "#7B1FA2" }}>
                2. Diagnóstico con escáner
              </Typography>
              <Typography>
                El técnico realiza la lectura de códigos de error con el escáner Launch X431 Pro3
                para determinar si uno o más sensores presentan fallas.
              </Typography>
            </TimelineContent>
          </TimelineItem>

          {/* Paso 3 */}
          <TimelineItem>
            <TimelineSeparator>
              <TimelineDot sx={{ backgroundColor: "#50455E" }} />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <Typography variant="h6" sx={{ color: "#50455E" }}>
                3. Evaluación y reparación
              </Typography>
              <Typography>
                Si no es necesario reemplazar sensores, se reinician los códigos de error. Si es necesario cambiar,
                el vehículo se traslada a vulcanización para desmontar la rueda y reemplazar el sensor.
              </Typography>
            </TimelineContent>
          </TimelineItem>

          {/* Paso 4 */}
          <TimelineItem>
            <TimelineSeparator>
              <TimelineDot sx={{ backgroundColor: "#7B1FA2" }} />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <Typography variant="h6" sx={{ color: "#7B1FA2" }}>
                4. Reprogramación y prueba de ruta
              </Typography>
              <Typography>
                Se reprograman los nuevos sensores con el escáner y se realiza una prueba de ruta de 10 minutos
                para verificar su correcto funcionamiento.
              </Typography>
            </TimelineContent>
          </TimelineItem>

          {/* Paso 5 */}
          <TimelineItem>
            <TimelineSeparator>
              <TimelineDot sx={{ backgroundColor: "#50455E" }} />
            </TimelineSeparator>
            <TimelineContent>
              <Typography variant="h6" sx={{ color: "#50455E" }}>
                5. Entrega e informe final
              </Typography>
              <Typography>
                Se entrega el informe del escáner Launch X431 Pro3 junto con el vehículo.
                El cliente recibe el reporte final y se realiza el pago del servicio.
              </Typography>
            </TimelineContent>
          </TimelineItem>
        </Timeline>
      </Box>

      {/* Sección: Tipos de TPMS */}
      <Container
        maxWidth="lg"
        sx={{
          mt: 12,
          mb: 12,
          overflowX: 'hidden',
        }}
      >
        <Box sx={{ overflow: 'hidden' }}>
          <AnimatedSection delay={0.4}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 'bold',
              mb: 2,
              textAlign: 'center',
              color: '#1848B9',
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
            }}
          >
            Existen dos tipos de TPMS
          </Typography>

          <Typography
            variant="h5"
            sx={{
              mb: 6,
              textAlign: 'center',
              color: '#7B1FA2',
              fontWeight: 600,
              fontSize: { xs: '1.3rem', sm: '1.5rem' },
            }}
          >
            Directo e Indirecto
          </Typography>

          <Grid container spacing={4} sx={{ overflow: 'hidden' }}>
            {/* TPMS Directo */}
            <Grid item xs={12} md={6} sx={{ overflow: 'hidden' }}>
              <Box
                component={motion.div}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                sx={{
                  willChange: 'transform',
                  overflow: 'visible',
                }}
              >
                <Card
                  sx={{
                    height: '100%',
                    background: 'linear-gradient(135deg, #1e293b 0%, #523370 100%)',
                    borderRadius: '20px',
                    boxShadow: '0 10px 40px rgba(123, 31, 162, 0.3)',
                    p: { xs: 3, sm: 4 },
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background:
                        'radial-gradient(circle at top right, rgba(255,255,255,0.1), transparent)',
                    },
                  }}
                >
                  <CardContent sx={{ position: 'relative', zIndex: 1 }}>
                    <Chip
                      label="DIRECTO"
                      sx={{
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        color: 'white',
                        fontWeight: 'bold',
                        mb: 2,
                        fontSize: '0.9rem',
                      }}
                    />
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 'bold',
                        color: 'white',
                        mb: 3,
                        fontSize: { xs: '1.3rem', sm: '1.5rem' },
                      }}
                    >
                      TPMS Directo
                    </Typography>
                    <Box component="ul" sx={{ pl: 2, color: 'white' }}>
                      <Typography component="li" sx={{ mb: 2, fontSize: { xs: '0.95rem', sm: '1rem' }, lineHeight: 1.6 }}>
                        Utiliza sensores de presión montados directamente en cada válvula de neumático
                      </Typography>
                      <Typography component="li" sx={{ mb: 2, fontSize: { xs: '0.95rem', sm: '1rem' }, lineHeight: 1.6 }}>
                        Miden la presión y la temperatura en tiempo real
                      </Typography>
                      <Typography component="li" sx={{ mb: 2, fontSize: { xs: '0.95rem', sm: '1rem' }, lineHeight: 1.6 }}>
                        Envían los datos a la computadora del vehículo, que los muestra en el tablero
                      </Typography>
                      <Typography component="li" sx={{ fontSize: { xs: '0.95rem', sm: '1rem' }, lineHeight: 1.6 }}>
                        Muestra la presión de cada neumático individualmente
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </Grid>

            {/* TPMS Indirecto */}
            <Grid item xs={12} md={6} sx={{ overflow: 'hidden' }}>
              <Box
                component={motion.div}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                sx={{
                  willChange: 'transform',
                  overflow: 'visible',
                }}
              >
                <Card
                  sx={{
                    height: '100%',
                    background: 'linear-gradient(135deg, #50455E 0%, #523370 100%)',
                    borderRadius: '20px',
                    boxShadow: '0 10px 40px rgba(245, 87, 108, 0.3)',
                    p: { xs: 3, sm: 4 },
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background:
                        'radial-gradient(circle at top right, rgba(255,255,255,0.1), transparent)',
                    },
                  }}
                >
                  <CardContent sx={{ position: 'relative', zIndex: 1 }}>
                    <Chip
                      label="INDIRECTO"
                      sx={{
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        color: 'white',
                        fontWeight: 'bold',
                        mb: 2,
                        fontSize: '0.9rem',
                      }}
                    />
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 'bold',
                        color: 'white',
                        mb: 3,
                        fontSize: { xs: '1.3rem', sm: '1.5rem' },
                      }}
                    >
                      TPMS Indirecto
                    </Typography>
                    <Box component="ul" sx={{ pl: 2, color: 'white' }}>
                      <Typography component="li" sx={{ mb: 2, fontSize: { xs: '0.95rem', sm: '1rem' }, lineHeight: 1.6 }}>
                        No usa sensores en las ruedas; utiliza los sensores del sistema ABS y ESP
                      </Typography>
                      <Typography component="li" sx={{ mb: 2, fontSize: { xs: '0.95rem', sm: '1rem' }, lineHeight: 1.6 }}>
                        Calcula la presión en función de la velocidad de rotación de cada rueda
                      </Typography>
                      <Typography component="li" sx={{ mb: 2, fontSize: { xs: '0.95rem', sm: '1rem' }, lineHeight: 1.6 }}>
                        Un neumático con baja presión gira ligeramente más rápido, y el sistema lo detecta
                      </Typography>
                      <Typography component="li" sx={{ fontSize: { xs: '0.95rem', sm: '1rem' }, lineHeight: 1.6 }}>
                        Es una solución más económica y no requiere baterías en los sensores
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </Grid>
          </Grid>
          </AnimatedSection>
        </Box>
      </Container>


      {/* Sección: Cómo detectar si necesito cambiar un sensor */}
      <Container maxWidth="lg" sx={{ mt: 12, mb: 12, overflowX: 'hidden' }}>
        <Box sx={{ overflow: 'hidden' }}>
          <AnimatedSection delay={0.5}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 'bold',
              mb: 6,
              textAlign: 'center',
              color: '#1848B9',
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
            }}
          >
            ¿Cómo detectar si necesito cambiar un sensor?
          </Typography>

          <Grid container spacing={3} sx={{ overflow: 'hidden' }}>
            {[
              { title: 'Luz de advertencia encendida', desc: 'El testigo TPMS permanece encendido en el tablero' },
              { title: 'Luz intermitente', desc: 'La luz parpadea indicando un problema con el sistema' },
              { title: 'Lecturas incorrectas', desc: 'El tablero muestra presiones que no coinciden con la realidad' },
              { title: 'Mensaje de error', desc: 'Aparece un mensaje indicando fallo del sistema TPMS' },
              { title: 'Cambio de neumáticos', desc: 'Después de cambiar neumáticos y la luz no se apaga' },
              { title: 'Batería agotada', desc: 'Los sensores tienen batería con vida útil de 5-8 años' },
            ].map((item, index) => (
              <Grid item xs={12} sm={6} md={4} key={index} sx={{ overflow: 'hidden' }}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  style={{ overflow: 'visible', willChange: 'transform' }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      backgroundColor: '#ffffff',
                      borderRadius: '15px',
                      boxShadow: '0 4px 20px rgba(255, 225, 184, 0.15)',
                      p: 3,
                      border: '2px solid #EDE7F6',
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 1), rgba(255, 225, 184, 0.08))',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 8px 30px rgba(255, 168, 46, 0.25)',
                        borderColor: '#FFF4E6',
                      }
                    }}
                  >
                    <CardContent>
                      <Box
                        sx={{
                          width: 50,
                          height: 50,
                          borderRadius: '50%',
                          backgroundColor: '#1565C0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: 2,
                          transition: 'all 0.3s ease',
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: '1.5rem',
                            fontWeight: 'bold',
                            color: '#FFFFFF',
                            transition: 'all 0.3s ease',
                          }}
                        >
                          {index + 1}
                        </Typography>
                      </Box>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 'bold',
                          color: '#424242',
                          mb: 1,
                          fontSize: { xs: '1rem', sm: '1.1rem' }
                        }}
                      >
                        {item.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#666',
                          lineHeight: 1.6,
                          fontSize: { xs: '0.9rem', sm: '0.95rem' }
                        }}
                      >
                        {item.desc}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
          </AnimatedSection>
        </Box>
      </Container>

      {/* CTA Final */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1E293B 0%, #764ba2 100%)',
          py: 8,
          mt: 8,
        }}
      >
        <Container maxWidth="md" sx={{ overflowX: 'hidden' }}>
          <Box sx={{ overflow: 'hidden' }}>
            <AnimatedSection>
            <Box sx={{ textAlign: 'center' }}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 'bold',
                  color: 'white',
                  mb: 3,
                  fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' }
                }}
              >
                ¿Necesitas nuestro servicio TPMS?
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: 'rgba(255,255,255,0.9)',
                  mb: 4,
                  fontSize: { xs: '1.1rem', sm: '1.3rem' }
                }}
              >
                Contáctanos ahora y resuelve el problema de tu vehículo
              </Typography>
              <Button
                component="a"
                href={`https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensajeWhatsApp)}`}
                target="_blank"
                rel="noopener"
                variant="contained"
                size="large"
                sx={{
                  backgroundColor: '#25D366',
                  color: '#ffffff',
                  fontSize: '1.3rem',
                  px: 8,
                  py: 2.5,
                  borderRadius: '50px',
                  fontWeight: 'bold',
                  textTransform: 'none',
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)',
                  '&:hover': {
                    backgroundColor: '#1ebc59',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                WhatsApp - Servicio TPMS
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

export default TPMSPage;
