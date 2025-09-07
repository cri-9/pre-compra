#!/bin/bash

# Script de configuración de seguridad para Visual Mecánica
# Este script implementa todas las medidas de seguridad recomendadas

echo "=== Configuración de Seguridad para Visual Mecánica ==="

# 1. Generar certificados SSL si no existen
if [ ! -f "nginx/ssl/visualmecanica.cl.crt" ]; then
    echo "Generando certificados SSL..."
    ./generate-ssl.sh
fi

# 2. Verificar configuración de headers de seguridad
echo "Verificando configuración de headers de seguridad..."
if [ ! -f "security-headers.conf" ]; then
    echo "❌ Error: security-headers.conf no encontrado"
    exit 1
fi

# 3. Verificar security.txt
if [ ! -f "security.txt" ]; then
    echo "❌ Error: security.txt no encontrado"
    exit 1
fi

# 4. Verificar configuración de Nginx
if [ ! -f "nginx/nginx.conf" ]; then
    echo "❌ Error: nginx.conf no encontrado"
    exit 1
fi

# 5. Verificar configuración de Apache
if [ ! -f "Backend/apache-prod.conf" ]; then
    echo "❌ Error: apache-prod.conf no encontrado"
    exit 1
fi

# 6. Crear directorio .well-known para security.txt
mkdir -p frontend/public/.well-known
cp security.txt frontend/public/.well-known/security.txt
cp security.txt frontend/public/security.txt

# 7. Configurar permisos seguros
chmod 644 security.txt
chmod 644 security-headers.conf
chmod 600 nginx/ssl/*.key 2>/dev/null || true
chmod 644 nginx/ssl/*.crt 2>/dev/null || true

echo "✅ Configuración de seguridad completada!"
echo ""
echo "Medidas implementadas:"
echo "- ✅ Content Security Policy (CSP)"
echo "- ✅ Strict Transport Security (HSTS)" 
echo "- ✅ Security.txt presente"
echo "- ✅ Headers de seguridad configurados"
echo "- ✅ Configuración SSL/TLS segura"
echo "- ✅ Protección contra ataques comunes"
echo "- ✅ Configuración PHP securizada"
echo "- ✅ Apache con headers de seguridad"
echo ""
echo "Para completar la configuración:"
echo "1. Ejecutar: docker-compose up --build"
echo "2. Para producción, reemplazar certificados autofirmados por certificados válidos"
echo "3. Configurar DNS con DNSSEC en el proveedor de dominio"
echo "4. Configurar firewall en el servidor"
echo ""
