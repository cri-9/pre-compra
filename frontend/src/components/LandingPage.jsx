import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MenuIcon from '@mui/icons-material/Menu';
import { Link as MuiLink, useTheme } from "@mui/material";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom"; // Importar useLocation para obtener la ubicación actual
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css"; //carrusel slick
import logo_sect from "../assets/Carrusel_Portada/img_secction1.webp";
import img_sec_1 from "../assets/Carrusel_Portada/portada_01.webp"; // Imagen de la sección
import img_sect_2 from "../assets/Carrusel_Portada/portada_02.webp"; // Imagen de la sección
import img_sect_3 from "../assets/Carrusel_Portada/portada_03.webp"; // Imagen de la sección
import img_sect_4 from "../assets/Carrusel_Portada/portada_04.webp"; // Imagen de la sección
import iconDpf from "../assets/img_prin_dpf/ico_dpf_nabv.png";
import logo from "../assets/Logo_Superior/logo_superior_menu2.webp";
import iconTpms from "../assets/servicios/icon_tpms_menu.png";
import '../Csspersonalizado/landingpage.css'; //Css personalizado para varios estilos

// DOCUMENTACIÓN: Hook personalizado para rastrear la posición del mouse
// Necesario para el efecto de partículas interactivas
function useMousePosition() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return mousePosition;
}

// DOCUMENTACIÓN: Función utilitaria para convertir colores hexadecimales a RGB
// Necesaria para las partículas con transparencia
function hexToRgb(hex) {
  hex = hex.replace("#", "");
  if (hex.length === 3) {
    hex = hex.split("").map((char) => char + char).join("");
  }
  const hexInt = parseInt(hex, 16);
  const red = (hexInt >> 16) & 255;
  const green = (hexInt >> 8) & 255;
  const blue = hexInt & 255;
  return [red, green, blue];
}

