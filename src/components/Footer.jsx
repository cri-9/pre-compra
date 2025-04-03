import React from 'react';
import { Container, Grid, Typography, Link, Box } from '@mui/material';
import { FaFacebookF, FaTwitter, FaGoogle, FaInstagram, FaLinkedinIn, FaGithub, FaHome, FaEnvelope, FaPhone, FaPrint } from 'react-icons/fa';
import logo from '../assets/logo_pre.png';

function Footer() {
  return (

    /*Logo en Footer*/
    <Box sx={{ backgroundColor: '#DDE4F4', 
                  color: 'white', 
                  py: 5,
                  display: 'flex' , //Habilita flexbox en el footer
                  alignItems: 'center', //Alinea los elementos en el eje vertical
                  justifyContent: 'center', //Alinea horizontalmente el centro 
                  }}> 
                  <img 
                    src={logo} 
                    alt="Logo" 
                    style={{ 
                      height: "100px", // Aumenta el tamaño                        
                      margin: "1px",
                      imageRendering: "crisp-edges", // Mejora la nitidez
                      border: 'none',
                    }}
                  />                

      <Container>
        <Grid container spacing={8}>
          <Grid item xs={12} md={3}>
            <Typography variant="h6" gutterBottom>
              Visual&Mecanica
            </Typography>
            <Typography variant="body2"
            color="text.secondary">
              Uno de los pocos servicios a domicilio, brindando confianza y calidad a nuestros clientes. No pierdas dinero y asegura tu inversión
            </Typography>
          </Grid>
          <Grid item xs={12} md={2}>
            <Typography variant="h6" gutterBottom>
              Productos
            </Typography>
            <Typography variant="body2">
              <Link href="#" color="text.secondary">
                Inicio
              </Link>
            </Typography>
            <Typography variant="body2">
              <Link href="#" color="text.secondary">
                Nuestro Servicio
              </Link>
            </Typography>
            <Typography variant="body2">
              <Link href="#" color="text.secondary">
                Nuestras Herramientas
              </Link>
            </Typography>
            <Typography variant="body2">
              <Link href="#" color="text.secondary">
                Testimonios
              </Link>
            </Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="h6" gutterBottom>
              Blog
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <FaHome style={{ marginRight: '8px' }} /> Ramon Freire 195, Temuco. CH
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <FaEnvelope style={{ marginRight: '8px' }} /> pre-venta@gmail.com
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <FaPhone style={{ marginRight: '8px' }} /> + 56-97541042
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <FaPrint style={{ marginRight: '8px' }} /> + 56-997541042
            </Typography>
          </Grid>
          <Grid item xs={12} md={2}>
            <Typography variant="h6" gutterBottom>
              Síguenos
            </Typography>
            <Box>
              <Link href="#" sx={{ mr: 1, color: '#1976D2' }}>
                <FaFacebookF />
              </Link>              
              <Link href="#" sx={{ mr: 1, color: '#EC4034' }}>
                <FaGoogle />
              </Link>
              <Link href="#" sx={{ mr: 1, color: '#AC3083' }}>
                <FaInstagram />
              </Link>
              <Link href="#" sx={{ mr: 1, color: '#0184CA' }}>
                <FaLinkedinIn />
              </Link>
              <Link href="#" sx={{ mr: 1, color: '#000000' }}>
                <FaGithub />
              </Link>
            </Box>
          </Grid>
        </Grid>
        <Box 
        textAlign="center" 
        pt={4} //Aumenta el padding top para separar
        mt={3} // Añade margen superior para separar
        sx={{ 
          borderTop: '1px solid  rgba(0,0,0,0.2)', // Borde Superior más delgado
          backgroundColor: 'rgba(0, 0, 0, 0.0)',  //Cambia el color de fondo  para diferenciar 
          py: 2 }}>
          <Typography variant="body2" color="text.secondary">
            © 2020 Copyright: <Link href="https://mdbootstrap.com/" color="inherit">Visual Mecánica</Link>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;