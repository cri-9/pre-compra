#!/bin/bash

cd "$(dirname "$0")/.."

if [ -f ".env" ]; then
    echo "❗ Ya existe un archivo .env, no se sobrescribirá."
    exit 1
fi

if [ -f ".env.example" ]; then
    cp .env.example .env
    echo "✅ Archivo .env creado a partir de .env.example. Edita .env con tus credenciales reales."
else
    echo "❌ No se encuentra .env.example para copiar."
    exit 2
fi