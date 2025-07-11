import { Box, Typography, Grid, Paper } from "@mui/material";
import { CheckCircleOutline } from "@mui/icons-material";
import { motion } from "framer-motion";

const items = [
  "Exterior",
  "Interior",
  "Motor",
  "Imágenes",
  "Kilometraje",
  "Informe",
  "Prueba de ruta",
  "Detalle Pintura",
  "Confianza",
  "Historial del Vehiculo",
  "Recomendaciones",  
];

const ChecklistSection = () => {
    // Define los colores que quieres alternar
  const color1 = "  #ffb74d  "; // Azul claro (ejemplo)
  const color2 = "  #1565C0  "; // Naranja claro (ejemplo)

  return (
    <Box sx={{ mt: 8, px: 6, py: 2, pt: 2, pb: 8}}>
      <Typography variant="h5" fontWeight="bold" textAlign="center" 
      gutterBottom mb={6} //Añade un margen inferior de 48px (6 * 8px)
      >
        ¿Qué incluye nuestra inspección pre-compra?
      </Typography>

      {/* checklist animado */}
      <Grid container spacing={3} justifyContent="center">
        {items.map((item, index) => {
          // Lógica para alternar el color cada 3 ítems
          const itemColor = (Math.floor(index / 3) % 2 === 0) ? color1 : color2;

            //Animacion de los items
          return (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Paper
                  elevation={3}
                  sx={{
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    borderRadius: 2,
                    backgroundColor: itemColor // color calculado
                  }}
                >
                    {/* icono de check */}
                  <CheckCircleOutline sx={{ color: "#7B1FA2" }} />
                  <Typography fontWeight="medium" sx={{ color: '#FFFFFF' }}>{item}</Typography>
                </Paper>
              </motion.div>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default ChecklistSection;