// ImagePopup.jsx
import CloseIcon from '@mui/icons-material/Close';
import { Box, IconButton, Modal } from '@mui/material';
import { useEffect, useState } from 'react';

// Imagen activa desde el 02 de julio 2026
import regresoImg from '../assets/ImagenPopup/regreso.webp';
// img_popup_1, img_popup_2, img_popup_3, img_popup_4 deshabilitadas temporalmente

import '../Csspersonalizado/ImagePopup.css';

const ImagePopup = () => {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    // Cierre automático a los 20 segundos
    const timer = setTimeout(() => {
      setOpen(false);
    }, 20000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => setOpen(false);

  return (
    <Modal open={open} onClose={handleClose}>
      <Box className="popup-container">
        <IconButton
          aria-label="Close"
          onClick={handleClose}
          className="close-button"
        >
          <CloseIcon />
        </IconButton>
        <img src={regresoImg} alt="Estamos de regreso" className="popup-image" />
      </Box>
    </Modal>
  );
};

export default ImagePopup;
