# Build stage
FROM node:22-alpine AS builder

RUN corepack enable

WORKDIR /app

# Copy all files needed for build
COPY . .

RUN pnpm install --frozen-lockfile
RUN pnpm build --filter server
RUN pnpm install --frozen-lockfile
RUN pnpm build

# Production stage
FROM node:22-alpine AS runner
ARG VERSION


# Set environment variables
ENV NODE_ENV=production
ENV API_PORT=8080
ENV VERSION=${VERSION}
ENV CONFIG_PATH=/data

WORKDIR ${CONFIG_PATH}

COPY --from=builder /app /app

EXPOSE 8080

# Start server
ENTRYPOINT ["node", "/app/packages/server/dist/run.js"]