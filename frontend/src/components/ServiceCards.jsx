import { School, Search, Settings, WifiTethering } from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
} from '@mui/material';
import pieTpms from '../assets/pie_tpms/pie_.webp';

const tpmsSteps = [
  {
    number: "01",
    title: "Revisión Gratuita",
    icon: <Search fontSize="large" />,
    color: "#1976D2",
    description: "Una vez contactado vamos al domicilio, revisamos cuántos sensores están con problema."
  },
  {
    number: "02",
    title: "Activación TPMS",
    icon: <WifiTethering fontSize="large" />,
    color: "#9C27B0",
    description: "Con escáner activamos uno por uno los sensores."
  },
  {
    number: "03",
    title: "Programación Precisa",
    icon: <Settings fontSize="large" />,
    color: "#1565C0",
    description: "Realizamos el diagnóstico y la programación de cada uno de estos sensores."
  },
  {
    number: "04",
    title: "Aprendizaje",
    icon: <School fontSize="large" />,
    color: "#ff9a04",
    description: "Una vez instalados, realizamos el aprendizaje en el vehículo y borramos los códigos de error."
  }
];

const StepCard = ({ number, title, icon, color, description }) => (
  <Card
    sx={{
      p: 2,
      borderRadius: 4,
      position: "relative",
      overflow: "visible",
      background: "#F2F2F2",
      boxShadow: "8px 8px 20px #bebebe, -8px -8px 20px #ffffff",
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    <Box
      sx={{
        backgroundColor: color,
        color: "white",
        padding: "5px 16px",
        borderRadius: "20px",
        position: "absolute",
        top: -16,
        left: "50%",
        transform: "translateX(-50%)",
        fontSize: "0.8rem",
        fontWeight: "bold",
        whiteSpace: "nowrap",
      }}
    >
      Paso {number}
    </Box>
    <CardContent sx={{ textAlign: "center", pt: 3.5, flexGrow: 1 }}>
      <Box
        sx={{
          backgroundColor: color,
          color: "white",
          width: 58,
          height: 58,
          borderRadius: "50%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mx: "auto",
          mb: 1.5,
        }}
      >
        {icon}
      </Box>
      <Typography variant="h6" fontWeight="bold" mt={1}>
        {title}
      </Typography>
      <Typography variant="body2" mt={1} color="text.secondary">
        {description}
      </Typography>
    </CardContent>
  </Card>
);

const ServiceCards = () => (
  <Box>
    <Typography
      variant="h5"
      fontWeight="bold"
      textAlign="center"
      mb={5}
      sx={{
        color: "#1848B9",
        fontSize: { xs: "1.6rem", sm: "2rem", md: "2.3rem" },
      }}
    >
      Procedimiento Sensores TPMS
    </Typography>

    <Grid
      container
      spacing={4}
      justifyContent="center"
      sx={{ px: { xs: 1, md: 2 } }}
    >
      {tpmsSteps.map((step, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <StepCard {...step} />
        </Grid>
      ))}
    </Grid>

    <Box sx={{ mt: 6, textAlign: "center" }}>
      <Box
        component="img"
        src={pieTpms}
        alt="Servicio TPMS a domicilio"
        sx={{
          width: '100%',
          maxWidth: 800,
          display: 'block',
          mx: 'auto',
          borderRadius: 2,
          imageRendering: 'auto',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }}
      />
    </Box>
  </Box>
);

export default ServiceCards;