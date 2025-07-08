# Script para probar la conectividad de la aplicación
Write-Host "=== PRUEBA DE CONECTIVIDAD ===" -ForegroundColor Cyan

# Probar puertos
$puertos = @{
    "Frontend (React)" = 3001
    "Backend (PHP)" = 8080
    "phpMyAdmin" = 8081
    "MySQL" = 3306
}

foreach ($servicio in $puertos.Keys) {
    $puerto = $puertos[$servicio]
    try {
        $conexion = Test-NetConnection -ComputerName localhost -Port $puerto -WarningAction SilentlyContinue
        if ($conexion.TcpTestSucceeded) {
            Write-Host "✅ $servicio (puerto $puerto): FUNCIONANDO" -ForegroundColor Green
        } else {
            Write-Host "❌ $servicio (puerto $puerto): NO ACCESIBLE" -ForegroundColor Red
        }
    } catch {
        Write-Host "❌ $servicio (puerto $puerto): ERROR" -ForegroundColor Red
    }
}

# Probar HTTP específicamente
Write-Host "`n=== PRUEBA HTTP ===" -ForegroundColor Cyan

$urls = @(
    "http://localhost:3001",
    "http://localhost:8080", 
    "http://localhost:8081"
)

foreach ($url in $urls) {
    try {
        $response = Invoke-WebRequest -Uri $url -Method Head -TimeoutSec 5 -ErrorAction Stop
        Write-Host "✅ ${url}: HTTP $($response.StatusCode)" -ForegroundColor Green
    } catch {
        $errorMsg = $_.Exception.Message
        if ($errorMsg -like "*404*") {
            Write-Host "⚠️ ${url}: HTTP 404 (servidor funcionando, ruta no encontrada)" -ForegroundColor Yellow
        } elseif ($errorMsg -like "*refused*" -or $errorMsg -like "*timeout*") {
            Write-Host "❌ ${url}: NO RESPONDE" -ForegroundColor Red
        } else {
            Write-Host "⚠️ ${url}: $errorMsg" -ForegroundColor Yellow
        }
    }
}

Write-Host "`n=== CONTENEDORES DOCKER ===" -ForegroundColor Cyan
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
