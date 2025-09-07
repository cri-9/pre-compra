# 📤 GUÍA COMPLETA - SUBIR CAMBIOS AL VPS VIA SFTP

## 🚀 MÉTODO 1: SFTP MANUAL PASO A PASO

### 1. Conectar al VPS
```bash
# Reemplaza con tus datos reales
sftp usuario@tu-vps-ip
# o si usas puerto específico:
sftp -P 22 usuario@tu-vps-ip
```

### 2. Navegar al directorio del proyecto
```bash
cd /var/www/html/pre-compra
# o tu ruta específica donde está el proyecto
```

### 3. Transferir archivos de seguridad uno por uno
```bash
put vps-upload/security-headers.conf
put vps-upload/security.txt
put vps-upload/SEGURIDAD.md
put vps-upload/INFORME_SEGURIDAD.md
put vps-upload/setup-security.sh
put vps-upload/generate-ssl.sh
put vps-upload/backend.Dockerfile
put vps-upload/docker-compose.yml
```

### 4. Transferir configuraciones
```bash
put vps-upload/nginx/nginx.conf nginx/
put vps-upload/Backend/apache-prod.conf Backend/
put vps-upload/Backend/.htaccess Backend/
```

### 5. Transferir certificados SSL
```bash
mkdir nginx/ssl
put vps-upload/nginx/ssl/visualmecanica.cl.crt nginx/ssl/
put vps-upload/nginx/ssl/visualmecanica.cl.key nginx/ssl/
```

### 6. Transferir archivos del frontend
```bash
mkdir -p frontend/public/.well-known
put vps-upload/frontend/public/.well-known/security.txt frontend/public/.well-known/
put vps-upload/frontend/public/security.txt frontend/public/
```

---

## ⚡ MÉTODO 2: SFTP AUTOMATIZADO

### Usar el archivo de comandos creado:
```bash
sftp -b comandos-sftp.txt usuario@tu-vps-ip
```

**Ventaja**: Ejecuta todos los comandos automáticamente.

---

## 🛠️ MÉTODO 3: USANDO CLIENTE SFTP GRÁFICO

### Clientes Recomendados:
- **WinSCP** (Windows)
- **FileZilla** (Multiplataforma)
- **Cyberduck** (Multiplataforma)

### Archivos a transferir:
1. **Raíz del proyecto**:
   - `security-headers.conf`
   - `security.txt`
   - `SEGURIDAD.md`
   - `INFORME_SEGURIDAD.md`
   - `setup-security.sh`
   - `generate-ssl.sh`
   - `backend.Dockerfile`
   - `docker-compose.yml`

2. **nginx/**:
   - `nginx.conf`

3. **nginx/ssl/**:
   - `visualmecanica.cl.crt`
   - `visualmecanica.cl.key`

4. **Backend/**:
   - `apache-prod.conf`
   - `.htaccess`

5. **frontend/public/**:
   - `security.txt`

6. **frontend/public/.well-known/**:
   - `security.txt`

---

## 🔧 COMANDOS POST-TRANSFERENCIA

### En el VPS (vía SSH):
```bash
# 1. Conectar vía SSH
ssh usuario@tu-vps-ip

# 2. Navegar al proyecto
cd /var/www/html/pre-compra

# 3. Dar permisos a scripts
chmod +x setup-security.sh
chmod +x generate-ssl.sh
chmod +x deploy.sh

# 4. Establecer permisos seguros para SSL
chmod 600 nginx/ssl/*.key
chmod 644 nginx/ssl/*.crt

# 5. Ejecutar configuración de seguridad
./setup-security.sh

# 6. Generar certificados SSL reales (reemplazar temporales)
sudo certbot --nginx -d visualmecanica.cl -d www.visualmecanica.cl

# 7. Reiniciar servicios con Docker
docker-compose down
docker-compose up -d --build

# 8. Verificar que todo funcione
docker-compose ps
curl -I https://visualmecanica.cl
```

---

## ⚠️ CONSIDERACIONES IMPORTANTES

### Backup antes de subir:
```bash
# En el VPS
cp -r /var/www/html/pre-compra /var/www/html/pre-compra_backup_$(date +%Y%m%d)
```

### Certificados SSL:
- Los certificados actuales son **TEMPORALES** para desarrollo
- En producción usar Let's Encrypt: `sudo certbot --nginx -d visualmecanica.cl`

### Variables de entorno:
- Verificar que `.env` esté configurado correctamente en el VPS
- No subir archivos `.env` vía SFTP (usar SSH para editarlos)

### Firewall:
- Verificar que puertos 80 y 443 estén abiertos
- Configurar firewall según la documentación

---

## 🧪 VERIFICACIÓN POST-DESPLIEGUE

### Testing Local:
```bash
curl -I https://visualmecanica.cl
curl https://visualmecanica.cl/.well-known/security.txt
```

### Testing Online:
1. [SSL Labs](https://www.ssllabs.com/ssltest/) - Verificar SSL/TLS
2. [Security Headers](https://securityheaders.com/) - Verificar headers
3. [Mozilla Observatory](https://observatory.mozilla.org/) - Auditoría completa

---

## 📞 SOPORTE

Si encuentras problemas:
1. Verificar logs: `docker-compose logs`
2. Verificar estado: `docker-compose ps`
3. Verificar configuración: `nginx -t` dentro del contenedor
4. Consultar documentación: `SEGURIDAD.md`

---

## ✅ CHECKLIST FINAL

- [ ] Archivos transferidos correctamente
- [ ] Permisos establecidos (`chmod +x *.sh`)
- [ ] Script de seguridad ejecutado (`./setup-security.sh`)
- [ ] Certificados SSL instalados (Let's Encrypt)
- [ ] Docker reiniciado (`docker-compose up -d --build`)
- [ ] Tests de seguridad pasados
- [ ] Backup realizado
- [ ] Monitoreo configurado

**¡Tu proyecto estará completamente seguro y listo para producción!** 🛡️
