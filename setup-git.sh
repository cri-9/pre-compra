#!/bin/bash

# Script para configurar Git en el proyecto actual

echo "🔧 Configurando Git para el proyecto Visual Mecánica..."

# Inicializar repositorio Git si no existe
if [ ! -d ".git" ]; then
    echo "📁 Inicializando repositorio Git..."
    git init
    git branch -M main
else
    echo "✅ Repositorio Git ya existe"
fi

# Configurar usuario Git (cambiar por tus datos)
echo "👤 Configurando usuario Git..."
git config user.name "cri-9"
git config user.email "cesar.719@gmail.com"

# Agregar archivos al repositorio
echo "📦 Agregando archivos al repositorio..."
git add .

# Crear commit inicial
echo "💾 Creando commit inicial..."
git commit -m "Initial commit: Proyecto Visual Mecánica con Docker

- Configuración Docker para desarrollo y producción
- Frontend React con Vite y Material UI
- Backend PHP con Apache
- Base de datos MySQL
- Nginx como reverse proxy
- Configuración SSL preparada"

echo "✅ Repositorio Git configurado correctamente"
echo "🚀 Ahora puedes conectar con GitHub y hacer push"
