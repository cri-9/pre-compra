import { FC, useState, useEffect } from "react";
import '../Csspersonalizado/landingpage.css';
import { AppBar, Toolbar, Typography, Button, Box, Container, SxProps, Theme } from "@mui/material";
import { Link } from "react-router-dom";
import { useWindowSize } from '@react-hook/window-size';
import Confetti from 'react-confetti';

// Components
import PrecioServicio from "./PrecioServicio";
import Cotizacion from "./Cotizacion";
import ServiceCards from "./ServiceCards";
import HerramientasSection from './HerramientasSection';
import ValorServicio from './ValorServicio';
import TestimoniosSection from "./TestimoniosSection";
import Footer from "./Footer";
import BotonWhatsApp from "./BotonWhatsApp";

// Assets
import logo from "../assets/logo_visual1.2.png";
import logo_sect from "../assets/img_secction1.webp";

// Styles
const styles: Record<string, SxProps<Theme>> = {
  headerBox: {
    backgroundColor: "#7B1FA2",
    mx: "auto",
    maxWidth: "5xl",
    px: { xs: 2, sm: 6, lg: 8 },
    py: { xs: 1, sm: 3 },
    spacing: 2,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  appBar: {
    backgroundColor: "#fff",
    boxShadow: "none"
  },
  toolbar: {
    flexDirection: { xs: "column", sm: "row" },
    alignItems: { xs: "center", sm: "flex-start" },
    justifyContent: "space-between",
    py: { xs: 1, sm: 0 },
    px: { xs: 2, sm: 6 }
  },
  navButtons: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: { xs: "center", sm: "flex-end" },
    gap: { xs: 1, sm: 2 },
    mt: { xs: 1, sm: 0 },
    paddingTop: 2
  },
  agendarButton: {
    width: { xs: "100%", sm: "140px" },
    height: "50px",
    fontSize: "1rem",
    fontWeight: "bold",
    backgroundColor: "#6a6191",
    color: "#ffffff",
    ml: { sm: 4 },
    "&:hover": {
      backgroundColor: "#7B1FA2"
    }
  }
};

const logoStyle = {
  height: "auto",
  maxHeight: "100px",
  width: "auto",
  maxWidth: "100%",
  border: "1px solid",
  margin: "1px",
  imageRendering: "crisp-edges" as const
};

const headerTextStyle = {
  color: '#f8f9f9',
  fontWeight: "bold"
};

const LandingPage: FC = () => {
  const [openCotizacion, setOpenCotizacion] = useState<boolean>(false);
  const [width, height] = useWindowSize();

  const numeroTelefono = "56997541042";
  const mensajeInicial = "Visual Mecánica le da la Bienvenida;  Te podemos ayudar.";

  useEffect(() => {
    const links = document.querySelectorAll('nav a');

    const handleClick = (e: Event) => {
      e.preventDefault();
      const link = e.currentTarget as HTMLAnchorElement;
      const targetId = link.getAttribute('href')?.substring(1);
      if (targetId) {
        const targetElement = document.getElementById(targetId);
        targetElement?.scrollIntoView({ behavior: 'smooth' });
      }
    };

    links.forEach(link => {
      link.addEventListener('click', handleClick);
    });

    return () => {
      links.forEach(link => {
        link.removeEventListener('click', handleClick);
      });
    };
  }, []);

  return (
    <div>
      <Box sx={styles.headerBox}>
        <Typography align="center" style={headerTextStyle}>
          No te pierdas la oportunidad de conocer nuestros servicios
        </Typography>
      </Box>

      <AppBar position="static" sx={styles.appBar}>
        <Toolbar sx={styles.toolbar}>
          <Typography variant="h6" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: { xs: "center", sm: "flex-start" }, paddingBottom: { xs: 1, sm: "15px" } }}>
            <img src={logo} alt="Logo" style={logoStyle} />
          </Typography>

          <Box sx={styles.navButtons}>
            <Button sx={{ color: "#7C70A1" }} component={Link} to="/">Inicio</Button>
            <Button sx={{ color: "#7C70A1" }} href="#nuestro-servicio">Nuestro Servicio</Button>
            <Button sx={{ color: "#7C70A1" }} href="#nuestras-herramientas">Nuestras Herramientas</Button>
            <Button sx={{ color: "#7C70A1" }} href="#valor-servicios">Valores</Button>
            <Button component={Link} to="/agendar" sx={styles.agendarButton}>
              Agendar
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Container sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: "center",
        mt: 4,
        gap: 6
      }}>
        <Box sx={{ display: "flex", textAlign: "center" }}>
          <img
            src={logo_sect}
            alt="Auto"
            style={{
              width: "100%",
              maxWidth: "500px",
              height: "auto",
              borderRadius: "40px"
            }}
          />
        </Box>

        <Box sx={{
          textAlign: "center",
          flex: 1,
          mt: { xs: 4, md: 0 }
        }}>
          <Typography variant="h3" sx={{ fontWeight: "bold", mb: 2 }}>
            Agenda con Nosotros
          </Typography>

          <Typography variant="h6" sx={{ color: "#555", mb: 4 }}>
            ¡Haz tu agendamiento o cotización fácil con nuestros formularios!
          </Typography>

          <Box sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: 2,
            maxWidth: "450px",
            margin: "0 auto"
          }}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => setOpenCotizacion(true)}
              sx={{
                fontSize: "1.5rem",
                px: 5,
                py: 1
              }}
            >
              Cotización
            </Button>

            <Button
              variant="contained"
              component={Link}
              to="/agendar"
              sx={{
                backgroundColor: "#6a6191",
                "&:hover": { backgroundColor: "#7B1FA2" },
                fontSize: "1.5rem",
                px: 5,
                py: 2
              }}
            >
              Agendar Ahora
            </Button>
          </Box>
        </Box>
      </Container>

      <PrecioServicio />

      <Container id="nuestro-servicio" sx={{ textAlign: "center", mt: 5 }}>
        <Typography variant="h4" fontWeight="bold" mb={3}>
          Nuestros Servicios
        </Typography>
        <ServiceCards />
      </Container>

      <Container id="nuestras-herramientas" sx={{ textAlign: "center", mt: 5 }}>
        <HerramientasSection />
      </Container>

      <div id="valor-servicios">
        <ValorServicio />
      </div>

      <TestimoniosSection />
      
      <Confetti width={width} height={height} run={false} />

      <Cotizacion open={openCotizacion} handleClose={() => setOpenCotizacion(false)} />
      
      <BotonWhatsApp
        numeroTelefono={numeroTelefono}
        mensajeInicial={mensajeInicial}
      />

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">Contáctanos por WhatsApp:</Typography>
        <BotonWhatsApp
          numeroTelefono={numeroTelefono}
          mensajeInicial={mensajeInicial}
        />
      </Box>

      <Footer />
    </div>
  );
};

export default LandingPage;
