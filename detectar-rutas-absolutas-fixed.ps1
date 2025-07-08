# Script para detectar rutas absolutas en codigo React/TypeScript
# Ruta base del codigo React
$codigoPath = ".\frontend\src"

# Verificar si la carpeta existe
if (-not (Test-Path $codigoPath)) {
    Write-Host "ERROR: No se encontro la carpeta $codigoPath" -ForegroundColor Red
    exit 1
}

# Buscar extensiones de archivos comunes
try {
    $archivos = Get-ChildItem -Path $codigoPath -Recurse -Include *.js,*.jsx,*.ts,*.tsx -ErrorAction Stop
} catch {
    Write-Host "ERROR al buscar archivos: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

if ($archivos.Count -eq 0) {
    Write-Host "No se encontraron archivos React en $codigoPath" -ForegroundColor Yellow
    exit 0
}

Write-Host "Buscando rutas absolutas en $($archivos.Count) archivos de React..." -ForegroundColor Cyan

# Patrones para detectar rutas absolutas (version simplificada)
$patrones = @(
    'src\s*=\s*["\x27]/([^"\x27\s]+)["\x27]',
    'href\s*=\s*["\x27]/([^"\x27\s]+)["\x27]',
    'from\s+["\x27]/([^"\x27\s]+)["\x27]',
    '["\x27]/assets/([^"\x27\s]+)["\x27]',
    '["\x27]/static/([^"\x27\s]+)["\x27]'
)

$resultados = @()

foreach ($archivo in $archivos) {
    try {
        $lineas = Get-Content $archivo.FullName -ErrorAction Stop
        for ($i = 0; $i -lt $lineas.Count; $i++) {
            $linea = $lineas[$i]
            
            foreach ($patron in $patrones) {
                if ($linea -match $patron) {
                    $rutaEncontrada = $Matches[1]
                    
                    $resultados += [PSCustomObject]@{
                        Archivo = ($archivo.FullName -replace [regex]::Escape($PWD.Path + "\"), "")
                        Linea = $i + 1
                        Ruta = "/$rutaEncontrada"
                        Contexto = $linea.Trim()
                    }
                }
            }
        }
    } catch {
        Write-Host "No se pudo leer el archivo: $($archivo.FullName)" -ForegroundColor Yellow
    }
}

if ($resultados.Count -eq 0) {
    Write-Host "No se encontraron rutas absolutas. Todo esta bien con los imports." -ForegroundColor Green
} else {
    Write-Host "`nSe encontraron $($resultados.Count) rutas absolutas:" -ForegroundColor Yellow
    
    # Agrupar por archivo para mejor visualizacion
    $porArchivo = $resultados | Group-Object Archivo
    
    foreach ($grupo in $porArchivo) {
        Write-Host "`nArchivo: $($grupo.Name)" -ForegroundColor White
        foreach ($resultado in $grupo.Group) {
            Write-Host "   Linea $($resultado.Linea): $($resultado.Ruta)" -ForegroundColor Red
            Write-Host "   Contexto: $($resultado.Contexto)" -ForegroundColor Gray
        }
    }
    
    Write-Host "`nRecomendaciones:" -ForegroundColor Cyan
    Write-Host "   • Mover archivos estaticos a frontend/public/" -ForegroundColor White
    Write-Host "   • Cambiar rutas absolutas '/assets/...' por rutas relativas" -ForegroundColor White
    Write-Host "   • Usar imports relativos para modulos TypeScript/JavaScript" -ForegroundColor White
    
    # Generar sugerencias especificas
    $rutasUnicas = $resultados | Select-Object -ExpandProperty Ruta | Sort-Object -Unique
    if ($rutasUnicas.Count -gt 0) {
        Write-Host "`nRutas problematicas encontradas:" -ForegroundColor Yellow
        foreach ($ruta in $rutasUnicas) {
            $sugerencia = $ruta -replace "^/", ""
            Write-Host "   '$ruta' -> '$sugerencia'" -ForegroundColor White
        }
    }
}
