#!/bin/bash

# Script para configurar SSL con Let's Encrypt

echo "🔒 Configurando SSL para visualmecanica.cl..."

# Instalar certbot
sudo apt update
sudo apt install -y certbot python3-certbot-nginx

# Obtener certificado SSL
sudo certbot --nginx -d visualmecanica.cl -d www.visualmecanica.cl

# Configurar renovación automática
sudo crontab -l > mycron
echo "0 12 * * * /usr/bin/certbot renew --quiet" >> mycron
sudo crontab mycron
rm mycron

echo "✅ SSL configurado correctamente"
echo "🔒 Tu sitio ahora está disponible en https://visualmecanica.cl"
