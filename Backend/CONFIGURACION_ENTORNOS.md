# 🔧 GUÍA DE CONFIGURACIÓN - DESARROLLO vs PRODUCCIÓN

## 📋 Resumen de tu Configuración Actual

### ✅ **Desarrollo (.env)**
```env
ENVIRONMENT=development
SIMULATE_EMAILS=true
SIMULATE_CALENDAR=true
FRONTEND_URL=http://localhost:5173
SMTP_USERNAME=cotizacionautomotriz09@gmail.com
```

### 🚀 **Producción (.env.production)**
```env
ENVIRONMENT=production
SIMULATE_EMAILS=false
SIMULATE_CALENDAR=false  
FRONTEND_URL=https://visualmecanica.cl
SMTP_USERNAME=contacto@visualmecanica.cl
```

## 🔄 Cambiar entre Entornos

### Para Desarrollo Local:
```powershell
.\switch-environment.ps1 development
```

### Para Producción VPS:
```powershell
.\switch-environment.ps1 production
```

## 📧 Configuración de Email

### Desarrollo (Gmail):
- **Usuario:** cotizacionautomotriz09@gmail.com
- **Modo:** Simulado (no envía emails reales)
- **Logs:** Se muestran en consola

### Producción (Hostinger):
- **Usuario:** contacto@visualmecanica.cl  
- **Modo:** Real (envía emails reales)
- **Servidor:** smtp.hostinger.com:465

## 🗄️ Base de Datos

### Desarrollo:
- **Host:** mysql (Docker)
- **DB:** precompra_db
- **Usuario:** user

### Producción:
- **Host:** database
- **DB:** visualmecanica_prod  
- **Usuario:** visualmecanica_user

## 🚀 Despliegue en VPS

### 1. Copiar archivos al VPS:
```bash
scp -r Backend/ usuario@tu-vps:/var/www/visual-mecanica/
```

### 2. Configurar producción en VPS:
```bash
cd /var/www/visual-mecanica/Backend
cp .env.production .env
```

### 3. Instalar dependencias:
```bash
composer install --no-dev
```

### 4. Configurar permisos:
```bash
chmod 600 .env
chmod -R 755 helpers/
```

## ⚠️ Diferencias Críticas

| Aspecto | Desarrollo | Producción |
|---------|------------|------------|
| Emails | 🟡 Simulados | 🔴 Reales |
| Calendar | 🟡 Simulado | 🔴 Real |
| Frontend | localhost:5173 | visualmecanica.cl |
| SMTP | Gmail personal | Hostinger profesional |
| Logs | Detallados | Mínimos |

## 🔍 Verificación

### Verificar configuración actual:
```powershell
.\verify-security.ps1
```

### Probar en desarrollo:
```bash
# Los emails aparecerán como [SIMULADO] en logs
# No se enviarán emails reales
```

### Probar en producción:
```bash
# ⚠️ CUIDADO: Los emails se envían REALMENTE
# Verificar destinatarios antes de probar
```

## 🆘 Solución de Problemas

### Si los emails no se simulan en desarrollo:
```env
SIMULATE_EMAILS=true
ENVIRONMENT=development
```

### Si los emails no se envían en producción:
1. Verificar credenciales SMTP
2. Verificar firewall del VPS (puerto 465)
3. Revisar logs de error

### Rollback a configuración anterior:
```powershell
# Buscar backup más reciente
ls backup_env_*
# Restaurar
copy backup_env_YYYY-MM-DD_HH-mm-ss\.env.backup .env
```

---

**💡 Tip:** Siempre usa `development` para pruebas locales y `production` solo en el VPS final.
