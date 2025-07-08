# Script para detectar rutas absolutas en proyecto React/TypeScript
# Version simplificada y funcional

Write-Host "Detector de Rutas Absolutas v2.0" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Blue

# Configuracion
$rutaBase = ".\frontend\src"
$extensiones = @("*.js", "*.jsx", "*.ts", "*.tsx", "*.vue", "*.html")

# Verificar carpeta
if (-not (Test-Path $rutaBase)) {
    Write-Host "ERROR: No se encontro la carpeta $rutaBase" -ForegroundColor Red
    exit 1
}

Write-Host "Analizando carpeta: $rutaBase" -ForegroundColor Green

# Buscar archivos
try {
    $archivos = Get-ChildItem -Path $rutaBase -Recurse -Include $extensiones
} catch {
    Write-Host "ERROR: No se pudieron buscar archivos" -ForegroundColor Red
    exit 1
}

if ($archivos.Count -eq 0) {
    Write-Host "No se encontraron archivos de codigo" -ForegroundColor Yellow
    exit 0
}

Write-Host "Archivos encontrados: $($archivos.Count)" -ForegroundColor Green

# Patrones simples para buscar rutas absolutas
$patronesSimples = @(
    'src="(/[^"]+)"',
    "src='(/[^']+)'",
    'href="(/[^"]+)"',
    "href='(/[^']+)'",
    'from "(/[^"]+)"',
    "from '(/[^']+)'",
    '"(/assets/[^"]+)"',
    "'(/assets/[^']+)'",
    '"(/static/[^"]+)"',
    "'(/static/[^']+)'"
)

$resultados = @()

# Analizar cada archivo
foreach ($archivo in $archivos) {
    $rutaCorta = $archivo.FullName.Replace($PWD.Path, ".")
    
    try {
        $lineas = Get-Content $archivo.FullName
        
        for ($i = 0; $i -lt $lineas.Count; $i++) {
            $linea = $lineas[$i]
            
            foreach ($patron in $patronesSimples) {
                if ($linea -match $patron) {
                    $rutaEncontrada = $Matches[1]
                    
                    # Filtrar URLs externas obvias
                    if ($rutaEncontrada -notmatch "^//|^/http|^/www") {
                        $resultados += [PSCustomObject]@{
                            Archivo = $rutaCorta
                            Linea = $i + 1
                            Ruta = $rutaEncontrada
                            Contexto = $linea.Trim()
                        }
                    }
                }
            }
        }
    } catch {
        Write-Host "AVISO: No se pudo leer $rutaCorta" -ForegroundColor Yellow
    }
}

# Mostrar resultados
Write-Host "`nRESULTADOS:" -ForegroundColor Cyan
Write-Host "===========" -ForegroundColor Blue

if ($resultados.Count -eq 0) {
    Write-Host "EXCELENTE: No se encontraron rutas absolutas problematicas" -ForegroundColor Green
} else {
    Write-Host "ENCONTRADAS: $($resultados.Count) rutas absolutas" -ForegroundColor Yellow
    
    $porArchivo = $resultados | Group-Object Archivo
    
    foreach ($grupo in $porArchivo) {
        Write-Host "`nArchivo: $($grupo.Name)" -ForegroundColor White
        foreach ($item in $grupo.Group) {
            Write-Host "  Linea $($item.Linea): $($item.Ruta)" -ForegroundColor Red
            Write-Host "  Contexto: $($item.Contexto)" -ForegroundColor Gray
            $sugerencia = $item.Ruta -replace "^/", ""
            Write-Host "  Sugerido: $sugerencia" -ForegroundColor Green
            Write-Host ""
        }
    }
    
    Write-Host "RECOMENDACIONES:" -ForegroundColor Cyan
    Write-Host "1. Mover archivos estaticos a frontend/public/" -ForegroundColor White
    Write-Host "2. Cambiar rutas '/assets/...' por rutas relativas" -ForegroundColor White
    Write-Host "3. Usar imports relativos para modulos locales" -ForegroundColor White
}

Write-Host "`nAnalisis completado!" -ForegroundColor Green
