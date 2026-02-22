// Detectar automáticamente el entorno
const isDevelopment = window.location.hostname === 'localhost' || 
                      window.location.hostname === '127.0.0.1';

// Configuración de URLs de la API
const API_CONFIG = {
  // URL base siempre vacía - usa rutas relativas
  // En desarrollo: el proxy de Vite redirecciona /api a https://visualmecanica.cl/api
  // En producción: las rutas relativas se resuelven naturalmente al mismo dominio
  BASE_URL: '',
  
  // Endpoints siempre usan /api/router.php
  ENDPOINTS: {
    ENVIAR_COTIZACION: '/api/router.php',
    VERIFICAR_BLOQUE: '/api/router.php',
    WEBPAY: '/api/router.php',
    WEBPAY_RESPUESTA: '/api/router.php',
    NOTIFICAR_TRANSFERENCIA: '/api/router.php',
    SUSCRIPCION: '/api/router.php'
  }
};

// Construir URL completa
export const buildApiUrl = (endpoint, params = {}) => {
  let url = `${API_CONFIG.BASE_URL}${endpoint}`;
  
  // Agregar parámetros a la URL si existen
  const queryParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    queryParams.append(key, value);
  }
  
  const queryString = queryParams.toString();
  if (queryString) {
    url += (url.includes('?') ? '&' : '?') + queryString;
  }
  
  return url;
};

// URLs específicas
export const API_URLS = {
  ENVIAR_COTIZACION: buildApiUrl(API_CONFIG.ENDPOINTS.ENVIAR_COTIZACION, { ruta: 'enviarCotizacion' }),
  VERIFICAR_BLOQUE: buildApiUrl(API_CONFIG.ENDPOINTS.VERIFICAR_BLOQUE, { ruta: 'verificarBloque' }),
  WEBPAY: buildApiUrl(API_CONFIG.ENDPOINTS.WEBPAY, { ruta: 'webpay' }),
  WEBPAY_RESPUESTA: buildApiUrl(API_CONFIG.ENDPOINTS.WEBPAY_RESPUESTA, { ruta: 'webpayRespuesta' }),
  NOTIFICAR_TRANSFERENCIA: buildApiUrl(API_CONFIG.ENDPOINTS.NOTIFICAR_TRANSFERENCIA, { ruta: 'notificarTransferencia' }),
  SUSCRIPCION: buildApiUrl(API_CONFIG.ENDPOINTS.SUSCRIPCION, { ruta: 'suscripcion' })
};

export default API_CONFIG;
export { API_CONFIG };

