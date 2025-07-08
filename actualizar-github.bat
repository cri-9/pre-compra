@echo off
chcp 65001 > nul
cls

echo ==================================================
echo  ACTUALIZAR REPOSITORIO GITHUB
echo ==================================================
echo.
echo Repositorio: https://github.com/cri-9/pre-compra.git
echo.

REM Verificar si Git está instalado
git --version > nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Git no está instalado o no está en el PATH
    echo.
    echo Descarga Git desde: https://git-scm.com/download/win
    echo Instala Git y asegurate de seleccionar "Add Git to PATH"
    echo.
    pause
    exit /b 1
)

echo Git encontrado correctamente
echo.

REM Configurar usuario
echo Configurando usuario Git...
git config user.name "cri-9"
git config user.email "cesar.719@gmail.com"

REM Inicializar repositorio si no existe
if not exist ".git" (
    echo Inicializando repositorio Git...
    git init
    git branch -M main
) else (
    echo Repositorio Git ya existe
)

REM Conectar con GitHub
echo Conectando con GitHub...
git remote remove origin 2>nul
git remote add origin https://github.com/cri-9/pre-compra.git

REM Verificar si hay cambios
git add .
git diff --cached --exit-code > nul
if %errorlevel% equ 0 (
    echo No hay cambios para enviar
    pause
    exit /b 0
)

REM Crear commit
echo Creando commit...
git commit -m "Actualizacion a Docker: Migracion completa de XAMPP a Docker"

echo.
echo ==================================================
echo  CONFIRMACION
echo ==================================================
echo.
echo Esto va a actualizar tu repositorio:
echo https://github.com/cri-9/pre-compra.git
echo.
set /p confirm="Continuar? (s/n): "

if /i "%confirm%"=="s" (
    echo.
    echo Enviando cambios a GitHub...
    git push -u origin main --force
    
    if %errorlevel% equ 0 (
        echo.
        echo ==================================================
        echo  EXITO!
        echo ==================================================
        echo.
        echo Repositorio actualizado correctamente
        echo Ver en: https://github.com/cri-9/pre-compra.git
        echo.
        echo Proximos pasos para produccion:
        echo 1. Comprar hosting/VPS
        echo 2. git clone https://github.com/cri-9/pre-compra.git
        echo 3. Configurar variables de entorno
        echo 4. Ejecutar deploy.sh
    ) else (
        echo.
        echo ERROR: No se pudo enviar al repositorio
        echo Verifica tu conexion a internet y permisos de GitHub
    )
) else (
    echo Operacion cancelada
)

echo.
pause
