// Deshabilitar completamente Vite HMR en producción
(function() {
  'use strict';
  
  // Deshabilitar variables de entorno de desarrollo
  if (typeof process !== 'undefined' && process.env) {
    process.env.NODE_ENV = 'production';
  }
  
  // Sobrescribir WebSocket para evitar conexiones HMR
  if (typeof WebSocket !== 'undefined') {
    const OriginalWebSocket = WebSocket;
    window.WebSocket = function(url, protocols) {
      // Bloquear conexiones WebSocket de Vite/HMR
      if (typeof url === 'string' && (
          url.includes('localhost:3001') || 
          url.includes('@vite/client') ||
          url.includes('__vite_ping')
      )) {
        console.warn('Vite HMR WebSocket bloqueado en producción:', url);
        // Crear un WebSocket falso que no se conecte
        const fakeSocket = {
          readyState: WebSocket.CLOSED,
          close: function() {},
          send: function() {},
          addEventListener: function() {},
          removeEventListener: function() {},
          dispatchEvent: function() { return false; }
        };
        return fakeSocket;
      }
      // Permitir otras conexiones WebSocket normales
      return new OriginalWebSocket(url, protocols);
    };
    // Copiar propiedades estáticas
    Object.setPrototypeOf(window.WebSocket, OriginalWebSocket);
    Object.defineProperty(window.WebSocket, 'CONNECTING', { value: 0 });
    Object.defineProperty(window.WebSocket, 'OPEN', { value: 1 });
    Object.defineProperty(window.WebSocket, 'CLOSING', { value: 2 });
    Object.defineProperty(window.WebSocket, 'CLOSED', { value: 3 });
  }
  
  // Limpiar referencias de Vite
  document.addEventListener('DOMContentLoaded', function() {
    if (window.__vite_plugin_react_preamble_installed__) {
      delete window.__vite_plugin_react_preamble_installed__;
    }
    if (window.__VITE_HMR_RUNTIME__) {
      delete window.__VITE_HMR_RUNTIME__;
    }
    if (window.__vite__) {
      delete window.__vite__;
    }
  });
  
  // Sobrescribir console.warn para filtrar advertencias de Vite en producción
  const originalWarn = console.warn;
  console.warn = function(...args) {
    const message = args.join(' ');
    if (message.includes('vite') || 
        message.includes('websocket') || 
        message.includes('HMR') ||
        message.includes('localhost:3001')) {
      return; // Silenciar advertencias de Vite en producción
    }
    return originalWarn.apply(console, args);
  };
})();
