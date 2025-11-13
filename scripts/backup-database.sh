#!/bin/bash

# Database backup script
# Creates timestamped backups of PostgreSQL database

set -e

# Configuration
BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/gitcaster_backup_$TIMESTAMP.sql"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

echo "🗄️  Creating database backup..."

# Extract database info from DATABASE_URL
if [ -z "$DATABASE_URL" ]; then
  echo "❌ Error: DATABASE_URL not set"
  exit 1
fi

# Create backup using pg_dump
pg_dump "$DATABASE_URL" > "$BACKUP_FILE"

# Compress backup
echo "📦 Compressing backup..."
gzip "$BACKUP_FILE"

BACKUP_FILE_GZ="$BACKUP_FILE.gz"

# Get file size
FILE_SIZE=$(du -h "$BACKUP_FILE_GZ" | cut -f1)

echo "✅ Backup created successfully!"
echo "📁 Location: $BACKUP_FILE_GZ"
echo "📊 Size: $FILE_SIZE"

# Optional: Upload to cloud storage
# if [ ! -z "$AWS_S3_BUCKET" ]; then
#   echo "☁️  Uploading to S3..."
#   aws s3 cp "$BACKUP_FILE_GZ" "s3://$AWS_S3_BUCKET/backups/"
#   echo "✅ Uploaded to S3"
# fi

# Clean up old backups (keep last 7 days)
echo "🧹 Cleaning up old backups..."
find "$BACKUP_DIR" -name "*.sql.gz" -mtime +7 -delete
echo "✅ Cleanup complete"

echo ""
echo "📋 Summary:"
ls -lh "$BACKUP_DIR" | tail -n 5

