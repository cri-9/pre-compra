# Documentación de Seguridad - Visual Mecánica

## Medidas de Seguridad Implementadas

### ✅ Content Security Policy (CSP)
- **Estado**: Implementado
- **Ubicación**: `security-headers.conf`, `nginx/nginx.conf`, `Backend/apache-prod.conf`
- **Descripción**: Controla qué recursos pueden cargar las páginas web, previniendo ataques XSS y de inyección de código.

### ✅ HTTP Strict Transport Security (HSTS)
- **Estado**: Implementado  
- **Ubicación**: `security-headers.conf`, configuración SSL de Nginx
- **Descripción**: Fuerza conexiones HTTPS y previene ataques de degradación de protocolo.
- **Configuración**: `max-age=31536000; includeSubDomains; preload`

### ✅ Security.txt
- **Estado**: Implementado
- **Ubicación**: `security.txt`, `/frontend/public/.well-known/security.txt`
- **Descripción**: Archivo que proporciona información de contacto para investigadores de seguridad.
- **URLs**: `https://visualmecanica.cl/.well-known/security.txt` y `https://visualmecanica.cl/security.txt`

### ✅ Headers de Seguridad Adicionales

#### X-Frame-Options
- Previene ataques de clickjacking
- Valor: `SAMEORIGIN`

#### X-Content-Type-Options  
- Previene ataques de MIME sniffing
- Valor: `nosniff`

#### X-XSS-Protection
- Protección contra XSS en navegadores antiguos
- Valor: `1; mode=block`

#### Referrer-Policy
- Controla información del referrer enviada
- Valor: `strict-origin-when-cross-origin`

#### Permissions-Policy
- Controla APIs del navegador que pueden usar las páginas
- Restringe geolocalización, cámara, micrófono, etc.

### ✅ Configuración SSL/TLS Segura
- **Protocolos**: TLS 1.2 y 1.3 únicamente
- **Cifrados**: Suite de cifrados seguros con preferencia ECDHE
- **OCSP Stapling**: Habilitado
- **Session Resumption**: Configurado de forma segura

### ✅ Configuración PHP Securizada
- `expose_php = Off` - Oculta versión de PHP
- `display_errors = Off` - No muestra errores en producción
- `session.cookie_httponly = 1` - Cookies no accesibles vía JavaScript
- `session.cookie_secure = 1` - Cookies solo por HTTPS
- `session.use_only_cookies = 1` - Solo cookies para sesiones

### ✅ Apache - Configuración de Seguridad
- Headers de seguridad configurados
- Archivos sensibles bloqueados (`.env`, `.log`, etc.)
- Directorios ocultos protegidos
- CORS configurado de forma restrictiva
- Tokens del servidor ocultados

### ✅ Nginx - Configuración de Seguridad  
- Proxy con headers de seguridad
- Archivos sensibles bloqueados
- Límites de tamaño de petición
- Timeouts de seguridad configurados
- Server tokens deshabilitados

### ✅ Docker - Seguridad de Contenedores
- Volúmenes de solo lectura donde es posible
- `no-new-privileges` habilitado
- Usuarios no-root
- Tmpfs para datos temporales

## Problemas de Seguridad Resueltos

### 🔒 Content Security Policy
- **Antes**: ❌ No configurado
- **Después**: ✅ CSP completo implementado

### 🔒 Strict Transport Security  
- **Antes**: ❌ No configurado
- **Después**: ✅ HSTS habilitado con preload

### 🔒 Security.txt
- **Antes**: ❌ No presente
- **Después**: ✅ Disponible en ubicaciones estándar

## Configuración Requerida del Servidor/Hosting

### DNS y DNSSEC
Para resolver los problemas de DNSSEC, configurar en el proveedor de DNS:

```
DNSKEY record: Configurar en el panel del proveedor
DS record: Configurar en el registrar del dominio  
RRSIG records: Se generan automáticamente
```

### Firewall
Configurar firewall para permitir solo puertos necesarios:
- Puerto 80 (HTTP) - Solo para redirección a HTTPS
- Puerto 443 (HTTPS) - Tráfico principal
- Puerto 22 (SSH) - Solo para administración
- Bloquear todos los demás puertos

### DoH (DNS over HTTPS)
Configurar en el servidor DNS o usar servicios como:
- Cloudflare DNS: 1.1.1.1
- Quad9: 9.9.9.9

## Scripts de Configuración

### Configuración Inicial
```bash
# Linux/macOS
./setup-security.sh

# Windows
setup-security.bat
```

### Generar Certificados SSL (Desarrollo)
```bash
# Linux/macOS
./generate-ssl.sh

# Windows  
generate-ssl.bat
```

### Iniciar con Seguridad
```bash
docker-compose up --build
```

## Verificación de Seguridad

### Herramientas de Testing
- [SSL Labs](https://www.ssllabs.com/ssltest/)
- [Security Headers](https://securityheaders.com/)
- [Mozilla Observatory](https://observatory.mozilla.org/)

### Comandos de Verificación
```bash
# Verificar headers de seguridad
curl -I https://visualmecanica.cl

# Verificar CSP
curl -H "Accept: text/html" https://visualmecanica.cl

# Verificar security.txt
curl https://visualmecanica.cl/.well-known/security.txt
```

## Mantenimiento de Seguridad

### Tareas Regulares
1. **Actualizar certificados SSL** (cada 90 días con Let's Encrypt)
2. **Revisar logs de seguridad** (semanalmente)
3. **Actualizar dependencias** (mensualmente)
4. **Auditoría de seguridad** (trimestralmente)

### Monitoreo
- Configurar alertas para certificados próximos a vencer
- Monitorear logs de acceso para patrones sospechosos
- Verificar integridad de archivos críticos

## Producción vs Desarrollo

### Desarrollo
- Certificados autofirmados permitidos
- Errores PHP visibles para debugging
- CORS más permisivo para testing

### Producción  
- Certificados SSL válidos requeridos
- Errores PHP ocultos
- CORS restrictivo
- Logs de seguridad habilitados
- Monitoreo activo

## Contacto de Seguridad

En caso de encontrar vulnerabilidades de seguridad:
- Email: security@visualmecanica.cl  
- URL: https://visualmecanica.cl/contact

**Tiempo de respuesta esperado**: 24-48 horas
