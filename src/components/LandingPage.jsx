import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import { Link } from 'react-router-dom';
import logo from "../assets/img_header1.jpg"; // Ajusta la ruta según tu estructura
import logo_sect from "../assets/img_secction1.jpg"; // Ajusta la ruta según tu estructura
import PrecioServicio from './PrecioServicio';

function LandingPage() {
  return (
    <div>
      {/* Header */}
      <AppBar position="static" sx={{ backgroundColor: '#1976d2' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            <img src={logo} alt="Logo" style={{ 
                height: '100px', 
                border: '1px solid ', //Boder azul
                borderRadius: '10px', //Bordes redondeados
                margin: '5px',
                }} />
          </Typography>
          <Button color="inherit" component={Link} to="/">Inicio</Button>
          <Button color="inherit" component={Link} to="/servicio">Servicio</Button>
          <Button color="inherit" component={Link} to="/testimonios">Testimonios</Button>
          <Button color="inherit" component={Link} to="/blog">Blog</Button>
          <Button color="inherit" component={Link} to="/agendar" sx={{ backgroundColor: '#fff', color: '#1976d2', ml: 2 }}>
            Agendar
          </Button>
        </Toolbar>
      </AppBar>

      {/* Sección principal */}
      <Container sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 5 }}>
        <Box>
          <img src={logo_sect} alt="Auto" style={{ 
            width: '100%', 
            maxWidth: '500px' ,
            height: 'auto',
            borderRadius: '40px', //Bordes redondeados
            }} />
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
            Agenda con Nosotros
          </Typography>
          <Typography variant="h6" sx={{ color: '#555' }}>
            ¡Haz tu agendamiento rápido y fácil con nuestro formulario!
          </Typography>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/agendar"
            sx={{ mt: 3 }}
          >
            Agendar Ahora
          </Button>
        </Box>
      </Container>

      {/* Componente PrecioServicio*/}
      <PrecioServicio/>

      {/* Footer */}
      <Box sx={{ backgroundColor: '#1976d2', color: '#fff', textAlign: 'center', py: 2, mt: 5 }}>
        <Typography variant="body2">© 2025 Pre-Compra. Todos los derechos reservados.</Typography>
      </Box>
    </div>
  );
}

export default LandingPage;
