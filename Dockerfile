# Build stage
FROM node:24-alpine AS builder
ARG APP_NAME=server

RUN corepack enable

WORKDIR /app

# Copy all files needed for build
COPY . .

RUN pnpm install --frozen-lockfile
RUN pnpm build --filter ${APP_NAME}

# Production stage
FROM node:24-alpine AS runner
ARG VERSION
ARG APP_NAME=server

# Set environment variables
ENV NODE_ENV=production
ENV API_PORT=8080
ENV VERSION=${VERSION}
ENV APP_NAME=${APP_NAME}
ENV CONFIG_PATH=/data

WORKDIR ${CONFIG_PATH}

COPY --from=builder /app /app

EXPOSE 8080

# Start the application
ENTRYPOINT sh -c "node /app/apps/${APP_NAME}/dist/run.js"