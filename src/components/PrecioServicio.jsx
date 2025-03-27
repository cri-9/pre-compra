import React from 'react';
import { Box, Typography } from '@mui/material';

function PrecioServicio() {
  return (
    <Box sx={{ textAlign: 'center', mt: 5 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
        Valor del servicio de pre-compra
      </Typography>
      <Typography variant="h5" sx={{ textDecoration: 'line-through', color: 'gray', mb: 1 }}>
        $54.000
      </Typography>
      <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
        $45.000
      </Typography>
    </Box>
  );
}

export default PrecioServicio;