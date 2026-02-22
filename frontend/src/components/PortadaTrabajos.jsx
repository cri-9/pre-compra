import { Box, Typography } from '@mui/material';
import Slider from 'react-slick';

// Importa los estilos de slick-carousel
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

// Importa tus estilos personalizados
import '../Csspersonalizado/PortadaTrabajos.css';

// Importa las imágenes de los trabajos realizados
import chevroletSilverado from '../assets/Portadas_trabajos/chevrolet_silverado.webp';
import fordExplorer from '../assets/Portadas_trabajos/ford_explorer.webp';
import kiaSportage from '../assets/Portadas_trabajos/kia_sportage.webp';
import landRover from '../assets/Portadas_trabajos/land_rover.webp';
import mazdaMx5 from '../assets/Portadas_trabajos/mazda_mx_5.webp';
import ram1500 from '../assets/Portadas_trabajos/ram_1500.webp';
import subaruOutback from '../assets/Portadas_trabajos/subaru_outback.webp';

// Datos de los trabajos realizados
const trabajosData = [
  {
    image: chevroletSilverado,
    title: "Chevrolet Silverado",
    link: null
  },
  {
    image: fordExplorer,
    title: "Ford Explorer",
    link: null
  },
  {
    image: kiaSportage,
    title: "Kia Sportage",
    link: null
  },
  {
    image: landRover,
    title: "Land Rover",
    link: null
  },
  {
    image: mazdaMx5,
    title: "Mazda MX-5",
    link: null
  },
  {
    image: ram1500,
    title: "RAM 1500",
    link: null
  },
  {
    image: subaruOutback,
    title: "Subaru Outback",
    link: "https://web.facebook.com/reel/1736782864393152"
  }
];

const PortadaTrabajos = () => {
  // Configuración del carrusel
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  };

  return (
    <Box sx={{
      textAlign: "center",
      p: { xs: 2, sm: 3, md: 4, lg: 5 },
      mt: { xs: 2, sm: 3, md: 4 },
      backgroundColor: '#ffffff',
      backgroundImage: 'none'
    }}>
      {/* Título principal */}
      <Typography
        variant="h4"
        fontWeight="bold"
        textAlign="center"
        gutterBottom
        sx={{
          color: "#1848B9",
          fontSize: { xs: "1.3rem", sm: "1.7rem", md: "2.1rem", lg: "2.5rem" },
          mb: { xs: 2, sm: 3, md: 4 }
        }}
      >
        Muestra de trabajos realizados
      </Typography>

      {/* Carrusel */}
      <Box sx={{
        width: { xs: '98%', sm: '97%', md: '96%', lg: '95%' },
        margin: '0 auto',
        '& .slick-slide': {
          padding: { xs: '0 5px', sm: '0 8px', md: '0 10px' }
        },
        '& .slick-list': {
          margin: { xs: '0 -5px', sm: '0 -8px', md: '0 -10px' }
        }
      }}>
        <Slider {...settings}>
          {trabajosData.map((trabajo, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                px: 1
              }}
            >
              <Box
                component={trabajo.link ? 'a' : 'div'}
                href={trabajo.link || undefined}
                target={trabajo.link ? '_blank' : undefined}
                rel={trabajo.link ? 'noopener noreferrer' : undefined}
                sx={{
                  position: 'relative',
                  borderRadius: '15px',
                  overflow: 'hidden',
                  boxShadow: 2,
                  transition: 'all 0.3s ease-in-out',
                  cursor: trabajo.link ? 'pointer' : 'default',
                  height: { xs: '490px', sm: '320px', md: '340px', lg: '480px' },
                  width: '100%',
                  textDecoration: 'none',
                  display: 'block',
                  '&:hover': {
                    boxShadow: 4,
                    transform: 'translateY(-5px)'
                  },
                  '& img': {
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.3s ease-in-out',
                  },
                  '&:hover img': {
                    transform: 'scale(1.05)'
                  }
                }}
              >
                <img
                  src={trabajo.image}
                  alt={trabajo.title}
                  loading="lazy"
                />
                {/* Overlay con título */}
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                    padding: '20px 15px 15px',
                    display: 'flex',
                    alignItems: 'flex-end',
                    height: '100%',
                    justifyContent: 'center'
                  }}
                >
                  <Typography
                    sx={{
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem', lg: '1.1rem' },
                      textShadow: '1px 1px 3px rgba(0,0,0,0.5)'
                    }}
                  >
                    {trabajo.title}
                    {trabajo.link && ' 🎬'}
                  </Typography>
                </Box>
              </Box>
            </Box>
          ))}
        </Slider>
      </Box>

      {/* Texto descriptivo debajo */}
      <Typography
        variant="body1"
        sx={{
          color: "#757575",
          fontSize: { xs: "0.85rem", sm: "0.95rem", md: "1rem", lg: "1.1rem" },
          mt: { xs: 2, sm: 3, md: 4 },
          maxWidth: '800px',
          margin: { xs: '15px auto 0', sm: '20px auto 0', md: '30px auto 0' }
        }}
      >
        Conhece algunos de los vehículos que hemos inspeccionado. Cada inspección realizada con profesionalismo y precisión.
      </Typography>
    </Box>
  );
};

export default PortadaTrabajos;
