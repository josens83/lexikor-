#!/bin/bash
# Database initialization script for LexiKor

set -e

echo "🚀 LexiKor Database Initialization"
echo "=================================="

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL..."
until pg_isready -h ${DB_HOST:-localhost} -p ${DB_PORT:-5432} -U ${DB_USER:-lexikor}; do
    echo "PostgreSQL is unavailable - sleeping"
    sleep 2
done

echo "✅ PostgreSQL is ready!"

# Run Alembic migrations
echo "📦 Running database migrations..."
cd /app
alembic upgrade head

echo "✅ Migrations completed!"

# Run seed script if it exists
if [ -f "scripts/seed_db.py" ]; then
    echo "🌱 Seeding database with initial data..."
    python scripts/seed_db.py
    echo "✅ Database seeded!"
else
    echo "⚠️  Seed script not found, skipping..."
fi

echo "🎉 Database initialization completed successfully!"
