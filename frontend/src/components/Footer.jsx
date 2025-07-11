import React from 'react';
import { Container, Grid, Typography, Link, Box, Divider } from '@mui/material';
import { FaFacebookF, FaTwitter, FaGoogle, FaInstagram, FaLinkedinIn, FaGithub, FaHome, FaEnvelope, FaPhone, FaPrint } from 'react-icons/fa';
import logo from '../assets/logo_pre.png';

function Footer() {
  return (
    <Box>
      {/* Sección del Logo en el Footer */}
      <Box 
        sx={{ 
          backgroundColor: '#DDE4F4', 
          color: 'white', 
          py: 5, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
        }}
      > 
        <img 
          src={logo} // Asegúrate de que 'logo' esté definido e importado
          alt="Logo" 
          style={{ 
            height: "100px",
            margin: "10px",
            imageRendering: "crisp-edges", 
            border: 'none',
          }}
        />         
      </Box>

      {/* Contenedor principal del pie de página (Grid de columnas) */}
      <Container sx={{ py: 6 }}>
        {/*
        Redistribución de anchos MD:
        Visual&Mecanica (md=3) + Productos (md=2.5) + Blog (md=3) + Síguenos (md=3.5) = 12
        Esto le da más espacio a Síguenos y equilibra las demás.
        También usar (3 + 2 + 4 + 3) si prefieres números enteros, dando más a Blog.
        Aquí usaremos: 3 + 2.5 + 3 + 3.5 = 12
        */}
        <Grid container spacing={6}> 

          {/* Columna: Visual&Mecanica */}
          <Grid 
            item 
            xs={12} 
            md={3} // Mantiene 3
          >
            <Typography variant="h6" gutterBottom>
              Visual&Mecanica
            </Typography>
            <Typography align="justify" variant="body2" color="text.secondary">
              Uno de los pocos servicios a domicilio en la Novena Región, brindando confianza y calidad a nuestros clientes. No pierdas dinero y asegura tu inversión.
            </Typography>
          </Grid>

          {/* Columna: Productos */}
          <Grid item xs={12} md={2.5}> {/* Reducimos a 2.5 para dar espacio */}
            <Typography variant="h6" gutterBottom>
              Productos
            </Typography>
            <Typography variant="body2">
              <Link href="#" color="text.secondary" underline="hover">
                Inicio
              </Link>
            </Typography>
            <Typography variant="body2">
              <Link href="#" color="text.secondary" underline="hover">
                Acerca de
              </Link>
            </Typography>
            <Typography variant="body2">
              <Link href="#" color="text.secondary" underline="hover">
                Nuestro Servicio
              </Link>
            </Typography>
            <Typography variant="body2">
              <Link href="#" color="text.secondary" underline="hover">
                Nuestras Herramientas
              </Link>
            </Typography>
            <Typography variant="body2">
              <Link href="#" color="text.secondary" underline="hover">
                Testimonios
              </Link>
            </Typography>
          </Grid>

          {/* Columna: Blog */}
          <Grid item xs={12} md={3}> {/* Mantiene 3, o podrías darle 3.5 si quieres más espacio aquí */}
            <Typography variant="h6" gutterBottom>
              Blog
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
              <FaHome style={{ marginRight: '8px' }} /> Ramon Freire 195, Temuco.
            </Typography>
            {/* Aplica whiteSpace: 'nowrap' al Typography del correo electrónico */}
            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}>
              <FaEnvelope style={{ marginRight: '8px' }} /> cotizacionautomotriz09@gmail.com
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
              <FaPhone style={{ marginRight: '8px' }} /> + 56-97541042
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
              <FaPrint style={{ marginRight: '8px' }} /> + 56-997541042
            </Typography>
          </Grid>

          {/* Columna: Síguenos (Ahora con más espacio y línea vertical) */}
          <Grid 
            item 
            xs={12} 
            md={3.5} // ¡Incrementamos a 3.5 para darle más espacio!
            sx={{
              borderLeft: { md: '1px solid #444746' }, 
              pl: { md: 4 } 
            }}
          >
            <Typography variant="h6" gutterBottom>
              Síguenos
            </Typography>
            <Box sx={{ display: 'flex', mt: 1 }}>
              <Link href="#" sx={{ mr: 1, color: '#1976D2' }}><FaFacebookF /></Link>         
              <Link href="#" sx={{ mr: 1, color: '#EC4034' }}><FaGoogle /></Link>
              <Link href="#" sx={{ mr: 1, color: '#AC3083' }}><FaInstagram /></Link>
              <Link href="#" sx={{ mr: 1, color: '#0184CA' }}><FaLinkedinIn /></Link>
              <Link href="#" sx={{ mr: 1, color: '#000000' }}><FaGithub /></Link>
            </Box>
          </Grid>

        </Grid> {/* Fin del Grid container principal */}
      </Container> {/* Fin del Container principal de las columnas */}

      {/* --- Línea divisoria horizontal antes del Copyright --- */}
      <Divider sx={{ my: 4, rgba:(52, 73, 94) }} />

      {/* Sección de Copyright */}
      <Box 
        sx={{
          display: 'flex',
          justifyContent: 'flex-start', 
          pr: 6, 
          pb: 2 
        }}
      >
        <Typography variant="body2" color="text.secondary">
          © 2025 Copyright: <Link href="https://visualmecanica.cl/" color="inherit" underline="hover">Visual Mecánica</Link>
        </Typography>
      </Box>

    </Box>
  );
}

export default Footer;