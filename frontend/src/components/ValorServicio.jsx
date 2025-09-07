
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { Link } from "react-router-dom";

import CheckIcon from '@mui/icons-material/Check';
import valores1 from '../assets/Valores_Servicios/mecanica_valor1.webp';
import valores2 from '../assets/Valores_Servicios/mecanica_valor2.webp';
import valores3 from '../assets/Valores_Servicios/mecanica_valor3.webp';

//Nuevo estilo botones 
import "../Csspersonalizado/Botones_RRSS.css";

  const precios = {
    'Inspección Visual Básica': 35000,
    'Inspección Visual Semi Full': 49000,
    'Inspección Visual Full': 69000,
  };

const valores = [
  {
    id: 1,
    titulo: "Inspección Visual Básica",
    precio: 35000,
    descripcion: "$35.000",
    imagen: valores1,
    listado: [
      { texto: "Scanner" },
      { texto: "Informe escáner" },
      { texto: "Validación Kilometraje" },
            
    ],
  },
  {
    id: 2,
    titulo: "Inspección Visual Semi Full",
    precio: 49000,
    descripcion: "$49.000",
    imagen: valores2,
    listado: [
      { texto: "Todo lo de Inspección Básica" },
      { texto: "+ de 150 puntos de revisión" },
      { texto: "Revisión interior/exterior" },
      { texto: "Informe Electrónico OBD2" },
      { texto: "Informe final con conclusiones" },
      { texto: "Revisión Mecánica" },      
      { texto: "Prueba Ruta" },      
      { texto: "Fotografías" },

    ],
  },
  {
    id: 3,
    titulo: "Inspección Visual Full",
    precio: 69000,
    descripcion: "$69.000",
    imagen: valores3,
    listado: [
      { texto: "Todo lo de Inspección Básica y Semi Full +" },
      { texto: "Informe Autofac" },
      { texto: "Certificado de Multas" },                   
      { texto: "Certificado de Anotaciones Vigentes" },  
      { texto: "Revisión Documental Prohibición de Venta" },
      { texto: "Checklist Vehiculo denunciado por robo o clonación" }, 
      
    ],
  },
];

