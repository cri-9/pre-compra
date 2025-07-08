# Script para verificar y ejecutar Docker Compose
Write-Host "=== Verificacion de Docker ===" -ForegroundColor Cyan

# Verificar Docker
try {
    $dockerVersion = docker --version
    Write-Host "Docker encontrado: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Docker no esta instalado o no esta en PATH" -ForegroundColor Red
    exit 1
}

# Verificar Docker Compose
try {
    $composeVersion = docker-compose --version
    Write-Host "Docker Compose encontrado: $composeVersion" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Docker Compose no esta instalado" -ForegroundColor Red
    exit 1
}

# Verificar archivos necesarios
$archivosNecesarios = @(
    "docker-compose.yml",
    "backend.Dockerfile",
    "frontend\frontend.Dockerfile",
    "docker\mysql\precompra_db.sql",
    "Backend\.env"
)

Write-Host "`n=== Verificacion de Archivos ===" -ForegroundColor Cyan
$archivosFaltantes = @()

foreach ($archivo in $archivosNecesarios) {
    if (Test-Path $archivo) {
        Write-Host "✅ $archivo" -ForegroundColor Green
    } else {
        Write-Host "❌ $archivo" -ForegroundColor Red
        $archivosFaltantes += $archivo
    }
}

if ($archivosFaltantes.Count -gt 0) {
    Write-Host "`nArchivos faltantes: $($archivosFaltantes -join ', ')" -ForegroundColor Red
    Write-Host "Por favor, asegurate de que todos los archivos existan antes de continuar." -ForegroundColor Yellow
    exit 1
}

Write-Host "`n=== Iniciando Docker Compose ===" -ForegroundColor Cyan
Write-Host "Deteniendo contenedores existentes..." -ForegroundColor Yellow

try {
    docker-compose down 2>$null
    Write-Host "Contenedores detenidos." -ForegroundColor Green
} catch {
    Write-Host "No habia contenedores ejecutandose." -ForegroundColor Yellow
}

Write-Host "`nConstruyendo e iniciando contenedores..." -ForegroundColor Yellow
try {
    docker-compose up --build
} catch {
    Write-Host "ERROR: No se pudo ejecutar docker-compose" -ForegroundColor Red
    Write-Host "Verifica que Docker Desktop este ejecutandose." -ForegroundColor Yellow
    exit 1
}
