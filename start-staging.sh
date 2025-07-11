#!/bin/bash

echo "========================================"
echo "  VISUAL MECANICA - STAGING CON NGROK"
echo "========================================"
echo ""

# Verificar si Docker está corriendo
if ! docker ps >/dev/null 2>&1; then
    echo "❌ ERROR: Docker no está corriendo"
    echo "Inicia Docker primero"
    exit 1
fi

# Verificar si ngrok está instalado
if ! command -v ngrok >/dev/null 2>&1; then
    echo "❌ ERROR: Ngrok no está instalado"
    echo ""
    echo "Instala ngrok:"
    echo "- MacOS: brew install ngrok"
    echo "- Ubuntu: snap install ngrok"
    echo "- O descarga desde: https://ngrok.com/download"
    exit 1
fi

echo "🐳 Iniciando aplicación Docker..."
docker-compose -f docker-compose.prod.yml up -d

echo "⏳ Esperando que los servicios estén listos..."
sleep 15

echo "🌐 Verificando servicios..."
if curl -f http://localhost:80 >/dev/null 2>&1; then
    PORT=80
elif curl -f http://localhost:3000 >/dev/null 2>&1; then
    PORT=3000
else
    echo "❌ No se puede conectar a la aplicación"
    echo "Revisa los logs: docker-compose -f docker-compose.prod.yml logs"
    exit 1
fi

echo "✅ Aplicación lista en puerto $PORT"

echo ""
echo "🚀 Iniciando túnel ngrok..."
echo "📝 La URL pública aparecerá en unos segundos..."
echo "🔍 Panel de control: http://localhost:4040"
echo ""
echo "⚠️ IMPORTANTE: No cierres esta terminal mientras uses la aplicación"
echo ""

# Iniciar ngrok
ngrok http $PORT
