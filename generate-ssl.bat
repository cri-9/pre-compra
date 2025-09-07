@echo off
REM Script para generar certificados SSL autofirmados para desarrollo en Windows
REM En producción, usar Let's Encrypt o certificados válidos

set SSL_DIR=nginx\ssl
set DOMAIN=visualmecanica.cl

REM Crear directorio SSL si no existe
if not exist %SSL_DIR% mkdir %SSL_DIR%

REM Generar clave privada
openssl genrsa -out %SSL_DIR%\%DOMAIN%.key 2048

REM Generar solicitud de certificado
openssl req -new -key %SSL_DIR%\%DOMAIN%.key -out %SSL_DIR%\%DOMAIN%.csr -subj "/C=CL/ST=Santiago/L=Santiago/O=Visual Mecanica/OU=IT Department/CN=%DOMAIN%"

REM Generar certificado autofirmado
openssl x509 -req -days 365 -in %SSL_DIR%\%DOMAIN%.csr -signkey %SSL_DIR%\%DOMAIN%.key -out %SSL_DIR%\%DOMAIN%.crt

echo Certificados SSL generados en %SSL_DIR%\
echo NOTA: Estos son certificados autofirmados para desarrollo.
echo Para producción, usar Let's Encrypt o certificados válidos.
pause
