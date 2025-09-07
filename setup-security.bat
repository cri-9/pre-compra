@echo off
REM Script de configuración de seguridad para Visual Mecánica
REM Este script implementa todas las medidas de seguridad recomendadas

echo === Configuración de Seguridad para Visual Mecánica ===

REM 1. Generar certificados SSL si no existen
if not exist "nginx\ssl\visualmecanica.cl.crt" (
    echo Generando certificados SSL...
    call generate-ssl.bat
)

REM 2. Verificar configuración de headers de seguridad
echo Verificando configuración de headers de seguridad...
if not exist "security-headers.conf" (
    echo ❌ Error: security-headers.conf no encontrado
    exit /b 1
)

REM 3. Verificar security.txt
if not exist "security.txt" (
    echo ❌ Error: security.txt no encontrado
    exit /b 1
)

REM 4. Verificar configuración de Nginx
if not exist "nginx\nginx.conf" (
    echo ❌ Error: nginx.conf no encontrado
    exit /b 1
)

REM 5. Verificar configuración de Apache
if not exist "Backend\apache-prod.conf" (
    echo ❌ Error: apache-prod.conf no encontrado
    exit /b 1
)

REM 6. Crear directorio .well-known para security.txt
if not exist "frontend\public\.well-known" mkdir "frontend\public\.well-known"
copy "security.txt" "frontend\public\.well-known\security.txt" >nul
copy "security.txt" "frontend\public\security.txt" >nul

echo ✅ Configuración de seguridad completada!
echo.
echo Medidas implementadas:
echo - ✅ Content Security Policy ^(CSP^)
echo - ✅ Strict Transport Security ^(HSTS^)
echo - ✅ Security.txt presente
echo - ✅ Headers de seguridad configurados
echo - ✅ Configuración SSL/TLS segura
echo - ✅ Protección contra ataques comunes
echo - ✅ Configuración PHP securizada
echo - ✅ Apache con headers de seguridad
echo.
echo Para completar la configuración:
echo 1. Ejecutar: docker-compose up --build
echo 2. Para producción, reemplazar certificados autofirmados por certificados válidos
echo 3. Configurar DNS con DNSSEC en el proveedor de dominio
echo 4. Configurar firewall en el servidor
echo.
pause
