@echo off
echo 🔧 Configurando Git para el proyecto Visual Mecánica...

REM Verificar si ya existe repositorio Git
if not exist ".git" (
    echo 📁 Inicializando repositorio Git...
    git init
    git branch -M main
) else (
    echo ✅ Repositorio Git ya existe
)

REM Configurar usuario Git (cambiar por tus datos)
echo 👤 Configurando usuario Git...
git config user.name "cri-9"
git config user.email "cesar.719@gmail.com"

REM Agregar archivos al repositorio
echo 📦 Agregando archivos al repositorio...
git add .

REM Crear commit inicial
echo 💾 Creando commit inicial...
git commit -m "Initial commit: Proyecto Visual Mecánica con Docker - Configuración Docker para desarrollo y producción - Frontend React con Vite y Material UI - Backend PHP con Apache - Base de datos MySQL - Nginx como reverse proxy - Configuración SSL preparada"

echo ✅ Repositorio Git configurado correctamente
echo 🚀 Ahora puedes conectar con GitHub y hacer push

pause
