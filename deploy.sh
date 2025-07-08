#!/bin/bash

# Script para desplegar en producción

echo "🚀 Iniciando despliegue en producción..."

# Verificar que estamos en el directorio correcto
if [ ! -f "docker-compose.prod.yml" ]; then
    echo "❌ Error: No se encontró docker-compose.prod.yml"
    exit 1
fi

# Detener contenedores existentes
echo "🛑 Deteniendo contenedores existentes..."
docker-compose -f docker-compose.prod.yml down

# Eliminar imágenes antiguas (opcional)
echo "🗑️ Limpiando imágenes antiguas..."
docker system prune -f

# Construir nuevas imágenes
echo "🔨 Construyendo imágenes..."
docker-compose -f docker-compose.prod.yml build --no-cache

# Iniciar servicios
echo "🚀 Iniciando servicios..."
docker-compose -f docker-compose.prod.yml up -d

# Verificar que los servicios están corriendo
echo "✅ Verificando servicios..."
docker-compose -f docker-compose.prod.yml ps

# Esperar a que los servicios estén listos
echo "⏳ Esperando a que los servicios estén listos..."
sleep 30

# Verificar conectividad
echo "🔍 Verificando conectividad..."
curl -f http://localhost:80 || echo "⚠️ Frontend no responde"
curl -f http://localhost:8080 || echo "⚠️ Backend no responde"

echo "✅ Despliegue completado"
echo "🌐 Sitio disponible en: http://localhost"
echo "🔧 API disponible en: http://localhost:8080"
