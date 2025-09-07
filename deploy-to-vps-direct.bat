@echo off
echo ============================================
echo  DESPLIEGUE DIRECTO AL VPS - VISUALMECANICA
echo ============================================
echo.

set /p VPS_IP="Ingresa la IP de tu VPS: "
set /p VPS_USER="Usuario (normalmente root): "

echo.
echo 1. Copiando archivos al VPS via SCP...
echo.

REM Copiar archivos modificados
scp -r ./frontend/vite.config.ts %VPS_USER%@%VPS_IP%:/var/www/visualmecanica/frontend/
scp -r ./frontend/index.html %VPS_USER%@%VPS_IP%:/var/www/visualmecanica/frontend/
scp -r ./frontend/Dockerfile.prod %VPS_USER%@%VPS_IP%:/var/www/visualmecanica/frontend/
scp -r ./docker-compose.prod-final.yml %VPS_USER%@%VPS_IP%:/var/www/visualmecanica/

echo.
echo 2. Conectando al VPS y reconstruyendo contenedores...
echo.

REM Conectar via SSH y ejecutar comandos
ssh %VPS_USER%@%VPS_IP% "cd /var/www/visualmecanica && docker-compose -f docker-compose.prod-final.yml down"
ssh %VPS_USER%@%VPS_IP% "cd /var/www/visualmecanica && docker-compose -f docker-compose.prod-final.yml build --no-cache frontend"
ssh %VPS_USER%@%VPS_IP% "cd /var/www/visualmecanica && docker-compose -f docker-compose.prod-final.yml up -d"

echo.
echo 3. Verificando estado de servicios...
ssh %VPS_USER%@%VPS_IP% "cd /var/www/visualmecanica && docker-compose -f docker-compose.prod-final.yml ps"

echo.
echo ============================================
echo  DESPLIEGUE COMPLETADO
echo ============================================
echo.
echo Verifica tu sitio en: https://visualmecanica.cl
pause
