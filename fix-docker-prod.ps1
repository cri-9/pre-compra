# Script PowerShell para solucionar problemas de Docker Compose en producción
# Ejecutar con: .\fix-docker-prod.ps1

Write-Host "🔧 Solucionando problemas de Docker Compose en producción..." -ForegroundColor Yellow

# 1. Detener todos los contenedores relacionados
Write-Host "📦 Deteniendo contenedores existentes..." -ForegroundColor Blue
docker-compose -f docker-compose.prod.yml down --remove-orphans

# 2. Limpiar contenedores huérfanos y redes
Write-Host "🧹 Limpiando contenedores huérfanos..." -ForegroundColor Blue
docker container prune -f
docker network prune -f

# 3. Eliminar contenedores específicos si existen
Write-Host "🗑️ Eliminando contenedores específicos..." -ForegroundColor Blue
try { docker rm -f visualmecanica-frontend-prod } catch { }
try { docker rm -f visualmecanica-backend-prod } catch { }
try { docker rm -f visualmecanica-database-prod } catch { }

# 4. Limpiar imágenes no utilizadas
Write-Host "🖼️ Limpiando imágenes no utilizadas..." -ForegroundColor Blue
docker image prune -f

# 5. Eliminar volúmenes huérfanos (cuidado con los datos)
Write-Host "💾 Limpiando volúmenes huérfanos..." -ForegroundColor Blue
docker volume prune -f

# 6. Reconstruir y levantar los servicios
Write-Host "🚀 Reconstruyendo y levantando servicios..." -ForegroundColor Green
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d

# 7. Mostrar estado de los contenedores
Write-Host "📊 Estado de los contenedores:" -ForegroundColor Green
docker-compose -f docker-compose.prod.yml ps

Write-Host "✅ Proceso completado!" -ForegroundColor Green