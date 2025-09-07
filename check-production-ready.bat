@echo off
echo ========================================
echo   VERIFICACION PRE-DESPLIEGUE
echo ========================================
echo.

echo [1/6] Verificando archivos criticos...
if exist "Backend\.env.production" (
    echo ✅ Backend\.env.production - OK
) else (
    echo ❌ Backend\.env.production - FALTA
)

if exist "Backend\router.php" (
    echo ✅ Backend\router.php - OK
) else (
    echo ❌ Backend\router.php - FALTA
)

if exist "Backend\notificarTransferencia_simple.php" (
    echo ✅ Backend\notificarTransferencia_simple.php - OK
) else (
    echo ❌ Backend\notificarTransferencia_simple.php - FALTA
)

if exist "Backend\helpers\corsHeaders.php" (
    echo ✅ Backend\helpers\corsHeaders.php - OK
) else (
    echo ❌ Backend\helpers\corsHeaders.php - FALTA
)

if exist "docker-compose.prod.yml" (
    echo ✅ docker-compose.prod.yml - OK
) else (
    echo ❌ docker-compose.prod.yml - FALTA
)

if exist "frontend\src\config\api.js" (
    echo ✅ frontend\src\config\api.js - OK
) else (
    echo ❌ frontend\src\config\api.js - FALTA
)

echo.
echo [2/6] Verificando configuracion de CORS...
findstr /C:"visualmecanica.cl" Backend\router.php >nul
if %errorlevel%==0 (
    echo ✅ CORS configurado para produccion
) else (
    echo ❌ CORS no configurado para produccion
)

echo.
echo [3/6] Verificando configuracion de API...
findstr /C:"isDevelopment" frontend\src\config\api.js >nul
if %errorlevel%==0 (
    echo ✅ API configurada para deteccion automatica
) else (
    echo ❌ API no configurada para deteccion automatica
)

echo.
echo [4/6] Verificando Docker Compose de produccion...
findstr /C:"docker-compose.prod.yml" docker-compose.prod.yml >nul
if %errorlevel%==0 (
    echo ❌ Archivo contiene referencia a si mismo
) else (
    echo ✅ Docker Compose de produccion OK
)

echo.
echo [5/6] Verificando variables de entorno...
findstr /C:"DEV_MODE=false" Backend\.env.production >nul
if %errorlevel%==0 (
    echo ✅ Modo desarrollo deshabilitado en produccion
) else (
    echo ❌ Modo desarrollo no configurado correctamente
)

echo.
echo [6/6] Resumen de archivos a subir...
echo.
echo 📁 ARCHIVOS CRITICOS PARA SFTP:
echo    Backend\router.php
echo    Backend\notificarTransferencia_simple.php
echo    Backend\helpers\corsHeaders.php
echo    Backend\.env.production
echo    frontend\src\config\api.js
echo    docker-compose.prod.yml
echo.
echo 📁 O SUBIR TODA LA CARPETA: pre-compra\
echo.
echo ========================================
echo   VERIFICACION COMPLETADA
echo ========================================
echo.
echo SIGUIENTE PASO:
echo 1. Subir archivos via SFTP a tu VPS
echo 2. Ejecutar: docker-compose -f docker-compose.prod.yml up -d --build
echo.
pause