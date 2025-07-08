# Script para detectar rutas absolutas en código React/TypeScript
# Autor: Asistente de programación
# Descripción: Busca rutas absolutas que deberían ser relativas

param(
    [string]$Path = ".\frontend\src",
    [switch]$Verbose
)

# Función para mostrar ayuda
function Show-Help {
    Write-Host "Uso: .\detectar-rutas-absolutas-mejorado.ps1 [-Path <ruta>] [-Verbose]" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Parámetros:" -ForegroundColor Green
    Write-Host "  -Path     : Ruta base para buscar archivos (por defecto: .\frontend\src)" -ForegroundColor White
    Write-Host "  -Verbose  : Muestra información detallada del proceso" -ForegroundColor White
    Write-Host "  -Help     : Muestra esta ayuda" -ForegroundColor White
}

# Verificar si se solicita ayuda
if ($args -contains "-Help" -or $args -contains "-h" -or $args -contains "/?") {
    Show-Help
    exit 0
}

Write-Host "🔍 Detector de Rutas Absolutas - Proyecto React/TypeScript" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Blue

# Verificar si la carpeta existe
if (-not (Test-Path $Path)) {
    Write-Host "❌ Error: No se encontró la carpeta '$Path'" -ForegroundColor Red
    Write-Host "💡 Tip: Asegúrate de estar en la raíz del proyecto o especifica la ruta correcta" -ForegroundColor Yellow
    exit 1
}

$Path = Resolve-Path $Path
Write-Host "📁 Analizando: $Path" -ForegroundColor Green

