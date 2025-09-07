@echo off
echo === Preparando archivos para transferir al VPS ===
echo.

REM Crear directorio temporal para organizar archivos
if not exist "vps-upload" mkdir "vps-upload"

echo Copiando archivos de seguridad...
copy "security-headers.conf" "vps-upload\" >nul 2>&1
copy "security.txt" "vps-upload\" >nul 2>&1
copy "SEGURIDAD.md" "vps-upload\" >nul 2>&1
copy "INFORME_SEGURIDAD.md" "vps-upload\" >nul 2>&1
copy "setup-security.sh" "vps-upload\" >nul 2>&1
copy "generate-ssl.sh" "vps-upload\" >nul 2>&1

echo Copiando configuraciones modificadas...
if not exist "vps-upload\nginx" mkdir "vps-upload\nginx"
copy "nginx\nginx.conf" "vps-upload\nginx\" >nul 2>&1

if not exist "vps-upload\Backend" mkdir "vps-upload\Backend"
copy "Backend\apache-prod.conf" "vps-upload\Backend\" >nul 2>&1
copy "Backend\.htaccess" "vps-upload\Backend\" >nul 2>&1

copy "backend.Dockerfile" "vps-upload\" >nul 2>&1
copy "docker-compose.yml" "vps-upload\" >nul 2>&1

echo Copiando certificados SSL...
if not exist "vps-upload\nginx\ssl" mkdir "vps-upload\nginx\ssl"
copy "nginx\ssl\visualmecanica.cl.crt" "vps-upload\nginx\ssl\" >nul 2>&1
copy "nginx\ssl\visualmecanica.cl.key" "vps-upload\nginx\ssl\" >nul 2>&1

echo Copiando archivos del frontend...
if not exist "vps-upload\frontend\public\.well-known" mkdir "vps-upload\frontend\public\.well-known"
copy "frontend\public\.well-known\security.txt" "vps-upload\frontend\public\.well-known\" >nul 2>&1
copy "frontend\public\security.txt" "vps-upload\frontend\public\" >nul 2>&1

echo.
echo ✅ Archivos preparados en la carpeta 'vps-upload'
echo.
echo === ARCHIVOS LISTOS PARA SFTP ===

echo.
echo 📁 Estructura de archivos para el VPS:
tree /F vps-upload 2>nul || dir /S /B vps-upload

echo.
echo === COMANDOS SFTP SUGERIDOS ===
echo.
echo 1. Conectar al VPS:
echo    sftp usuario@tu-vps-ip
echo.
echo 2. Navegar al proyecto:
echo    cd /ruta/del/proyecto/
echo.
echo 3. Transferir archivos principales:
echo    put vps-upload/security-headers.conf
echo    put vps-upload/security.txt
echo    put vps-upload/SEGURIDAD.md
echo    put vps-upload/INFORME_SEGURIDAD.md
echo    put vps-upload/setup-security.sh
echo    put vps-upload/generate-ssl.sh
echo    put vps-upload/backend.Dockerfile
echo    put vps-upload/docker-compose.yml
echo.
echo 4. Transferir configuraciones:
echo    put vps-upload/nginx/nginx.conf nginx/
echo    put vps-upload/Backend/apache-prod.conf Backend/
echo    put vps-upload/Backend/.htaccess Backend/
echo.
echo 5. Transferir certificados SSL:
echo    mkdir nginx/ssl
echo    put vps-upload/nginx/ssl/visualmecanica.cl.crt nginx/ssl/
echo    put vps-upload/nginx/ssl/visualmecanica.cl.key nginx/ssl/
echo.
echo 6. Transferir archivos del frontend:
echo    mkdir -p frontend/public/.well-known
echo    put vps-upload/frontend/public/.well-known/security.txt frontend/public/.well-known/
echo    put vps-upload/frontend/public/security.txt frontend/public/
echo.
echo ⚠️  RECORDATORIO: En el VPS ejecutar después de la transferencia:
echo    chmod +x *.sh
echo    ./setup-security.sh
echo    sudo certbot --nginx -d visualmecanica.cl -d www.visualmecanica.cl
echo    docker-compose up -d --build
echo.

pause