// DOCUMENTACIÓN: Componente de partículas animadas interactivas
// Crea un efecto de fondo con partículas que responden al movimiento del mouse
const Particles = React.forwardRef(({ 
  className = "",
  quantity = 50, // Reducido para mejor rendimiento
  staticity = 50,
  ease = 50,
  size = 0.4,
  color = "#DF9FEA", // Color púrpura del tema
  ...props 
}, ref) => {
  const canvasRef = React.useRef(null);
  const canvasContainerRef = React.useRef(null);
  const context = React.useRef(null);
  const circles = React.useRef([]);
  const mousePosition = useMousePosition();
  const mouse = React.useRef({ x: 0, y: 0 });
  const canvasSize = React.useRef({ w: 0, h: 0 });
  const dpr = typeof window !== "undefined" ? window.devicePixelRatio : 1;
  const rafID = React.useRef(null);

  React.useEffect(() => {
    if (canvasRef.current) {
      context.current = canvasRef.current.getContext("2d");
    }
    initCanvas();
    animate();

    const handleResize = () => {
      setTimeout(() => initCanvas(), 200);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      if (rafID.current != null) {
        window.cancelAnimationFrame(rafID.current);
      }
      window.removeEventListener("resize", handleResize);
    };
  }, [color]);

  React.useEffect(() => {
    onMouseMove();
  }, [mousePosition.x, mousePosition.y]);

  const initCanvas = () => {
    resizeCanvas();
    drawParticles();
  };

  const onMouseMove = () => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const { w, h } = canvasSize.current;
      const x = mousePosition.x - rect.left - w / 2;
      const y = mousePosition.y - rect.top - h / 2;
      const inside = x < w / 2 && x > -w / 2 && y < h / 2 && y > -h / 2;
      if (inside) {
        mouse.current.x = x;
        mouse.current.y = y;
      }
    }
  };

  const resizeCanvas = () => {
    if (canvasContainerRef.current && canvasRef.current && context.current) {
      canvasSize.current.w = canvasContainerRef.current.offsetWidth;
      canvasSize.current.h = canvasContainerRef.current.offsetHeight;

      canvasRef.current.width = canvasSize.current.w * dpr;
      canvasRef.current.height = canvasSize.current.h * dpr;
      canvasRef.current.style.width = `${canvasSize.current.w}px`;
      canvasRef.current.style.height = `${canvasSize.current.h}px`;
      context.current.scale(dpr, dpr);

      circles.current = [];
      for (let i = 0; i < quantity; i++) {
        const circle = circleParams();
        drawCircle(circle);
      }
    }
  };

  const circleParams = () => {
    const x = Math.floor(Math.random() * canvasSize.current.w);
    const y = Math.floor(Math.random() * canvasSize.current.h);
    const pSize = Math.floor(Math.random() * 3) + size; // DOCUMENTACIÓN: Tamaño más variado
    const alpha = 0;
    const targetAlpha = parseFloat((Math.random() * 0.6 + 0.2).toFixed(1)); // DOCUMENTACIÓN: Más opacas (0.2-0.8)
    const dx = (Math.random() - 0.5) * 0.2; // DOCUMENTACIÓN: Movimiento más rápido
    const dy = (Math.random() - 0.5) * 0.2;
    const magnetism = 0.2 + Math.random() * 6; // DOCUMENTACIÓN: Mayor magnetismo al mouse
    return {
      x, y, translateX: 0, translateY: 0, size: pSize, alpha, targetAlpha, dx, dy, magnetism,
    };
  };

  const rgb = hexToRgb(color);

  const drawCircle = (circle, update = false) => {
    if (context.current) {
      const { x, y, translateX, translateY, size, alpha } = circle;
      context.current.translate(translateX, translateY);
      context.current.beginPath();
      context.current.arc(x, y, size, 0, 2 * Math.PI);
      context.current.fillStyle = `rgba(${rgb.join(", ")}, ${alpha})`;
      context.current.fill();
      context.current.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (!update) {
        circles.current.push(circle);
      }
    }
  };

  const clearContext = () => {
    if (context.current) {
      context.current.clearRect(0, 0, canvasSize.current.w, canvasSize.current.h);
    }
  };

  const drawParticles = () => {
    clearContext();
    for (let i = 0; i < quantity; i++) {
      const circle = circleParams();
      drawCircle(circle);
    }
  };

  const remapValue = (value, start1, end1, start2, end2) => {
    const remapped = ((value - start1) * (end2 - start2)) / (end1 - start1) + start2;
    return remapped > 0 ? remapped : 0;
  };

  const animate = () => {
    clearContext();
    circles.current.forEach((circle, i) => {
      const edge = [
        circle.x + circle.translateX - circle.size,
        canvasSize.current.w - circle.x - circle.translateX - circle.size,
        circle.y + circle.translateY - circle.size,
        canvasSize.current.h - circle.y - circle.translateY - circle.size,
      ];
      const closestEdge = edge.reduce((a, b) => Math.min(a, b));
      const remapClosestEdge = parseFloat(remapValue(closestEdge, 0, 20, 0, 1).toFixed(2));
      
      if (remapClosestEdge > 1) {
        circle.alpha += 0.04; // DOCUMENTACIÓN: Aparición más rápida
        if (circle.alpha > circle.targetAlpha) {
          circle.alpha = circle.targetAlpha;
        }
      } else {
        circle.alpha = circle.targetAlpha * remapClosestEdge;
      }
      
      circle.x += circle.dx;
      circle.y += circle.dy;
      circle.translateX += (mouse.current.x / (staticity / circle.magnetism) - circle.translateX) / ease;
      circle.translateY += (mouse.current.y / (staticity / circle.magnetism) - circle.translateY) / ease;

      drawCircle(circle, true);

      if (circle.x < -circle.size || circle.x > canvasSize.current.w + circle.size ||
          circle.y < -circle.size || circle.y > canvasSize.current.h + circle.size) {
        circles.current.splice(i, 1);
        const newCircle = circleParams();
        drawCircle(newCircle);
      }
    });
    rafID.current = window.requestAnimationFrame(animate);
  };

  return (
    <div
      className={className}
      ref={canvasContainerRef}
      style={{ 
        position: 'absolute', 
        inset: 0, 
        pointerEvents: 'none',
        zIndex: 1
      }}
      {...props}
    >
      <canvas 
        ref={canvasRef} 
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
});

