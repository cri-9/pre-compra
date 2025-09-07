#!/bin/bash
# Script para solucionar el problema de permisos en el build del frontend

echo "🔧 Solucionando problema de permisos en frontend build..."

# Opción 1: Usar Dockerfile alternativo (más estable)
echo "📝 Creando Dockerfile alternativo..."
cp frontend/Dockerfile.prod.alternative frontend/Dockerfile.prod

# Opción 2: Limpiar imágenes y contenedores anteriores
echo "🧹 Limpiando imágenes anteriores..."
docker-compose -f docker-compose.prod.yml down --rmi all --volumes --remove-orphans
docker system prune -f

# Opción 3: Construir solo el frontend primero para debug
echo "🔨 Intentando build del frontend..."
docker build -t test-frontend ./frontend -f ./frontend/Dockerfile.prod

if [ $? -eq 0 ]; then
    echo "✅ Frontend build exitoso con Dockerfile corregido"
    echo "🚀 Procediendo con deploy completo..."
    docker-compose -f docker-compose.prod.yml up -d --build
else
    echo "❌ Frontend build falló. Intentando solución alternativa..."
    
    # Opción 4: Build local del frontend y copia manual
    echo "📦 Construyendo frontend localmente..."
    cd frontend
    
    # Verificar si node_modules existe
    if [ ! -d "node_modules" ]; then
        echo "📥 Instalando dependencias..."
        npm install
    fi
    
    # Dar permisos a binarios
    echo "🔐 Corrigiendo permisos..."
    find node_modules/.bin -type f -exec chmod +x {} \; 2>/dev/null || true
    
    # Intentar build
    echo "🏗️ Construyendo..."
    npm run build
    
    if [ $? -eq 0 ]; then
        echo "✅ Build local exitoso"
        cd ..
        
        # Crear Dockerfile simple que solo copia dist
        cat > frontend/Dockerfile.prod.simple << 'EOF'
FROM nginx:alpine
COPY dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
EOF
        
        # Usar el Dockerfile simple
        cp frontend/Dockerfile.prod.simple frontend/Dockerfile.prod
        
        echo "🚀 Desplegando con build pre-construido..."
        docker-compose -f docker-compose.prod.yml up -d --build
    else
        echo "❌ Build local también falló"
        echo "💡 Soluciones manuales:"
        echo "   1. Verificar que Node.js esté instalado correctamente"
        echo "   2. Ejecutar: npm install && npm run build"
        echo "   3. Verificar permisos: chmod +x node_modules/.bin/*"
    fi
fi

echo "🏁 Script completado"