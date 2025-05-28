import { FC, ReactElement } from "react";
import { Card, CardContent, Typography, Grid, Box, SxProps, Theme } from "@mui/material";
import { Search, Home, Person, Lock } from "@mui/icons-material";


interface ServiceOption {
  number: string;
  title: string;
  icon: ReactElement;
  color: string;
  description: string;
}

const options: ServiceOption[] = [
  { 
    number: "01", 
    title: "Inspección Visual", 
    icon: <Search fontSize="large" />, 
    color: "#1976D2",
    description: "Realizamos una revisión visual completa para detectar posibles daños."
  },
  { 
    number: "02", 
    title: "Revisión con escaner", 
    icon: <Home fontSize="large" />, 
    color: "#4A8",
    description: "Analizamos el estado mecánico del vehículo con nuestros expertos."
  },
  { 
    number: "03", 
    title: "Revisión Documental", 
    icon: <Person fontSize="large" />, 
    color: "#9C27B0",
    description: "Verificamos los documentos legales para asegurar una compra segura."
  },
  { 
    number: "04", 
    title: "Seguridad y Confianza", 
    icon: <Lock fontSize="large" />, 
    color: "#E44",
    description: "Garantizamos transparencia en cada inspección realizada."
  }
];

const cardStyles: Record<string, SxProps<Theme>> = {
  card: {
    maxWidth: 300,
    p: 2,
    borderRadius: 3,
    boxShadow: 3,
    position: "relative",
    overflow: "visible"
  },
  badge: {
    backgroundColor: "color",
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
  },
  iconContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column"
  },
  iconBox: {
    padding: 1.5,
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center"
  }
};

const OptionCard: FC<ServiceOption> = ({ number, title, icon, color, description }) => {
  return (
    <Card sx={cardStyles.card}>
      <Box sx={{ ...cardStyles.badge, backgroundColor: color }} />
      <CardContent sx={{ textAlign: "center" }}>
        <Typography variant="h3" fontWeight="bold">{number}</Typography>
        <Typography variant="h6" fontWeight="bold" mt={1}>{title}</Typography>
        <Typography variant="body2" mt={1}>
          {description}
        </Typography>
        <Box mt={2} sx={cardStyles.iconContainer}>
          <Box sx={{ ...cardStyles.iconBox, backgroundColor: color }}>
            {icon}
          </Box>
          <Typography mt={1} fontSize={14} fontWeight="bold">DATA INFO</Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

const ServiceCards: FC = () => {
  return (    
    <Grid container spacing={3} justifyContent="center" sx={{ p: 3 }}>
      {options.map((option, index) => (
        <Grid item key={index}>
          <OptionCard {...option} />
        </Grid>
      ))}
    </Grid> 
 );
};

export default ServiceCards;
