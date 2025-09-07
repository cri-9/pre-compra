@echo off
echo Obteniendo nombres correctos de servicios...
ssh root@srv910304.hstgr.cloud "cd ~/pre-compra && docker-compose ps"

echo.
echo Reiniciando servicio frontend (usa el nombre correcto del listado anterior)
ssh root@srv910304.hstgr.cloud "cd ~/pre-compra && docker-compose restart frontend"

echo.
echo Verificando logs del frontend...
ssh root@srv910304.hstgr.cloud "cd ~/pre-compra && docker-compose logs --tail=10 frontend"
pause
