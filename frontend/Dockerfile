# Multi-stage Dockerfile for Next.js (Node 20 + pnpm)

FROM node:20-alpine AS deps
WORKDIR /app
RUN apk add --no-cache libc6-compat \
  && corepack enable \
  && corepack prepare pnpm@9 --activate
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM node:20-alpine AS builder
WORKDIR /app
RUN apk add --no-cache libc6-compat \
  && corepack enable \
  && corepack prepare pnpm@9 --activate
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build-time public env var for client bundle
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

RUN pnpm build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN apk add --no-cache libc6-compat

# Copy build artifacts and runtime deps
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
ENV PORT=3000

CMD ["node", "./node_modules/next/dist/bin/next", "start", "-p", "3000"]