// Importar imágenes optimizadas para móvil (600x500, menor peso)
import img_movil_1 from "../assets/Carrusel_Movil/img_movil_1.webp";
import img_movil_2 from "../assets/Carrusel_Movil/img_movil_2.webp";
import img_movil_3 from "../assets/Carrusel_Movil/img_movil_3.webp";
import img_movil_4 from "../assets/Carrusel_Movil/img_movil_4.webp";
import img_movil_5 from "../assets/Carrusel_Movil/img_movil_5.webp";
//componentes
import { useWindowSize } from '@react-hook/window-size'; // Importar el hook para obtener el tamaño de la ventana
import Confetti from 'react-confetti'; // Importar el componente de confeti
import Slider from "react-slick";
import Cotizacion from "../components/Cotizacion"; // Importar el nuevo componente
import About from './About';
import BotonWhatsApp from "./BotonWhatsApp.jsx"; // Importar el botón de WhatsApp
import ChecklistSection from "./ChecklistSection.jsx";
import ComoFunciona from './ComoFunciona.jsx';
import Footer from "./Footer";
import HerramientasSection from "./HerramientasSection.jsx";
import PrecioServicio from "./PrecioServicio";
import PreguntasFrecuentes from './PreguntasFrecuentes.jsx';
import ServiceCards from "./ServiceCards.jsx"; //nuevas card de prueba
import TestimoniosSection from "./TestimoniosSection.jsx";
import ValorServicio from './ValorServicio';

// IMPORTAR LA IMAGEN DE FONDO DEL HEADER
import headerBackground from "../assets/img_atras_header/header_.webp";
//IMPORTAR IMAGEN DE FONDO MENU HAMBURGUEZA
import fondoMenuHamburguesa from "../assets/fondo_menu_hambur/img_fondo_hambur.webp";

