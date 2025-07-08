@echo off
echo 🚀 Iniciando despliegue en producción...

REM Verificar que estamos en el directorio correcto
if not exist "docker-compose.prod.yml" (
    echo ❌ Error: No se encontró docker-compose.prod.yml
    exit /b 1
)

REM Detener contenedores existentes
echo 🛑 Deteniendo contenedores existentes...
docker-compose -f docker-compose.prod.yml down

REM Eliminar imágenes antiguas (opcional)
echo 🗑️ Limpiando imágenes antiguas...
docker system prune -f

REM Construir nuevas imágenes
echo 🔨 Construyendo imágenes...
docker-compose -f docker-compose.prod.yml build --no-cache

REM Iniciar servicios
echo 🚀 Iniciando servicios...
docker-compose -f docker-compose.prod.yml up -d

REM Verificar que los servicios están corriendo
echo ✅ Verificando servicios...
docker-compose -f docker-compose.prod.yml ps

REM Esperar a que los servicios estén listos
echo ⏳ Esperando a que los servicios estén listos...
timeout /t 30 /nobreak > nul

echo ✅ Despliegue completado
echo 🌐 Sitio disponible en: http://localhost
echo 🔧 API disponible en: http://localhost:8080

pause
