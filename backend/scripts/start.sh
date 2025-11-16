#!/bin/bash
# Startup script for LexiKor Backend

set -e

echo "🚀 Starting LexiKor Backend..."

# Initialize database if needed
if [ "${INIT_DB:-false}" = "true" ]; then
    echo "🔧 Initializing database..."
    bash /app/scripts/init_db.sh
fi

# Start the application
echo "🌐 Starting FastAPI server..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
