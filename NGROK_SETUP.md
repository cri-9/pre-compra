# Guía para exponer tu aplicación Docker con Ngrok

## 1. Instalar Ngrok

### Windows:
1. Ve a https://ngrok.com/download
2. Descarga ngrok para Windows
3. Extrae el .exe a una carpeta (ej: C:\ngrok\)
4. Agrega C:\ngrok\ al PATH de Windows

### O con Chocolatey:
```powershell
choco install ngrok
```

## 2. Crear cuenta y configurar

1. Regístrate en https://ngrok.com (gratis)
2. Obtén tu token de autenticación
3. Configura ngrok:
```bash
ngrok config add-authtoken TU_TOKEN_AQUI
```

## 3. Preparar tu aplicación para Ngrok

### Opción A: Exponer puerto 80 (Nginx)
```bash
# Iniciar tu aplicación Docker
docker-compose -f docker-compose.prod.yml up -d

# En otra terminal, exponer con ngrok
ngrok http 80
```

### Opción B: Exponer puerto 3000 (Frontend directo)
```bash
# Iniciar solo el frontend
docker-compose up frontend -d

# Exponer frontend
ngrok http 3000
```

## 4. Configuración para múltiples servicios

### Crear archivo ngrok.yml:
```yaml
version: "2"
authtoken: TU_TOKEN_AQUI
tunnels:
  frontend:
    addr: 80
    proto: http
    subdomain: visualmecanica-staging
  api:
    addr: 8080
    proto: http
    subdomain: visualmecanica-api
```

### Ejecutar múltiples túneles:
```bash
ngrok start --all
```

## 5. URLs que obtendrás:

- **Frontend**: https://abc123.ngrok-free.app
- **API**: https://def456.ngrok-free.app

## 6. Actualizar configuración frontend

Cuando tengas la URL de ngrok, actualiza:

### En frontend/.env:
```env
VITE_API_URL=https://def456.ngrok-free.app
VITE_BACKEND_URL=https://def456.ngrok-free.app/Backend
```

### Rebuild frontend:
```bash
cd frontend
npm run build
cd ..
docker-compose -f docker-compose.prod.yml up frontend --build -d
```

## 7. Comandos útiles:

```bash
# Ver túneles activos
ngrok tunnels list

# Inspeccionar tráfico
# Ve a http://localhost:4040

# Exponer con dominio personalizado (plan pago)
ngrok http 80 --subdomain=visualmecanica

# Exponer con autenticación
ngrok http 80 --auth="usuario:contraseña"
```

## 8. Para testing completo:

```bash
# 1. Iniciar aplicación
docker-compose -f docker-compose.prod.yml up -d

# 2. Exponer con ngrok
ngrok http 80

# 3. Probar en la URL que te da ngrok
# Ejemplo: https://abc123.ngrok-free.app
```

## 9. Solución de problemas:

### Error CORS:
Agrega la URL de ngrok a tu backend PHP:
```php
header("Access-Control-Allow-Origin: https://abc123.ngrok-free.app");
```

### URL dinámica:
Para obtener la URL programáticamente:
```bash
curl http://localhost:4040/api/tunnels | jq '.tunnels[0].public_url'
```
