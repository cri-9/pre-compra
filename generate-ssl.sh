#!/bin/bash

# Script para generar certificados SSL autofirmados para desarrollo
# En producción, usar Let's Encrypt o certificados válidos

SSL_DIR="nginx/ssl"
DOMAIN="visualmecanica.cl"

# Crear directorio SSL si no existe
mkdir -p $SSL_DIR

# Generar clave privada
openssl genrsa -out $SSL_DIR/$DOMAIN.key 2048

# Generar solicitud de certificado
openssl req -new -key $SSL_DIR/$DOMAIN.key -out $SSL_DIR/$DOMAIN.csr -subj "/C=CL/ST=Santiago/L=Santiago/O=Visual Mecanica/OU=IT Department/CN=$DOMAIN"

# Generar certificado autofirmado
openssl x509 -req -days 365 -in $SSL_DIR/$DOMAIN.csr -signkey $SSL_DIR/$DOMAIN.key -out $SSL_DIR/$DOMAIN.crt

# Establecer permisos seguros
chmod 600 $SSL_DIR/$DOMAIN.key
chmod 644 $SSL_DIR/$DOMAIN.crt

echo "Certificados SSL generados en $SSL_DIR/"
echo "NOTA: Estos son certificados autofirmados para desarrollo."
echo "Para producción, usar Let's Encrypt o certificados válidos."
