#!/bin/bash
set -euo pipefail

ENV_FILE="$HOME/.env.backup"
if [ ! -f "$ENV_FILE" ]; then
  echo "ERROR: $ENV_FILE not found. Create it with DATABASE_URL=postgres://..."
  exit 1
fi
source "$ENV_FILE"

BACKUP_DIR="$HOME/backups"
DATE=$(date +%Y-%m-%d)
FILENAME="backup-${DATE}.sql.gz"

mkdir -p "$BACKUP_DIR"

echo "[$(date)] Starting backup..."
pg_dump "$DATABASE_URL" | gzip > "$BACKUP_DIR/$FILENAME"
echo "[$(date)] Backup saved: $BACKUP_DIR/$FILENAME"

find "$BACKUP_DIR" -name "backup-*.sql.gz" -mtime +30 -delete
echo "[$(date)] Old backups cleaned."
