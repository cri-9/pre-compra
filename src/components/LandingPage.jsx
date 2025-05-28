import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; // Importar useLocation para obtener la ubicación actual
import '../Csspersonalizado/landingpage.css'; //Css personalizado para varios estilos
import { AppBar, Toolbar, Typography, Button, Box, Container } from "@mui/material";
import { Link } from "react-router-dom";
import logo from "../assets/Logo_Superior/logo_visual1.2.webp";
import logo_sect from "../assets/img_secction1.webp";
import PrecioServicio from "./PrecioServicio";
import Cotizacion from "../components/Cotizacion"; // Importar el nuevo componente
import ServiceCards from "./ServiceCards.jsx"; //nuevas card de prueba
import HerramientasSection from "./HerramientasSection.jsx";
import ValorServicio from './ValorServicio';
import About from './About';
import PreguntasFrecuentes from './PreguntasFrecuentes.jsx';
import TestimoniosSection from "./TestimoniosSection.jsx";
import Footer from "./Footer";
import Confetti from 'react-confetti'; // Importar el componente de confeti
import { useWindowSize } from '@react-hook/window-size'; // Importar el hook para obtener el tamaño de la ventana
import BotonWhatsApp from "./BotonWhatsApp.jsx"; // Importar el botón de WhatsApp

//import CardServicio from "./ServiceCards.jsx";

