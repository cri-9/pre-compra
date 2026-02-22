import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MenuIcon from '@mui/icons-material/Menu';
import {
  AppBar,
  Box,
  Button,
  Collapse,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  Link as MuiLink,
  Stack,
  Toolbar,
  useTheme
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import fondoMenuHamburguesa from "../assets/fondo_menu_hambur/img_fondo_hambur.webp";
import iconDpf from "../assets/img_prin_dpf/ico_dpf_nabv.png";
import logo from "../assets/Logo_Superior/logo_superior_menu2.webp";
import iconTpms from "../assets/servicios/icon_tpms_menu.png";
import Cotizacion from "./Cotizacion";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [anchorElServicios, setAnchorElServicios] = useState(null);
  const [openServicios, setOpenServicios] = useState(false);
  const serviciosRef = useRef(null);
  const [openServiciosMobile, setOpenServiciosMobile] = useState(false);
  const [openCotizacion, setOpenCotizacion] = useState(false);
  const theme = useTheme();
  const numeroTelefono = "56949685530";

  const handleServiciosClick = (event) => {
    setAnchorElServicios(event.currentTarget);
    setOpenServicios((prev) => !prev);
  };

  const handleServiciosClose = () => {
    setAnchorElServicios(null);
    setOpenServicios(false);
  };

  const handleServiciosMobileToggle = () => {
    setOpenServiciosMobile(!openServiciosMobile);
  };

  const handleDrawerToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navLinks = [
    { name: 'Inicio', href: '/' },
    { name: 'Quienes Somos', href: '/#about' },
    { name: 'Nuestro Servicio', href: '/#nuestro-servicio' },
  ];
  
  const navLinksAfter = [
    { name: 'Nuestras Herramientas', href: '/#nuestras-herramientas' },
    { name: 'Valores', href: '/#valor-servicios' },
  ];

  const servicios = [
    { name: 'Servicio TPMS', href: '/tpms', icon: iconTpms },
    { name: 'Regeneración DPF', href: '/dpf', icon: iconDpf },
  ];

  const isServiciosOpen = openServicios;

  const linkStyles = {
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
      color: '#D49CEC'
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
  };

  const Navigation = () => (
    <>
      <Stack direction="row" spacing={3} sx={{ mr: 6, ml: 2 }}>
        {navLinks.map((link) => (
          <MuiLink
            key={link.name}
            href={link.href}
            underline="none"
            sx={linkStyles}
          >
            {link.name}
          </MuiLink>
        ))}

        <Box ref={serviciosRef} sx={{ position: 'relative', display: 'inline-flex', alignItems: 'center', zIndex: 100 }} className="servicios-container">
          <Button
            id="servicios-button"
            disableRipple
            disableElevation
            onClick={handleServiciosClick}
            aria-controls={isServiciosOpen ? 'servicios-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={isServiciosOpen ? 'true' : undefined}
            endIcon={
              <ExpandMoreIcon
                sx={{
                  fontSize: '1.1rem',
                  transition: 'transform 0.3s ease',
                  transform: isServiciosOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                }}
              />
            }
            sx={{
              ...linkStyles,
              px: 0,
              minWidth: 0,
              lineHeight: 1.4,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.5,
              '&:hover': {
                ...linkStyles['&:hover'],
                backgroundColor: 'transparent'
              },
              '&::after': {
                ...linkStyles['&::after'],
                width: '100%',
                left: 0,
                transform: isServiciosOpen ? 'scaleX(1)' : 'scaleX(0)'
              },
            }}
          >
            Servicios
          </Button>

          {/* Dropdown personalizado de Servicios */}
          <Box
            role="menu"
            aria-labelledby="servicios-button"
            sx={{
              position: 'absolute',
              top: 'calc(100% + 6px)',
              left: '50%',
              transform: isServiciosOpen ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(-8px)',
              opacity: isServiciosOpen ? 1 : 0,
              pointerEvents: isServiciosOpen ? 'auto' : 'none',
              transition: 'opacity 180ms ease, transform 180ms ease',
              backgroundColor: '#f9f6fc',
              boxShadow: '0 12px 30px rgba(0, 0, 0, 0.18)',
              borderRadius: '12px',
              border: '1px solid rgba(123, 31, 162, 0.12)',
              minWidth: 360,
              zIndex: (theme) => theme.zIndex.appBar + 200,
              py: 1,
              px: 1,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'stretch'
            }}
          >
            {servicios.map((servicio, idx) => (
              <Box
                key={servicio.name}
                component={Link}
                to={servicio.href}
                onClick={handleServiciosClose}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  py: 2,
                  px: 3,
                  gap: 1,
                  textDecoration: 'none',
                  backgroundColor: 'transparent',
                  flex: 1,
                  borderRight: idx === servicios.length - 1 ? 'none' : '1px solid rgba(123, 31, 162, 0.12)',
                  '&:hover': {
                    backgroundColor: '#EDE7F6',
                  }
                }}
              >
                {servicio.icon && (
                  <img
                    src={servicio.icon}
                    alt={servicio.name}
                    style={{
                      width: '50px',
                      height: '50px',
                      objectFit: 'contain'
                    }}
                  />
                )}
                <span
                  style={{
                    color: '#7B1FA2',
                    fontWeight: 500,
                    fontSize: '0.9rem',
                    textAlign: 'center'
                  }}
                >
                  {servicio.name}
                </span>
              </Box>
            ))}
          </Box>
        </Box>

        {navLinksAfter.map((link) => (
          <MuiLink
            key={link.name}
            href={link.href}
            underline="none"
            sx={linkStyles}
          >
            {link.name}
          </MuiLink>
        ))}
      </Stack>
    </>
  );

  // Cerrar al hacer click fuera del dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!serviciosRef.current) return;
      if (!serviciosRef.current.contains(e.target)) {
        setOpenServicios(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
    <AppBar position="sticky"
      sx={{
        backgroundColor: "#f9f6fc",
        backdropFilter: 'blur(10px)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.30)',
        borderRadius: '15px',
        mx: 'auto',
        my: -6,
        top: 0,
        maxWidth: { xs: '95%', sm: '95%', md: '85%', lg: '95%' },
        zIndex: (theme) => theme.zIndex.appBar + 50,
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
            minWidth: 0,
          }}
        >
          <Link to="/">
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
          </Link>
        </Box>

        {/* Navegación para escritorio */}
        <Box sx={{ display: { xs: 'none', lg: 'flex' }, alignItems: 'center' }}>
          <Navigation />
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => setOpenCotizacion(true)}
            sx={{
              fontSize: "0.9rem",
              px: 3,
              py: 1,
              ml: 1,
              textTransform: 'none',
              borderRadius: '8px',
              whiteSpace: 'nowrap',
            }}
          >
            Cotización
          </Button>
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

        {/* Botón de menú móvil */}
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
              mr: { xs: 1, sm: 2, md: 3 },
            }}
          >
            {isMenuOpen ? <CloseIcon sx={{ fontSize: '1.3rem' }} /> : <MenuIcon sx={{ fontSize: '1.3rem' }} />}
          </IconButton>
        </Box>

        {/* Drawer móvil */}
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
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${fondoMenuHamburguesa})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            },
          }}
        >
          <Box
            onClick={(e) => {
              // No cerrar el drawer si se hace click en el botón de Servicios
              if (e.target.closest('.servicios-toggle')) {
                return;
              }
              handleDrawerToggle();
            }}
            sx={{
              textAlign: 'center',
              minHeight: '100vh',
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
              px: 2,
              py: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%'
            }}>
              {navLinks.map((link) => (
                <ListItem key={link.name} disablePadding sx={{ mb: 1, width: '100%', px: 0, justifyContent: 'center', display: 'flex' }}>
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
                    }}
                  >
                    {link.name}
                  </MuiLink>
                </ListItem>
              ))}

              {/* Servicios en móvil con collapse */}
              <ListItem disablePadding sx={{ mb: 1, width: '100%', display: 'flex', flexDirection: 'column' }}>
                <ListItemButton
                  className="servicios-toggle"
                  onClick={handleServiciosMobileToggle}
                  sx={{
                    textAlign: 'center',
                    width: '100%',
                    color: '#7B1FA2',
                    fontWeight: 500,
                    justifyContent: 'center'
                  }}
                >
                  <ListItemText primary="Servicios" />
                  <ExpandMoreIcon
                    sx={{
                      transform: openServiciosMobile ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s'
                    }}
                  />
                </ListItemButton>
                <Collapse in={openServiciosMobile} timeout="auto" unmountOnExit sx={{ width: '100%' }}>
                  <List component="div" disablePadding>
                    {servicios.map((servicio) => (
                      <ListItem key={servicio.name} disablePadding sx={{ pl: 4 }}>
                        <ListItemButton
                          component={Link}
                          to={servicio.href}
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            py: 1,
                          }}
                        >
                          {servicio.icon && (
                            <img
                              src={servicio.icon}
                              alt={servicio.name}
                              style={{
                                width: '40px',
                                height: '40px',
                                marginBottom: '4px',
                                objectFit: 'contain'
                              }}
                            />
                          )}
                          <ListItemText
                            primary={servicio.name}
                            sx={{
                              '& .MuiTypography-root': {
                                fontSize: '0.85rem',
                                color: '#D49CEC !important'
                              }
                            }}
                          />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              </ListItem>

              {/* Links después de Servicios en móvil */}
              {navLinksAfter.map((link) => (
                <ListItem key={link.name} disablePadding sx={{ mb: 1, width: '100%' }}>
                  <MuiLink
                    href={link.href}
                    underline="none"
                    sx={{
                      display: 'block',
                      textAlign: 'center',
                      width: '100%',
                      py: 1.5,
                      color: '#7B1FA2',
                      fontWeight: 500,
                      fontSize: '0.9rem',
                      '&:hover': {
                        color: '#D49CEC',
                      }
                    }}
                  >
                    {link.name}
                  </MuiLink>
                </ListItem>
              ))}

              <ListItem disablePadding sx={{ mt: 3, px: 0 }}>
                <ListItemButton
                  onClick={() => {
                    setOpenCotizacion(true);
                    handleDrawerToggle();
                  }}
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
                    primary="Cotización"
                    sx={{
                      '& .MuiTypography-root': {
                        fontSize: "0.9rem",
                        fontWeight: 'bold',
                      }
                    }}
                  />
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding sx={{ mt: 2, mb: 2, justifyContent: 'center', display: 'flex' }}>
                <Button
                  component="a"
                  href={`https://wa.me/${numeroTelefono}`}
                  target="_blank"
                  rel="noopener"
                  sx={{
                    width: "100%",
                    height: "36px",
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
    <Cotizacion open={openCotizacion} handleClose={() => setOpenCotizacion(false)} />
    </>
  );
}

export default Navbar;
