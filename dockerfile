# Builder Stage
FROM node:20-alpine3.18 AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1
ENV SKIP_ENV_VALIDATION 1

RUN npm run build

# Runner Stage
FROM node:20-alpine3.18 AS runner
WORKDIR /app

# Install FFmpeg
RUN apk add --no-cache ffmpeg

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
ENV PORT 3000

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/package.json /app/package-lock.json ./
RUN npm ci --only=production

COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/ ./.next/

USER nextjs
EXPOSE 3000

CMD ["npm", "run", "start"]
