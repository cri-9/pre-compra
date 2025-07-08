import React from "react";
import { Box, Typography, Card, CardContent, Avatar } from "@mui/material";
import { Grid } from "@mui/material";
import { Star } from "@mui/icons-material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Importador de imágenes
import persona1 from "../assets/Testimonios/persona1.webp";
import persona2 from "../assets/Testimonios/persona2.webp";
import persona3 from "../assets/Testimonios/persona3.webp";

// Datos de testimonios
const testimonios = [
  {
    nombre: "Juan Pérez",
    comentario: "El servicio fue excelente, muy recomendado.",
    foto: persona1,
  },
  {
    nombre: "María López",
    comentario: "Muy profesional y confiable, volveré a usarlo.",
    foto: persona2,
  },
  {
    nombre: "Carlos Gómez",
    comentario: "Rápido y eficiente, 100% recomendado.",
    foto: persona3,
  },
];

function TestimoniosSection() {
  return (
    <Box sx={{ mt: 5, px: 2, textAlign: "center" }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Testimonios de Clientes
      </Typography>
      <Box sx={{ maxWidth: "80%", margin: "0 auto" }}>
      <Grid container spacing={4} justifyContent="center">
        {testimonios.map((testimonio, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ p: 3, textAlign: "center", borderRadius: 3, boxShadow: 4 }}>
              <Avatar
                src={testimonio.foto}
                alt={testimonio.nombre}
                sx={{ width: 80, height: 80, margin: "0 auto", mb: 2 }}
              />
              <Box display="flex" justifyContent="center" mb={1}>
                {[1, 2, 3].map((_, i) => (
                  <Star key={i} sx={{ color: "#FFD700" }} />
                ))}
              </Box>
              <Typography variant="body1" color="text.secondary">
                "{testimonio.comentario}"
              </Typography>
              <Typography variant="subtitle2" mt={2} fontWeight="bold">
                - {testimonio.nombre}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
      </Box>
    </Box>
  );
};

export default TestimoniosSection;
