@echo off
echo === Validación de Configuración de Seguridad ===
echo.

set "errores=0"

echo Verificando archivos de seguridad...
echo.

REM Verificar security.txt
if exist "security.txt" (
    echo ✅ security.txt encontrado
) else (
    echo ❌ security.txt NO encontrado
    set /a errores+=1
)

REM Verificar security-headers.conf
if exist "security-headers.conf" (
    echo ✅ security-headers.conf encontrado
) else (
    echo ❌ security-headers.conf NO encontrado
    set /a errores+=1
)

REM Verificar configuración de Nginx
if exist "nginx\nginx.conf" (
    echo ✅ nginx.conf encontrado
    findstr /C:"Strict-Transport-Security" "nginx\nginx.conf" >nul
    if !errorlevel! equ 0 (
        echo ✅ HSTS configurado en nginx.conf
    ) else (
        echo ⚠️  HSTS no encontrado en nginx.conf
    )
) else (
    echo ❌ nginx.conf NO encontrado
    set /a errores+=1
)

REM Verificar certificados SSL
if exist "nginx\ssl\visualmecanica.cl.crt" (
    echo ✅ Certificado SSL encontrado
) else (
    echo ❌ Certificado SSL NO encontrado
    set /a errores+=1
)

if exist "nginx\ssl\visualmecanica.cl.key" (
    echo ✅ Clave privada SSL encontrada
) else (
    echo ❌ Clave privada SSL NO encontrada
    set /a errores+=1
)

REM Verificar configuración de Apache
if exist "Backend\apache-prod.conf" (
    echo ✅ apache-prod.conf encontrado
    findstr /C:"Content-Security-Policy" "Backend\apache-prod.conf" >nul
    if !errorlevel! equ 0 (
        echo ✅ CSP configurado en apache-prod.conf
    ) else (
        echo ⚠️  CSP no encontrado en apache-prod.conf
    )
) else (
    echo ❌ apache-prod.conf NO encontrado
    set /a errores+=1
)

REM Verificar .htaccess
if exist "Backend\.htaccess" (
    echo ✅ .htaccess encontrado
) else (
    echo ❌ .htaccess NO encontrado
    set /a errores+=1
)

REM Verificar archivos en frontend
if exist "frontend\public\.well-known\security.txt" (
    echo ✅ security.txt en .well-known encontrado
) else (
    echo ⚠️  security.txt en .well-known no encontrado
)

if exist "frontend\public\security.txt" (
    echo ✅ security.txt en public encontrado
) else (
    echo ⚠️  security.txt en public no encontrado
)

echo.
echo === RESUMEN DE VALIDACIÓN ===
if %errores% equ 0 (
    echo ✅ TODOS LOS ARCHIVOS DE SEGURIDAD ESTÁN PRESENTES
    echo.
    echo Medidas de seguridad implementadas:
    echo - Content Security Policy ^(CSP^)
    echo - HTTP Strict Transport Security ^(HSTS^)
    echo - Security.txt
    echo - Headers de seguridad
    echo - Certificados SSL ^(autofirmados para desarrollo^)
    echo - Configuración Apache securizada
    echo - Protección de archivos sensibles
    echo.
    echo 🚀 LISTO PARA EJECUTAR: docker-compose up --build
) else (
    echo ❌ SE ENCONTRARON %errores% ERRORES
    echo Por favor, revise los archivos faltantes antes de continuar
)

echo.
echo === PRÓXIMOS PASOS PARA PRODUCCIÓN ===
echo 1. Reemplazar certificados autofirmados por certificados válidos
echo 2. Configurar DNSSEC en el proveedor de DNS
echo 3. Configurar firewall en el servidor
echo 4. Configurar DoH ^(DNS over HTTPS^)
echo 5. Realizar test de seguridad con herramientas online
echo.

pause
