# Crear carpeta frontend
$frontendPath = ".\frontend"
if (!(Test-Path $frontendPath)) {
    New-Item -ItemType Directory -Path $frontendPath
}

# Archivos que se deben mover a frontend
$archivos = @(
    "src", "public", "package.json", "package-lock.json", "vite.config.ts",
    "tsconfig.json", "tsconfig.app.json", "tsconfig.node.json",
    ".env", ".env.example", ".env.production.example", ".prettierrc", "eslint.config.js"
)

# Mover archivos
foreach ($item in $archivos) {
    if (Test-Path $item) {
        Move-Item -Path $item -Destination $frontendPath -Force
        Write-Host "Movido: $item -> $frontendPath"
    }
}

Write-Host "`n✅ ¡Estructura reorganizada!"
Write-Host "Verifica si tus rutas de imagen están usando 'import' (todo OK) o rutas absolutas ('/assets/...')."
Write-Host "Si usas rutas absolutas, mueve esas imágenes desde src/assets a frontend/public y cambia las rutas en el código."
