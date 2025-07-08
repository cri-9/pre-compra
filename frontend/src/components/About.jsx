// src/components/About.jsx
import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Box,
  Paper,
  Avatar,  
} from '@mui/material';
import { Build, CheckCircle, DirectionsCar } from '@mui/icons-material';
import { List, ListItem, ListItemIcon, ListItemText, Fade } from '@mui/material';
import { motion } from 'framer-motion';

//Imagenes
import about from "../assets/About/about_1.webp";
import about2 from "../assets/About/about_2.webp";

const About = () => {
  return (
    <Box sx={{ bgcolor: '#F9F6FC', py: 8 }}>
      <Container maxWidth="md">
        {/* Título principal animado */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            sx={{
              color: '#7B1FA2',
              fontWeight: 'bold',
              textAlign: 'center',
              mb: 4,
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
          En <strong>VisualMecánica</strong> ofrecemos un servicio técnico de inspección automotriz de pre-compra a domicilio.
          Analizamos cada detalle del vehículo para ayudarte a tomar una decisión segura.
        </Typography>

        {/* Íconos representativos */}
        <Grid container spacing={4} justifyContent="center" sx={{ mb: 6 }}>
          <Grid item xs={12} sm={4}>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Paper
                elevation={4}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  bgcolor: '#7B1FA2',
                  color: 'white',
                  borderRadius: 3,
                }}
              >
                <Avatar sx={{ bgcolor: 'white', mb: 1, mx: 'auto' }}>
                  <DirectionsCar sx={{ color: '#7B1FA2' }} />
                </Avatar>
                <Typography variant="h6">Evaluación en terreno</Typography>
                <Typography variant="body2">Vamos a donde estés</Typography>
              </Paper>
            </motion.div>
          </Grid>
          <Grid item xs={12} sm={4}>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Paper
                elevation={4}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  bgcolor: '#FFB74D',
                  color: '#220F3E',
                  borderRadius: 3,
                }}
              >
                <Avatar sx={{ bgcolor: 'white', mb: 1, mx: 'auto' }}>
                  <Build sx={{ color: '#FFB74D' }} />
                </Avatar>
                <Typography variant="h6">Diagnóstico completo</Typography>
                <Typography variant="body2">Motor, chasis, interior</Typography>
              </Paper>
            </motion.div>
          </Grid>
          <Grid item xs={12} sm={4}>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Paper
                elevation={4}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  bgcolor: '#1565C0',
                  color: 'white',
                  borderRadius: 3,
                }}
              >
                <Avatar sx={{ bgcolor: 'white', mb: 1, mx: 'auto' }}>
                  <CheckCircle sx={{ color: '#1565C0' }} />
                </Avatar>
                <Typography variant="h6">Informe profesional</Typography>
                <Typography variant="body2">Detalles y recomendación</Typography>
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
              Con <strong>VisualMecánica</strong>, inspeccionas con confianza e inviertes con inteligencia.
            </Typography>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default About;
