# Cloudflare Tunnel - Mejor alternativa a Ngrok

## Ventajas sobre Ngrok:
- ✅ **Gratis permanentemente**
- ✅ **URL fija** (no cambia)
- ✅ **Mejor rendimiento**
- ✅ **Sin límites de ancho de banda**
- ✅ **HTTPS automático**

## 1. Instalar Cloudflare Tunnel

### Windows:
```powershell
# Descargar desde GitHub
# https://github.com/cloudflare/cloudflared/releases
# O con Chocolatey:
choco install cloudflared
```

### Linux/Mac:
```bash
# Ubuntu/Debian
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared-linux-amd64.deb

# MacOS
brew install cloudflared
```

## 2. Configurar Cloudflare Tunnel

```bash
# 1. Autenticarse (abre navegador)
cloudflared tunnel login

# 2. Crear túnel
cloudflared tunnel create visualmecanica-staging

# 3. Crear archivo de configuración
# Crear: ~/.cloudflared/config.yml
```

## 3. Archivo de configuración (config.yml):

```yaml
tunnel: TU_TUNNEL_ID_AQUI
credentials-file: ~/.cloudflared/TU_TUNNEL_ID.json

ingress:
  # Frontend
  - hostname: visualmecanica-staging.tu-dominio.com
    service: http://localhost:80
  
  # API
  - hostname: api-visualmecanica.tu-dominio.com
    service: http://localhost:8080
  
  # Catch-all
  - service: http_status:404
```

## 4. Ejecutar túnel:

```bash
# Iniciar aplicación Docker
docker-compose -f docker-compose.prod.yml up -d

# Iniciar túnel
cloudflared tunnel run visualmecanica-staging
```

## 5. URL fija obtenida:
- **Frontend**: https://visualmecanica-staging.tu-dominio.com
- **API**: https://api-visualmecanica.tu-dominio.com

¡La URL nunca cambia! 🎉
