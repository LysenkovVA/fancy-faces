#!/bin/bash
set -e

# Wait for PostgreSQL to be ready
#echo "Ожидание запуска PostgreSQL..."
#until pg_isready -h localhost -p 5432 -U postgres
#do
#  echo "Проверка запуска PostgreSQL..."
#  sleep 1
#done
#
#echo "PostgreSQL запущен!"

# Run migrations
echo "Запуск миграций Prisma..."
npx prisma migrate deploy

# Generate Prisma client
echo "Генерация клиента Prisma..."
npx prisma generate

# Start the Next.js application
echo "Запуск приложения Next.js..."
exec "$@"
