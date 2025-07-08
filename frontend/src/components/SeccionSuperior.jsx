import React from "react";
import {
  Box,
  Grid,
  Typography,
  Button,
  Container,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import logo_sect from "../assets/img_secction1.jpg"; // Asegúrate de tener esta imagen o ajusta la ruta

const SeccionSuperior = ({ setOpenCotizacion }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Container sx={{ mt: 12 }}>
      <Grid
        container
        spacing={4}
        alignItems="center"
        justifyContent="center"
        direction={isMobile ? "column-reverse" : "row"}
      >
        {/* Texto y botones */}
        <Grid item xs={12} md={6}>
          <Box sx={{ textAlign: isMobile ? "center" : "left" }}>
            <Typography variant="h3" sx={{ fontWeight: "bold", mb: 2 }}>
              Agenda con Nosotros
            </Typography>
            <Typography variant="h6" sx={{ color: "#555", mb: 4 }}>
              ¡Haz tu agendamiento rápido y fácil con nuestro formulario!
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                alignItems: isMobile ? "center" : "flex-start",
              }}
            >
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => setOpenCotizacion(true)}
                sx={{
                  fontSize: "1.2rem",
                  px: 4,
                  py: 1.5,
                  width: isMobile ? "100%" : "450px",
                }}
              >
                Cotización
              </Button>

              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#6a6191",
                  "&:hover": { backgroundColor: "#7B1FA2" },
                  fontSize: "1.2rem",
                  px: 4,
                  py: 1.5,
                  width: isMobile ? "100%" : "450px",
                }}
              >
                Agendar Ahora
              </Button>
            </Box>
          </Box>
        </Grid>

        {/* Imagen */}
        <Grid item xs={12} md={6}>
          <Box sx={{ textAlign: "center" }}>
            <img
              src={logo_sect}
              alt="Auto"
              style={{
                width: "100%",
                maxWidth: "500px",
                height: "auto",
                borderRadius: "40px",
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SeccionSuperior;
