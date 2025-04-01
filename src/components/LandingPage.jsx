import React, { useState, useEffect } from "react";
import '../Csspersonalizado/landingpage.css'; //Css personalizado para varios estilos
import { AppBar, Toolbar, Typography, Button, Box, Container } from "@mui/material";
import { Link } from "react-router-dom";
import logo from "../assets/img_header1.jpg";
import logo_sect from "../assets/img_secction1.jpg";
import PrecioServicio from "./PrecioServicio";
import Cotizacion from "../components/Cotizacion"; // Importar el nuevo componente
import ServiceCards from "./ServiceCards.jsx"; //nuevas card de prueba
import HerramientasSection from './herramientasSection';
import TestimoniosSection from "./TestimoniosSection.jsx";
import Footer from "./Footer";
//import CardServicio from "./ServiceCards.jsx";

function LandingPage() {
  const [openCotizacion, setOpenCotizacion] = useState(false);
  const servicios = [
    {
      titulo: 'Servicio 1',
      subheader: 'Descripción del servicio 1',
      imagen: '/imgcard1.jpg',
      descripcion: 'Detalles del servicio 1',
    },
    {
      titulo: 'Servicio 2',
      subheader: 'Descripción del servicio 2',
      imagen: '/imgcard2.jpg',
      descripcion: 'Detalles del servicio 2',
    },
    {
      titulo: 'Servicio 3',
      subheader: 'Descripción del servicio 3',
      imagen: '/imgcard3.jpg',
      descripcion: 'Detalles del servicio 3',
    },
  ];
  
  {/*Navegación dentro de la misma pagian*/}
  useEffect(() => {
    const links = document.querySelectorAll('nav a');

    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();

        const targetId = link.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }, []);

  return (
    <div>
      {/* Header */}
      <AppBar position="static" sx={{ backgroundColor: "#4F6A95" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            <img src={logo} alt="Logo" style={{ height: "100px", border: "1px solid ", borderRadius: "10px", margin: "5px" }} />
          </Typography>
          <Button color="inherit" component={Link} to="/">Inicio</Button>
          <Button color="inherit" href="#nuestro-servicio">Nuestro Servicio</Button>
          <Button color="inherit" href="#nuestras-herramientas">Nuestras Herramientas</Button> {/* Agrega el enlace */}
          <Button color="inherit" onClick={() => document.getElementById("testimonios").scrollIntoView({ behavior: "smooth" })}>
                  Testimonios</Button>
          <Button color="inherit" component={Link} to="/blog">Blog</Button>
          <Button color="inherit" component={Link} to="/agendar" sx={{ backgroundColor: "#fff", color: "#1976d2", ml: 2 }}>
            Agendar
          </Button>
        </Toolbar>
      </AppBar>

      {/* Sección principal */}
      <Container sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 5, gap: 8 }}>
        <Box>
          <img src={logo_sect} alt="Auto" style={{ width: "100%", maxWidth: "500px", height: "auto", borderRadius: "40px" }} />
        </Box>
        <Box sx={{ textAlign: "center", flex: 1 }}>
          <Typography variant="h3" sx={{ fontWeight: "bold", mb: 2 }}>
            Agenda con Nosotros
          </Typography>
          <Typography variant="h6" sx={{ color: "#555" ,  mb: 4 }}>
            ¡Haz tu agendamiento rápido y fácil con nuestro formulario!
          </Typography>

          
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '17vh' }}>
            {/* Botón Cotización */}
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => setOpenCotizacion(true)}
            sx={{ 
              fontSize: "1.5rem",  //reduce el tamaño de la fuente si es necesario 
              px: 5, //Reduce el padding horizontal 
              py: 1, //Reduce el padding vertical
              width: '450px', // Opcional: ajustar el ancho fijo
              left: '12%', // Opcional: centrar el botón horizontalmente
            }}
          >
            Cotización
          </Button>

          {/* Botón Agendar */}
          <Button
            variant="contained"
            color="secondary"
            component={Link}
            to="/agendar"
            sx={{ 
              fontSize: "1.5rem",  // Reduce el tamaño de la fuente si es necesario
              px: 5, // Reduce el padding horizontal
              py: 2,  // Reduce el padding vertical
              width: '450px', // Opcional: ajustar el ancho fijo
              left: '12%', // Opcional: centrar el botón horizontalmente
            }}
          >
            Agendar Ahora
          </Button>
          </div>
        </Box>
      </Container>

      {/* Componente PrecioServicio */}
      <PrecioServicio />
{/*Aca va EL NUEVO CODIGO DE LAS CARS*/ }
{/* Sección de Servicios */}
<Container id="nuestro-servicio" sx={{ textAlign: "center", mt: 5 }}>
  <Typography variant="h4" fontWeight="bold" mb={3}>
    Nuestros Servicios
  </Typography>
  <ServiceCards />
  </Container>

       {/* Se dejara sin efecta para probar otra Card --componente se guarda en block al final////// Componentes Card*/}
       {/* Sección de Herramientas */}
  <Container id="nuestras-herramientas" sx={{ textAlign: "center", mt: 5 }}>
  <HerramientasSection />
    </Container>

    {/*Testimonios*/}
    <TestimoniosSection />
 
      {/* Ventana emergente de Cotización */}
      <Cotizacion open={openCotizacion} handleClose={() => setOpenCotizacion(false)} />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default LandingPage;

