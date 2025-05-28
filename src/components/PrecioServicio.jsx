import React from 'react';
import { Box, Typography } from '@mui/material';


function PrecioServicio() {
  return (
    <Box sx={{ textAlign: 'center', mt: 8 }} className= "onda-fondo-svg">
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
        Valor del servicio pre-compra básico desde
      </Typography>
      <Typography variant="h5" sx={{ textDecoration: 'line-through', color: 'gray', mb: 1 }}>
        $54.000
      </Typography>
      <Typography variant="h2" sx={{ fontWeight: 'bold', color: '#1565C0' }}>
        $30.000
      </Typography>
    </Box>
  );
}

export default PrecioServicio;