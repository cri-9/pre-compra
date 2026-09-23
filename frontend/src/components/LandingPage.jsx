import CalendarMonth from '@mui/icons-material/CalendarMonth';
import CloseIcon from '@mui/icons-material/Close';
import Description from '@mui/icons-material/Description';
import DesktopWindows from '@mui/icons-material/DesktopWindows';
import DirectionsCar from '@mui/icons-material/DirectionsCar';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FilterAlt from '@mui/icons-material/FilterAlt';
import MenuIcon from '@mui/icons-material/Menu';
import PrecisionManufacturing from '@mui/icons-material/PrecisionManufacturing';
import TireRepair from '@mui/icons-material/TireRepair';
import VerifiedUser from '@mui/icons-material/VerifiedUser';
import { Link as MuiLink, useTheme } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Drawer from '@mui/material/Drawer';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import iconDpf from '../assets/img_prin_dpf/ico_dpf_nabv.png';
import logo from '../assets/Logo_Superior/logo_superior_menu2.webp';
import iconTpms from '../assets/servicios/icon_tpms_menu.png';
import '../Csspersonalizado/landingpage.css';

// Hook personalizado para rastrear la posición del mouse (reservado para uso futuro)
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

//componentes
import { useWindowSize } from '@react-hook/window-size'; // Importar el hook para obtener el tamaño de la ventana
import Confetti from 'react-confetti'; // Importar el componente de confeti
import Cotizacion from "../components/Cotizacion"; // Importar el nuevo componente
import About from './About';
import BotonWhatsApp from "./BotonWhatsApp.jsx"; // Importar el botón de WhatsApp
import ChecklistSection from "./ChecklistSection.jsx";
import ComoFunciona from './ComoFunciona.jsx';
import Footer from "./Footer";
import HerramientasSection from "./HerramientasSection.jsx";
import PortadaTrabajos from './PortadaTrabajos';
import PreguntasFrecuentes from './PreguntasFrecuentes.jsx';
import ServiceCards from "./ServiceCards.jsx"; //nuevas card de prueba
import TestimoniosSection from "./TestimoniosSection.jsx";
import ValorServicio from './ValorServicio';

// IMPORTAR LA IMAGEN DE FONDO DEL HEADER
import headerBackground from "../assets/img_atras_header/header_.webp";
//IMPORTAR IMAGEN DE FONDO MENU HAMBURGUEZA
import fondoMenuHamburguesa from "../assets/fondo_menu_hambur/img_fondo_hambur.webp";

const services = [
  {
    Icon: DirectionsCar,
    title: 'Inspección pre-compra',
    subtitle: 'automotriz',
    text: 'Evaluación completa para que tomes la mejor decisión.',
  },
  {
    Icon: TireRepair,
    title: 'TPMS | Activación |',
    subtitle: 'Programación | Diagnóstico',
    text: 'Sistemas de monitoreo de presión de neumáticos.',
  },
  {
    Icon: DesktopWindows,
    title: 'Scanner profesional',
    subtitle: 'con Informe Técnico',
    text: 'Diagnóstico avanzado con reporte completo y detallado.',
  },
  {
    Icon: FilterAlt,
    title: 'Regeneración',
    subtitle: 'Electrónica DPF',
    text: 'Limpieza y regeneración del filtro de partículas diésel.',
  },
  {
    Icon: PrecisionManufacturing,
    title: 'Diagnóstico',
    subtitle: 'Electrónico Completo',
    text: 'Detección precisa de fallas en todos los sistemas del vehículo.',
  },
  {
    Icon: VerifiedUser,
    title: 'Asesoría Técnica',
    subtitle: 'Especializada',
    text: 'Acompañamiento profesional para cada necesidad de tu vehículo.',
  },
];

