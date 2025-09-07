import React, { useState } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { FaFacebookF, FaTiktok, FaGoogle, FaInstagram, FaGithub, FaHome, FaEnvelope, FaPhone, FaWhatsapp, FaYoutube } from 'react-icons/fa';
import logo from '../assets/Logo_Footer/logo_form_ico (1).png';
import { API_CONFIG } from '../config/api';

// Footer component css submit
import "../Csspersonalizado/subcri_footer.css"
function Footer() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setSnackbar({ open: true, message: 'Por favor ingresa un email válido', severity: 'error' });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/suscripcion.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() })
      });

      const data = await response.json();

      if (data.success) {
        setSnackbar({ open: true, message: data.message || '¡Gracias por suscribirte!', severity: 'success' });
        setEmail(''); // Limpiar el formulario
      } else {
        setSnackbar({ open: true, message: data.error || 'Error al procesar la suscripción', severity: 'error' });
      }
    } catch (error) {
      console.error('Error al enviar suscripción:', error);
      setSnackbar({ open: true, message: 'Error de conexión. Intenta nuevamente.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };
  return (
    <Box sx={{ 
      width: '100%', 
      backgroundColor: '#DBD6E1', 
      overflow: 'hidden',
      boxSizing: 'border-box'
    }}>
      <Grid container direction="column" alignItems="center" spacing={2} sx={{ width: '100%', margin: 0 }}>
        {/* Logo */}
  <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', pt: { xs: 3, sm: 4, md: 5 } }}>
          <img
            src={logo}
            alt="Logo"
            style={{ height: '100px', margin: '5px', imageRendering: 'crisp-edges', border: 'none' }}
          />
        </Grid>
        {/* Contenido principal (las columnas) */}
        <Grid item xs={12} sx={{ width: '100%' }}>
          <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 }, width: '100%', boxSizing: 'border-box' }}>
            <Grid container spacing={{ xs: 3, sm: 4, md: 6 }} sx={{ width: '100%', margin: 0 }}>
              {/* Visual&Mecanica */}
              <Grid item xs={12} sm={6} md={3} sx={{ textAlign: { xs: 'center', md: 'left', lg: 'left' }, mb: { xs: 2, md: 0 } }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom color="#424242" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' } }}>
                  Visual&Mecanica
                </Typography>
                <Typography align="justify" variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' }, lineHeight: { xs: 1.4, sm: 1.5 } }}>
                  El primer servicio pre-compra automotriz a domicilio en la Novena Región, brindando confianza y calidad a nuestros clientes. No pierdas dinero y asegura tu inversión.
                </Typography>
              </Grid>
              {/* Productos */}
              <Grid item xs={12} sm={6} md={3} sx={{ textAlign: { xs: 'center', md: 'left', lg: 'left' }, mb: { xs: 2, md: 0 }, pl: { xs: 0, md: 2 } }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom color="#424242" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' } }}>
                  Productos
                </Typography>
                <Box sx={{ '& > *': { mb: 0.5 } }}>
                  <Typography variant="body2" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}><Link href="#" color="text.secondary" underline="hover">Inicio</Link></Typography>
                  <Typography variant="body2" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}><Link href="#about" color="text.secondary" underline="hover">Quienes Somos</Link></Typography>
                  <Typography variant="body2" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}><Link href="#nuestro-servicio" color="text.secondary" underline="hover">Nuestro Servicio</Link></Typography>
                  <Typography variant="body2" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}><Link href="#nuestras-herramientas" color="text.secondary" underline="hover">Nuestras Herramientas</Link></Typography>
                  <Typography variant="body2" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}><Link href="#valor-servicios" color="text.secondary" underline="hover">Valores</Link></Typography>
                </Box>
              </Grid>
              {/* Contacto */}
              <Grid item xs={12} sm={6} md={3} sx={{ textAlign: { xs: 'center', md: 'left', lg: 'left' }, mb: { xs: 2, md: 0 } }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom color="#424242" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' } }}>
                  Contacto
                </Typography>
                <Box sx={{ '& > *': { mb: 1 } }}>
                  <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', md: 'flex-start' }, fontSize: { xs: '0.8rem', sm: '0.875rem' }, flexWrap: 'wrap' }}><FaHome style={{ marginRight: '8px', flexShrink: 0 }} /> Ramon Freire, Temuco.</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', md: 'flex-start' }, fontSize: { xs: '0.7rem', sm: '0.8rem' }, flexWrap: 'wrap', wordBreak: 'break-all' }}><FaEnvelope style={{ marginRight: '8px', flexShrink: 0 }} /> contacto@visualmecanica.cl</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', md: 'flex-start' }, fontSize: { xs: '0.7rem', sm: '0.8rem' }, flexWrap: 'wrap', wordBreak: 'break-all' }}><FaEnvelope style={{ marginRight: '8px', flexShrink: 0 }} /> cotizacion@visualmecanica.cl</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', md: 'flex-start' }, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}><FaPhone style={{ marginRight: '8px', flexShrink: 0 }} /> + 56-97541042</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', md: 'flex-start' }, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}><FaWhatsapp style={{ marginRight: '8px', flexShrink: 0 }} /> + 56-997541042</Typography>
                </Box>
              </Grid>
              {/* Síguenos y suscripción */}
              <Grid item xs={12} sm={6} md={3} sx={{ 
                textAlign: { xs: 'center', md: 'left' }, 
                mb: { xs: 2, md: 0 }, 
                position: 'relative', 
                pl: { xs: 0, sm: 4, md: 2 }, 
                mt: { xs: 6, sm: 0, md: -1 }, 
                maxWidth: '100%',
                overflow: 'hidden',
                '&::before': { 
                  content: '""', 
                  position: 'absolute', 
                  left: '8px', 
                  top: '25px', 
                  bottom: '20px', 
                  width: '1px', 
                  backgroundColor: '#444746', 
                  opacity: 0.5, 
                  display: { xs: 'none', md: 'block' } 
                } 
              }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom color="#424242" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' } }}>
                  Síguenos
                </Typography>
                <Box sx={{ display: 'flex', mt: 1, justifyContent: { xs: 'center', sm: 'flex-start' }, flexWrap: 'wrap', gap: 1 }}>
                  <Link href="https://www.facebook.com/profile.php?id=61579055617312" 
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ color: '#1976D2', fontSize: { xs: '1.2rem', sm: '1rem' } }}>
                    <FaFacebookF />
                  </Link>
                  <Link 
                  href="https://www.instagram.com/precompravisualmecanica/"
                  target="_blank"
                  rel="noopener noreferrer" 
                  sx={{ color: '#AC3083', fontSize: { xs: '1.2rem', sm: '1rem' } }}>
                    <FaInstagram />
                    </Link>
                  <Link
                  href="https://www.tiktok.com/@visualmecanica"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ color: '#000000', fontSize: { xs: '1.2rem', sm: '1rem' } }}
                >
                <FaTiktok />
                </Link>
                 <Link
                  href="https://wa.me/56997541042"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ color: '#25D366', fontSize: { xs: '1.2rem', sm: '1rem' } }}
                  >
                  <FaWhatsapp />
                </Link>
                <Link
                  href="https://www.youtube.com/@VisualMecánica"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ color: '#d92226', fontSize: { xs: '1.2rem', sm: '1rem' } }}
                >
                <FaYoutube />
                </Link>                 
                </Box>
                {/* Formulario de suscripción debajo de Síguenos */}
                <Box sx={{ 
                  marginTop: 2.5, 
                  display: 'flex', 
                  justifyContent: 'center',
                  maxWidth: '100%',
                  overflow: 'hidden',                  
                }}>
                  <form className="subscribe" onSubmit={handleSubmit}>
                    <p>SUBSCRIBETE</p>
                    <input 
                      placeholder="Tu correo electrónico" 
                      className="subscribe-input" 
                      name="email" 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required 
                      disabled={loading}
                    />
                    <br />
                    <button 
                      type="submit" 
                      className="submit-btn"
                      disabled={loading}
                    >
                      {loading ? 'ENVIANDO...' : 'ENVIAR'}
                    </button>
                  </form>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Grid>
        {/* Divider */}
        <Grid item xs={12} sx={{ width: '100%' }}>
          <Divider sx={{ my: 4 }} />
        </Grid>
        {/* Copyright */}
        <Grid item xs={12} sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', pb: { xs: 3, sm: 2 } }}>
          <Typography variant="body2" fontWeight="bold" gutterBottom color="#424242" sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' }, textAlign: 'center' }}>
            © 2025 Copyright: <Link href="https://visualmecanica.cl/" color="inherit" underline="hover">Visual Mecánica</Link>
          </Typography>
        </Grid>
      </Grid>
      
      {/* Snackbar para notificaciones */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Footer;

