import React from "react";
import { Box, Grid, Typography } from "@mui/material";

// Importador de imágenes
import escaner from '../assets/Nuestras_Herramientas/escaner1.webp';
import estetos from '../assets/Nuestras_Herramientas/estetos1.webp';
import aceite from '../assets/Nuestras_Herramientas/aceite1.webp';
import multimetro1 from '../assets/Nuestras_Herramientas/multimetro1.webp';
import medidoneumaticos from '../assets/Nuestras_Herramientas/medidor_neumatico.webp';
import pintura from '../assets/Nuestras_Herramientas/medidor_pintura.webp';
import informelegal from '../assets/nuestras_Herramientas/informelegal.webp';



function HerramientasSection() {
  const herramientas = [
    { titulo: 'Escáner', descripcion: 'Lee las fallas electrónicas del vehículo.', imagen: escaner },
    { titulo: 'Estetoscopio', descripcion: 'Detecta ruidos internos en el motor.', imagen: estetos },    
    { titulo: 'Medidor Liquido Frenos', descripcion: 'Verifica la calidad del aceite de los frenos.', imagen: aceite },
    { titulo: 'Medidor Bateria', descripcion: 'Verifica la calidad de la batería.', imagen: multimetro1 },
    { titulo: 'Medidor de neumáticos', descripcion: 'Mide la profundidad de los surcos.', imagen: medidoneumaticos },            
    { titulo: 'Medidor de pintura', descripcion: 'Mide la profundidad', imagen: pintura },
    { titulo: 'Informe Legal', descripcion: 'Se entrega informe legal del automovil en cuestión. dependiendo del servicio que contrate', imagen: informelegal },
    
  ];

  return (
    <Box sx={{ padding: '20px', backgroundColor: '#f0f0f0' }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom textAlign="center">
        Nuestras herramientas
      </Typography>
      <Typography variant="body1" gutterBottom textAlign="center">
        Nos preocupamos de siempre contar con herramientas de última generación.
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        {herramientas.map((herramienta, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <Box 
              sx={{ 
                backgroundColor: 'white', 
                padding: '20px', 
                borderRadius: '10px', 
                boxShadow: 3, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                textAlign: 'center',
                height: '320px' // Asegura que todas las cards tengan el mismo alto
              }}
            >
              <img
                src={herramienta.imagen}
                alt={herramienta.titulo}
                style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px' }}
              />
              <Typography variant="h6" gutterBottom mt={2}>
                {herramienta.titulo}
              </Typography>
              <Typography variant="body2">{herramienta.descripcion}</Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default HerramientasSection;
