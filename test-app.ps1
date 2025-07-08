# Script para probar la aplicación una vez que esté lista
Write-Host "=== PRUEBA RAPIDA DE LA APLICACION ===" -ForegroundColor Cyan

# URLs a probar
$urls = @{
    "Frontend React" = "http://localhost:3001"
    "Backend PHP" = "http://localhost:8080"
    "Cotización API" = "http://localhost:8080/enviarCotizacion.php"
    "Verificar Bloque API" = "http://localhost:8080/verificarBloque.php"
}

foreach ($nombre in $urls.Keys) {
    $url = $urls[$nombre]
    Write-Host "`nProbando: $nombre" -ForegroundColor Yellow
    Write-Host "URL: $url" -ForegroundColor Gray
    
    try {
        $response = Invoke-WebRequest -Uri $url -Method Head -TimeoutSec 5 -ErrorAction Stop
        Write-Host "✅ Estado: HTTP $($response.StatusCode)" -ForegroundColor Green
    } catch {
        $errorMsg = $_.Exception.Message
        if ($errorMsg -like "*404*") {
            Write-Host "⚠️ Estado: HTTP 404 (endpoint no encontrado, pero servidor funcionando)" -ForegroundColor Yellow
        } elseif ($errorMsg -like "*500*") {
            Write-Host "⚠️ Estado: HTTP 500 (error del servidor, necesita configuración)" -ForegroundColor Yellow
        } elseif ($errorMsg -like "*refused*") {
            Write-Host "❌ Estado: Conexión rechazada (servidor no está ejecutándose)" -ForegroundColor Red
        } else {
            Write-Host "⚠️ Estado: $errorMsg" -ForegroundColor Yellow
        }
    }
}

Write-Host "`n=== INSTRUCCIONES ===" -ForegroundColor Cyan
Write-Host "1. Abre tu navegador en: http://localhost:3001" -ForegroundColor White
Write-Host "2. Prueba crear una cotización" -ForegroundColor White
Write-Host "3. Si hay errores, revisa los logs: docker-compose logs" -ForegroundColor White
