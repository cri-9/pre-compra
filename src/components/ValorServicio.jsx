import React from "react";
import { Button, Card, CardContent, CardMedia, Typography, Box, Grid, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
import valores1 from '../assets/mecanica_valor1.jpg';
import valores2 from '../assets/mecanica_valor2.jpg';
import valores3 from '../assets/mecanica_valor3.jpg';

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
      { texto: "+ de 100 puntos de revisión"},
      { texto: "Revisión estado pintura"},
      { texto: "Prueba Ruta", },
      { texto: "Imagenes"},
      { texto: "Scaner "},
            // ... (puedes añadir más elementos al listado)
    ],
  },
  {
    id: 3,
    titulo: "Servicio Full",
    descripcion: "$65.000.",
    imagen: valores3,
    listado: [
      { texto: "Informe Legal Digital"},
      { texto: "+ de 100 puntos de revisión"},            
      { texto: "revisión estado pintura"},
      { texto: "Revisión Mecánica"},
      { texto: "Prueba ruta", },
      { texto: "Imagenes"},
      

      // ... (puedes añadir más elementos al listado)
    ],
  },
];

const ValorServicio = () => {
  return (
    <Box sx={{ textAlign: "center", p: 4, mt: 3 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Nuestros Valores
      </Typography>
      <Grid container spacing={4} justifyContent="center" alignItems="stretch" sx={{ mt: 1 }}> {/* Agrega mt: 4  para separar*/}
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
                </Box>
                <Typography variant="h4" sx={{ mt: 2, color: '#7B1FA2', fontWeight: 'bold' }}> {/*Estilos precio*/}
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
                <Button variant="contained" sx={{  width: "170px", height: "60px" , backgroundColor: "#6a6191", "&:hover": { backgroundColor: "#7B1FA2"}, fontSize: "1rem" , fontWeight: "bold"}}> {/*Ajusta tamaño de los botones  width y heigth y fontSize el tamaño*/}
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

