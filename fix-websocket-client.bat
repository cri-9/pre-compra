@echo off
echo ===============================================
echo SOLUCION RAPIDA - DESHABILITAR WEBSOCKET VITE
echo ===============================================

echo.
echo Alternativa: Modificar el cliente Vite para NO conectar WebSocket
echo.

echo.
echo 1. Creando configuracion que deshabilita completamente HMR...
echo import.meta.env.DEV = false; > disable-vite-client.js
echo document.addEventListener('DOMContentLoaded', function() { >> disable-vite-client.js
echo   if (window.__vite_plugin_react_preamble_installed__) { >> disable-vite-client.js
echo     delete window.__vite_plugin_react_preamble_installed__; >> disable-vite-client.js
echo   } >> disable-vite-client.js
echo }); >> disable-vite-client.js

echo.
echo 2. Subiendo archivo de desactivacion...
scp disable-vite-client.js root@srv910304.hstgr.cloud:~/pre-compra/frontend/public/

echo.
echo 3. Modificando index.html para incluir el script...
ssh root@srv910304.hstgr.cloud "cd ~/pre-compra/frontend && cp public/index.html public/index.html.backup && sed -i '/<\/head>/i\    <script src=\"/disable-vite-client.js\"></script>' public/index.html"

echo.
echo 4. Reiniciando contenedor frontend...
ssh root@srv910304.hstgr.cloud "cd ~/pre-compra && docker-compose restart vite-frontend-new"

echo.
echo 5. Esperando que se inicie...
timeout /t 15 /nobreak >nul

echo.
echo 6. Verificando funcionamiento...
ssh root@srv910304.hstgr.cloud "cd ~/pre-compra && curl -s -I https://visualmecanica.cl | head -5"

echo.
echo ================================================
echo SOLUCION APLICADA
echo ================================================
echo.
echo Ahora el cliente Vite deberia estar desactivado
echo Probar: https://visualmecanica.cl
echo.
pause
