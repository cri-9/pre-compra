// src/components/About.jsx
import { Build, CheckCircle, DirectionsCar, Search } from '@mui/icons-material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';

//Imagenes
import about from "../assets/About/about_1.webp";
import about2 from "../assets/About/about_2.webp";


const About = () => {
  return (
    <Box sx={{ bgcolor: '#F9F6FC', py: 8 }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: 3 }}>
        {/* Título principal animado */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Typography
            variant="h4"
            component="h2"// Cambiado a h2 para semántica
            gutterBottom // Agregar más separación debajo del título
            sx={{
              color: '#1848B9',
              fontWeight: 'bold',
              textAlign: 'center',
              mb: 4, // Más separación debajo del título
            }}
          >
            ¿Quiénes Somos?
          </Typography>
        </motion.div>

        {/* Descripción */} 
        <Typography
        variant="body1"
        sx={{
        color: '#220F3E',
        textAlign: 'justify',      // Justifica el texto para que los bordes queden alineados
        textAlignLast: 'center',  // Opcional: Centra la última línea para mantener el estilo
        maxWidth: '1100px',        // Limita el ancho para que no se desarme en pantallas grandes
        mx: 'auto',               // Centra todo el bloque de texto horizontalmente
        mb: 5,
        fontSize: '1.1rem',
        lineHeight: 1.6,          // Mejora la legibilidad del bloque justificado
        }}
        >
        En <strong>VisualMecánica</strong> somos una empresa especializada en servicios técnicos automotrices a domicilio, orientados a la evaluación, 
        diagnóstico y mantenimiento preventivo del vehículo. Contamos con personal calificado y equipamiento profesional para entregar información precisa y confiable.
        Nuestros servicios incluyen <strong>Diagnóstico computarizado mediante escáner automotriz</strong>, <strong>Inspección pre-compra Automotriz</strong>, <strong>Mantenimiento y calibración de sensores TPMS</strong> (sistema de monitoreo de presión de neumáticos) y <strong>regeneración de DPF</strong> 
        (filtro de partículas diésel). Cada servicio se realiza bajo criterios técnicos objetivos, entregando reportes claros que permiten a nuestros clientes 
        tomar decisiones informadas, seguras y respaldadas técnicamente.
        </Typography>

        {/* Íconos representativos */}
        <Grid 
        container spacing={4} justifyContent="center" sx={{ mb: 6 }}>
          {/* Primera fila - 4 grids más anchos */}
          <Grid item xs={12} sm={6} md={6} lg={3}>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Paper
                elevation={4}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  bgcolor: '#7B1FA2',
                  color: 'white',
                  borderRadius: 3,
                  height: '250px', // Altura fija para uniformidad
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <Avatar sx={{ bgcolor: 'white', mb: 1, mx: 'auto' }}>
                  <DirectionsCar sx={{ color: '#7B1FA2' }} />
                </Avatar>
                <Typography variant="h6">Escáner Profesional</Typography>
                <Typography variant="body2">Diagnóstico computarizado avanzado para detectar fallas electrónicas latentes, analizar módulos ECU y asegurar el correcto funcionamiento de los sistemas del vehículo.</Typography>
              </Paper>
            </motion.div>
          </Grid>

          <Grid item xs={12} sm={6} md={6} lg={3}>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Paper
                elevation={4}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  bgcolor: '#FFB74D',
                  color: '#250F3E',
                  borderRadius: 3,
                  height: '250px', // Altura fija para uniformidad
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <Avatar sx={{ bgcolor: 'white', mb: 1, mx: 'auto' }}>
                  <Build sx={{ color: '#FFB74D' }} />
                </Avatar>
                <Typography variant="h6">Inspección Pre-compra</Typography>
                <Typography variant="body2">Evaluación técnica, estética y mecánica completa en terreno antes de comprar. Revisamos motor, chasis y componentes clave para que inviertas con total seguridad.</Typography>
              </Paper>
            </motion.div>
          </Grid>

          <Grid item xs={12} sm={6} md={6} lg={3}>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Paper
                elevation={4}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  bgcolor: '#1565C0',
                  color: 'white',
                  borderRadius: 3,
                  height: '250px', // Altura fija para uniformidad
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <Avatar sx={{ bgcolor: 'white', mb: 1, mx: 'auto' }}>
                  <CheckCircle sx={{ color: '#1565C0' }} />
                </Avatar>
                <Typography variant="h6">Sensores TPMS</Typography>
                <Typography variant="body2">Servicio especializado de mantenimiento, programación y calibración del sistema de monitoreo de presión de neumáticos. Evita alertas molestas y viaja seguro.</Typography>
              </Paper>
            </motion.div>
          </Grid>

          <Grid item xs={12} sm={6} md={6} lg={3}>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Paper
                elevation={4}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  bgcolor: '#CAB0E5',
                  color: '#220F3E',
                  borderRadius: 3,
                  height: '250px', // Altura fija para uniformidad
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <Avatar sx={{ bgcolor: 'white', mb: 1, mx: 'auto' }}>
                  <Search sx={{ color: '#CAB0E5' }} />
                </Avatar>
                <Typography variant="h6">Regeneración DPF</Typography>
                <Typography variant="body2">Limpieza y regeneración forzada del filtro de partículas diésel mediante software profesional. Restaura la potencia del motor y reduce la emisión de contaminantes.</Typography>
              </Paper>
            </motion.div>
          </Grid>         
        </Grid>

        {/* Imagen representativa */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: 4, // Espacio entre las imágenes
              flexWrap: 'wrap', // Permite que las imágenes se ajusten al contenedor
              mb: 4,
            }}
          >
            <img
              src={about}
              alt="Inspección de vehículo"
              style={{
                maxWidth: 300,
                width: '100%',
                borderRadius: 16,
                boxShadow: '0px 8px 24px rgba(0,0,0,0.2)',
              }}
            />
            <img
              src={about2}
              alt="Inspección de vehículo"
              style={{
                maxWidth: 300,
                width: '100%',
                borderRadius: 16,
                boxShadow: '0px 8px 24px rgba(0,0,0,0.2)',
              }}
            />
          </Box>
        </motion.div>

       
        {/* Frase final */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <Box>
            <Typography
              variant="h6"
              align="center"
              sx={{ color: '#220F3E', fontWeight: 'medium' }}
            >
              Con <strong>VisualMecánica</strong>, cada inspección te permite comprar con confianza e invertir con inteligencia.
            </Typography>
          </Box>
        </motion.div>
      </Box>
    </Box>
  );
};

export default About;
