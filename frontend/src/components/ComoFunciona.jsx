import BuildCircleIcon from "@mui/icons-material/BuildCircle";
import DescriptionIcon from "@mui/icons-material/Description";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import { Box, Typography } from "@mui/material";

const flipCardStyle = {
  perspective: "1000px",
  width: "300px",
  height: "220px",
  cursor: "pointer",
  "&:hover .flipInner": {
    transform: "rotateY(180deg)",
  },
};

const flipCardInner = {
  position: "relative",
  width: "100%",
  height: "100%",
  textAlign: "center",
  transition: "transform 0.8s",
  transformStyle: "preserve-3d",
};

const flipCardFace = {
  position: "absolute",
  width: "100%",
  height: "100%",
  WebkitBackfaceVisibility: "hidden",
  backfaceVisibility: "hidden",
  borderRadius: "16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  padding: "16px",
};

const frontStyle = {
  ...flipCardFace,
  backgroundColor: "#50455E",
  color: "#FFFFFF",
};

const backStyle = {
  ...flipCardFace,
  backgroundColor: "#C4BCCD",
  color: "#07222c",
  transform: "rotateY(180deg)",
  fontWeight: "400",
};

// Componente de flecha fuera del FlipCard para evitar duplicaciones
const ArrowIcon = ({ color = "#FFFFFF" }) => (
  <Box
    sx={{
      position: 'absolute',
      bottom: '10px',
      right: '10px',
      width: '20px',
      height: '20px',
      zIndex: 10
    }}
  >
    <svg 
      width="20" 
      height="20" 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z" 
        fill={color}
      />
    </svg>
  </Box>
);

const FlipCard = ({ icon, title, description, isSpecial = false }) => {
  return (    
    <Box sx={flipCardStyle}>        
      <Box className="flipInner" sx={flipCardInner}>
        {/* Frente */}
        <Box sx={frontStyle}>
          <Box sx={{ textAlign: 'center' }}>
            {icon}
            <Typography variant="h6" sx={{ mt: 2, color: '#FFFFFF' }}>
              {title}
            </Typography>
          </Box>
          <ArrowIcon color="#FFFFFF" />
        </Box>
        
        {/* Atrás */}
        <Box sx={backStyle}>
          <Box sx={{ textAlign: 'center', p: 2 }}>
            {isSpecial ? (
              <Box>
                <Typography variant="body2" sx={{ mb: 2, fontSize: '0.85rem' }}>
                  Una vez completada la inspección, nuestros ejecutivos consolidan los datos para preparar la entrega de tres informes:
                </Typography>
                <Box sx={{ textAlign: 'left', pl: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1, fontSize: '0.8rem' }}>
                    1.- Escáner detallado
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1, fontSize: '0.8rem' }}>
                    2.- Informe de Visual Mecánica
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '0.8rem' }}>
                    3.- Checklist Vehiculo denunciado por robo o clonación 
                  </Typography>
                </Box>
              </Box>
            ) : (
              <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                {description}
              </Typography>
            )}
          </Box>
          <ArrowIcon color="#07222c" />
        </Box>
      </Box>
    </Box>
  );
};

const ComoFunciona = () => {
  return (
    <Box
         sx={{
        py: 8,
        bgcolor: "#DBD6E1",
        textAlign: "center",
        position: "relative", // Necesario para que el pseudo-elemento funcione
        // Crea una forma de onda en la parte inferior
        clipPath: 'polygon(0 10%, 100% 0, 100% 100%, 0% 100%)', // Ajusta estos valores para crear una onda
        
      }}
    >
      <Typography 
        variant="h4" 
        fontWeight="bold" 
        textAlign="center" 
        gutterBottom 
        color={"#1848B9"}
        mb={4}
      >
        ¿Cómo Funciona?
      </Typography>
      <Box
        sx={{
          display: "flex",
          gap: 4,
          justifyContent: "center",
          flexWrap: "wrap",
          mt: 4,
        }}
      >
      <FlipCard
        icon={<EventAvailableIcon sx={{ fontSize: 50 }} />}
        title="Reserva mediante agendamiento"
        description="Para reservar, por favor completa los campos solicitados y selecciona la fecha y hora de tu preferencia. Recibirás una confirmación preliminar por correo electrónico y un ejecutivo se pondrá en contacto contigo para finalizar el agendamiento."
      />
      <FlipCard
        icon={<BuildCircleIcon sx={{ fontSize: 50 }} />}
        title="Inspección en Terreno"
        description="Con base en los datos proporcionados y una vez confirmados, nuestro técnico se desplazará al lugar del vehículo para realizar la inspección, asegurando la total confidencialidad del proceso."
      />
      <FlipCard
        icon={<DescriptionIcon sx={{ fontSize: 50 }} />}
        title="Entrega de Informe digital"
        description="Una vez completada la inspección, nuestros ejecutivos consolidan los datos para preparar la entrega de tres informes:

1.- Escáner detallado

2.- Informe de Visual Mecánica

3.- Documentos legales (Servicio full)"
        isSpecial={true}
      />
      </Box>
    </Box>
  );
};

export default ComoFunciona;
