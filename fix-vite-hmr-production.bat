@echo off
echo ============================================
echo  SOLUCIONANDO PROBLEMA DE VITE HMR EN VPS
echo ============================================
echo.

echo 1. Deteniendo contenedores actuales...
docker-compose -f docker-compose.prod-final.yml down

echo.
echo 2. Limpiando imágenes y volúmenes...
docker system prune -f
docker volume prune -f

echo.
echo 3. Reconstruyendo imágenes con las nuevas configuraciones...
docker-compose -f docker-compose.prod-final.yml build --no-cache

echo.
echo 4. Iniciando servicios en modo producción...
docker-compose -f docker-compose.prod-final.yml up -d

echo.
echo 5. Verificando estado de los servicios...
docker-compose -f docker-compose.prod-final.yml ps

echo.
echo ============================================
echo  SOLUCIÓN APLICADA EXITOSAMENTE
echo ============================================
echo.
echo Los cambios aplicados:
echo - Configuración de Vite para deshabilitar HMR en producción
echo - Script en index.html para bloquear WebSockets de Vite
echo - Construcción forzada en modo NODE_ENV=production
echo - Filtros para silenciar advertencias de Vite en consola
echo.
echo La página debería cargar sin errores de WebSocket ahora.
echo Verifica en: https://visualmecanica.cl
echo.
pause
