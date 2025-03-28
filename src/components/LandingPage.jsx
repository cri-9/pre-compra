import React, { useState } from "react";
import { AppBar, Toolbar, Typography, Button, Box, Container } from "@mui/material";
import { Link } from "react-router-dom";
import logo from "../assets/img_header1.jpg";
import logo_sect from "../assets/img_secction1.jpg";
import PrecioServicio from "./PrecioServicio";
import Cotizacion from "../components/Cotizacion"; // Importar el nuevo componente

function LandingPage() {
  const [openCotizacion, setOpenCotizacion] = useState(false);

  return (
    <div>
      {/* Header */}
      <AppBar position="static" sx={{ backgroundColor: "#1976d2" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            <img src={logo} alt="Logo" style={{ height: "100px", border: "1px solid ", borderRadius: "10px", margin: "5px" }} />
          </Typography>
          <Button color="inherit" component={Link} to="/">Inicio</Button>
          <Button color="inherit" component={Link} to="/servicio">Servicio</Button>
          <Button color="inherit" component={Link} to="/testimonios">Testimonios</Button>
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
          <Typography variant="h6" sx={{ color: "#555" }}>
            ¡Haz tu agendamiento rápido y fácil con nuestro formulario!
          </Typography>

          {/* Botón Cotización */}
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => setOpenCotizacion(true)}
            sx={{ mt: 3, mb: 2, fontSize: "1.2rem", px: 4, py: 1.2 }}
          >
            Cotización
          </Button>

          {/* Botón Agendar */}
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/agendar"
            sx={{ fontSize: "1.5rem", px: 5, py: 1.5 }}
          >
            Agendar Ahora
          </Button>
        </Box>
      </Container>

      {/* Componente PrecioServicio */}
      <PrecioServicio />

      {/* Ventana emergente de Cotización */}
      <Cotizacion open={openCotizacion} handleClose={() => setOpenCotizacion(false)} />

      {/* Footer */}
      <Box sx={{ backgroundColor: "#1976d2", color: "#fff", textAlign: "center", py: 2, mt: 5 }}>
        <Typography variant="body2">© 2025 Pre-Compra. Todos los derechos reservados.</Typography>
      </Box>
    </div>
  );
}

export default LandingPage;

