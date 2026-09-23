import react from '@vitejs/plugin-react';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
// https://vitejs.dev/config/
export default defineConfig(function (_a) {
    var command = _a.command, mode = _a.mode;
    var isProduction = mode === 'production';
    return {
        plugins: [
            react({
                jsxImportSource: '@emotion/react',
                babel: {
                    plugins: ['@emotion/babel-plugin'],
                },
            }),
        ],
        resolve: {
            dedupe: ['@emotion/react', '@emotion/styled', '@mui/material', '@mui/system'],
            alias: {
                '@': resolve(__dirname, './src'),
                '@components': resolve(__dirname, './src/components'),
                '@assets': resolve(__dirname, './src/assets'),
                '@styles': resolve(__dirname, './src/Csspersonalizado'),
                '@mui/system/Unstable_Grid': resolve(__dirname, 'node_modules/@mui/material/node_modules/@mui/system/Unstable_Grid'),
            },
        },
        optimizeDeps: {
            include: [
                '@emotion/react',
                '@emotion/styled',
                '@mui/material',
                '@mui/material/Tooltip',
                '@mui/icons-material',
            ],
        },
        server: {
            port: 3001,
            host: '0.0.0.0', // Importante para Docker
            open: false, // No intentar abrir navegador en contenedor
            hmr: !isProduction ? {
                port: 3001,
                host: '0.0.0.0'
            } : false, // Deshabilitar HMR en producción
            proxy: {
                '/api': {
                    target: 'http://localhost:8080',
                    changeOrigin: true,
                    secure: false,
                    rewrite: function (path) { return path.replace(/^\/api/, ''); }
                }
            }
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
