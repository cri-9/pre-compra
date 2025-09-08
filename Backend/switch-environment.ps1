# SCRIPT PARA CAMBIAR ENTRE DESARROLLO Y PRODUCCION

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("development", "production")]
    [string]$Environment
)

Write-Host "CAMBIANDO A ENTORNO: $Environment" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Green
Write-Host ""

$backupDir = "backup_env_" + (Get-Date -Format "yyyy-MM-dd_HH-mm-ss")

# Crear backup del .env actual
if (Test-Path ".env") {
    Write-Host "Creando backup del .env actual..." -ForegroundColor Cyan
    New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
    Copy-Item ".env" "$backupDir\.env.backup"
    Write-Host "Backup creado en: $backupDir" -ForegroundColor Green
}

if ($Environment -eq "development") {
    Write-Host "Configurando para DESARROLLO..." -ForegroundColor Cyan
    
    # Verificar que existe .env con configuración de desarrollo
    if (Test-Path ".env") {
        $envContent = Get-Content ".env" -Raw
        if ($envContent -match "ENVIRONMENT=development") {
            Write-Host "✅ Ya está configurado para desarrollo" -ForegroundColor Green
        } else {
            # Actualizar ENVIRONMENT en .env existente
            $envContent = $envContent -replace "ENVIRONMENT=production", "ENVIRONMENT=development"
            $envContent = $envContent -replace "SIMULATE_EMAILS=false", "SIMULATE_EMAILS=true"
            $envContent = $envContent -replace "SIMULATE_CALENDAR=false", "SIMULATE_CALENDAR=true"
            $envContent | Set-Content ".env" -Encoding UTF8
            Write-Host "✅ Configuración actualizada a desarrollo" -ForegroundColor Green
        }
    }
    
    Write-Host ""
    Write-Host "CONFIGURACION DE DESARROLLO:" -ForegroundColor Yellow
    Write-Host "• ENVIRONMENT=development" -ForegroundColor White
    Write-Host "• SIMULATE_EMAILS=true (emails se simulan)" -ForegroundColor White
    Write-Host "• SIMULATE_CALENDAR=true (calendar se simula)" -ForegroundColor White
    Write-Host "• FRONTEND_URL=http://localhost:5173" -ForegroundColor White
    
} elseif ($Environment -eq "production") {
    Write-Host "Configurando para PRODUCCION..." -ForegroundColor Cyan
    
    if (Test-Path ".env.production") {
        Copy-Item ".env.production" ".env" -Force
        Write-Host "✅ Configuración de producción aplicada" -ForegroundColor Green
    } else {
        Write-Host "❌ Archivo .env.production no encontrado" -ForegroundColor Red
        exit 1
    }
    
    Write-Host ""
    Write-Host "CONFIGURACION DE PRODUCCION:" -ForegroundColor Yellow
    Write-Host "• ENVIRONMENT=production" -ForegroundColor White
    Write-Host "• SIMULATE_EMAILS=false (emails REALES)" -ForegroundColor White
    Write-Host "• SIMULATE_CALENDAR=false (calendar REAL)" -ForegroundColor White
    Write-Host "• FRONTEND_URL=https://visualmecanica.cl" -ForegroundColor White
    Write-Host "• SMTP via Hostinger (contacto@visualmecanica.cl)" -ForegroundColor White
}

# Verificar configuración final
Write-Host ""
Write-Host "Verificando configuracion..." -ForegroundColor Cyan

if (Test-Path ".env") {
    $envContent = Get-Content ".env" -Raw
    
    if ($envContent -match "ENVIRONMENT=(\w+)") {
        $currentEnv = $Matches[1]
        Write-Host "ENVIRONMENT: $currentEnv" -ForegroundColor Green
    }
    
    if ($envContent -match "SIMULATE_EMAILS=(\w+)") {
        $simulateEmails = $Matches[1]
        $color = if ($simulateEmails -eq "true") { "Yellow" } else { "Red" }
        Write-Host "SIMULATE_EMAILS: $simulateEmails" -ForegroundColor $color
    }
    
    # Mostrar línea de SMTP_USERNAME
    $envLines = Get-Content ".env"
    $smtpLine = $envLines | Where-Object { $_ -like "SMTP_USERNAME=*" }
    if ($smtpLine) {
        Write-Host "SMTP_USERNAME configurado" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "CAMBIO DE ENTORNO COMPLETADO" -ForegroundColor Green

if ($Environment -eq "production") {
    Write-Host ""
    Write-Host "⚠️  IMPORTANTE - MODO PRODUCCION:" -ForegroundColor Red
    Write-Host "• Los emails se enviarán REALMENTE" -ForegroundColor Yellow
    Write-Host "• Verificar credenciales SMTP antes de usar" -ForegroundColor Yellow
    Write-Host "• Configurar Google Calendar con credenciales reales" -ForegroundColor Yellow
}
