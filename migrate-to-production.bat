@echo off
echo ================================================
echo MIGRACION A FRONTEND DE PRODUCCION (SIN WEBSOCKET)
echo ================================================

echo.
echo 1. Subiendo docker-compose de producción...
scp docker-compose.prod-final.yml root@srv910304.hstgr.cloud:~/pre-compra/

echo.
echo 2. Parando contenedores actuales...
ssh root@srv910304.hstgr.cloud "cd ~/pre-compra && docker-compose down"

echo.
echo 3. Usando configuración de producción...
ssh root@srv910304.hstgr.cloud "cd ~/pre-compra && mv docker-compose.yml docker-compose.dev.yml && mv docker-compose.prod-final.yml docker-compose.yml"

echo.
echo 4. Construyendo frontend en modo producción (esto puede tomar varios minutos)...
ssh root@srv910304.hstgr.cloud "cd ~/pre-compra && docker-compose build frontend"

echo.
echo 5. Iniciando todos los servicios...
ssh root@srv910304.hstgr.cloud "cd ~/pre-compra && docker-compose up -d"

echo.
echo 6. Verificando estado de contenedores...
ssh root@srv910304.hstgr.cloud "cd ~/pre-compra && docker-compose ps"

echo.
echo 7. Probando conectividad...
ssh root@srv910304.hstgr.cloud "cd ~/pre-compra && sleep 30 && curl -I https://visualmecanica.cl"

echo.
echo ================================================
echo MIGRACION COMPLETADA
echo ================================================
echo.
echo El frontend ahora usa archivos estaticos de produccion
echo SIN cliente Vite de desarrollo = SIN errores WebSocket
echo.
echo VERIFICAR:
echo 1. Abrir https://visualmecanica.cl
echo 2. NO deberian aparecer errores WebSocket en consola
echo 3. La aplicacion deberia cargar normalmente
echo.
pause
