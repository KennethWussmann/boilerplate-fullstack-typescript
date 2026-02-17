# Build stage
FROM node:24-alpine AS builder

RUN corepack enable

WORKDIR /app

COPY . .

RUN pnpm install --frozen-lockfile --ignore-scripts

ENV VITE_HTTP_API_URL=/api/graphql
ENV VITE_API_ENABLED=true
RUN pnpm build

# Production stage
FROM node:24-alpine AS runner
RUN corepack enable
ARG VERSION

ENV NODE_ENV=production
ENV API_PORT=8080
ENV API_BASE_PATH=/api
ENV VERSION=${VERSION}
ENV CONFIG_PATH=/data
ENV FRONTEND_ENABLED=true
ENV FRONTEND_LOCAL_PATH=/app/apps/web/dist

WORKDIR ${CONFIG_PATH}

COPY --from=builder /app /app

EXPOSE 8080

ENTRYPOINT sh -c "cd /app/apps/server && pnpm db:migrate && node dist/run.js"