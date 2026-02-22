import { Home, Person, Search } from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography
} from '@mui/material';

// Neuvo estiloo css de las card


const options = [
  { 
    number: "01", 
    title: "Inspección Visual", 
    icon: <Search fontSize="large" />, 
    color: "#1976D2",
    description: "Realizamos una revisión externa y detallada del vehículo para identificar posibles daños en la carrocería, chasis, neumáticos, vidrios, focos y otros componentes visibles."
  },
  { 
    number: "02", 
    title: "Revisión con escaner", 
    icon: <Home fontSize="large" />, 
    color: "#ffb64d",
    description: " Este procedimiento nos permite acceder a la información de las diferentes unidades de control (ECU), detectar posibles fallas, códigos de error o anomalías ocultas y evaluar el estado real de los sistemas electrónicos."
  },
  { 
    number: "03", 
    title: "Mantenimiento TPMS", 
    icon: <Person fontSize="large" />, 
    color: "#9C27B0",
    description: "Realizamos un pre chequeo para saber el estado de cada uno, en el caso que no se tenga comunicación con no o más se procede al reemplazo del sensores TPMS para asegurar su correcto funcionamiento y la seguridad de tu vehículo, proceso 100% a domicilio."
  },
  { 
    number: "04", 
    title: "Mantenimiento DPF", 
    icon: <Person fontSize="large" />, 
    color: "#b02727ff",
    description: "Realizamos la regeneración electrónica del filtro de partículas diésel (DPF) utilizando equipos especializados que permiten eliminar las partículas acumuladas en el filtro sin necesidad de desmontarlo, restaurando su eficiencia y funcionalidad.  "
  }
];

const OptionCard = ({ number, title, icon, color, description }) => {
  return (
  <Card
  sx={{
    maxWidth: 300,
    p: 2,
    borderRadius: 10,
    position: "relative",
    overflow: "visible",
    background: "#F2F2F2", // ✅ background como string
    boxShadow: "15px 15px 30px #bebebe, -15px -15px 30px #ffffff" // ✅ múltiple sombra como string
    
  }}
>
      <Box
        sx={{
          backgroundColor: color,
          color: "white",
          padding: "8px 15px",
          borderRadius: "8px",
          position: "absolute",
          top: -20,
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: "0.9rem",
          fontWeight: "bold",
          textTransform: "uppercase",
        }}
      >
        
      </Box>
      <CardContent sx={{ textAlign: "center" }}>
        <Typography variant="h3" fontWeight="bold">{number}</Typography>
        <Typography variant="h6" fontWeight="bold" mt={1}>{title}</Typography>
        <Typography variant="body2" mt={1}>
          {description}  {/* Se muestra la descripción personalizada */}
        </Typography>
        <Box mt={2} sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
          <Box
            sx={{ backgroundColor: color, padding: 1.5, borderRadius: "50%", display: "flex", justifyContent: "center" }}
          >
            {icon}
          </Box>
          <Typography mt={1} fontSize={14} fontWeight="bold">DATA INFO</Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

const ServiceCards = () => {
  return (
    <Box>
      <Grid 
        container 
        spacing={3} 
        justifyContent="center" 
        sx={{ 
          p: 3,
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(4, 1fr)'
          },
          gap: 3
        }}
      >
        {options.map((option, index) => (
          <Box key={index}>
            <OptionCard {...option} />
          </Box>
        ))}
      </Grid>
    </Box>
  );
};

export default ServiceCards;
