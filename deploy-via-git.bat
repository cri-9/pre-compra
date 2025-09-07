@echo off
echo ============================================
echo  DESPLIEGUE VIA GIT AL VPS - VISUALMECANICA
echo ============================================
echo.

set /p VPS_IP="Ingresa la IP de tu VPS: "
set /p VPS_USER="Usuario (normalmente root): "

echo.
echo 1. Subiendo cambios a GitHub...
git add .
git commit -m "Fix: Solucion Vite HMR WebSocket en produccion"
git push origin main

echo.
echo 2. Conectando al VPS y actualizando codigo...
ssh %VPS_USER%@%VPS_IP% "cd /var/www/visualmecanica && git pull origin main"

echo.
echo 3. Reconstruyendo contenedores en el VPS...
ssh %VPS_USER%@%VPS_IP% "cd /var/www/visualmecanica && docker-compose -f docker-compose.prod-final.yml down"
ssh %VPS_USER%@%VPS_IP% "cd /var/www/visualmecanica && docker-compose -f docker-compose.prod-final.yml build --no-cache frontend"
ssh %VPS_USER%@%VPS_IP% "cd /var/www/visualmecanica && docker-compose -f docker-compose.prod-final.yml up -d"

echo.
echo 4. Verificando servicios...
ssh %VPS_USER%@%VPS_IP% "cd /var/www/visualmecanica && docker-compose -f docker-compose.prod-final.yml ps"

echo.
echo ============================================
echo  DESPLIEGUE COMPLETADO VIA GIT
echo ============================================
echo.
pause
