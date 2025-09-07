import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const isProduction = mode === 'production';
  
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
        '@components': resolve(__dirname, './src/components'),
        '@assets': resolve(__dirname, './src/assets'),
        '@styles': resolve(__dirname, './src/Csspersonalizado'),
      },
    },
    server: {
      port: 3001,
      host: '0.0.0.0', // Importante para Docker
      open: false, // No intentar abrir navegador en contenedor
      hmr: !isProduction ? {
        port: 3001,
        host: '0.0.0.0'
      } : false, // Deshabilitar HMR en producción
    },
    build: {
      outDir: 'dist',
      sourcemap: false, // Desactivar sourcemaps en producción para reducir tamaño
      minify: 'esbuild', // Cambiar de terser a esbuild para mejor compatibilidad con Alpine
      chunkSizeWarningLimit: 1600,
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
            'mui-vendor': ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled'],
          },
        },
      },
      // Configuración adicional para evitar problemas en Alpine Linux
      target: 'es2015',
      cssCodeSplit: true,
    },
    // Configurar específicamente para producción
    define: isProduction ? {
      global: 'globalThis',
      __DEV__: false,
      'process.env.NODE_ENV': '"production"'
    } : {},
    esbuild: isProduction ? {
      drop: ['console', 'debugger'], // Remover console.log en producción
    } : {},
  };
});