const ValorServicio = () => {
  return (
    <Box sx={{ 
      textAlign: "center", 
      p: 5, 
      mt: 3,
      backgroundColor: '#ffffff',
      backgroundImage: 'none'
    }}>
      <Typography 
        variant="h4" 
        fontWeight="bold" 
        textAlign="center" 
        gutterBottom 
        color={"#1848B9"} 
        >
        Valores Inspección Visual Pre-Compra
      </Typography>
      <Typography variant="body1" textAlign="center" gutterBottom
        sx={{ 
          color: "#757575", // Color plomo
          fontSize: { xs: "1.3rem", sm: "1.5rem", md: "1.7rem" }, // Tamaño personalizado
          fontWeight: 500,
          mb: 4 // Separación debajo del título
        }}
      >
        Revisa nuestros valores, consulta con nuestros expertos y aclara todas tus dudas
      </Typography>
      <Grid container spacing={4} justifyContent="center" alignItems="stretch" sx={{ mt: 1 }}>
        {valores.map((valor) => (
          <Grid item xs={12} sm={6} md={3} key={valor.id}>
            <Card sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              backgroundColor: '#ffffff',
              backgroundImage: 'none',
              boxShadow: 2,
              borderRadius: '20px', // Border radius más notorio (aumentado de default ~4px a 20px)
              '&:hover': {
                boxShadow: 4
              }
            }}>
              <CardMedia
                component="img"
                height="300"
                image={valor.imagen}
                alt={valor.titulo}
                sx={{ borderRadius: 2, boxShadow: 3, objectFit: 'cover' }}
              />
              <CardContent sx={{ 
                flexGrow: 1,
                backgroundColor: '#ffffff',
                backgroundImage: 'none'
              }}>
                <Box
                  sx={{
                    display: 'inline-flex',
                    flexDirection: 'column', // Añadido para apilar verticalmente
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '20px',
                    backgroundColor: '#ffffff',
                    padding: '8px 16px',
                    marginBottom: '8px',
                  }}
                >
                  <Typography variant="h5" fontWeight="bold">
                    {valor.titulo}
                  </Typography>

                  {/* Etiqueta domicilio - Opción 3: Estilo Minimalista con Borde */}
                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 0.5,
                      color: '#675978', // Color de tu botón "Agendar"
                      border: '1.5px solid #675978', // Borde con el mismo color
                      borderRadius: '50px', // Totalmente redondeado
                      padding: '5px 12px',
                      marginTop: '5px',
                    }}
                  >
                    <DirectionsCarIcon sx={{ fontSize: '1.1rem' }} />
                    <Typography variant="caption" sx={{ fontWeight: 'bold', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                      A Domicilio
                    </Typography>
                    </Box>
                </Box>
                <Typography variant="h3" sx={{ 
                  mt: 2, 
                  color: '#7B1FA2', 
                  fontWeight: 'bold',
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' } // Precio más grande: aumentado de h4 a h3 con tamaños responsivos
                }}>
                  {valor.descripcion}
                </Typography>
                {valor.listado && (
                  <List>
                    {valor.listado.map((item, index) => {
                      // Primer elemento de Semi Full y Full con color especial solo para el ícono
                      const isSpecialItem = (valor.id === 2 || valor.id === 3) && index === 0;
                      const checkColor = isSpecialItem ? '#3A3243' : '#DBD6E1';
                      
                      return (
                        <ListItem key={index}>
                          <ListItemIcon>
                    <Box
                      sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 24, // Ajusta el tamaño del círculo
                      height: 24, // Debe ser el mismo que el ancho
                      borderRadius: '50%', // Para que sea un círculo perfecto
                      bgcolor: checkColor, // O el color que desees para el fondo
                      }}
                    >
                  <CheckIcon
                sx={{
                color: 'white', // El color del ícono debe ser blanco o uno que contraste
                fontSize: '1rem', // Un tamaño más pequeño dentro del círculo
                }}
                />
              </Box>
            </ListItemIcon>
                          <ListItemText 
                            primary={
                              (valor.id === 2 && index === 0) || (valor.id === 3 && index === 0)
                                ? <span style={{ fontWeight: 'bold', color: '#303030' }}>{item.texto}</span>
                                : <span style={{ color: '#696969' }}>{item.texto}</span>
                            }
                            secondary={item.puntos}
                          />
                        </ListItem>
                      );
                    })}
                  </List>
                )}
              </CardContent>
              <Box sx={{ p: 1, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                
                 {/* Botón de WhatsApp agregado arriba del botón Agendar */}
                <Button 
                  sx={{
                    width: '280px', // Ajusta el ancho del botón
                    height: '50px', // Ajusta la altura del botón
                    borderRadius: '50px',
                    background: '#FDAF34',
                    
                    border: 'none',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    textDecoration: 'none',
                    textTransform: 'none',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(3px)',
                      boxShadow: 'none',
                      background: '#FFA82E',
                    },
                    '&:active': {
                      opacity: 0.5,
                    },
                  }}                 
                  component="a"
                  href="https://wa.me/56997541042"
                  target="_blank"
                  rel="noopener"
                >
                  WhatsApp
                </Button>
                {/* Separador visual entre botones */}
                <div className="separador-botones-valorservicio" />
                <Button 
                  sx={{
                    width: '240px',
                    height: '50px',
                    borderRadius: '50px',
                    background: ' #675978',                    
                    border: 'none',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    textDecoration: 'none',
                    textTransform: 'none',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(3px)',
                      boxShadow: 'none',
                      background: '#50455E',
                    },
                    '&:active': {
                      opacity: 0.5,
                    },
                  }}               
                  component={Link} to="/agendar"                
                >                
                  Agendar
                </Button>
              </Box>
              <Typography variant="body2" sx={{ mb: 1, p: 2 }}>
                  ¿Tienes preguntas? Contáctanos
                </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ValorServicio;
