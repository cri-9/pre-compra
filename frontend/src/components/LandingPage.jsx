import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; // Importar useLocation para obtener la ubicación actual
import '../Csspersonalizado/landingpage.css'; //Css personalizado para varios estilos
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  Container, 
  Chip, 
  Stack,
  IconButton,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Link as MuiLink
} from "@mui/material";
import "slick-carousel/slick/slick.css"; //carrusel slick
import "slick-carousel/slick/slick-theme.css";
import CheckIcon from '@mui/icons-material/Check';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { Link } from "react-router-dom";
import logo from "../assets/Logo_Superior/logo_visual1.2.webp";
import logo_sect from "../assets/Carrusel_Portada/img_secction1.webp";
import img_sec_1 from "../assets/Carrusel_Portada/portada_01.webp"; // Imagen de la sección
import img_sect_2 from "../assets/Carrusel_Portada/portada_02.jpg"; // Imagen de la sección
import img_sect_3 from "../assets/Carrusel_Portada/portada_03.webp"; // Imagen de la sección
import img_sect_4 from "../assets/Carrusel_Portada/portada_04.webp"; // Imagen de la sección
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
import Slider from "react-slick";

//import CardServicio from "./ServiceCards.jsx";

function LandingPage() {
  const [openCotizacion, setOpenCotizacion] = useState(false); // Estado para abrir/cerrar la ventana emergente de cotización
  const [width, height] = useWindowSize(); // Obtener el tamaño de la ventana
  const [openExito, setOpenExito] = useState(false); // Estado para el confeti
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Estado para el menú móvil
  const location = useLocation(); // Obtener la ubicación actual
  const theme = useTheme(); // Accede al tema de MUI para los breakpoints
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Detecta si es pantalla móvil
  
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
  
  // Enlaces de navegación
  const navLinks = [
    { name: 'Inicio', href: '/' },
    { name: 'Acerca de', href: '#about' },
    { name: 'Nuestro Servicio', href: '#nuestro-servicio' },
    { name: 'Nuestras Herramientas', href: '#nuestras-herramientas' },
    { name: 'Valores', href: '#valor-servicios' },
  ];

  // Función para manejar el menú móvil
  const handleDrawerToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const images = [logo_sect, img_sec_1, img_sect_2, img_sect_3, img_sect_4]; // Imágenes del carrusel
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1, // Solo una imagen visible a la vez
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: true
  };
   

  return (
    <div>    
    
      {/* Header mejorado con menú hamburguesa */}      
      <AppBar position="static" sx={{ backgroundColor: "white", boxShadow: 3 }}>
        <Toolbar sx={{
          maxWidth: 'lg',
          width: '100%',
          mx: 'auto',
          px: { xs: 1, sm: 2, md: 4 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          py: { xs: 1, sm: 1.5 },
          minHeight: { xs: '56px', sm: '64px' },
        }}>
          {/* Logo Container */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexGrow: { xs: 0, lg: 1 },
              minWidth: 0, // Permite que el logo se reduzca si es necesario
            }}
          >
            <img
              src={logo}
              alt="Logo"
              style={{
                height: 'auto',
                maxHeight: '60px',
                width: 'auto',
                maxWidth: '150px',
                margin: '1px',
                imageRendering: 'crisp-edges',
              }}
            />
          </Box>

          {/* Navegación para escritorio grande */}
          <Box sx={{ display: { xs: 'none', lg: 'flex' }, alignItems: 'center' }}>
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'nowrap',
                alignItems: 'center',
                gap: 1.5,
              }}
            >
              {navLinks.map((link) => (
                <Button
                  key={link.name}
                  href={link.href}
                  sx={{
                    color: '#7C70A1',
                    '&:hover': {
                      backgroundColor: 'grey.100',
                    },
                    borderRadius: '8px',
                    textTransform: 'none',
                    px: 1.5,
                    py: 1,
                    fontSize: '0.9rem',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {link.name}
                </Button>
              ))}
              
              {/* Botón Agendar en el menú */}
              <Button 
                component={Link} 
                to="/agendar"              
                sx={{ 
                  width: "120px",
                  height: "36px",
                  fontSize: "0.9rem",
                  fontWeight: "bold",
                  backgroundColor: "#7B1FA2",
                  color: "#ffffff",
                  ml: 1,
                  "&:hover": { 
                    backgroundColor: "#6a6191"
                  },
                  textTransform: 'none',
                  borderRadius: '8px',
                  whiteSpace: 'nowrap',
                }}
              >
                Agendar
              </Button>
            </Box>
            <Button
              component="a"
                href="https://wa.me/56997541042" // Reemplaza con tu número real
                  target="_blank"
                    rel="noopener"
                      sx={{
                      width: "120px",
                      height: "36px",
                      fontSize: "0.9rem",
                      fontWeight: "bold",
                      backgroundColor: "#25D366", // Verde WhatsApp
                      color: "#ffffff",
                      ml: 1,
                      "&:hover": {
                      backgroundColor: "#1ebc59"
                        },
                      textTransform: 'none',
                      borderRadius: '8px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                  WhatsApp
                </Button>
          </Box>

          {/* Botón de menú móvil y tablet */}
          <Box sx={{ display: { xs: 'flex', lg: 'none' }, justifyContent: 'flex-end', width: '100%' }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="end"
              onClick={handleDrawerToggle}
              sx={{
                color: 'grey.600',
                '&:hover': {
                  color: '#7C70A1',
                },
                p: 0.5,
                mr: { xs: 1, sm: 2, md: 3 }, // Más margen a la derecha en pantallas pequeñas
              }}
            >
              {isMenuOpen ? <CloseIcon sx={{ fontSize: '1.3rem' }} /> : <MenuIcon sx={{ fontSize: '1.3rem' }} />}
            </IconButton>
          </Box>

          {/* Cajón de navegación para móvil y tablet */}
          <Drawer
            anchor="right"
            open={isMenuOpen}
            onClose={handleDrawerToggle}
            sx={{
              display: { xs: 'block', lg: 'none' },
              '& .MuiDrawer-paper': { 
                boxSizing: 'border-box', 
                width: { xs: '260px', sm: '300px', md: '320px' },
                pt: 2,
              },
            }}
          >
            <Box
              onClick={handleDrawerToggle}
              onKeyDown={handleDrawerToggle}
              sx={{ textAlign: 'center' }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 2, mb: 2 }}>
                <IconButton onClick={handleDrawerToggle}>
                  <CloseIcon />
                </IconButton>
              </Box>
              <List sx={{ px: 2 }}>
                {navLinks.map((link) => (
                  <ListItem key={link.name} disablePadding sx={{ mb: 1 }}>
                    <ListItemButton 
                      component={MuiLink} 
                      href={link.href} 
                      sx={{ 
                        textAlign: 'center',
                        borderRadius: '8px',
                        py: 1.5,
                        '&:hover': {
                          backgroundColor: 'grey.100',
                        }
                      }}
                    >
                      <ListItemText 
                        primary={link.name} 
                        sx={{ 
                          '& .MuiTypography-root': { 
                            fontSize: '1.1rem',
                            color: '#7C70A1',
                          } 
                        }} 
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
                {/* Botón Agendar en el menú móvil */}
                <ListItem disablePadding sx={{ mt: 3 }}>
                  <ListItemButton 
                    component={Link} 
                    to="/agendar" 
                    sx={{ 
                      textAlign: 'center',
                      backgroundColor: '#7B1FA2',
                      color: 'white',
                      borderRadius: '8px',
                      py: 2,
                      '&:hover': {
                        backgroundColor: '#6a6191',
                      }
                    }}
                  >
                    <ListItemText 
                      primary="Agendar" 
                      sx={{ 
                        '& .MuiTypography-root': { 
                          fontSize: '1.2rem',
                          fontWeight: 'bold',
                        } 
                      }} 
                    />
                  </ListItemButton>
                </ListItem>
                {/* Botón WhatsApp en Drawer móvil/tablet */}
                <ListItem disablePadding sx={{ mt: 2, mb: 2, justifyContent: 'center', display: 'flex' }}>
                  <Button
                    component="a"
                    href={`https://wa.me/${numeroTelefono}`}
                    target="_blank"
                    rel="noopener"
                    sx={{
                      width: "100%",
                      height: "40px",
                      fontSize: "1rem",
                      fontWeight: "bold",
                      backgroundColor: "#25D366",
                      color: "#ffffff",
                      mt: 1,
                      mb: 1,
                      '&:hover': {
                        backgroundColor: '#1ebc59',
                      },
                      textTransform: 'none',
                      borderRadius: '8px',
                    }}
                  >
                    WhatsApp
                  </Button>
                </ListItem>
              </List>
            </Box>
          </Drawer>
        </Toolbar>
      </AppBar>
      
      {/* Sección principal */}
      <Container
        sx={{
          mt: { xs: 3, sm: 4 }, // Margen superior
          mb: { xs: 6, sm: 8 }, // Margen inferior
          px: { xs: 2, sm: 3, md: 4 }, // Padding horizontal responsivo
        }}
      >
        {/* Contenedor principal con layout flexbox responsivo */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' }, // Columna en móviles, fila en pantallas medianas y grandes
            alignItems: 'center', // Centra verticalmente los elementos
            justifyContent: 'space-between', // Distribuye el espacio entre los elementos
            gap: { xs: 4, sm: 6, md: 12 }, // Espacio entre elementos, responsivo
          }}
        >
          {/* Sección de contenido de texto */}
          <Box
            sx={{
              textAlign: { xs: 'center', md: 'left' }, // Alineación de texto responsiva
              width: { md: '50%' }, // Ocupa la mitad del ancho en pantallas medianas y grandes
              zIndex: 10, // Controla el orden de apilamiento
            }}
          >
            {/* Chip/Etiqueta para "Servicios de Autoseguro Profesionales" */}
            <Chip
              label="Servicio de Inspección Profesional"
              sx={{
                display: 'inline-flex', // Para que se comporte como un bloque en línea
                px: 4, // Padding horizontal (4 unidades de MUI, cada una 8px)
                py: 1.5, // Padding vertical
                backgroundColor: '#EDE7F6', // Color de fondo similar a purple-100
                color: '#6A1B9A', // Color del texto similar a purple-800
                borderRadius: '9999px', // Bordes completamente redondeados
                fontSize: '0.875rem', // Tamaño de fuente pequeño (text-sm)
                fontWeight: 'medium', // Grosor de fuente medio
                mb: 3, // Margen inferior (3 unidades de MUI)
              }}
            />

            {/* Título principal de la sección */}
            <Typography
              variant="h3" // Variante de tipografía, adaptable a tamaños de pantalla
              component="h1" // Renderiza semánticamente como un h1
              sx={{
                fontWeight: 'bold', // Texto en negrita
                mb: 3, // Margen inferior
                color: 'grey.800', // Color de texto gris oscuro (del tema MUI)
                lineHeight: 'tight', // Altura de línea ajustada
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem', lg: '3.5rem' }, // Tamaños de fuente responsivos
              }}
              className="efecto-titulo" //Efecto css nuevo
            >
              Protege tu vehículo con{' '}
              {/* Parte del texto con un color diferente */}
              <Box component="span" sx={{ color: '#7d1ea2' }}>
                expertos
              </Box>
            </Typography>

            {/* Párrafo descriptivo */}
            <Typography
              variant="body1" // Variante de tipografía para texto de cuerpo
              sx={{
                fontSize: '1.125rem', // Tamaño de fuente grande (text-lg)
                color: 'grey.600', // Color de texto gris (del tema MUI)
                mb: 4, // Margen inferior
                maxWidth: 'lg', // Ancho máximo en el contenedor
                mx: { xs: 'auto', md: 0 }, // Margen horizontal automático para centrar en móviles, a la izquierda en escritorio
              }}
            >
              Primeros en la Región de la Araucania, servicio 100% a domicilio
              Atención personalizada.
            </Typography>

            {/* Contenedor de los puntos de beneficio */}
            <Stack
              direction="column" // Organiza los elementos en columna
              spacing={2.5} // Espacio entre cada punto de beneficio
              sx={{
                mb: 4, // Margen inferior
                textAlign: 'left', // Alineación de texto a la izquierda
                maxWidth: 'lg', // Ancho máximo
                mx: { xs: 'auto', md: 0 }, // Margen horizontal automático para centrar en móviles, a la izquierda en escritorio
              }}
            >
              {/* Beneficio 1 */}
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {/* Ícono de verificación */}
                <Box
                  sx={{
                    flexShrink: 0, // Evita que el elemento se encoja
                    width: 32, // Ancho (8 unidades de Tailwind = 32px)
                    height: 32, // Alto
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%', // Completamente redondeado
                    backgroundColor: '#ffb64d', // Color de fondo naranja
                  }}
                >
                  <CheckIcon sx={{ width: 16, height: 16, color: '#ffffff' }} /> {/* Ícono blanco */}
                </Box>
                <Typography variant="body1" sx={{ ml: 3, color: 'grey.700' }}>
                  Atención personalizada a domicilio
                </Typography>
              </Box>

              {/* Beneficio 2 */}
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box
                  sx={{
                    flexShrink: 0,
                    width: 32,
                    height: 32,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    backgroundColor: '#ffb64d', // Color de fondo naranja
                  }}
                >
                  <CheckIcon sx={{ width: 16, height: 16, color: '#ffffff' }} />
                </Box>
                <Typography variant="body1" sx={{ ml: 3, color: 'grey.700' }}>
                  Cobertura completa y personalizada
                </Typography>
              </Box>

              {/* Beneficio 3 */}
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box
                  sx={{
                    flexShrink: 0,
                    width: 32,
                    height: 32,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    backgroundColor: '#ffb64d', // Color de fondo naranja
                  }}
                >
                  <CheckIcon sx={{ width: 16, height: 16, color: '#ffffff' }} />
                </Box>
                <Typography variant="body1" sx={{ ml: 3, color: 'grey.700' }}>
                  Precios competitivos garantizados
                </Typography>
              </Box>
            </Stack>

            {/* Contenedor de botones */}
            <Box
              sx={{
                display: "flex", // Flex container
                flexDirection: { xs: "column", sm: "row" }, // Columna en móviles, fila en pantallas más grandes
                justifyContent: { xs: "center", md: "flex-start" }, // Centrado en móviles, izquierda en escritorio
                gap: { xs: 2, sm: 2.5 }, // Espacio entre botones
                maxWidth: "450px", // Ancho máximo del contenedor
                mx: { xs: "auto", md: 0 }, // Margen automático para centrar en móviles
              }}
            >
              {/* Botón Cotización */}
              <Button
                variant="outlined"
                color="primary"
                onClick={() => setOpenCotizacion(true)}
                sx={{
                  fontSize: "1.1rem", // Tamaño de la fuente
                  px: 4, // Padding horizontal
                  py: 1.5, // Padding vertical
                  borderRadius: "8px", // Radio de borde
                  borderColor: "#6a6191",
                  color: "#6a6191",
                  "&:hover": {
                    borderColor: "#7B1FA2",
                    backgroundColor: "rgba(106, 97, 145, 0.04)"
                  }
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
                  fontSize: "1.1rem", // Tamaño de la fuente
                  px: 4, // Padding horizontal
                  py: 1.5, // Padding vertical
                  borderRadius: "8px", // Radio de borde
                }}      
                className="btn" //Clase para el boton nuevo estilo css
                >
                Agendar Ahora
              </Button>
            </Box>
          </Box>

          {/* Imagen de la sección */}
          <Box 
            sx={{ 
              display: "flex", 
              textAlign: "center",
              width: { md: '45%' }, // Ancho en pantallas medianas y grandes
              justifyContent: "center"
            }}
          >
            <Slider {...settings} style={{ width: "100%", maxWidth: "500px" }}>
              {images.map((img, index) => (
                <Box key={index}>
                  <img
                    src={img}
                    alt={`Imagen ${index + 1}`} 
                    style={{
                      width: "100%",
                      height: "auto",
                      borderRadius: "40px"
                    }}
                  />
                </Box>
              ))}
            </Slider>
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
  sx={{
    position: 'fixed',
    bottom: 24,
    right: 24,
    zIndex: 2000 
  }}
/>

{/* Opción 2: Botón dentro de una sección de contacto */}
{/*<Box sx={{ mt: 4 }}>        
<BotonWhatsApp
  numeroTelefono={numeroTelefono}
  mensajeInicial={mensajeInicial}
/>
</Box>*/}
{/* Footer */}
<Footer />
      
</div>
  );
}

export default LandingPage;
