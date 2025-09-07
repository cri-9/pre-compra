@echo off
echo ===========================================
echo SUBIENDO CONFIGURACION DEFINITIVA VITE
echo ===========================================

echo.
echo 1. Copiando vite.config.js actualizado...
scp frontend\vite.config.js root@srv910304.hstgr.cloud:~/pre-compra/frontend/

echo.
echo 2. Copiando archivo disable-hmr.js...
scp frontend\src\disable-hmr.js root@srv910304.hstgr.cloud:~/pre-compra/frontend/src/

echo.
echo 3. Reiniciando contenedor frontend...
ssh root@srv910304.hstgr.cloud "cd ~/pre-compra && docker-compose restart vite-frontend-new"

echo.
echo 4. Verificando que no hay errores WebSocket...
ssh root@srv910304.hstgr.cloud "cd ~/pre-compra && docker-compose logs --tail=20 vite-frontend-new"

echo.
echo ===============================================
echo CONFIGURACION VITE COMPLETADA
echo ===============================================
echo.
echo PASOS FINALES:
echo 1. Abrir https://visualmecanica.cl
echo 2. Verificar que no hay errores WebSocket en consola
echo 3. Comprobar que la aplicacion funciona normalmente
echo.
pause
