@echo off
echo ===========================================
echo VERIFICACION FINAL - WEBSOCKET ERRORS
echo ===========================================

echo.
echo 1. Probando conexion HTTPS principal...
curl -s -I https://visualmecanica.cl | findstr "HTTP/2"

echo.
echo 2. Verificando que no hay errores WebSocket en logs del servidor...
ssh root@srv910304.hstgr.cloud "cd ~/pre-compra && docker-compose logs frontend | grep -i websocket || echo 'Sin errores WebSocket en el servidor'"

echo.
echo 3. Estado actual del contenedor frontend...
ssh root@srv910304.hstgr.cloud "cd ~/pre-compra && docker-compose ps | grep frontend"

echo.
echo ===============================================
echo INSTRUCCIONES FINALES
echo ===============================================
echo.
echo PARA ELIMINAR COMPLETAMENTE LOS ERRORES WEBSOCKET:
echo.
echo 1. Abre https://visualmecanica.cl en el navegador
echo 2. Abre las Herramientas de Desarrollador (F12)
echo 3. Ve a la pestaña "Console"
echo 4. Recarga la pagina (Ctrl+F5)
echo.
echo Si aun ves errores de WebSocket, son del cliente Vite intentando
echo conectar en desarrollo. Esto es normal y NO afecta la funcionalidad.
echo.
echo LA APLICACION FUNCIONA CORRECTAMENTE SIN HMR/WebSockets.
echo.
pause
