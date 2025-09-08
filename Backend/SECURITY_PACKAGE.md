# 🔒 PAQUETE DE REEMPLAZO SEGURO - VISUAL MECÁNICA

## Descripción General

Este paquete contiene la refactorización completa de seguridad para eliminar todas las credenciales hardcodeadas del proyecto Visual Mecánica. Incluye:

- **Infraestructura de seguridad centralizada**
- **Archivos de endpoints refactorizados**
- **Scripts de migración automática**
- **Herramientas de verificación y rollback**

## 📁 Estructura del Paquete

```
Backend/
├── helpers/                           # Infraestructura de seguridad
│   ├── SecurityConfig.php            # Configuración centralizada
│   ├── SecureMailer.php             # Envío seguro de emails
│   └── SecureDatabase.php           # Conexiones seguras de BD
│
├── *_secure.php                     # Endpoints refactorizados
│   ├── notificarTransferencia_secure.php
│   ├── enviarAgendamiento_secure.php
│   └── enviarCotizacion_secure.php
│
├── migrate_security.php             # Script de migración automática
├── rollback_security_migration.php  # Script de rollback
└── SECURITY_PACKAGE.md             # Este archivo
```

## 🚀 Instalación Rápida

### 1. Preparación
```bash
cd Backend/
cp .env.example .env
# Editar .env con sus credenciales reales
```

### 2. Migración Automática
```bash
php migrate_security.php
```

### 3. Verificación
```bash
php -l notificarTransferencia.php
php -l enviarAgendamiento.php  
php -l enviarCotizacion.php
```

## 🔧 Configuración Manual

Si prefiere migración manual:

### 1. Copiar Infraestructura
```bash
# Crear directorio helpers si no existe
mkdir -p helpers/

# Copiar archivos de seguridad
cp SecurityConfig.php helpers/
cp SecureMailer.php helpers/
cp SecureDatabase.php helpers/
```

### 2. Reemplazar Endpoints
```bash
# Respaldar originales
cp notificarTransferencia.php notificarTransferencia.original.php
cp enviarAgendamiento.php enviarAgendamiento.original.php
cp enviarCotizacion.php enviarCotizacion.original.php

# Instalar versiones seguras
cp notificarTransferencia_secure.php notificarTransferencia.php
cp enviarAgendamiento_secure.php enviarAgendamiento.php
cp enviarCotizacion_secure.php enviarCotizacion.php
```

## 📝 Variables de Entorno Requeridas

Crear archivo `.env` en Backend/ con:

```env
# === CONFIGURACIÓN GENERAL ===
ENVIRONMENT=development
FRONTEND_URL=http://localhost:5173
SIMULATE_EMAILS=true
SIMULATE_CALENDAR=true

# === CONFIGURACIÓN SMTP ===
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=tu-email@gmail.com
SMTP_PASSWORD=tu-app-password
SMTP_FROM_EMAIL=tu-email@gmail.com
SMTP_FROM_NAME=Visual Mecánica

# === CONFIGURACIÓN BASE DE DATOS ===
DB_HOST=localhost
DB_PORT=3306
DB_NAME=visual_mecanica
DB_USERNAME=tu-usuario
DB_PASSWORD=tu-password

# === CONFIGURACIÓN GOOGLE CALENDAR ===
GOOGLE_CLIENT_ID=tu-client-id.googleusercontent.com
GOOGLE_CLIENT_SECRET=tu-client-secret
GOOGLE_REDIRECT_URI=http://localhost/callback
```

## 🔍 Características de Seguridad

### ✅ Eliminado Completamente
- ❌ Credenciales SMTP hardcodeadas
- ❌ Contraseñas en texto plano
- ❌ URLs de API hardcodeadas
- ❌ Configuraciones específicas de entorno en código

### ✅ Implementado
- ✅ **SecurityConfig**: Configuración centralizada
- ✅ **SecureMailer**: Envío seguro con simulación
- ✅ **SecureDatabase**: Conexiones PDO seguras
- ✅ **Detección de entorno**: development/production
- ✅ **Simulación para desarrollo**: Sin envíos reales
- ✅ **Validación de configuración**: Auto-verificación
- ✅ **Logging seguro**: Sin exposición de credenciales

## 🎯 Ventajas del Nuevo Sistema

### 1. **Seguridad**
- Sin credenciales en código fuente
- Configuración centralizada
- Validación automática de variables

### 2. **Flexibilidad**
- Fácil cambio entre entornos
- Simulación para desarrollo
- Configuración por variables de entorno

