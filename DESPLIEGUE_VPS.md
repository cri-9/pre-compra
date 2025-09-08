# 🚀 COMANDOS PARA SUBIR COMMIT A GITHUB

## 1. Verificar archivos modificados
```bash
git status
```

## 2. Agregar archivos al staging (CUIDADO: No subir .env con credenciales)
```bash
# Agregar archivos específicos (SIN .env)
git add Backend/helpers/
git add Backend/*_secure.php
git add Backend/migrate_security.php
git add Backend/rollback_security_migration.php
git add Backend/switch-environment.ps1
git add Backend/verify-security.ps1
git add Backend/SECURITY_PACKAGE.md
git add Backend/CONFIGURACION_ENTORNOS.md

# Verificar que .env NO esté en el commit
git status
```

## 3. Hacer commit
```bash
git commit -m "🔒 Implementar paquete de seguridad completo

- Agregar infraestructura SecurityConfig, SecureMailer, SecureDatabase
- Refactorizar endpoints para eliminar credenciales hardcodeadas
- Implementar sistema de cambio de entornos dev/prod
- Agregar scripts de migración y verificación
- Documentación completa de configuración"
```

## 4. Subir a GitHub
```bash
git push origin main
```

## ⚠️ IMPORTANTE: Verificar .gitignore
```bash
# Verificar que .env esté excluido
cat Backend/.gitignore | grep ".env"

# Si no está, agregarlo:
echo ".env" >> Backend/.gitignore
echo ".env.local" >> Backend/.gitignore  
echo ".env.production" >> Backend/.gitignore
```

---

# 📦 ARCHIVOS PARA SUBIR AL VPS UBUNTU

## Estructura a subir al VPS:
```
/var/www/visual-mecanica/Backend/
├── helpers/                          # ✅ SUBIR
│   ├── SecurityConfig.php
│   ├── SecureMailer.php
│   └── SecureDatabase.php
│
├── *.php                            # ✅ SUBIR (endpoints principales)
│   ├── notificarTransferencia.php
│   ├── enviarAgendamiento.php
│   ├── enviarCotizacion.php
│   ├── verificarBloque.php
│   ├── webpay.php
│   └── [todos los otros *.php]
│
├── .env.production                  # ✅ SUBIR (como plantilla)
├── .gitignore                       # ✅ SUBIR
├── composer.json                    # ✅ SUBIR
├── switch-environment.ps1           # ✅ SUBIR
├── verify-security.ps1              # ✅ SUBIR
├── CONFIGURACION_ENTORNOS.md        # ✅ SUBIR
│
├── vendor/                          # ❌ NO SUBIR (instalar en VPS)
├── .env                            # ❌ NO SUBIR (crear en VPS)
├── logs/                           # ❌ NO SUBIR (crear en VPS)
└── backup_*/                       # ❌ NO SUBIR
```

## Comandos para subir al VPS:

### 1. Comprimir archivos (desde directorio pre-compra):
```bash
# Crear archivo comprimido SIN archivos sensibles
tar -czf visual-mecanica-backend.tar.gz \
  --exclude="Backend/.env" \
  --exclude="Backend/vendor" \
  --exclude="Backend/logs" \
  --exclude="Backend/backup_*" \
  --exclude="Backend/*.log" \
  Backend/
```

### 2. Subir al VPS:
```bash
# Opción A: SCP
scp visual-mecanica-backend.tar.gz usuario@tu-vps-ip:/home/usuario/

# Opción B: SFTP
sftp usuario@tu-vps-ip
put visual-mecanica-backend.tar.gz
quit
```

### 3. En el VPS Ubuntu - Configurar:
```bash
# Conectar al VPS
ssh usuario@tu-vps-ip

# Ir al directorio web
cd /var/www/

# Crear directorio si no existe
sudo mkdir -p visual-mecanica

# Extraer archivos
cd /home/usuario/
tar -xzf visual-mecanica-backend.tar.gz

# Mover archivos
sudo mv Backend/* /var/www/visual-mecanica/
sudo chown -R www-data:www-data /var/www/visual-mecanica/

# Ir al directorio de la aplicación
cd /var/www/visual-mecanica/
```

### 4. Configurar entorno de producción en VPS:
```bash
# Copiar configuración de producción
sudo cp .env.production .env

# Instalar Composer si no está instalado
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer

# Instalar dependencias PHP
composer install --no-dev --optimize-autoloader

# Crear directorios necesarios
sudo mkdir -p logs
sudo mkdir -p tmp

# Configurar permisos
sudo chmod 600 .env
sudo chmod -R 755 helpers/
sudo chmod -R 775 logs/
sudo chmod -R 775 tmp/

# Verificar configuración
php verify-security.ps1  # (si tienes PowerShell en Linux)
# O crear un script PHP similar para verificar
```

### 5. Configurar servidor web (Apache/Nginx):

#### Para Apache:
```bash
# Crear VirtualHost
sudo nano /etc/apache2/sites-available/visual-mecanica.conf
```

#### Para Nginx:
```bash
# Configurar server block
sudo nano /etc/nginx/sites-available/visual-mecanica
```

### 6. Configurar SSL (Certbot):
```bash
# Instalar Certbot
sudo apt update
sudo apt install certbot python3-certbot-apache  # Para Apache
# O
sudo apt install certbot python3-certbot-nginx   # Para Nginx

# Obtener certificado SSL
sudo certbot --apache -d visualmecanica.cl      # Apache
# O  
sudo certbot --nginx -d visualmecanica.cl       # Nginx
```

---

# 📋 CHECKLIST DE DESPLIEGUE

## Antes de subir:
- [ ] ✅ Verificar que .env no esté en el commit
- [ ] ✅ Verificar que vendor/ no esté en el commit  
- [ ] ✅ Probar localmente en modo development
- [ ] ✅ Documentación actualizada

## En el VPS:
- [ ] ✅ Archivos extraídos en /var/www/visual-mecanica/
- [ ] ✅ .env configurado para producción
- [ ] ✅ Composer install ejecutado
- [ ] ✅ Permisos configurados correctamente
- [ ] ✅ Servidor web configurado
- [ ] ✅ SSL configurado
- [ ] ✅ Base de datos configurada
- [ ] ✅ Pruebas de endpoints funcionando

## Verificación final:
- [ ] ✅ Emails se envían correctamente (Hostinger)
- [ ] ✅ Base de datos funciona
- [ ] ✅ HTTPS activo
- [ ] ✅ CORS configurado para el dominio
- [ ] ✅ Logs sin errores críticos
