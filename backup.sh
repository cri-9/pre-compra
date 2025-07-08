#!/bin/bash

# Script de backup automático para producción

BACKUP_DIR="/backups/visualmecanica"
DATE=$(date +%Y%m%d_%H%M%S)

echo "📁 Iniciando backup - $DATE"

# Crear directorio de backup
mkdir -p $BACKUP_DIR

# Backup de la base de datos
docker exec visualmecanica-db-prod mysqldump -u visualmecanica_user -p'tu_password_seguro_aqui' visualmecanica_prod > $BACKUP_DIR/db_backup_$DATE.sql

# Backup de archivos
tar -czf $BACKUP_DIR/files_backup_$DATE.tar.gz ./Backend ./frontend/dist

# Eliminar backups antiguos (mantener últimos 7 días)
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "✅ Backup completado: $BACKUP_DIR/backup_$DATE"
