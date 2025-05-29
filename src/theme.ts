// src/theme.ts
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1565C0', // Cambia este valor por el color que desees
    },
    secondary: {
      main: '#9C27B0', // Cambia este valor por el color que desees
    },
    // tertiary eliminado de palette
  },
  customColors: {
    tertiary: '#ffb74d', // Color personalizado
  },
});

export default theme;
