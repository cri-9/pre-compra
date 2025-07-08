# Script para probar todos los endpoints del backend
Write-Host "=== PROBANDO ENDPOINTS DEL BACKEND ===" -ForegroundColor Green

$baseUrl = "http://localhost:8080"
$endpoints = @(
    @{ name = "Test Connection"; url = "/test_connection.php"; method = "GET" },
    @{ name = "Enviar Cotizacion"; url = "/enviarCotizacion.php"; method = "GET" },
    @{ name = "Setup Database"; url = "/setup_database.php"; method = "GET" },
    @{ name = "Test Tabla Existente"; url = "/test_tabla_existente.php"; method = "GET" },
    @{ name = "Verificar Bloque"; url = "/verificarBloque.php"; method = "GET" },
    @{ name = "WebPay"; url = "/webpay.php"; method = "GET" }
)

foreach ($endpoint in $endpoints) {
    Write-Host "`n--- Probando: $($endpoint.name) ---" -ForegroundColor Yellow
    try {
        $response = Invoke-WebRequest -Uri "$baseUrl$($endpoint.url)" -Method $endpoint.method -ErrorAction Stop
        Write-Host "✅ Status: $($response.StatusCode)" -ForegroundColor Green
        $content = $response.Content
        if ($content.Length -gt 200) {
            $content = $content.Substring(0, 200) + "..."
        }
        Write-Host "Content: $content" -ForegroundColor Cyan
    }
    catch {
        $statusCode = $_.Exception.Response.StatusCode.Value__
        Write-Host "❌ Error: $statusCode" -ForegroundColor Red
        Write-Host "Message: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n=== PRUEBA COMPLETADA ===" -ForegroundColor Green
