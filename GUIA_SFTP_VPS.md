# Lista de Archivos para Subir al VPS via SFTP

## 🔐 Archivos de Seguridad (NUEVOS)
```
security-headers.conf              → /ruta/del/proyecto/
security.txt                      → /ruta/del/proyecto/
SEGURIDAD.md                      → /ruta/del/proyecto/
INFORME_SEGURIDAD.md              → /ruta/del/proyecto/
setup-security.sh                → /ruta/del/proyecto/
generate-ssl.sh                   → /ruta/del/proyecto/
validar-seguridad.bat             → /ruta/del/proyecto/ (opcional)
```

## 📁 Certificados SSL (Temporales - Reemplazar en producción)
```
nginx/ssl/visualmecanica.cl.crt   → /ruta/del/proyecto/nginx/ssl/
nginx/ssl/visualmecanica.cl.key   → /ruta/del/proyecto/nginx/ssl/
```

## ⚙️ Configuraciones Modificadas
```
nginx/nginx.conf                  → /ruta/del/proyecto/nginx/
Backend/apache-prod.conf          → /ruta/del/proyecto/Backend/
Backend/.htaccess                 → /ruta/del/proyecto/Backend/
backend.Dockerfile               → /ruta/del/proyecto/
docker-compose.yml               → /ruta/del/proyecto/
```

## 🌐 Frontend (Security.txt)
```
frontend/public/.well-known/security.txt  → /ruta/del/proyecto/frontend/public/.well-known/
frontend/public/security.txt             → /ruta/del/proyecto/frontend/public/
```

## 🚀 Scripts de Despliegue
```
setup-security.sh                → /ruta/del/proyecto/
deploy.sh                        → /ruta/del/proyecto/
start-docker.ps1                 → /ruta/del/proyecto/
```

---

## 📋 CHECKLIST DE TRANSFERENCIA

### Paso 1: Conectar vía SFTP
```bash
sftp usuario@tu-vps-ip
# o usando puerto específico:
sftp -P 22 usuario@tu-vps-ip
```

### Paso 2: Navegar al directorio del proyecto
```bash
cd /ruta/del/proyecto/
```

### Paso 3: Transferir archivos de seguridad
```bash
put security-headers.conf
put security.txt
put SEGURIDAD.md
put INFORME_SEGURIDAD.md
put setup-security.sh
put generate-ssl.sh
```

### Paso 4: Transferir configuraciones
```bash
put nginx/nginx.conf nginx/
put Backend/apache-prod.conf Backend/
put Backend/.htaccess Backend/
put backend.Dockerfile
put docker-compose.yml
```

### Paso 5: Crear directorios y transferir SSL
```bash
mkdir nginx/ssl
put nginx/ssl/visualmecanica.cl.crt nginx/ssl/
put nginx/ssl/visualmecanica.cl.key nginx/ssl/
```

### Paso 6: Transferir archivos del frontend
```bash
mkdir -p frontend/public/.well-known
put frontend/public/.well-known/security.txt frontend/public/.well-known/
put frontend/public/security.txt frontend/public/
```

---

## ⚠️ IMPORTANTE PARA PRODUCCIÓN

### Certificados SSL
Los certificados actuales son **TEMPORALES**. En el VPS debes:

1. **Generar certificados reales con Let's Encrypt**:
```bash
# En el VPS
sudo apt update
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d visualmecanica.cl -d www.visualmecanica.cl
```

2. **O usar certificados de tu proveedor SSL**

### Permisos en el VPS
```bash
# Después de la transferencia
chmod +x setup-security.sh
chmod +x generate-ssl.sh
chmod +x deploy.sh
chmod 600 nginx/ssl/*.key
chmod 644 nginx/ssl/*.crt
```

---

## 🔧 COMANDOS POST-TRANSFERENCIA

### En el VPS, ejecutar:
```bash
# 1. Dar permisos
chmod +x *.sh

# 2. Configurar seguridad
./setup-security.sh

# 3. Generar certificados reales (reemplazar temporales)
sudo certbot --nginx -d visualmecanica.cl -d www.visualmecanica.cl

# 4. Iniciar con Docker
docker-compose up -d --build
```

---

## 📊 VERIFICACIÓN POST-DESPLIEGUE

### Testing de Seguridad
```bash
# Verificar headers
curl -I https://visualmecanica.cl

# Verificar SSL
openssl s_client -connect visualmecanica.cl:443 -servername visualmecanica.cl

# Verificar security.txt
curl https://visualmecanica.cl/.well-known/security.txt
```

### Herramientas Online
- [SSL Labs Test](https://www.ssllabs.com/ssltest/)
- [Security Headers](https://securityheaders.com/)
- [Mozilla Observatory](https://observatory.mozilla.org/)

---

## 🆘 BACKUP RECOMENDADO

Antes de subir, hacer backup del VPS:
```bash
# En el VPS
cp -r /ruta/del/proyecto /ruta/del/proyecto_backup_$(date +%Y%m%d)
```
