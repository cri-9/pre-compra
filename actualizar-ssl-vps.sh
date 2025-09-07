# Comandos para actualizar configuración SSL en el VPS

# 1. Hacer backup de la configuración actual
cp nginx/nginx.conf nginx/nginx.conf.backup

# 2. Verificar ubicación de certificados Let's Encrypt
ls -la /etc/letsencrypt/live/visualmecanica.cl/

# 3. Actualizar nginx.conf para usar certificados reales
# Editar nginx/nginx.conf y cambiar estas líneas:

# CAMBIAR DE:
# ssl_certificate /etc/nginx/ssl/visualmecanica.cl.crt;
# ssl_certificate_key /etc/nginx/ssl/visualmecanica.cl.key;

# CAMBIAR A:
# ssl_certificate /etc/letsencrypt/live/visualmecanica.cl/fullchain.pem;
# ssl_certificate_key /etc/letsencrypt/live/visualmecanica.cl/privkey.pem;

# 4. Verificar configuración
nginx -t

# 5. Reiniciar servicios
docker-compose down
docker-compose up -d --build

# 6. Verificar que funcione
curl -I https://visualmecanica.cl
