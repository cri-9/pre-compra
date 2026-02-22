import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Fab from '@mui/material/Fab';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Slide from '@mui/material/Slide';
import Typography from '@mui/material/Typography';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function BotonWhatsApp({ numeroTelefono, mensajeInicial, onOpenCotizacion, sx = {} }) {
  const [openChatbot, setOpenChatbot] = useState(false);

  const handleOpenChatbot = () => {
    setOpenChatbot(true);
  };

  const handleCloseChatbot = () => {
    setOpenChatbot(false);
  };

  const handleCotizar = () => {
    // Evento Meta Pixel para lead/cotización
    if (window.fbq) {
      window.fbq('track', 'Lead', {
        content_name: 'Cotización',
        content_category: 'Quote Form'
      });
    }
    
    setOpenChatbot(false);
    if (onOpenCotizacion) {
      onOpenCotizacion();
    }
  };

  const handleWhatsApp = () => {
    // Evento Meta Pixel para contacto por WhatsApp
    if (window.fbq) {
      window.fbq('track', 'Contact', {
        content_name: 'WhatsApp',
        content_category: 'Contact Button'
      });
    }
    
    window.open(
      `https://wa.me/${numeroTelefono}?text=${encodeURIComponent(mensajeInicial)}`,
      '_blank',
      'noopener,noreferrer'
    );
    setOpenChatbot(false);
  };

  return (
    <>
      {/* Botón flotante principal */}
      <Fab
        onClick={handleOpenChatbot}
        color="success"
        sx={{
          position: 'fixed',
          bottom: { xs: 8, sm: 16, md: 24 },
          right: { xs: 8, sm: 16, md: 24 },
          backgroundColor: "#25D366",
          '&:hover': {
            backgroundColor: "#1ebc59",
            transform: 'scale(1.1)',
          },
          transition: 'all 0.3s ease',
          zIndex: 1000,
          boxShadow: '0 4px 20px rgba(37, 211, 102, 0.4)',
          ...sx,
        }}
      >
        <WhatsAppIcon />
      </Fab>

      {/* Dialog del Chatbot */}
      <Dialog
        open={openChatbot}
        onClose={handleCloseChatbot}
        TransitionComponent={Transition}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            overflow: 'hidden',
            position: 'fixed',
            bottom: { xs: 20, sm: 100 },
            right: { xs: 20, sm: 30 },
            top: 'auto',
            left: 'auto',
            margin: 0,
            maxWidth: { xs: '90vw', sm: '400px' },
            maxHeight: '500px',
          }
        }}
        BackdropProps={{
          sx: { backgroundColor: 'transparent' }
        }}
      >
        {/* Header del chatbot */}
        <DialogTitle 
          sx={{ 
            backgroundColor: '#25D366', 
            color: 'white', 
            py: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <WhatsAppIcon sx={{ mr: 1 }} />
            <Typography variant="h6" component="div">
              <strong>Visual Mecánica</strong>
            </Typography>
          </Box>
          <IconButton 
            onClick={handleCloseChatbot}
            sx={{ color: 'white', p: 0.5 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 0 }}>
          {/* Mensaje de bienvenida */}
          <Paper 
            elevation={0}
            sx={{ 
              p: 3, 
              backgroundColor: '#f5f5f5',
              borderRadius: 0
            }}
          >
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#25D366', 
                fontWeight: 'bold',
                mb: 1,
                textAlign: 'center'
              }}
            >
              ¡Hola! Bienvenido a Visual Mecánica
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: 'grey.700',
                textAlign: 'center',
                mb: 2
              }}
            >
              Tienes todas las opciones en nuestra Web.
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'grey.600',
                textAlign: 'center'
              }}
            >
              Cotiza, Agenda o simplemente habla con nosotros.
            </Typography>
          </Paper>

          {/* Opciones del chatbot */}
          <Box sx={{ p: 2 }}>
            {/* Botón Cotizar */}
            <Button
              fullWidth
              variant="outlined"
              startIcon={<RequestQuoteIcon />}
              onClick={handleCotizar}
              sx={{
                mb: 2,
                py: 1.5,
                borderColor: '#7B1FA2',
                color: '#7B1FA2',
                borderRadius: '12px',
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 'medium',
                '&:hover': {
                  borderColor: '#6a1b9a',
                  backgroundColor: 'rgba(123, 31, 162, 0.04)',
                },
                justifyContent: 'flex-start',
                pl: 3
              }}
            >
              Cotizar Servicio
            </Button>

            {/* Botón Agendar */}
            <Button
              fullWidth
              variant="outlined"
              startIcon={<CalendarTodayIcon />}
              component={Link}
              to="/agendar"
              onClick={handleCloseChatbot}
              sx={{
                mb: 2,
                py: 1.5,
                borderColor: '#ff9800',
                color: '#ff9800',
                borderRadius: '12px',
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 'medium',
                '&:hover': {
                  borderColor: '#f57c00',
                  backgroundColor: 'rgba(255, 152, 0, 0.04)',
                },
                justifyContent: 'flex-start',
                pl: 3
              }}
            >
              Agendar Cita
            </Button>

            {/* Botón WhatsApp */}
            <Button
              fullWidth
              variant="contained"
              startIcon={<ChatIcon />}
              onClick={handleWhatsApp}
              sx={{
                py: 1.5,
                backgroundColor: '#25D366',
                borderRadius: '12px',
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 'medium',
                '&:hover': {
                  backgroundColor: '#1ebc59',
                },
                justifyContent: 'flex-start',
                pl: 3,
                boxShadow: '0 2px 8px rgba(37, 211, 102, 0.3)',
              }}
            >
              Hablar por WhatsApp
            </Button>
          </Box>

          {/* Footer del chatbot */}
          <Box 
            sx={{ 
              p: 2, 
              backgroundColor: '#f9f9f9',
              borderTop: '1px solid #e0e0e0'
            }}
          >
            <Typography 
              variant="caption" 
              sx={{ 
                color: 'grey.500',
                textAlign: 'center',
                display: 'block'
              }}
            >
              Estamos aquí para ayudarte 24/7
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default BotonWhatsApp;