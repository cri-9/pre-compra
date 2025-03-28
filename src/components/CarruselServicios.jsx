import React from "react";
import Slider from "react-slick";
import { Box, Typography } from "@mui/material";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Importa imágenes (ajusta la ruta según tu estructura)
import servicio1 from "../assets/servicio1.png";
import servicio2 from "../assets/servicio2.png";
import servicio3 from "../assets/servicio3.png";

const CarruselServicios = () => {
  const settings = {
    dots: true, // Muestra indicadores de navegación
    infinite: true, // Se repite en bucle
    speed: 500, // Velocidad de transición
    slidesToShow: 1, // Una imagen a la vez
    slidesToScroll: 1, // Se mueve de a una imagen
    autoplay: true, // Activar auto deslizamiento
    autoplaySpeed: 5000, // 5 segundos por imagen
  };

  const servicios = [
    { imagen: servicio1, titulo: "Inspección Básica", precio: "$30.000" },
    { imagen: servicio2, titulo: "Inspección Completa", precio: "$45.000" },
    { imagen: servicio3, titulo: "Inspección Premium", precio: "$60.000" },
  ];

  return (
    <Box sx={{ width: "80%", margin: "0 auto", mt: 5, textAlign: "center" }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
        Nuestros Servicios
      </Typography>
      <Typography variant="h6" sx={{ color: "#555", mb: 4 }}>
        Conoce los valores de nuestros servicios de pre-compra
      </Typography>
      <Slider {...settings}>
        {servicios.map((servicio, index) => (
          <Box key={index} sx={{ textAlign: "center" }}>
            <img
              src={servicio.imagen}
              alt={servicio.titulo}
              style={{
                width: "100%",
                maxHeight: "300px",
                objectFit: "cover",
                borderRadius: "10px",
              }}
            />
            <Typography variant="h5" sx={{ fontWeight: "bold", mt: 2 }}>
              {servicio.titulo}
            </Typography>
            <Typography variant="h6" sx={{ color: "#1976d2", mt: 1 }}>
              {servicio.precio}
            </Typography>
          </Box>
        ))}
      </Slider>
    </Box>
  );
};

export default CarruselServicios;
