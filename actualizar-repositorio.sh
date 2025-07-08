#!/bin/bash

echo "🔄 Actualizando repositorio existente: https://github.com/cri-9/pre-compra.git"
echo ""

# Verificar si ya existe repositorio Git
if [ ! -d ".git" ]; then
    echo "📁 Inicializando repositorio Git..."
    git init
    git branch -M main
else
    echo "✅ Repositorio Git ya existe"
fi

# Configurar usuario Git
echo "👤 Configurando usuario Git..."
git config user.name "cri-9"
git config user.email "cesar.719@gmail.com"

# Conectar con tu repositorio existente
echo "🔗 Conectando con repositorio GitHub..."
git remote remove origin 2>/dev/null
git remote add origin https://github.com/cri-9/pre-compra.git

# Verificar conexión
echo "📡 Verificando conexión..."
git remote -v

# Hacer backup del repositorio actual (opcional pero recomendado)
echo "💾 Haciendo backup del repositorio actual..."
git fetch origin main 2>/dev/null
git checkout -b backup-xampp origin/main 2>/dev/null
git checkout main 2>/dev/null

# Agregar archivos al repositorio
echo "📦 Agregando archivos actualizados..."
git add .

# Crear commit con la nueva versión Docker
echo "💾 Creando commit con versión Docker..."
git commit -m "Actualización a Docker: Migración de XAMPP a Docker

- Configuración Docker para desarrollo y producción
- Frontend React con Vite y Material UI actualizado
- Backend PHP con Apache en contenedor
- Base de datos MySQL en contenedor
- Nginx como reverse proxy
- Configuración SSL preparada
- Scripts de despliegue automatizados

Migración completa de XAMPP a Docker para mejor portabilidad y escalabilidad"

echo ""
echo "⚠️  IMPORTANTE: Esto va a actualizar tu repositorio actual"
echo "📂 Repositorio: https://github.com/cri-9/pre-compra.git"
echo ""
read -p "¿Estás seguro de que quieres continuar? (s/n): " confirm

if [[ $confirm == [sS] ]]; then
    echo "🚀 Haciendo push al repositorio..."
    git push -u origin main --force
    echo ""
    echo "✅ Repositorio actualizado correctamente"
    echo "🌐 Puedes verlo en: https://github.com/cri-9/pre-compra.git"
    echo ""
    echo "📋 Próximos pasos:"
    echo "- Clona el repositorio en tu servidor: git clone https://github.com/cri-9/pre-compra.git"
    echo "- Configura las variables de entorno: cp .env.production .env"
    echo "- Ejecuta el despliegue: ./deploy.sh"
else
    echo "❌ Operación cancelada"
fi

echo ""
read -p "Presiona Enter para continuar..."
