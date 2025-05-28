#!/bin/bash

BACKEND_PATH="$(dirname "$0")/.."

echo "Buscando y eliminando archivos temporales en: $BACKEND_PATH"

# Eliminar archivos tmp_*.json, tmp_test.json, tmpdatos_webpay_*.json, *.log, archivos de prueba
find "$BACKEND_PATH" -maxdepth 1 \( \
    -name 'tmp_*.json' -o \
    -name 'tmp_test.json' -o \
    -name 'tmpdatos_webpay_*.json' -o \
    -name '*.log' -o \
    -name 'prueba*' -o \
    -name 'test*' \
\) -type f -print -delete

echo "Eliminación completada."