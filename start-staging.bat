@echo off
echo ========================================
echo  VISUAL MECANICA - STAGING CON NGROK
echo ========================================
echo.

REM Verificar si Docker está corriendo
docker ps >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker no está corriendo
    echo Inicia Docker Desktop primero
    pause
    exit /b 1
)

REM Verificar si ngrok está instalado
ngrok version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Ngrok no está instalado
    echo.
    echo Descarga ngrok desde: https://ngrok.com/download
    echo O instala con: choco install ngrok
    pause
    exit /b 1
)

echo 🐳 Iniciando aplicación Docker...
docker-compose -f docker-compose.prod.yml up -d

echo ⏳ Esperando que los servicios estén listos...
timeout /t 15 /nobreak >nul

echo 🌐 Verificando servicios...
curl -f http://localhost:80 >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️ Frontend no responde en puerto 80
    echo Intentando puerto 3000...
    curl -f http://localhost:3000 >nul 2>&1
    if %errorlevel% neq 0 (
        echo ❌ No se puede conectar a la aplicación
        echo Revisa los logs: docker-compose -f docker-compose.prod.yml logs
        pause
        exit /b 1
    )
    set PORT=3000
) else (
    set PORT=80
)

echo ✅ Aplicación lista en puerto %PORT%

echo.
echo 🚀 Iniciando túnel ngrok...
echo 📝 La URL pública aparecerá en unos segundos...
echo 🔍 Panel de control: http://localhost:4040
echo.
echo ⚠️ IMPORTANTE: No cierres esta ventana mientras uses la aplicación
echo.

REM Iniciar ngrok
ngrok http %PORT%
