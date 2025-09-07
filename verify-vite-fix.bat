@echo off
echo ============================================
echo  VERIFICANDO SOLUCIÓN VITE HMR
echo ============================================
echo.

echo 1. Verificando estado de contenedores...
docker-compose -f docker-compose.prod-final.yml ps

echo.
echo 2. Verificando logs del frontend...
echo "--- Últimos logs del frontend ---"
docker-compose -f docker-compose.prod-final.yml logs --tail=20 frontend

echo.
echo 3. Verificando que nginx esté sirviendo archivos correctamente...
echo "--- Últimos logs de nginx ---"
docker-compose -f docker-compose.prod-final.yml logs --tail=10 nginx

echo.
echo 4. Verificando conectividad...
curl -I http://localhost
echo.
curl -I http://localhost:3001

echo.
echo ============================================
echo  INSTRUCCIONES PARA VERIFICAR EN NAVEGADOR
echo ============================================
echo.
echo 1. Abre https://visualmecanica.cl en tu navegador
echo 2. Abre las Herramientas de Desarrollador (F12)
echo 3. Ve a la pestaña Console
echo 4. Recarga la página (Ctrl+F5)
echo 5. Verifica que NO aparezcan errores de WebSocket de Vite
echo.
echo Si aún aparecen errores:
echo - Limpia caché del navegador (Ctrl+Shift+R)
echo - Verifica que el archivo index.html tenga el script anti-HMR
echo - Ejecuta: docker-compose -f docker-compose.prod-final.yml logs frontend
echo.
pause
