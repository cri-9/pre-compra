@echo off
echo Actualizando repositorio existente: https://github.com/cri-9/pre-compra.git
echo.

REM Verificar si ya existe repositorio Git
if not exist ".git" (
    echo Inicializando repositorio Git...
    git init
    git branch -M main
) else (
    echo Repositorio Git ya existe
)

REM Configurar usuario Git
echo Configurando usuario Git...
git config user.name "cri-9"
git config user.email "cesar.719@gmail.com"

REM Conectar con tu repositorio existente
echo Conectando con repositorio GitHub...
git remote remove origin 2>nul
git remote add origin https://github.com/cri-9/pre-compra.git

REM Verificar conexión
echo Verificando conexion...
git remote -v

REM Hacer backup del repositorio actual (opcional pero recomendado)
echo Haciendo backup del repositorio actual...
git fetch origin main 2>nul
git checkout -b backup-xampp origin/main 2>nul
git checkout main 2>nul

REM Agregar archivos al repositorio
echo Agregando archivos actualizados...
git add .

REM Crear commit con la nueva versión Docker
echo Creando commit con version Docker...
git commit -m "Actualizacion a Docker: Migracion de XAMPP a Docker - Configuracion Docker para desarrollo y produccion - Frontend React con Vite y Material UI actualizado - Backend PHP con Apache en contenedor - Base de datos MySQL en contenedor - Nginx como reverse proxy - Configuracion SSL preparada - Scripts de despliegue automatizados - Migracion completa de XAMPP a Docker para mejor portabilidad y escalabilidad"

echo.
echo IMPORTANTE: Esto va a actualizar tu repositorio actual
echo Repositorio: https://github.com/cri-9/pre-compra.git
echo.
set /p confirm="Estas seguro de que quieres continuar? (s/n): "

if /i "%confirm%"=="s" (
    echo Haciendo push al repositorio...
    git push -u origin main --force
    echo.
    echo Repositorio actualizado correctamente
    echo Puedes verlo en: https://github.com/cri-9/pre-compra.git
    echo.
    echo Proximos pasos:
    echo - Clona el repositorio en tu servidor: git clone https://github.com/cri-9/pre-compra.git
    echo - Configura las variables de entorno: cp .env.production .env
    echo - Ejecuta el despliegue: ./deploy.sh
) else (
    echo Operacion cancelada
)

echo.
pause
