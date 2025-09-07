import { useState } from "react";
import { useLocation } from "react-router-dom";
import '../Csspersonalizado/landingpage.css'; // CSS personalizado

// Importaciones de Material-UI
import { Link as MuiLink, useTheme } from "@mui/material";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
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

// Iconos
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';

// Importaciones para el Grid con calendario
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";

// React Router
import { Link } from "react-router-dom";

// Importar logo
import logo from "../assets/Logo_Superior/logo_superior_menu2.webp";

// Item estilizado para el Grid
const Item = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

// DOCUMENTACIÓN: Componente Navigation para el menú principal
// Maneja tanto navegación desktop como móvil con drawer
const Navigation = ({ isMobile }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const theme = useTheme();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Opciones del menú principal
  const menuItems = [
    { text: "Inicio", path: "/" },
    { text: "Servicios", path: "/#servicios" },
    { text: "Precios", path: "/#precios" },
    { text: "Blog", path: "/blog" },
    { text: "Contacto", path: "/#contacto" },
  ];

  // Función para determinar si un enlace está activo
  const isActiveLink = (path) => {
    if (path === "/blog") {
      return location.pathname === "/blog";
    }
    return false;
  };

  // Contenido del drawer móvil
  const drawer = (
    <div>
      <Box sx={{ display: "flex", alignItems: "center", p: 2 }}>
        <IconButton onClick={handleDrawerToggle}>
          <CloseIcon />
        </IconButton>
      </Box>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={item.path.startsWith("/#") ? "a" : Link}
              to={item.path.startsWith("/#") ? undefined : item.path}
              href={item.path.startsWith("/#") ? item.path : undefined}
              onClick={handleDrawerToggle}
              sx={{
                backgroundColor: isActiveLink(item.path) ? "#f0f0f0" : "transparent",
              }}
            >
              <ListItemText 
                primary={item.text}
                sx={{
                  "& .MuiTypography-root": {
                    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
                    fontWeight: 500,
                  }
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <>
      <AppBar 
        position="fixed" 
        sx={{ 
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
          zIndex: 1100
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ minHeight: "70px !important" }}>
            {/* Logo */}
            <Box sx={{ display: "flex", alignItems: "center", mr: 4 }}>
              <img
                src={logo}
                alt="Logo"
                style={{
                  height: "45px",
                  width: "auto",
                  objectFit: "contain",
                }}
              />
            </Box>

            {/* Enlaces de navegación para desktop */}
            {!isMobile && (
              <Stack 
                direction="row" 
                spacing={3} 
                sx={{ 
                  flexGrow: 1, 
                  justifyContent: "center",
                  alignItems: "center" 
                }}
              >
                {menuItems.map((item) => (
                  <MuiLink
                    key={item.text}
                    component={item.path.startsWith("/#") ? "a" : Link}
                    to={item.path.startsWith("/#") ? undefined : item.path}
                    href={item.path.startsWith("/#") ? item.path : undefined}
                    underline="none"
                    sx={{
                      color: isActiveLink(item.path) ? "#1976d2" : "#333",
                      fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
                      fontSize: "16px",
                      fontWeight: isActiveLink(item.path) ? 600 : 500,
                      textTransform: "none",
                      transition: "all 0.3s ease",
                      position: "relative",
                      padding: "8px 16px",
                      borderRadius: "4px",
                      "&:hover": {
                        color: "#1976d2",
                        backgroundColor: "rgba(25, 118, 210, 0.04)",
                      },
                    }}
                  >
                    {item.text}
                  </MuiLink>
                ))}
              </Stack>
            )}

            {/* Botón menú móvil */}
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ color: "#333" }}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* Drawer para móvil */}
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Mejor performance en móvil
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: 250,
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

// Componente principal del Blog
function Blog() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [value, setValue] = useState(new Date());

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      {/* Navegación */}
      <Navigation isMobile={isMobile} />

      {/* Espaciado para el AppBar fijo */}
      <Box sx={{ height: "70px" }} />

      {/* Layout con Grid y Calendario */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography 
          variant="h2" 
          component="h1" 
          gutterBottom
          sx={{ 
            fontWeight: 700, 
            color: "#333",
            textAlign: "center",
            mb: 4
          }}
        >
          Layout con Calendario
        </Typography>
        
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Grid container spacing={3}>
            {/* Primera fila */}
            <Grid item xs={8}>
              <Item>size=8</Item>
            </Grid>
            <Grid item xs={4}>
              <Item>size=4</Item>
            </Grid>

            {/* Segunda fila */}
            <Grid item xs={4}>
              <Item>size=4</Item>
            </Grid>
            <Grid item xs={8}>
              <Item>size=8</Item>
            </Grid>

            {/* Tercera fila completa */}
            <Grid item xs={12}>
              <Item>size=12</Item>
            </Grid>

            {/* Cuarta fila */}
            <Grid item xs={6}>
              <Item>size=6</Item>
            </Grid>
            <Grid item xs={6}>
              <Item>size=6</Item>
            </Grid>

            {/* Quinta fila con calendario */}
            <Grid item xs={8}>
              <Item>size=8</Item>
            </Grid>
            <Grid item xs={4}>
              <StaticDatePicker
                displayStaticWrapperAs="desktop"
                value={value}
                onChange={(newValue) => setValue(newValue)}
                renderInput={(params) => <TextField {...params} />}
              />
            </Grid>
          </Grid>
        </LocalizationProvider>
      </Container>
    </Box>
  );
}

export default Blog;