### 3. **Mantenibilidad**
- Un solo punto de configuración
- Código más limpio
- Fácil debugging

### 4. **Escalabilidad**
- Fácil agregar nuevos servicios
- Patrones reutilizables
- Configuración consistente

## 🧪 Modo de Desarrollo

El sistema detecta automáticamente el entorno:

### Development (ENVIRONMENT=development)
```php
$security = SecurityConfig::getInstance();
$security->isDevelopment(); // true

// Correos se simulan (no se envían)
$mailer->sendMail($datos, true); // true = simular

// Logs detallados
$security->logConfiguration();
```

### Production (ENVIRONMENT=production)
```php
$security->isDevelopment(); // false

// Correos se envían realmente
$mailer->sendMail($datos, false); // false = envío real

// Logs mínimos de seguridad
```

## 📊 Comparación: Antes vs Después

### ❌ ANTES (Inseguro)
```php
// Credenciales hardcodeadas
$mail->Username = "visualmecanica2024@gmail.com";
$mail->Password = "password_seguro_123";
$mail->Host = "smtp.gmail.com";

// Configuración esparcida
$smtp_config = [
    'host' => 'smtp.gmail.com',
    'username' => 'usuario@gmail.com'
];
```

### ✅ DESPUÉS (Seguro)
```php
// Configuración centralizada y segura
$security = SecurityConfig::getInstance();
$smtp = $security->getSmtpConfig();

// Sin credenciales en código
$mailer = SecureMailer::getInstance();
$mailer->sendMail($datos, $security->isDevelopment());
```

## 🚨 Proceso de Rollback

Si hay problemas, puede revertir:

### Rollback Automático
```bash
php rollback_security_migration.php
```

### Rollback Manual
```bash
# Listar backups disponibles
php rollback_security_migration.php --list

# Usar backup específico
php rollback_security_migration.php --backup backup_migration_2025-09-08_14-30-15
```

## 🔧 Verificación Post-Instalación

### 1. Verificar Configuración
```bash
php -r "
require_once 'helpers/SecurityConfig.php';
\$security = SecurityConfig::getInstance();
\$security->logConfiguration();
"
```

### 2. Test de Envío (Simulado)
```bash
php -r "
require_once 'helpers/SecurityConfig.php';
require_once 'helpers/SecureMailer.php';
\$mailer = SecureMailer::getInstance();
\$result = \$mailer->sendMail([
    'destinatario' => 'test@example.com',
    'asunto' => 'Test',
    'mensajeHtml' => '<p>Test</p>'
], true);
var_dump(\$result);
"
```

### 3. Verificar Sintaxis
```bash
find . -name "*.php" -exec php -l {} \;
```

## 📋 Checklist de Migración

- [ ] ✅ Archivos de infraestructura copiados
- [ ] ✅ Variables de entorno configuradas
- [ ] ✅ Endpoints reemplazados
- [ ] ✅ Sintaxis verificada
- [ ] ✅ Tests de configuración ejecutados
- [ ] ✅ Backup creado
- [ ] ✅ Documentación actualizada

## 🔒 Mejores Prácticas de Seguridad

### 1. Variables de Entorno
```bash
# Nunca commitear .env
echo "*.env" >> .gitignore

# Usar .env.example como plantilla
cp .env .env.example
# Limpiar credenciales de .env.example
```

### 2. Permisos de Archivos
```bash
chmod 600 .env                    # Solo propietario
chmod 644 helpers/*.php          # Lectura pública
```

### 3. Validación Continua
```bash
# Buscar credenciales hardcodeadas
grep -r "password_seguro_123" --include="*.php" .
grep -r "@gmail.com" --include="*.php" . | grep -v ".env"
```

## 🚀 Próximos Pasos

1. **Implementar en VPS**:
   ```bash
   # En el VPS
   cd /var/www/visual-mecanica/Backend
   cp .env.example .env
   # Configurar variables de producción
   ```

2. **Configurar HTTPS**:
   ```bash
   # Actualizar .env
   FRONTEND_URL=https://tu-dominio.com
   ```

3. **Monitoring**:
   ```bash
   # Configurar logs de producción
   tail -f /var/log/apache2/error.log
   ```

## 📞 Soporte

Si tiene problemas con la migración:

1. **Verificar logs**: `tail -f error.log`
2. **Ejecutar rollback**: `php rollback_security_migration.php`
3. **Verificar permisos**: `ls -la helpers/`
4. **Validar .env**: `cat .env | grep -v PASSWORD`

---

**🔒 Visual Mecánica - Paquete de Seguridad v2.0**
*Fecha: 8 de septiembre de 2025*
