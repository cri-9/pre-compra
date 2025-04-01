import React from "react";
import { Box, Typography, Card, CardContent, Avatar } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Importador de imágenes
import persona1 from "../assets/persona1.jpg";
import persona2 from "../assets/persona2.jpg";
import persona3 from "../assets/persona3.jpg";

// Datos de testimonios
const testimonios = [
  {
    nombre: "Juan Pérez",
    comentario: "El servicio fue excelente, muy recomendado.",
    imagen: persona1,
  },
  {
    nombre: "María López",
    comentario: "Muy profesional y confiable, volveré a usarlo.",
    imagen: persona2,
  },
  {
    nombre: "Carlos Gómez",
    comentario: "Rápido y eficiente, muy satisfecho con la experiencia.",
    imagen: persona3,
  },
];

function TestimoniosSection() {
  return (
    <Box sx={{ maxWidth: 800, margin: "auto", padding: 4 }}>
      <Typography variant="h4" textAlign="center" gutterBottom>
        Testimonios de Clientes
      </Typography>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        loop={true}
        pagination={{ clickable: true }}
        navigation={true}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
      >
        {testimonios.map((testimonio, index) => (
          <SwiperSlide key={index}>
            <Card sx={{ padding: 3, textAlign: "center", boxShadow: 3 }}>
              <Avatar
                src={testimonio.imagen}
                sx={{ width: 80, height: 80, margin: "auto", mb: 2 }}
              />
              <CardContent>
                <Typography variant="body1">{testimonio.comentario}</Typography>
                <Typography variant="subtitle2" fontWeight="bold" mt={1}>
                  - {testimonio.nombre}
                </Typography>
              </CardContent>
            </Card>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
}

export default TestimoniosSection;
