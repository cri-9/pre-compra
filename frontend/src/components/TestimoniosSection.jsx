import { Box, Card, CardMedia, Typography } from '@mui/material';
import Slider from 'react-slick';

// Importa los estilos de slick-carousel
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

// Importa tus estilos personalizados
import '../Csspersonalizado/Testimonios.css';

// Importa las imágenes (asegúrate que la ruta sea correcta)
import testimonioImg1 from '../assets/Testimonios/persona1.webp';
import testimonioImg2 from '../assets/Testimonios/persona2.webp';
import testimonioImg3 from '../assets/Testimonios/persona3.webp';
// import testimonioImg4 from '../assets/Testimonios/persona4.webp'; // Comentado temporalmente

// Datos de los testimonios
const testimonialsData = [
  {
    image: testimonioImg1,
    quote: "El servicio fue increíblemente detallado. Encontraron un problema serio en el motor que el vendedor no mencionó. Me ahorraron un gran dolor de cabeza. ¡Gracias, Visualmecanica.cl!",
    name: "Carlos Fernández",
    title: "Mi primer auto automático"
  },
  {
    image: testimonioImg2,
    quote: "No sabía nada de autos. Contraté su inspección y me sentí segura al comprar. El informe fue muy claro y profesional. ¡Altamente recomendable!",
    name: "Carla Gómez",
    title: "Desde Lautaro"
  },
  {
    image: testimonioImg3,
    quote: "Gracias a la inspección, pude negociar un mejor precio. Detectaron fallas que el vendedor no había informado. Un servicio indispensable.",
    name: "Maria García",
    title: "Feliz con mi compra"
  }
  // Testimonio 4 comentado temporalmente por problema de imagen
  /*,
  {
    image: testimonioImg4,
    quote: "Estaba vendiendo mi auto. La inspección generó confianza en el comprador y pude cerrar la venta más rápido y a un precio justo. ¡Excelente servicio!",
    name: "Eduardo Pérez",
    title: "me voy 100% satisfecho."
  }
  */
];

const Testimonios = () => {
  // Configuración del carrusel
  const settings = {
    dots: true,       // Muestra los puntos de navegación
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    arrows: false,    // Oculta las flechas de navegación
  };

  return (
    <Box     
     sx={{
      py: { xs: 6, md: 8 }, // Aumentado padding vertical en móviles para dar más espacio al contenido
      px: { xs: 2, md: 0 }, // Reducido padding horizontal en móviles
      bgcolor: "#F2F0F4",
      textAlign: "center",
      position: "relative", // Necesario para que el pseudo-elemento funcione
      // ClipPath responsivo - menos agresivo en móviles para no cortar contenido
      clipPath: { 
        xs: 'polygon(0 5%, 100% 0, 100% 100%, 0% 100%)', // Menos corte en móviles (5% vs 10%)
        md: 'polygon(0 10%, 100% 0, 100% 100%, 0% 100%)' // Corte original en desktop
      },
      overflow: 'visible', // Cambiado de hidden a visible para permitir que el contenido se vea
      minHeight: { xs: '100vh', md: 'auto' }, // Altura mínima en móviles para asegurar espacio suficiente
  }}
        >
        <Typography 
          variant="h3" 
          component="h2" 
          sx={{ 
            fontWeight: 'bold',
            color: '#1A237E',
            fontSize: { xs: '1.3rem', sm: '1.8rem', md: '2.5rem' }, // Ligeramente más pequeño en móviles
            mt: { xs: 2, md: 0 }, // Reducido margen superior en móviles para dar más espacio al contenido
            mb: { xs: 3, md: 1 }, // Margen inferior ajustado
            px: { xs: 1, sm: 1, md: 0 }, // Padding horizontal mínimo en móviles
            lineHeight: { xs: 1.1, md: 1.3 }, // Altura de línea más compacta en móviles
            textAlign: 'center',
            maxWidth: '100%', // Asegurar que no exceda el contenedor
            wordWrap: 'break-word', // Permitir división de palabras si es necesario
            zIndex: 10, // Asegurar que esté por encima del clipPath
            position: 'relative', // Necesario para z-index
          }}
        >
          Opiniones de nuestros Clientes
        </Typography>

      {/* Sección de testimonios */}
      <Box className="testimonial-section">
      <Slider {...settings}>
        {testimonialsData.map((testimonial, index) => (
          <Box key={index} className="testimonial-slide">
            <Card className="testimonial-image-card">
              <CardMedia
                component="img"
                image={testimonial.image}
                alt={`Testimonio de ${testimonial.name}`}
                className="testimonial-image"
              />
            </Card>
            <Box className="testimonial-text-content">
              <Typography variant="body1" component="p" className="testimonial-quote">
                {testimonial.quote}
              </Typography>
              <Box mt={3}>
                <Typography variant="subtitle1" className="testimonial-name">
                  {testimonial.name}
                </Typography>
                <Typography variant="body2" className="testimonial-title">
                  {testimonial.title}
                </Typography>
              </Box>
            </Box>
          </Box>
        ))}
      </Slider>
    </Box>
    </Box>
  );
};

export default Testimonios;