# Script para hacer build y copiar archivos publicos en desarrollo
Write-Host "Haciendo build de Vite..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "Copiando archivos de public a dist..." -ForegroundColor Yellow
    Copy-Item -Path "public\*" -Destination "dist\" -Recurse -Force
    
    Write-Host "Verificando archivos copiados:" -ForegroundColor Green
    Get-ChildItem -Path "dist\" | Where-Object { $_.Name -match "(icon|favicon)" } | ForEach-Object { Write-Host "  $($_.Name)" -ForegroundColor Green }
    
    Write-Host "Build completado. Los archivos estan listos en la carpeta dist/" -ForegroundColor Green
} else {
    Write-Host "Error en el build. No se copiaron los archivos." -ForegroundColor Red
}
