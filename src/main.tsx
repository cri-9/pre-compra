import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // Asegúrate de que este archivo exista o elimina esta línea si no lo necesitas

import { ThemeProvider } from '@mui/material/styles';
import theme from './theme'; // importa tu tema

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);