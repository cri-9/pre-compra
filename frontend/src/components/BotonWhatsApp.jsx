import { Fab } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

function BotonWhatsApp({ numeroTelefono, mensajeInicial }) {
  return (
    <Fab
      href={`https://wa.me/${numeroTelefono}?text=${encodeURIComponent(mensajeInicial)}`}
      target="_blank"
      rel="noopener noreferrer"
      color="success"
      sx={{ position: 'fixed', bottom: 16, right: 16 }}
    >
      <WhatsAppIcon />
    </Fab>
  );
}

export default BotonWhatsApp;