# Buscar archivos de código
$extensiones = @("*.js", "*.jsx", "*.ts", "*.tsx", "*.vue", "*.html")
try {
    $archivos = Get-ChildItem -Path $Path -Recurse -Include $extensiones -ErrorAction Stop
    if ($Verbose) {
        Write-Host "📋 Extensiones buscadas: $($extensiones -join ', ')" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Error al buscar archivos: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

if ($archivos.Count -eq 0) {
    Write-Host "⚠️ No se encontraron archivos de código en '$Path'" -ForegroundColor Yellow
    Write-Host "💡 Tip: Verifica que la ruta contenga archivos .js, .jsx, .ts, .tsx, .vue o .html" -ForegroundColor Yellow
    exit 0
}

Write-Host "📊 Archivos encontrados: $($archivos.Count)" -ForegroundColor Green

# Patrones regex para detectar rutas absolutas (usando comillas dobles para evitar problemas)
$patrones = @{
    "src_attribute" = 'src\s*=\s*["''](\\/[^"'']+)["'']'
    "href_attribute" = 'href\s*=\s*["''](\\/[^"'']+)["'']'
    "import_statement" = 'import\s+[^from]*from\s+["''](\\/[^"'']+)["'']'
    "import_function" = 'import\s*\(\s*["''](\\/[^"'']+)["'']\s*\)'
    "require_statement" = 'require\s*\(\s*["''](\\/[^"'']+)["'']\s*\)'
    "url_css" = 'url\s*\(\s*["'']?(\\/[^"''\)]+)["'']?\s*\)'
    "asset_reference" = '["''](\\/(?:assets|static|public|images|img|css|js|fonts)\/[^"'']+)["'']'
}

$resultados = @()
$archivosConProblemas = 0

foreach ($archivo in $archivos) {
    $rutaRelativa = $archivo.FullName.Replace($PWD.Path + "\", "")
    
    if ($Verbose) {
        Write-Host "🔍 Analizando: $rutaRelativa" -ForegroundColor Gray
    }
    
    try {
        $lineas = Get-Content $archivo.FullName -ErrorAction Stop -Encoding UTF8
        $tieneProblemas = $false
        
        for ($i = 0; $i -lt $lineas.Count; $i++) {
            $linea = $lineas[$i]
            $numeroLinea = $i + 1
            
            foreach ($nombrePatron in $patrones.Keys) {
                $patron = $patrones[$nombrePatron]
                
                if ($linea -match $patron) {
                    $rutaEncontrada = $Matches[1]
                    
                    # Filtrar rutas que claramente son URL externas
                    if ($rutaEncontrada -notmatch "^\/\/(www\.|[a-z]+\.)" -and 
                        $rutaEncontrada -notmatch "^\/[a-z]+:\/\/") {
                        
                        $tieneProblemas = $true
                        $resultados += [PSCustomObject]@{
                            Archivo = $rutaRelativa
                            Linea = $numeroLinea
                            Ruta = $rutaEncontrada
                            Contexto = $linea.Trim()
                            TipoPatron = $nombrePatron
                            Sugerencia = ($rutaEncontrada -replace "^\/", "")
                        }
                    }
                }
            }
        }
        
        if ($tieneProblemas) {
            $archivosConProblemas++
        }
        
    } catch {
        Write-Host "⚠️ No se pudo leer: $rutaRelativa - $($_.Exception.Message)" -ForegroundColor Yellow
    }
}

# Mostrar resultados
Write-Host "`n" + "=" * 60 -ForegroundColor Blue
Write-Host "📋 RESULTADOS DEL ANÁLISIS" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Blue

if ($resultados.Count -eq 0) {
    Write-Host "✅ ¡Excelente! No se encontraron rutas absolutas problemáticas." -ForegroundColor Green
    Write-Host "🎉 Tu código sigue las mejores prácticas para rutas de archivos." -ForegroundColor Green
} else {
    Write-Host "⚠️ Se encontraron $($resultados.Count) rutas absolutas en $archivosConProblemas archivo(s):" -ForegroundColor Yellow
    
    # Agrupar por archivo
    $porArchivo = $resultados | Group-Object Archivo | Sort-Object Name
    
    foreach ($grupo in $porArchivo) {
        Write-Host "`n📄 $($grupo.Name)" -ForegroundColor White -BackgroundColor DarkBlue
        
        foreach ($item in $grupo.Group) {
            Write-Host "   📍 Línea $($item.Linea): " -NoNewline -ForegroundColor Red
            Write-Host "$($item.Ruta)" -ForegroundColor Yellow
            Write-Host "      Contexto: " -NoNewline -ForegroundColor Gray
            Write-Host "$($item.Contexto)" -ForegroundColor DarkGray
            Write-Host "      Sugerido: " -NoNewline -ForegroundColor Green
            Write-Host "$($item.Sugerencia)" -ForegroundColor Cyan
            Write-Host ""
        }
    }
    
    # Estadísticas
    Write-Host "`n📊 ESTADÍSTICAS:" -ForegroundColor Cyan
    $porTipo = $resultados | Group-Object TipoPatron | Sort-Object Count -Descending
    foreach ($tipo in $porTipo) {
        Write-Host "   • $($tipo.Name): $($tipo.Count) ocurrencias" -ForegroundColor White
    }
    
    # Recomendaciones
    Write-Host "`n💡 RECOMENDACIONES:" -ForegroundColor Cyan
    Write-Host "   1. Mueve archivos estáticos a 'frontend/public/'" -ForegroundColor White
    Write-Host "   2. Cambia rutas absolutas '/assets/...' por rutas relativas" -ForegroundColor White
    Write-Host "   3. Usa imports relativos para módulos locales" -ForegroundColor White
    Write-Host "   4. Considera usar alias de path en tu configuración de build" -ForegroundColor White
    
    # Rutas más comunes
    $rutasComunes = $resultados | Group-Object { ($_.Ruta -split '/')[1] } | Sort-Object Count -Descending | Select-Object -First 5
    if ($rutasComunes.Count -gt 0) {
        Write-Host "`n🔧 CARPETAS MÁS REFERENCIADAS:" -ForegroundColor Cyan
        foreach ($carpeta in $rutasComunes) {
            Write-Host "   • /$($carpeta.Name): $($carpeta.Count) referencias" -ForegroundColor White
        }
    }
}

Write-Host "`n" + "=" * 60 -ForegroundColor Blue
Write-Host "✨ Análisis completado. ¡Gracias por usar el detector!" -ForegroundColor Green
