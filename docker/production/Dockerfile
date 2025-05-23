# syntax=docker.io/docker/dockerfile:1

FROM node:18-alpine AS base

# 1. Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

WORKDIR /app

# 1. Установка зависимостей из предпочтительного источника
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i; \
  else echo "Lockfile not found." && exit 1; \
  fi


# 2. Пересборка исходников только когда необходимо
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 3. Копирование файла с переменными окржения
COPY .env.production .

# 4. Генерация клиента для Prisma ORM
RUN npx prisma generate --schema ./src/database/prisma

# 5. Сборка продуктовой версии приложения
RUN npm run build

# 6. Сборка продуктового образа, копирование всех файлов и запуск standalone версии Next-приложения
FROM base AS runner
WORKDIR /app

ENV NODE_ENV="production"

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 8080

ENV PORT=8080

CMD HOSTNAME="0.0.0.0" node server.js