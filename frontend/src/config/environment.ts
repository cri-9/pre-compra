const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  webPayEnabled: import.meta.env.VITE_WEBPAY_ENABLED === 'true',
};

export default config;