// Componente principal de la página de destino
function LandingPage() {
  const [openCotizacion, setOpenCotizacion] = useState(false); // Estado para abrir/cerrar la ventana emergente de cotización
  const [width, height] = useWindowSize(); // Obtener el tamaño de la ventana
  const [openExito, setOpenExito] = useState(false); // Estado para el confeti
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Estado para el menú móvil
  const [openServiciosLP, setOpenServiciosLP] = useState(false); // Estado para el menú de servicios en LP
  const serviciosLpRef = React.useRef(null); // Ref para cerrar al hacer clic fuera
  const location = useLocation(); // Obtener la ubicación actual
  const navigate = useNavigate(); // Hook para navegación programática
  const theme = useTheme();

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
  const numeroTelefono = "56949685530"; // Número de teléfono de WhatsApp
  const mensajeInicial = `Hola! 
Gracias por comunicarte con Visual Mecánica

Selecciona el servicio que deseas agendar:

1) Inspección Pre-Compra Automotriz
   Revisión técnica completa + Informe profesional

2) Mantención de Sensores TPMS
   Diagnóstico, programación y activación

3) Regeneración Electrónica DPF
   Diagnóstico + regeneración + reset de error

4) Servicio de Escáner Profesional
   Diagnóstico avanzado con informe OBD2

Nuestro equipo confirmará disponibilidad a la brevedad.`; // Mensaje inicial
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

  
  // Componente Navigation con nuevo estilo (inspirado en diseño indigo)
  const Navigation = () => (
    <Box
      component="nav"
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px 20px',
        mr: 2,
        ml: 1,
      }}
    >
      {navLinks.map((link) => {
        // Si el link es "Servicios", renderiza con dropdown local
        if (link.name === 'Servicios') {
          return (
            <Box key={link.name} ref={serviciosLpRef} sx={{ position: 'relative', zIndex: 1000 }}>
              <Box
                component="button"
                onClick={() => setOpenServiciosLP(!openServiciosLP)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#475569',
                  fontWeight: 500,
                  fontSize: { xs: '0.75rem', md: '0.875rem' },
                  fontFamily: 'Roboto, Arial, sans-serif',
                  transition: 'color 0.2s ease',
                  padding: 0,
                  '&:hover': { color: '#4338ca' },
                }}
              >
                Servicios
                <ExpandMoreIcon
                  sx={{
                    fontSize: '0.9rem',
                    transition: 'transform 0.3s ease',
                    transform: openServiciosLP ? 'rotate(180deg)' : 'rotate(0deg)',
                  }}
                />
              </Box>

              {/* Dropdown */}
              <Box
                role="menu"
                sx={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  left: '50%',
                  transform: openServiciosLP
                    ? 'translateX(-50%) translateY(0)'
                    : 'translateX(-50%) translateY(-8px)',
                  opacity: openServiciosLP ? 1 : 0,
                  pointerEvents: openServiciosLP ? 'auto' : 'none',
                  transition: 'opacity 180ms ease, transform 180ms ease',
                  backgroundColor: '#f9f6fc',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.18)',
                  border: '1px solid rgba(123,31,162,0.12)',
                  borderRadius: '12px',
                  overflow: 'visible',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'stretch',
                  zIndex: 9999,
                  minWidth: '360px',
                  py: 1,
                  px: 1,
                }}
              >
                {servicios.map((servicio, idx, arr) => (
                  <div
                    key={servicio.name}
                    onClick={() => {
                      setOpenServiciosLP(false);
                      navigate(servicio.href);
                    }}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flex: 1,
                      padding: '16px 24px',
                      gap: '8px',
                      backgroundColor: 'transparent',
                      borderRadius: '8px',
                      borderRight:
                        idx === arr.length - 1
                          ? 'none'
                          : '1px solid rgba(123,31,162,0.12)',
                      textDecoration: 'none',
                      color: 'inherit',
                      transition: 'background-color 0.2s ease',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#EDE7F6'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                  >
                    {servicio.icon && (
                      <img
                        src={servicio.icon}
                        alt=""
                        style={{ width: '32px', height: '32px', objectFit: 'contain' }}
                      />
                    )}
                    <span style={{ color: '#7B1FA2', fontWeight: 500, fontSize: '0.9rem', fontFamily: 'Roboto, Arial, sans-serif', textAlign: 'center' }}>
                      {servicio.name}
                    </span>
                  </div>
                ))}
              </Box>
            </Box>
          );
        }

        // Enlace activo para Inicio
        const isActive = link.name === 'Inicio';
        return (
          <MuiLink
            key={link.name}
            href={link.href}
            underline="none"
            sx={{
              color: isActive ? '#4338ca' : '#475569',
              fontFamily: 'Roboto, Arial, sans-serif',
              fontWeight: 500,
              fontSize: { xs: '0.75rem', md: '0.875rem' },
              transition: 'color 0.2s ease',
              whiteSpace: 'nowrap',
              '&:hover': { color: '#4338ca' },
            }}
          >
            {link.name}
          </MuiLink>
        );
      })}
    </Box>
  );
  // Función para manejar el menú móvil
  const handleDrawerToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div style={{ width: '100%', overflowX: 'hidden', marginTop: 0, paddingTop: 0, lineHeight: 0 }}>
      <Box 
        sx={{
          // ESTILOS DEL FONDO DE LA IMAGEN
          backgroundColor: '#0a0a0a', // base oscura: evita franja blanca
          backgroundImage: `linear-gradient(rgba(20, 15, 40, 0.6), rgba(10, 5, 20, 0.35)), url(${headerBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: '50% center',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',            // imagen llena arriba, AppBar al fondo
          minHeight: { xs: '110px', sm: '170px', md: '200px' }, // banner imagen grande
        }}
      > 
                {/* Header original con menú hamburguesa - MODIFICADO PARA BARRA FLOTANTE */}            
        <AppBar position="static" 
          sx={{ 
            backgroundColor: "#f9f6fc", // Fondo semi-transparente
            backdropFilter: 'blur(10px)', // Efecto de desenfoque moderno
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.30)', // Sombra más suave
            borderRadius: '15px', // Bordes redondeados para efecto flotante
            mx: 'auto',
            maxWidth: '1250px', //Ancho menu
            mb: '-44px', // 50% dentro imagen, 50% fuera
            overflow: 'visible',
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
            overflow: 'visible',
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
                  backgroundColor: "#8a23a8",
                  color: "#ffffff",
                  ml: 1,
                  "&:hover": { 
                    backgroundColor: "#8a23a8"
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
                href="https://wa.me/56949685530"
                target="_blank"
                rel="noopener"
                sx={{
                  width: "120px",
                  height: "36px",
                  fontSize: "0.9rem",
                  fontWeight: "bold",
                  backgroundColor: "#ff9a04",
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
      
      {/* SECCIÓN HERO REDISEÑADA */}
      <Box
        component="section"
        sx={{
          width: '100%',
          py: { xs: 3, md: 4 },
          px: { xs: 1.5, md: 4 },
          mt: '44px', // compensar overlap 50/50 AppBar
          }}
      >
        <Container maxWidth="xl" disableGutters>
          <Box
            sx={{
              position: 'relative',
              overflow: 'hidden',
              borderRadius: '18px',
              px: { xs: 2, md: 7 },
              py: { xs: 3, md: 4 },
              background: 'linear-gradient(135deg, #ffffff 0%, #fbf6ff 45%, #f6ebff 100%)',
              boxShadow: '0 14px 40px rgba(36, 20, 49, 0.08)',
            }}
          >
            <Typography
              component="h2"
              sx={{
                textAlign: 'center',
                fontWeight: 900,
                fontSize: { xs: '1.8rem', sm: '2.3rem', md: '2.85rem' },
                lineHeight: 1.05,
                letterSpacing: '-1px',
                color: '#202632',
                textTransform: 'uppercase',
              }}
            >
              Servicios{' '}
              <Box component="span" sx={{ color: '#7B1FA2' }}>
                Integrales
              </Box>{' '}
              de Diagnóstico
            </Typography>

            <Box
              sx={{
                width: '92px',
                height: '5px',
                borderRadius: '999px',
                background: '#7B1FA2',
                mx: 'auto',
                mt: 1,
                mb: 1.5,
              }}
            />

            <Typography
              sx={{
                textAlign: 'center',
                color: '#4B5563',
                fontSize: { xs: '0.9rem', md: '1.05rem' },
                fontWeight: 500,
                mb: { xs: 3, md: 4 },
              }}
            >
              Tecnología avanzada y expertos a tu servicio para el cuidado completo de tu vehículo.
            </Typography>

            <Grid container spacing={{ xs: 3, md: 4 }}>
              {services.map((item, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: '82px 1fr',
                      alignItems: 'center',
                      columnGap: 2,
                      minHeight: '112px',
                      position: 'relative',
                      pr: { md: index % 3 !== 2 ? 3 : 0 },
                      '&::after': {
                        content: { xs: 'none', md: index % 3 !== 2 ? '""' : 'none' },
                        position: 'absolute',
                        right: 0,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '1px',
                        height: '70px',
                        background: 'rgba(36, 20, 49, 0.16)',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 78,
                        height: 78,
                        borderRadius: '50%',
                        background: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#7B1FA2',
                        boxShadow: '0 12px 25px rgba(36, 20, 49, 0.12), inset 0 0 0 1px rgba(123, 31, 162, 0.06)',
                        '& svg': {
                          fontSize: 42,
                          strokeWidth: 1.4,
                        },
                      }}
                    >
                      <item.Icon />
                    </Box>

                    <Box>
                      <Typography
                        sx={{
                          color: '#7B1FA2',
                          fontWeight: 900,
                          fontSize: { xs: '1.03rem', md: '1.12rem' },
                          lineHeight: 1.05,
                        }}
                      >
                        {item.title}
                      </Typography>

                      <Typography
                        sx={{
                          color: '#202632',
                          fontWeight: 900,
                          fontSize: { xs: '1.03rem', md: '1.12rem' },
                          lineHeight: 1.05,
                          mb: 0.7,
                        }}
                      >
                        {item.subtitle}
                      </Typography>

                      <Typography
                        sx={{
                          color: '#4B5563',
                          fontSize: { xs: '0.88rem', md: '0.96rem' },
                          lineHeight: 1.35,
                          maxWidth: '290px',
                        }}
                      >
                        {item.text}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: { xs: 1.5, md: 3 },
                mt: { xs: 3, md: 3.5 },
                flexWrap: 'wrap',
              }}
            >
              <Button
                href="/agendar"
                variant="contained"
                startIcon={<CalendarMonth />}
                sx={{
                  width: { xs: '100%', sm: 280 },
                  height: 46,
                  borderRadius: '999px',
                  textTransform: 'none',
                  fontWeight: 800,
                  fontSize: '1rem',
                  color: '#ffffff',
                  background: 'linear-gradient(90deg, #7B1FA2, #8E24AA)',
                  boxShadow: '0 10px 22px rgba(123, 31, 162, 0.25)',
                  '&:hover': {
                    background: 'linear-gradient(90deg, #6A1B9A, #7B1FA2)',
                  },
                }}
              >
                Agendar Ahora
              </Button>

              <Button
                onClick={() => setOpenCotizacion(true)}
                variant="contained"
                startIcon={<Description />}
                sx={{
                  width: { xs: '100%', sm: 280 },
                  height: 46,
                  borderRadius: '999px',
                  textTransform: 'none',
                  fontWeight: 800,
                  fontSize: '1rem',
                  color: '#ffffff',
                  background: 'linear-gradient(90deg, #FFA726, #FF9800)',
                  boxShadow: '0 10px 22px rgba(255, 152, 0, 0.25)',
                  '&:hover': {
                    background: 'linear-gradient(90deg, #FB8C00, #F57C00)',
                  },
                }}
              >
                Cotización
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
   

      {/* Componente About */}
      <div id="about">
      <About />
      </div>

      {/* Componente Cómo Funciona */}
      <ComoFunciona />

  {/* Checklist Section */}
  <ChecklistSection />

{/* Sección de Servicios Procedimiento sensores TPMS */}
<Container id="nuestro-servicio" sx={{ mt: 5, mb: 5 }}>
  <ServiceCards />
  </Container>

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

    {/*PortadaTrabajos - Muestra de trabajos realizados*/}
    <PortadaTrabajos />

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
