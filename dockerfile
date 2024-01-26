# # Builder Stage
# FROM node:20-alpine3.18 AS builder
# WORKDIR /app
# COPY package.json package-lock.json* ./
# RUN npm ci
# COPY . .

# ENV NEXT_TELEMETRY_DISABLED 1
# ENV SKIP_ENV_VALIDATION 1

# RUN npm run build

# # Runner Stage
# FROM node:20-alpine3.18 AS runner
# WORKDIR /app

# # Install FFmpeg
# RUN apk add --no-cache ffmpeg

# ENV NODE_ENV production
# ENV NEXT_TELEMETRY_DISABLED 1
# ENV PORT 3000

# RUN addgroup --system --gid 1001 nodejs
# RUN adduser --system --uid 1001 nextjs

# COPY --from=builder /app/package.json /app/package-lock.json ./
# RUN npm ci --only=production

# COPY --from=builder /app/next.config.mjs ./
# COPY --from=builder /app/src/env.mjs ./
# COPY --from=builder /app/public ./public
# COPY --from=builder --chown=nextjs:nodejs /app/.next/ ./.next/

# USER nextjs
# EXPOSE 3000

# CMD ["npm", "run", "start"]
# Install dependencies only when needed
FROM node:20-alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
RUN apk add --no-cache ffmpeg
WORKDIR /app
COPY package.json package-lock.json ./ 
RUN npm ci

# Rebuild the source code only when needed
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Production image, copy all the files and run next
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# You only need to copy next.config.js if you are NOT using the default configuration
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Automatically leverage output traces to reduce image size 
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
