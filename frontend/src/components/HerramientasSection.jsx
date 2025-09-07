import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

// Importador de imágenes
import aceite from '../assets/Nuestras_Herramientas/aceite1.webp';
import endoscopica from '../assets/Nuestras_Herramientas/endoscopica.webp';
import escaner from '../assets/Nuestras_Herramientas/escaner1.webp';
import estetos from '../assets/Nuestras_Herramientas/estetos1.webp';
import informelegal from '../assets/Nuestras_Herramientas/informelegal.webp';
import medidoneumaticos from '../assets/Nuestras_Herramientas/medidor_neumatico.webp';
import pintura from '../assets/Nuestras_Herramientas/medidor_pintura.webp';
import multimetro1 from '../assets/Nuestras_Herramientas/multimetro1.webp';



function HerramientasSection() {
  const herramientas = [
    { titulo: 'Escáner Automotriz', descripcion: 'Es una herramienta de diagnóstico que se conecta a la computadora (ECU o Módulo de Control del Motor) de un vehículo a través del puerto OBD-II. Su función principal es leer y diagnosticar las fallas electrónicas que el vehículo.', imagen: escaner },
    { titulo: 'Estetoscopio Mecánico', descripcion: 'El estetoscopio de mecánico es una herramienta esencial para diagnosticar problemas. Permite aislar ruidos internos y vibraciones del motor, la transmisión y otros componentes, ayudando a identificar el origen de la falla con precisión.', imagen: estetos },    
    { titulo: 'Medidor Liquido Frenos', descripcion: 'El medidor de líquido de frenos es una herramienta crucial para la seguridad vial. Su función es verificar el estado y el nivel de humedad del líquido, lo que previene fallas en el sistema y ayuda a evitar accidentes.', imagen: aceite },
    { titulo: 'Medidor Bateria', descripcion: 'Es una herramienta esencial para el mantenimiento automotriz. Verifica la carga, el estado de salud y el voltaje de la batería para prevenir fallas de arranque inesperadas. Es clave para la fiabilidad del vehículo.', imagen: multimetro1 },
    { titulo: 'Medidor de neumáticos', descripcion: 'Es una herramienta de seguridad esencial. Permite medir la profundidad de los surcos para asegurar que el neumático tenga el agarre adecuado en la carretera, lo cual es crucial para evitar el deslizamiento, especialmente en condiciones húmedas.', imagen: medidoneumaticos },
    { titulo: 'Medidor de pintura', descripcion: 'El medidor de pintura automotriz es una herramienta esencial para inspeccionar un vehículo. Mide el espesor de la capa de pintura, permitiendo detectar reparaciones o repintados que no han sido reportados, como resultado de un accidente..', imagen: pintura },
    { titulo: 'Cámara Endoscopica', descripcion: 'Es una herramienta versátil que permite una inspección visual detallada de zonas que son inaccesibles a simple vista. Es fundamental para diagnosticar problemas sin desmontar, como fallas en el motor o daños en la carrocería.', imagen: endoscopica },
    { titulo: 'Informe Legal', descripcion: 'El informe certifica la situación legal del automóvil. Contiene información crucial sobre su estado, historial de propiedad y si tiene multas, gravámenes o embargos pendientes, brindando total transparencia al comprador.', imagen: informelegal },
    
  ];

  return (
    <Box
      id="nuestras-herramientas"
      sx={{
        py: 8,
        backgroundColor: '#ffffff',
        position: 'relative'
      }}
    >
      <Box sx={{ 
        maxWidth: 1400, 
        mx: 'auto', 
        px: 3, 
        position: 'relative', 
        zIndex: 2
      }}>
        <Typography 
        variant="h4" 
        fontWeight="bold" 
        textAlign="center" 
        gutterBottom 
        color={"#1848B9"} 
        >
          Nuestras herramientas
        </Typography>
        <Typography variant="body1" textAlign="center" gutterBottom
        sx={{ 
          color: "#757575", // Color plomo
          fontSize: { xs: "1.3rem", sm: "1.5rem", md: "1.7rem" }, // Tamaño personalizado
          fontWeight: 500,
          mb: 4 // Separación debajo del título
        }}
      >
          Nos preocupamos de siempre contar con herramientas de última generación.
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          {herramientas.map((herramienta, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Box 
                sx={{
                  p: 2, 
                  borderRadius: 2, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  textAlign: 'center',
                  height: '390px',
                  background: 'lightgrey',
                  boxShadow: 'rgba(50, 50, 93, 0.25) 0px 30px 50px -12px inset, rgba(0, 0, 0, 0.3) 0px 18px 26px -18px inset'
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
                <Typography variant="body2" sx={{ color: '#757575' }}>{herramienta.descripcion}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}

export default HerramientasSection;
