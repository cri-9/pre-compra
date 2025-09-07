import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
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
    <Box
     sx={{
    py: { xs: 6, sm: 8 }, // Menos padding vertical en pantallas pequeñas
    bgcolor: "#F2F0F4",
    textAlign: "center",
    position: "relative", // Necesario para que el pseudo-elemento funcione
    // Crea una forma de onda en la parte inferior
    clipPath: 'polygon(0 0, 100% 10%, 100% 100%, 0% 100%)', // Ajusta estos valores para crear una onda
  }}
    >
      <Box sx={{ 
        maxWidth: 1400, 
        mx: 'auto', 
        px: { xs: 3, sm: 6 }, // Menos padding horizontal en pantallas pequeñas
        pt: { xs: 4, sm: 0 }, // Padding superior adicional para pantallas pequeñas
        position: 'relative', 
        zIndex: 2
      }}>
        <Typography
          variant="h4"
          fontWeight="bold"
          textAlign="center"
          gutterBottom
          color={"#1848B9"}
          sx={{
            fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.5rem" },
            mt: { xs: 2, sm: 0 }, // Margen superior para pantallas pequeñas
            mb: { xs: 2, sm: 3 }, // Menos separación debajo en pantallas pequeñas
            pt: { xs: 2, sm: 0 }  // Padding superior adicional para pantallas pequeñas
          }}
        >
        Detalles de la inspección pre-compra
        </Typography>
        <Typography variant="body1" textAlign="center" gutterBottom
          sx={{ color: "#757575", 
                fontSize: { xs: "1.3rem", sm: "1.5rem", md: "1.7rem" }, // Título secundario - Reducido
                fontWeight: 500,
                mb: 4 // Separación debajo del título
              }} 
              >
            Una inspección completa para tu tranquilidad y tu inversión en la compra de tu vehículo.
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
    </Box>
  );
};

export default ChecklistSection;