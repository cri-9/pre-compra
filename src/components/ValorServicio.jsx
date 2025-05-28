import { Link } from "react-router-dom";
import React from "react";
import { Button, Card, CardContent, CardMedia, Typography, Box, Grid, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
import valores1 from '../assets/Valores_servicios/mecanica_valor1.webp';
import valores2 from '../assets/Valores_servicios/mecanica_valor2.webp';
import valores3 from '../assets/Valores_servicios/mecanica_valor3.webp';

const valores = [
  {
    id: 1,
    titulo: "Servicio Básico",
    descripcion: "$30.000.",
    imagen: valores1,
    listado: [
      { texto: "Scaner" },
      // ... (puedes añadir más elementos al listado)
    ],
  },
  {
    id: 2,
    titulo: "Servicio Semi Full",
    descripcion: "$45.000.",
    imagen: valores2,
    listado: [
      { texto: "+ de 100 puntos de revisión" },
      { texto: "Revisión estado pintura" },
      { texto: "Prueba Ruta" },
      { texto: "Imagenes" },
      { texto: "Scaner " },
      // ... (puedes añadir más elementos al listado)
    ],
  },
  {
    id: 3,
    titulo: "Servicio Full",
    descripcion: "$65.000.",
    imagen: valores3,
    listado: [
      { texto: "Informe Legal Digital" },
      { texto: "+ de 100 puntos de revisión" },
      { texto: "revisión estado pintura" },
      { texto: "Revisión Mecánica" },
      { texto: "Prueba ruta" },
      { texto: "Imagenes" },
      // ... (puedes añadir más elementos al listado)
    ],
  },
];

const ValorServicio = () => {
  return (
    <Box sx={{  textAlign: "center", p: 4, mt: 3 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Nuestros Valores de Servicio son todos a domicilio
      </Typography>
      <Grid container spacing={4} justifyContent="center" alignItems="stretch" sx={{ mt: 1 }}>
        {valores.map((valor) => (
          <Grid item xs={12} sm={6} md={3} key={valor.id}>
            <Card sx={{ display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="300"
                image={valor.imagen}
                alt={valor.titulo}
                sx={{ borderRadius: 2, boxShadow: 3, objectFit: 'cover' }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Box
                  sx={{
                    display: 'inline-flex',
                    flexDirection: 'column', // Añadido para apilar verticalmente
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '20px',
                    backgroundColor: '#f0f0f0',
                    padding: '8px 16px',
                    marginBottom: '8px',
                  }}
                >
                  <Typography variant="h6" fontWeight="bold">
                    {valor.titulo}
                  </Typography>
                  <Box
                    sx={{
                      backgroundColor: '#e0f7fa',
                      color: '#1976d2',
                      padding: '5px 10px',
                      borderRadius: '4px',
                      marginTop: '5px',
                      display: 'inline-block',
                    }}
                  >
                    <Typography variant="body2" sx={{color: '#8e44ad', fontWeight: 'bold', fontSize: '1rem', borderRadius: '4px'}}>Domicilio</Typography>
                  </Box>
                </Box>
                <Typography variant="h4" sx={{ mt: 2, color: '#7B1FA2', fontWeight: 'bold' }}>
                  {valor.descripcion}
                </Typography>
                {valor.listado && (
                  <List>
                    {valor.listado.map((item, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <CheckIcon style={{ color: 'green' }} />
                        </ListItemIcon>
                        <ListItemText primary={item.texto} secondary={item.puntos} />
                      </ListItem>
                    ))}
                  </List>
                )}
              </CardContent>
              <Box sx={{ p: 1, textAlign: 'center' }}>
                <Button variant="contained" sx={{ width: "170px", height: "60px", backgroundColor: "#7B1FA2", fontSize: "1rem", fontWeight: "bold" }}
                component={Link} to="/agendar"                
                color="primary"
                >
                  Agendar
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ValorServicio;