function LandingPage() {
  const [openCotizacion, setOpenCotizacion] = useState(false); // Estado para abrir/cerrar la ventana emergente de cotización
  const [width, height] = useWindowSize(); // Obtener el tamaño de la ventana
  const [openExito, setOpenExito] = useState(false); // Estado para el confeti
  const location = useLocation(); // Obtener la ubicación actual
  
  useEffect(() => {
    const params = new URLSearchParams(location.search); // Obtener los parámetros de la URL
    if (params.get("mensaje") === "exito") {
      alert("!Su proceso de pago y agendamineto se realizón con éxito!"); // Mostrar alerta de éxito
    }
  }, [location]); // Ejecutar el efecto solo cuando la ubicación cambie

  {/*Navegación dentro de la misma pagina*/}
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
   //Boton de WhatsApp
  const numeroTelefono = "56997541042"; // Número de teléfono de WhatsApp
  const mensajeInicial = "Visual Mecánica le da la Bienvenida;  Te podemos ayudar."; // Mensaje inicial
   

  return (
    <div>      
     {/* Sección superior */}
     <Box sx={{ 
      backgroundColor: "#7B1FA2",  // Color de fondo
      mx: "auto",  // Margen automático para centrar
      maxWidth: "5xl",  // Ancho máximo
      px: { xs:2, sm: 6, lg: 8 }, // Padding horizontal
      py: { xs: 1, sm: 3} , // Padding vertical
      spacing: 2, // Espacio entre elementos
      display: "flex", // Flex container
      flexDirection: "column", // Dirección de los elementos
      alignItems: "center", // Alineación de los elementos
      justifyContent: "center", // Justificación de los elementos

      }}
      >
        {/* Puedes agregar contenido aquí si es necesario */}
        <Typography
          align="center"
          variant="h8"
          sx={{
            color: '#ffffff',
            fontWeight: '400',
            fontSize: { xs: '1.2rem', sm: '1.2rem', md: '1.2rem' },
            backgroundColor: '#7B1FA2',
            padding: '2px',
            borderRadius: '12px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
            fontFamily: 'Roboto, sans-serif',
            marginBottom: '3px'
  }}
>
  No esperes más, asegura tu patrimonio ¡No te pierdas la oportunidad de conocer nuestros servicios a domicilio en la Novena Región!
</Typography>

      </Box>

      {/* Header */}      
      <AppBar position="static" sx={{ backgroundColor: "#fff", boxShadow: "none" }}>{/*Efectos al header*/}
        <Toolbar
          sx={{
            flexDirection: { xs: "column", sm: "row" }, // Cambia la dirección del flex en pantallas pequeñas
            alignItems: { xs: "center", sm: "flex-start"}, // Alineación del contenido
            justifyContent: "space-between",
            py: { xs: 1, sm: 0  }, // Padding vertical
            px: { xs: 2, sm: 6  }, // Padding horizontal
         
          }}
        >
        <Typography variant="h6" 
        sx={{ 
          flexGrow: 1, // Asegura que el logo ocupe el espacio disponible
          display: 'flex',  // Flexbox para centrar el logo
          alignItems: 'center',  // Alineación del logo
          justifyContent: { xs: "center", sm: "flex-start" }, // Alineación del logo
          paddingBottom: { xs: 1, sm: "15px" }, // Padding inferior en pantallas pequeñas
          }}
          >
            <img 
              src={logo} 
              alt="Logo"  // Logo de la empresa
              style={{ 
                height: "auto", // Altura automática para mantener la proporción
                maxHeight: "100px", // Altura máxima del logo
                width: "auto", // Ancho automático para mantener la proporción
                maxWidth: "100%", // Ancho máximo del logo
                border: "1px solid", // Borde del logo
                margin: "1px", // Margen del logo
                imageRendering: "crisp-edges", // Mejora la calidad de la imagen
              }}
              />
          </Typography>

          {/* Botones de navegación */}
          <Box 
          sx={{ 
            display: "flex" ,  // Flexbox para los botones
            flexWrap: "wrap", // Permite que los botones se ajusten en pantallas pequeñas
            justifyContent: { xs: "center", sm: "flex-end" }, // Alineació n de los botones            
            gap: { xs: 1, sm: 2 }, // Espacio entre los botones
            mt: { xs: 1, sm: 0 }, // Margen superior en pantallas pequeñas
            paddingTop: 2, // Padding superior
            }} 
            > 
          <Button sx={{ color: "#7C70A1" }} component={Link} to="/">Inicio</Button>          
          <Button sx={{ color: "#7C70A1" }} href="#about">Acerca de</Button>
          <Button sx={{ color: "#7C70A1" }} href="#nuestro-servicio">Nuestro Servicio</Button>
          <Button sx={{ color: "#7C70A1" }} href="#nuestras-herramientas">Nuestras Herramientas</Button>
          <Button sx={{ color: "#7C70A1" }} href="#valor-servicios">Valores</Button>         
          <Button 
            component={Link} 
            to="/agendar"              
            sx={{ 
              width: { xs: "100%", sm: "140px" }, // Ancho del botón en pantallas pequeñas
              height: "50px" , // Alto del botón
              fontSize: "1rem" , // Tamaño de la fuente
              fontWeight: "bold",  // Peso de la fuente
              backgroundColor: "#6a6191", // Color de fondo del botón
              color: "#ffffff", // Color del texto
              ml: {sm: 4},  // Margen izquierdo en pantallas pequeñas
              "&:hover": { 
                backgroundColor: "#7B1FA2"  // Color de fondo al pasar el mouse
              },
            }}
          >
            Agendar
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
      
      {/* Sección principal */}
      <Container
  sx={{
    display: "flex", // Flex container
    flexDirection: { xs: "column", md: "row" }, // Columna en móviles, fila en escritorio
    alignItems: "center", //      justifyContent: "space-between",
    mt: 4, // Margen superior
    gap: 6, // Espacio entre elementos
  }}
>
  {/* Imagen de la sección */}
  <Box sx={{ display: "flex", textAlign: "center" }}>
    <img
      src={logo_sect}
      alt="Auto"
      style={{
        width: "100%", // Ancho de la imagen
        maxWidth: "500px", // Ancho máximo de la imagen
        height: "auto", // Altura automática para mantener la proporción
        borderRadius: "40px", // Borde redondeado
      }}
    />
  </Box>

  {/* Texto y botones */}
  <Box
    sx={{
      textAlign: "center", // Alineación del texto
      flex: 1, // Ocupa el espacio restante
      mt: { xs: 4, md: 0 }, // Margen superior en móviles
    }}
  >
    <Typography variant="h3" sx={{ 
      fontWeight: "bold", 
      mb: 2 
      }}
      className="efecto-titulo" //Efecto css nuevo
      > 
      Agenda con Nosotros
    </Typography>

    <Typography variant="h6" sx={{ color: "#555", mb: 4 }}>
      ¡Haz tu agendamiento o cotización fácil con nuestros formularios!
    </Typography>

    {/* Contenedor de botones */}
    <Box
      sx={{
        display: "flex", // Flex container
        flexDirection: "column", // Columna para móviles
        justifyContent: "space-between", // Espacio entre botones
        gap: 2, // Espacio entre botones
        maxWidth: "450px", // Ancho máximo del contenedor
        margin: "0 auto", // Margen automático para centrar
      }}
    >
      {/* Botón Cotización */}
      <Button
        variant="outlined"
        color="tertiary"
        onClick={() => setOpenCotizacion(true)}
        sx={{
          fontSize: "1.6rem", // Tamaño de la fuente
          px: 5, // Padding horizontal
          py: 1, // Padding vertical
          borderRadius: "7px", // Radio de borde
        }}
        className="btn" //Clase para el boton nuevo estilo css
      >
        Cotización
      </Button>

      {/* Botón Agendar */}
      <Button
        variant="contained"
        component={Link}
        to="/agendar"
        sx={{
          backgroundColor: "#6a6191", // Color de fondo
          "&:hover": { backgroundColor: "#7B1FA2" }, // Color de fondo al pasar el mouse
          fontSize: "1.5rem", // Tamaño de la fuente
          px: 5, // Padding horizontal
          py: 2, // Padding vertical
          borderRadius: "7px", // Radio de borde
        }}      
        className="btn" //Clase para el boton nuevo estilo css
        >
        Agendar Ahora
      </Button>
    </Box>
  </Box>
</Container>
   

      {/* Componente PrecioServicio */}
      <PrecioServicio />

      {/* Componente About */}
      <div id="about">
      <About />
      </div>
      

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

    {/*ValoresServicio*/}
    <div id="valor-servicios" >
    <ValorServicio />
    </div>

    {/*Testimonios*/}
    <TestimoniosSection />
    {openExito && (
  <Confetti width={width} height={height} />
  
)}  

{/* Componente PreguntasFrecuentes */}
<Container> 
<PreguntasFrecuentes />
</Container>

{/* Ventana emergente de Cotización */}
<Cotizacion open={openCotizacion} handleClose={() => setOpenCotizacion(false)} />

{/* Opción 1: Botón flotante en la esquina inferior derecha */}
<BotonWhatsApp
  numeroTelefono={numeroTelefono}
  mensajeInicial={mensajeInicial}
/>

{/* Opción 2: Botón dentro de una sección de contacto */}
<Box sx={{ mt: 4 }}>        
<BotonWhatsApp
  numeroTelefono={numeroTelefono}
  mensajeInicial={mensajeInicial}
/>
</Box>
{/* Footer */}
<Footer />
      
</div>
  );
}

export default LandingPage;
