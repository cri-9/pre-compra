// Configuración de URLs de la API
const API_CONFIG = {
  // URL base del backend en Docker
  BASE_URL: 'http://localhost:8080',
  
  // Endpoints específicos
  ENDPOINTS: {
    ENVIAR_COTIZACION: '/enviarCotizacion.php',
    VERIFICAR_BLOQUE: '/verificarBloque_ultra.php',
    WEBPAY: '/webpay.php',
    WEBPAY_RESPUESTA: '/webpayRespuesta.php',
    NOTIFICAR_TRANSFERENCIA: '/notificarTransferencia.php'
  }
};

// Función helper para construir URLs completas
export const buildApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// URLs específicas para fácil uso
export const API_URLS = {
  ENVIAR_COTIZACION: buildApiUrl(API_CONFIG.ENDPOINTS.ENVIAR_COTIZACION),
  VERIFICAR_BLOQUE: buildApiUrl(API_CONFIG.ENDPOINTS.VERIFICAR_BLOQUE),
  WEBPAY: buildApiUrl(API_CONFIG.ENDPOINTS.WEBPAY),
  WEBPAY_RESPUESTA: buildApiUrl(API_CONFIG.ENDPOINTS.WEBPAY_RESPUESTA),
  NOTIFICAR_TRANSFERENCIA: buildApiUrl(API_CONFIG.ENDPOINTS.NOTIFICAR_TRANSFERENCIA)
};

export default API_CONFIG;