// Componente principal de la página de destino
function LandingPage() {
  const [openCotizacion, setOpenCotizacion] = useState(false); // Estado para abrir/cerrar la ventana emergente de cotización
  const [width, height] = useWindowSize(); // Obtener el tamaño de la ventana
  const [openExito, setOpenExito] = useState(false); // Estado para el confeti
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Estado para el menú móvil
  const [openServiciosLP, setOpenServiciosLP] = useState(false); // Estado para el menú de servicios en LP
  const serviciosLpRef = React.useRef(null); // Ref para cerrar al hacer clic fuera
  const location = useLocation(); // Obtener la ubicación actual
  const theme = useTheme(); // Accede al tema de MUI para los breakpoints
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Detecta si es pantalla móvil

  useEffect(() => {
    const params = new URLSearchParams(location.search); // Obtener los parámetros de la URL
    if (params.get("mensaje") === "exito") {
      alert("!Su proceso de pago y agendamineto se realizón con éxito!"); // Mostrar alerta de éxito
    }
  }, [location]); // Ejecutar el efecto solo cuando la ubicación cambie  {/*Navegación dentro de la misma pagina*/}
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
  const mensajeInicial = "Visual Mecánica le da la Bienvenida;  Te podemos ayudar."; // Mensaje inicial
  

  // Enlaces de navegación
  const navLinks = [
    { name: 'Inicio', href: '/' },
    { name: 'Quienes Somos', href: '#about' },
    { name: 'Nuestro Servicio', href: '#nuestro-servicio' },
    { name: 'Nuestras Herramientas', href: '#nuestras-herramientas' },
    { name: 'Servicios' }, // Sin href porque abrirá un menú
    { name: 'Valores', href: '#valor-servicios' },
   // { name: 'Blog', href: '/blog' },
  ];

  // SubmenÃº de Servicios
  const servicios = [
    { name: 'Servicio TPMS', href: '/tpms', icon: iconTpms },
    { name: 'Regeneración DPF', href: '/dpf', icon: iconDpf },
  ];

  // Handlers para el menÃº de servicios
  // Handlers anteriores removidos - dropdown local usa setOpenServiciosLP

  
  // Componente Navigation con dropdown local para Servicios
  const Navigation = () => (
    <Stack direction="row" spacing={3} sx={{ mr: 6, ml: 2, alignItems: 'center' }}>
      {navLinks.map((link) => {
        // Si el link es "Servicios", renderiza con dropdown local
        if (link.name === 'Servicios') {
          return (
            <Box key={link.name} ref={serviciosLpRef} sx={{ position: 'relative' }}>
              <Button
                disableRipple
                onClick={() => setOpenServiciosLP(!openServiciosLP)}
                endIcon={
                  <ExpandMoreIcon
                    sx={{
                      fontSize: '1.1rem',
                      transition: 'transform 0.3s ease',
                      transform: openServiciosLP ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                  />
                }
                sx={{
                  color: '#7B1FA2',
                  fontWeight: 500,
                  textTransform: 'none',
                  fontSize: '0.9rem',
                  fontFamily: 'Roboto, Arial, sans-serif',
                  letterSpacing: 0.2,
                  '&:hover': { color: '#D49CEC', background: 'transparent' },
                }}
              >
                {link.name}
              </Button>

              {/* Dropdown local con posicionamiento absoluto */}
              <Box
                role="menu"
                sx={{
                  position: 'absolute',
                  top: 'calc(100% + 6px)',
                  left: '50%',
                  transform: openServiciosLP
                    ? 'translateX(-50%) translateY(0)'
                    : 'translateX(-50%) translateY(-8px)',
                  opacity: openServiciosLP ? 1 : 0,
                  pointerEvents: openServiciosLP ? 'auto' : 'none',
                  transition: 'opacity 180ms ease, transform 180ms ease',
                  backgroundColor: '#f9f6fc',
                  boxShadow: '0 12px 30px rgba(0, 0, 0, 0.18)',
                  border: '1px solid rgba(123, 31, 162, 0.12)',
                  borderRadius: '12px',
                  overflow: 'visible',
                  display: 'flex',
                  flexDirection: 'row',
                  zIndex: (theme) => theme.zIndex.modal + 2000,
                }}
              >
                {servicios.map((servicio, idx, arr) => (
                  <Box
                    key={servicio.name}
                    component={Link}
                    to={servicio.href}
                    onClick={() => setOpenServiciosLP(false)}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flex: 1,
                      py: 2,
                      px: 3,
                      gap: 1,
                      minWidth: '120px',
                      backgroundColor: 'transparent',
                      borderRadius: '8px',
                      borderRight:
                        idx === arr.length - 1
                          ? 'none'
                          : '1px solid rgba(123, 31, 162, 0.12)',
                      transition: 'background-color 0.2s ease',
                      '&:hover': { backgroundColor: '#EDE7F6' },
                      textDecoration: 'none',
                      color: 'inherit',
                    }}
                  >
                    {servicio.icon && (
                      <img
                        src={servicio.icon}
                        alt={servicio.name}
                        style={{
                          width: '45px',
                          height: '45px',
                          objectFit: 'contain',
                        }}
                      />
                    )}
                    <span
                      style={{
                        color: '#7B1FA2',
                        fontWeight: 500,
                        fontSize: '0.9rem',
                        textAlign: 'center',
                      }}
                    >
                      {servicio.name}
                    </span>
                  </Box>
                ))}
              </Box>
            </Box>
          );
        }

        // Enlaces normales
        return (
          <MuiLink
            key={link.name}
            href={link.href}
            underline="none"
            sx={{
              position: 'relative',
              padding: '5px 0',
              color: '#7B1FA2',
              fontFamily: 'Roboto, Arial, sans-serif',
              fontWeight: 500,
              fontSize: '0.9rem',
              letterSpacing: 0.2,
              textTransform: 'none',
              transition: 'color 0.3s ease-out',
              '&:hover': {
                color: '#D49CEC',
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                width: '100%',
                height: '2px',
                backgroundColor: '#B34FDE',
                bottom: 0,
                left: 0,
                transform: 'scaleX(0)',
                transformOrigin: 'center',
                transition: 'transform 0.3s ease-out',
              },
              '&:hover::after': {
                transform: 'scaleX(1)',
              },
            }}
          >
            {link.name}
          </MuiLink>
        );
      })}
    </Stack>
  );
  // Función para manejar el menú móvil
  const handleDrawerToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Configuración de imágenes del carrusel con versiones para escritorio y móvil
  const carouselImages = [
    {
      desktop: logo_sect,
      mobile: img_movil_1,
      alt: "Imagen principal del servicio" // Descripción de la imagen
    },
    {
      desktop: img_sec_1,
      mobile: img_movil_2,
      alt: "Servicio de inspección profesional"
    },
    {
      desktop: img_sect_2,
      mobile: img_movil_3,
      alt: "Herramientas especializadas"
    },
    {
      desktop: img_sect_3,
      mobile: img_movil_4,
      alt: "Atención personalizada"
    },
    {
      desktop: img_sect_4,
      mobile: img_movil_5,
      alt: "Cobertura completa"
    }
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1, // Solo una imagen visible a la vez
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: true,
    lazyLoad: 'progressive', // Cambiado para mejor rendimiento en móviles
    adaptiveHeight: true, // Se adapta a la altura de la imagen
    centerMode: false, // Desactivar modo centro para evitar solapamiento
    variableWidth: false, // Ancho fijo para evitar problemas de alineación
    swipeToSlide: true, // Permitir deslizar suavemente
    touchThreshold: 5, // Mayor sensibilidad al tacto
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: false, // Sin flechas en móvil para mejor UX
          dots: true,
          adaptiveHeight: true,
          centerMode: false, // Asegurar que no se active en móvil
          variableWidth: false
        }
      }
    ]
  };
  return (
    <div style={{ width: '100%', overflowX: 'hidden' }}>          {/* NUEVO CONTENEDOR CON LA IMAGEN DE FONDO */}
      <Box 
        sx={{
          // ESTILOS DEL FONDO DE LA IMAGEN
          backgroundImage: `linear-gradient(rgba(47, 47, 128, 0.5), rgba(31, 27, 27, 0.5)), url(${headerBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'multiply',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          minHeight: { xs: '150px', sm: '200px' }, // Altura del contenedor para que la imagen sobresalga
        }}
      > 
                {/* Header original con menú hamburguesa - MODIFICADO PARA BARRA FLOTANTE */}            
        <AppBar position="static" 
          sx={{ 
            backgroundColor: "#f9f6fc", // Fondo semi-transparente
            backdropFilter: 'blur(10px)', // Efecto de desenfoque moderno
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.30)', // Sombra más suave
            borderRadius: '15px', // Bordes redondeados para efecto flotante
            mx: 'auto', // DOCUMENTACIÓN: Centrado automático para mejor balance
            my: -6, // Margen vertical para efecto flotante
            maxWidth: { xs: '95%', sm: '95%', md: '85%', lg: '95%' }, // DOCUMENTACIÓN: Ancho controlado para centrado perfecto
            // Los márgenes laterales (mx) hacen que la barra sea más corta que el ancho completo
            // creando el efecto de barra flotante sobre la imagen de fondo
          }}
        >
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
                  maxHeight: '95px',
                  width: 'auto',
                  maxWidth: '280px',
                  margin: '0px',
                  imageRendering: 'crisp-edges',
                }}
              />
            </Box>

            {/* Navegación para escritorio grande con subrayado animado */}
            <Box sx={{ display: { xs: 'none', lg: 'flex' }, alignItems: 'center' }}>
              {/* Menú de navegación animado */}
              <Navigation />
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
              {/* Botón WhatsApp en el menú */}
              <Button
                component="a"
                href="https://wa.me/56997541042"
                target="_blank"
                rel="noopener"
                sx={{
                  width: "120px",
                  height: "36px",
                  fontSize: "0.9rem",
                  fontWeight: "bold",
                  backgroundColor: "#25D366",
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
                  color: 'grey.600', // Color del icono para contrastar
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
                  // DOCUMENTACIÓN: Agregando imagen de fondo al menú hamburguesa
                  backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${fondoMenuHamburguesa})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                },
              }}
            >
            
              <Box
                //imagen de fondo en menu hamburguesa
                onClick={handleDrawerToggle}
                onKeyDown={handleDrawerToggle}
                sx={{ 
                textAlign: 'center',
                minHeight: '100vh',
                // DOCUMENTACIÓN: Estilos para contrastar con la imagen de fondo del menú
                color: 'white',
                '& .MuiTypography-root': {
                color: 'white !important',
              },
                '& .MuiListItemText-root .MuiTypography-root': {
                color: 'white !important',
              },
                '& .MuiIconButton-root': {
                 color: 'white',
            }
            }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 2, mb: 2 }}>
                  <IconButton onClick={handleDrawerToggle}>
                    <CloseIcon />
                  </IconButton>
                </Box>
                <List sx={{ 
                  px: 2, // Más padding horizontal para mejor encuadre
                  py: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center', // Centrar elementos
                  width: '100%'
                }}>
                  {/* Menú móvil con subrayado animado */}
                  {navLinks.map((link) => (
                    <ListItem key={link.name} disablePadding sx={{ mb: 1, width: '100%', px: 0, justifyContent: 'center', display: 'flex' }}>
                      {/* Usar MuiLink para evitar conflictos de imports en Drawer móvil */}
                      <MuiLink
                        href={link.href}
                        underline="none"
                        sx={{
                          position: 'relative',
                          padding: '5px 0',
                          color: '#7B1FA2',
                          fontFamily: 'Roboto, Arial, sans-serif',
                          fontWeight: 500,
                          fontSize: '0.9rem',
                          letterSpacing: 0.2,
                          textTransform: 'none',
                          textAlign: 'center',
                          width: '100%',
                          transition: 'color 0.3s ease-out',
                          '&:hover': {
                            color: '#D49CEC',
                          },
                          '&::after': {
                            content: '""',
                            position: 'absolute',
                            width: '100%',
                            height: '2px',
                            backgroundColor: '#B34FDE',
                            bottom: 0,
                            left: 0,
                            transform: 'scaleX(0)',
                            transformOrigin: 'center',
                            transition: 'transform 0.3s ease-out',
                          },
                          '&:hover::after': {
                            transform: 'scaleX(1)',
                          },
                        }}
                      >
                        {link.name}
                      </MuiLink>
                    </ListItem>
                  ))}
                {/* Botón Agendar en el menú móvil */}
                <ListItem disablePadding sx={{ mt: 3, px: 0 }}>
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
                                                    fontSize: "0.9rem", // DOCUMENTACIÓN: Texto más pequeño para botón compacto // DOCUMENTACIÓN: Reducido para botón más compacto
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
                                            height: "36px", // DOCUMENTACIÓN: Altura reducida para botón más compacto
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
    </Box>
      
      {/* Sección principal con efecto de partículas interactivas */}
      <Container
        sx={{
          mt: { xs: 3, sm: 4 }, // Margen superior
          mb: { xs: 6, sm: 8 }, // Margen inferior
          px: { xs: 2, sm: 3, md: 4 }, // Padding horizontal responsivo
          maxWidth: "100%", // Asegurar que no se desborde
          overflow: "hidden", // Prevenir scroll horizontal
          position: 'relative', // DOCUMENTACIÓN: Necesario para el posicionamiento absoluto de las partículas
          minHeight: '600px', // DOCUMENTACIÓN: Altura mínima para que las partículas tengan espacio
        }}
      >
        {/* DOCUMENTACIÓN: Componente de partículas animadas de fondo */}
        {/* Efecto más visible con partículas púrpuras que responden al movimiento del mouse */}
        <Particles
          quantity={70}
          staticity={35}
          ease={25}
          size={1.2}
          color="#DF9FEA"
        />
        {/* Contenedor principal con layout flexbox responsivo */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' }, // Columna en móviles, fila en pantallas medianas y grandes
            alignItems: 'center', // Centra verticalmente los elementos
            justifyContent: 'space-between', // Distribuye el espacio entre los elementos
            gap: { xs: 4, sm: 6, md: 12 }, // Espacio entre elementos, responsivo
            position: 'relative', // DOCUMENTACIÓN: Para que el contenido aparezca sobre las partículas
            zIndex: 2, // DOCUMENTACIÓN: Z-index superior a las partículas (z-index: 1)
          }}
        >
          {/* Sección de contenido de texto */}
          <Box
            sx={{
              textAlign: { xs: 'center', md: 'left' }, // Alineación de texto responsiva
              width: { md: '50%' }, // Ocupa la mitad del ancho en pantallas medianas y grandes
              zIndex: 10, // DOCUMENTACIÓN: Z-index alto para estar sobre las partículas
              position: 'relative', // DOCUMENTACIÓN: Necesario para el z-index
            }}
          >
            {/* Chip/Etiqueta para "Servicios de Autoseguro Profesionales" */}
            <Chip
              label="Servicio de Inspección Automotriz Profesional"
              sx={{
                display: 'inline-flex', // Para que se comporte como un bloque en línea
                px: 4, // Padding horizontal (4 unidades de MUI, cada una 8px)
                py: 1.5, // Padding vertical
                          width: "100%", // Asegurar ancho completo
                          mx: 0, // Sin márgenes horizontales
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
              Protege tu inversión con{' '}
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
              y una atención de primera calidad.
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
                  Cobertura completa y confiable
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
              {/* Botón Agendar con efecto hover personalizado */}
              <Box
                component="button"
                onClick={() => window.location.href = '/agendar'}
                className="btn" // Clase para el botón nuevo estilo CSS
                sx={{
                  position: 'relative',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  borderRadius: '25px',
                  border: '1px solid #7B1FA2',
                  backgroundColor: '#7B1FA2',
                  padding: '12px 36px', // Aumentado el padding para más espacio
                  textAlign: 'center',
                  fontWeight: 600,
                  color: 'white',
                  minWidth: { xs: '200px', sm: '220px' }, // Aumentado el ancho mínimo
                  width: { xs: '100%', sm: 'auto' },
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2, // Aumentado el gap para más separación
                  '&:hover': {
                    backgroundColor: '#6a6191',
                    '& .text-content': {
                      transform: 'translateX(60px)', // Aumentado para más espacio
                      opacity: 0,
                    },
                    '& .dot-indicator': {
                      opacity: 0, // Hacer que el punto desaparezca
                      transform: 'scale(0.5)',
                    },
                    '& .arrow-content': {
                      transform: 'translateX(-20px)',
                      opacity: 1,
                    },
                  },
                }}
              >
                {/* Contenido principal con punto y texto */}
                <Box
                  className="dot-indicator"
                  sx={{
                    height: '8px',
                    width: '8px',
                    borderRadius: '50%',
                    backgroundColor: 'white',
                    transition: 'all 0.3s ease',
                    flexShrink: 0,
                  }}
                />
                <Box
                  className="text-content"
                  sx={{
                    transition: 'all 0.3s ease',
                    whiteSpace: 'nowrap', // Evitar salto de línea
                    fontSize: '1.1rem', // Tamaño de fuente específico
                  }}
                >
                  Agendar Ahora
                </Box>
                
                {/* Contenido con flecha que aparece en hover */}
                <Box
                  className="arrow-content"
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    zIndex: 10,
                    display: 'flex',
                    height: '100%',
                    width: '100%',
                    transform: 'translateX(60px)', // Ajustado para coincidir con el texto
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1,
                    color: 'white',
                    opacity: 0,
                    transition: 'all 0.3s ease',
                    whiteSpace: 'nowrap', // Evitar salto de línea
                  }}
                >
                  <span style={{ fontSize: '1.1rem' }}>Agendar Ahora</span>
                  <ArrowForwardIcon sx={{ fontSize: '20px' }} />
                </Box>
              </Box>

              {/* Botón Cotización con efecto hover personalizado */}
              <Box
                component="button"
                onClick={() => setOpenCotizacion(true)}
                className="btn"
                sx={{
                  position: 'relative',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  borderRadius: '25px',
                  border: '1px solid #FFB64D',
                  backgroundColor: '#FFB64D',
                  padding: '12px 36px', // Mismo padding que el botón Agendar
                  textAlign: 'center',
                  fontWeight: 600,
                  color: 'white',
                  minWidth: { xs: '200px', sm: '220px' }, // Mismo ancho que el botón Agendar
                  width: { xs: '100%', sm: 'auto' },
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2, // Misma separación que el botón Agendar
                  '&:hover': {
                    backgroundColor: '#FFCE8A',
                    '& .text-content': {
                      transform: 'translateX(60px)', // Mismo desplazamiento
                      opacity: 0,
                    },
                    '& .dot-indicator': {
                      opacity: 0, // Hacer que el punto desaparezca
                      transform: 'scale(0.5)',
                    },
                    '& .arrow-content': {
                      transform: 'translateX(-20px)',
                      opacity: 1,
                    },
                  },
                }}
              >
                {/* Contenido principal con punto y texto */}
                <Box
                  className="dot-indicator"
                  sx={{
                    height: '8px',
                    width: '8px',
                    borderRadius: '50%',
                    backgroundColor: 'white',
                    transition: 'all 0.3s ease',
                    flexShrink: 0,
                  }}
                />
                <Box
                  className="text-content"
                  sx={{
                    transition: 'all 0.3s ease',
                    whiteSpace: 'nowrap', // Evitar salto de línea
                    fontSize: '1.1rem', // Mismo tamaño que el botón Agendar
                  }}
                >
                  Cotización
                </Box>
                
                {/* Contenido con flecha que aparece en hover */}
                <Box
                  className="arrow-content"
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    zIndex: 10,
                    display: 'flex',
                    height: '100%',
                    width: '100%',
                    transform: 'translateX(60px)', // Ajustado para coincidir con el texto
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1,
                    color: 'white',
                    opacity: 0,
                    transition: 'all 0.3s ease',
                    whiteSpace: 'nowrap', // Evitar salto de línea
                  }}
                >
                  <span style={{ fontSize: '1.1rem' }}>Cotización</span>
                  <ArrowForwardIcon sx={{ fontSize: '20px' }} />
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Carrusel de imágenes optimizado para móvil */}
          <Box 
            sx={{ 
              display: "flex", 
              textAlign: "center",
              width: { md: '45%' }, // Ancho en pantallas medianas y grandes
              justifyContent: "center",
              // Prevenir overflow y solapamiento
              overflow: 'hidden',
              '& .slick-slider': {
                width: '100%'
              },
              '& .slick-list': {
                overflow: 'hidden',
                width: '100%'
              },
              '& .slick-track': {
                display: 'flex',
                alignItems: 'center'
              },
              '& .slick-slide': {
                padding: '0 5px', // Pequeño espacio entre slides
                '& > div': {
                  width: '100%',
                  height: '100%'
                }
              }
            }}
          >
            <Slider {...settings} style={{ width: "100%", maxWidth: "500px" }}>
              {carouselImages.map((imageData, index) => (
                <Box key={index} sx={{ 
                  width: '100%',
                  display: 'flex !important', // Force flex display
                  justifyContent: 'center',
                  alignItems: 'center',
                  px: 0, // Sin padding extra que cause problemas
                }}> 
                  <Box
                    component="img"
                    src={isMobile ? imageData.mobile : imageData.desktop}
                    alt={imageData.alt}
                    sx={{
                      width: "100%",
                      height: "auto",
                      borderRadius: "40px",
                      objectFit: "cover",
                      maxWidth: "100%",
                      display: "block",
                      margin: '0 auto', // Centrar imagen
                      // Estilos específicos para móvil
                      ...(isMobile && {
                        maxHeight: "350px",
                        objectFit: "contain"
                      })
                    }}
                    onError={(e) => {
                      // Fallback si la imagen no carga
                      if (isMobile && e.target.src === imageData.mobile) {
                        e.target.src = imageData.desktop; // Usar desktop como fallback
                      }
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

      {/* Componente Cómo Funciona */}
      <ComoFunciona />

{/* Sección de Servicios */}
<Container id="nuestro-servicio" sx={{ textAlign: "center", mt: 5 }}>
  <Typography variant="h5" fontWeight="bold" mb={3}
  sx={{ color: "#1848B9", 
        fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.5rem" }, // Título principal - Reducido
        mb: 3 //Menos separación debajo del titulo
      }} 
      >
    Nuestros Servicios
  </Typography>
  <Typography variant="h6" fontWeight="bold" mb={2}
  sx={{ color: "#757575", 
        fontSize: { xs: "1.3rem", sm: "1.5rem", md: "1.7rem" }, // Título secundario - Reducido
        mb: 4 // Separación debajo del título
      }} 
      >
    Cada detalle cuenta: de una inspección minuciosa a una revisión documental completa.
  </Typography>
  <ServiceCards />  
  </Container>

  {/* Checklist Section - fuera del Container para fondo completo */}
  <ChecklistSection />

       {/* Se dejara sin efecta para probar otra Card --componente se guarda en block al final////// Componentes Card*/}
       {/* Sección de Herramientas */}
  <HerramientasSection />

    {/*ValoresServicio*/}
    <div id="valor-servicios" style={{ 
      backgroundColor: '#ffffff', 
      backgroundImage: 'none',
      padding: '20px 0',
      position: 'relative',
      zIndex: 1
    }}>
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
