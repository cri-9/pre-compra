# Script de diagnóstico para Docker
Write-Host "=== DIAGNOSTICO DOCKER COMPOSE ===" -ForegroundColor Cyan

# 1. Verificar estado de Docker Desktop
Write-Host "`n1. Verificando Docker Desktop..." -ForegroundColor Yellow
$dockerProcesses = Get-Process | Where-Object {$_.ProcessName -like "*docker*"}
if ($dockerProcesses) {
    Write-Host "✅ Docker Desktop parece estar ejecutándose" -ForegroundColor Green
    $dockerProcesses | ForEach-Object { Write-Host "   - $($_.ProcessName)" -ForegroundColor Gray }
} else {
    Write-Host "❌ Docker Desktop NO está ejecutándose" -ForegroundColor Red
    Write-Host "   Por favor, inicia Docker Desktop desde el menú de inicio" -ForegroundColor Yellow
    Write-Host "   Espera a que aparezca 'Docker Desktop is running' en la bandeja del sistema" -ForegroundColor Yellow
    pause
    exit 1
}

# 2. Verificar comandos de Docker
Write-Host "`n2. Verificando comandos Docker..." -ForegroundColor Yellow
try {
    $result = docker version --format "{{.Client.Version}}" 2>$null
    if ($result) {
        Write-Host "✅ Docker CLI: v$result" -ForegroundColor Green
    } else {
        throw "No response"
    }
} catch {
    Write-Host "❌ Docker CLI no responde" -ForegroundColor Red
    Write-Host "   Espera unos minutos a que Docker Desktop termine de iniciar" -ForegroundColor Yellow
    exit 1
}

try {
    $result = docker-compose --version 2>$null
    if ($result) {
        Write-Host "✅ Docker Compose: $result" -ForegroundColor Green
    } else {
        throw "No response"
    }
} catch {
    Write-Host "❌ Docker Compose no disponible" -ForegroundColor Red
    exit 1
}

# 3. Verificar archivos del proyecto
Write-Host "`n3. Verificando archivos del proyecto..." -ForegroundColor Yellow
$archivos = @{
    "docker-compose.yml" = "Configuración principal de Docker Compose"
    "backend.Dockerfile" = "Dockerfile para el backend PHP"
    "frontend\frontend.Dockerfile" = "Dockerfile para el frontend React"
    "docker\mysql\precompra_db.sql" = "Script de inicialización de la base de datos"
    "Backend\.env" = "Variables de entorno del backend"
    "frontend\package.json" = "Configuración del proyecto Node.js"
}

$todoOK = $true
foreach ($archivo in $archivos.Keys) {
    if (Test-Path $archivo) {
        Write-Host "✅ $archivo" -ForegroundColor Green
    } else {
        Write-Host "❌ $archivo - $($archivos[$archivo])" -ForegroundColor Red
        $todoOK = $false
    }
}

if (-not $todoOK) {
    Write-Host "`n❌ Faltan archivos necesarios. No se puede continuar." -ForegroundColor Red
    exit 1
}

# 4. Verificar puertos
Write-Host "`n4. Verificando puertos..." -ForegroundColor Yellow
$puertos = @(8080, 3306, 8081, 5173)
foreach ($puerto in $puertos) {
    $conexion = Test-NetConnection -ComputerName localhost -Port $puerto -WarningAction SilentlyContinue
    if ($conexion.TcpTestSucceeded) {
        Write-Host "⚠️ Puerto $puerto ya está en uso" -ForegroundColor Yellow
    } else {
        Write-Host "✅ Puerto $puerto disponible" -ForegroundColor Green
    }
}

# 5. Intentar construir e iniciar
Write-Host "`n5. Iniciando contenedores..." -ForegroundColor Yellow
Write-Host "Esto puede tomar varios minutos la primera vez..." -ForegroundColor Gray

try {
    # Limpiar contenedores existentes
    Write-Host "Limpiando contenedores existentes..." -ForegroundColor Gray
    docker-compose down --remove-orphans 2>$null
    
    # Construir e iniciar
    Write-Host "Construyendo e iniciando servicios..." -ForegroundColor Gray
    docker-compose up --build --detach
    
    # Verificar estado
    Start-Sleep 10
    Write-Host "`n=== ESTADO DE LOS SERVICIOS ===" -ForegroundColor Cyan
    docker-compose ps
    
    Write-Host "`n=== ACCESOS ===" -ForegroundColor Cyan
    Write-Host "🌐 Frontend (React):     http://localhost:5173" -ForegroundColor Green
    Write-Host "🐘 Backend (PHP):        http://localhost:8080" -ForegroundColor Green  
    Write-Host "🗄️ phpMyAdmin:           http://localhost:8081" -ForegroundColor Green
    Write-Host "📊 MySQL (puerto):       localhost:3306" -ForegroundColor Green
    
    Write-Host "`nPara ver logs en vivo: docker-compose logs -f" -ForegroundColor Yellow
    Write-Host "Para detener: docker-compose down" -ForegroundColor Yellow
    
} catch {
    Write-Host "❌ ERROR al ejecutar docker-compose:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    Write-Host "`nMostrando logs de error..." -ForegroundColor Yellow
    docker-compose logs --tail=50
}
