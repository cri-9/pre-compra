#!/bin/bash

# Parametros: modificar según corresponda:
USER="root"
PASS=""
DB="precompra_db"
BACKUP_PATH="../backups/"
DATE=$(date +"%Y-%m-%d_%H-%M-%S")

mkdir -p "$BACKUP_PATH"
mysqldump -u "$USER" -p"$PASS" "$DB" > "$BACKUP_PATH/backup_${DB}_$DATE.sql"

# Opcional: eliminar backups de más de 7 días:
find "$BACKUP_PATH" -name "backup_${DB}_*.sql" -type f -mtime +7 -delete