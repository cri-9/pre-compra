import React from "react";
import { Box, Container, Grid, Typography, Avatar } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const pasos = [
  {
    step: "01",
    title: "Agenda tu Cita",
    description: "Selecciona fecha, hora y ubicación. Nos adaptamos a tu horario.",
    icon: <AccessTimeIcon fontSize="large" color="secondary" />,
  },
  {
    step: "02",
    title: "Inspección Completa",
    description: "Nuestro técnico certificado revisa 200+ puntos en 2-3 horas.",
    icon: <DirectionsCarIcon fontSize="large" color="secondary" />,
  },
  {
    step: "03",
    title: "Recibe tu Reporte",
    description: "Reporte digital detallado con fotos y recomendaciones en 24h.",
    icon: <CheckCircleIcon fontSize="large" color="secondary" />,
  },
];

const ProcesoSection = () => {
  return (
    <Box id="proceso" sx={{ py: 10, bgcolor: "#f9fafb" }}>
      <Container maxWidth="lg">
        <Box textAlign="center" mb={8}>
          <Typography variant="h4" component="h2" fontWeight="bold" gutterBottom>
            Proceso Simple y Rápido
          </Typography>
          <Typography variant="h6" color="text.secondary">
            En solo 3 pasos obtienes un reporte completo de tu vehículo
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {pasos.map((step, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Box textAlign="center">
                <Avatar
                  sx={{
                    width: 64,
                    height: 64,
                    bgcolor: "primary.main",
                    color: "white",
                    fontSize: 24,
                    fontWeight: "bold",
                    mx: "auto",
                    mb: 2,
                  }}
                >
                  {step.step}
                </Avatar>
                <Box mb={2}>{step.icon}</Box>
                <Typography variant="h6" component="h3" fontWeight="medium" gutterBottom>
                  {step.title}
                </Typography>
                <Typography color="text.secondary">{step.description}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default ProcesoSection;
