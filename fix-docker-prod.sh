#!/bin/bash

# Script para solucionar problemas de Docker Compose en producción
# Ejecutar con: bash fix-docker-prod.sh

echo "🔧 Solucionando problemas de Docker Compose en producción..."

# 1. Detener todos los contenedores relacionados
echo "📦 Deteniendo contenedores existentes..."
docker-compose -f docker-compose.prod.yml down --remove-orphans

# 2. Limpiar contenedores huérfanos y redes
echo "🧹 Limpiando contenedores huérfanos..."
docker container prune -f
docker network prune -f

# 3. Eliminar contenedores específicos si existen
echo "🗑️ Eliminando contenedores específicos..."
docker rm -f visualmecanica-frontend-prod 2>/dev/null || true
docker rm -f visualmecanica-backend-prod 2>/dev/null || true
docker rm -f visualmecanica-database-prod 2>/dev/null || true

# 4. Limpiar imágenes no utilizadas
echo "🖼️ Limpiando imágenes no utilizadas..."
docker image prune -f

# 5. Eliminar volúmenes huérfanos (cuidado con los datos)
echo "💾 Limpiando volúmenes huérfanos..."
docker volume prune -f

# 6. Reconstruir y levantar los servicios
echo "🚀 Reconstruyendo y levantando servicios..."
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d

# 7. Mostrar estado de los contenedores
echo "📊 Estado de los contenedores:"
docker-compose -f docker-compose.prod.yml ps

echo "✅ Proceso completado!"