import React from "react";
import { Card, CardContent, Typography, Box, Grid, Button, CardMedia, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
import valores1 from '../assets/Valores_servicios/mecanica_valor1.webp';
import valores2 from '../assets/Valores_servicios/mecanica_valor2.webp';
import valores3 from '../assets/Valores_servicios/mecanica_valor3.webp';

// Usar la misma información de servicios que en ValorServicio.jsx
const servicios = [
  {
    id: 1,
    titulo: "Servicio Básico",
    precio: 30000,
    descripcion: "$30.000",
    imagen: valores1,
    listado: [
      { texto: "Scaner" },
    ],
  },
  {
    id: 2,
    titulo: "Servicio Semi Full",
    precio: 45000,
    descripcion: "$45.000",
    imagen: valores2,
    listado: [
      { texto: "+ de 100 puntos de revisión" },
      { texto: "Revisión estado pintura" },
      { texto: "Prueba Ruta" },
      { texto: "Imagenes" },
      { texto: "Scaner " },
    ],
  },
  {
    id: 3,
    titulo: "Servicio Full",
    precio: 65000,
    descripcion: "$65.000",
    imagen: valores3,
    listado: [
      { texto: "Informe Legal Digital" },
      { texto: "+ de 100 puntos de revisión" },
      { texto: "revisión estado pintura" },
      { texto: "Revisión Mecánica" },
      { texto: "Prueba ruta" },
      { texto: "Imagenes" },
    ],
  },
];

function SeleccionServicio({ datos, onChange }) {
  // Función para seleccionar un servicio
  const seleccionarServicio = (servicio) => {
    onChange({
      ...datos,
      servicioId: servicio.id,
      nombreServicio: servicio.titulo,
      monto: servicio.precio
    });
  };

  return (
    <Card elevation={3} sx={{ borderRadius: 3, p: 2, mt: 2, backgroundColor: "#f7f7f7" }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
          Seleccione el Tipo de Servicio
        </Typography>

        <Grid container spacing={3} justifyContent="center">
          {servicios.map((servicio) => (
            <Grid item xs={12} sm={6} md={4} key={servicio.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  border: datos.servicioId === servicio.id ? '2px solid #7B1FA2' : '1px solid #e0e0e0',
                  boxShadow: datos.servicioId === servicio.id ? '0 4px 8px rgba(123, 31, 162, 0.2)' : 'none',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onClick={() => seleccionarServicio(servicio)}
              >
                <CardMedia
                  component="img"
                  height="140"
                  image={servicio.imagen}
                  alt={servicio.titulo}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" fontWeight="bold">
                    {servicio.titulo}
                  </Typography>
                  <Box
                    sx={{
                      backgroundColor: '#e0f7fa',
                      borderRadius: '4px',
                      padding: '8px',
                      marginBottom: '10px'
                    }}
                  >
                    <Typography variant="body2">
                      {servicio.descripcion}
                    </Typography>
                  </Box>
                  <List>
                    {servicio.listado.map((item, index) => (
                      <ListItem key={index} sx={{ padding: '4px 0' }}>
                        <ListItemIcon sx={{ minWidth: 'auto', marginRight: '8px' }}>
                          <CheckIcon sx={{ color: '#4caf50' }} />
                        </ListItemIcon>
                        <ListItemText primary={item.texto} />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
                <Box sx={{ p: 2 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={e => {
                      e.stopPropagation(); // Evita doble llamada
                      seleccionarServicio(servicio);
                    }}
                  >
                    Seleccionar
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
}

export default SeleccionServicio;