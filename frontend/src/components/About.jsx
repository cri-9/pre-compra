// src/components/About.jsx
import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Fade from '@mui/material/Fade';
import { Build, CheckCircle, DirectionsCar, DriveEta, Search } from '@mui/icons-material';
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
            textAlign: 'center',
            mb: 5,
            fontSize: '1.1rem',
          }}
        >
          En <strong>VisualMecánica</strong> se especializa en brindar un servicio de <strong>inspección automotriz pre-compra a domicilio</strong>, 
          fundamental para proteger tu inversión. Nuestro equipo técnico evalúa meticulosamente cada componente del vehículo, 
          proporcionándote una visión clara y objetiva para que tomes la mejor decisión de compra.
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
                  height: '200px', // Altura fija para uniformidad
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <Avatar sx={{ bgcolor: 'white', mb: 1, mx: 'auto' }}>
                  <DirectionsCar sx={{ color: '#7B1FA2' }} />
                </Avatar>
                <Typography variant="h6">Inspección en terreno</Typography>
                <Typography variant="body2">Realizamos la evaluación en la ubicación del vehículo para tu comodidad.</Typography>
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
                  color: '#220F3E',
                  borderRadius: 3,
                  height: '220px', // Altura fija para uniformidad
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <Avatar sx={{ bgcolor: 'white', mb: 1, mx: 'auto' }}>
                  <Build sx={{ color: '#FFB74D' }} />
                </Avatar>
                <Typography variant="h6">Análisis integral</Typography>
                <Typography variant="body2">Un diagnóstico profundo que abarca desde el motor y el chasis hasta el interior y sistemas clave</Typography>
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
                  height: '200px', // Altura fija para uniformidad
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <Avatar sx={{ bgcolor: 'white', mb: 1, mx: 'auto' }}>
                  <CheckCircle sx={{ color: '#1565C0' }} />
                </Avatar>
                <Typography variant="h6">Reporte exhaustivo</Typography>
                <Typography variant="body2">Recibe un informe profesional con hallazgos detallados, fotografías y recomendaciones</Typography>
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
                  height: '220px', // Altura fija para uniformidad
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <Avatar sx={{ bgcolor: 'white', mb: 1, mx: 'auto' }}>
                  <Search sx={{ color: '#CAB0E5' }} />
                </Avatar>
                <Typography variant="h6">Visual y Prueba de ruta</Typography>
                <Typography variant="body2">Realizamos una inspección visual interna y externa, prueba de conducción para evaluar el desempeño de la dirección, caja de cambios y la amortiguación.</Typography>
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
