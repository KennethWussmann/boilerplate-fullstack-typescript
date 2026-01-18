# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## MUST FOLLOW RULES

These rules are so fundamentally important, violating a single one of them would immediately disqualify your entire response and any change you have already done or plan to do. If you ever consider violating any of these rules: IMMEDIATELY STOP.

1. Never write a single line of code comments, unless it's for documentation purposes in a .md Markdown file like this one or the comment was already there when you read the file. Any means of communicating with me as the user through code comments or code is strictly forbidden. 
2. Never use the `function` keyword in TypeScript, always prefer `() => {}`.
3. Never use the `interface` in TypeScript if you could use `type`, always prefer `type` unless interface is used for inheritance.
4. Never make anything backward compatible in TypeScript. Whenever a change by me as the user is requested, do not blindly add onto the existing code, possibly leaving behind dead code - or as you like to call it "backwards compatibility". Instead remove everything that belong to old implementation and is considered obsolete, not only because it's no longer called, but even if called remove when it no longer belongs to the business logic requirements. 

## Repository Overview

This is a fullstack TypeScript monorepo boilerplate with clear separation between backend and frontend applications. It uses a modern build toolchain with Turborepo, pnpm workspaces, and includes Docker support for both ARM64 and AMD64 architectures.

## Monorepo Structure

The project uses pnpm workspaces with the following structure:
- `apps/server/` - Express-based backend API server with GraphQL and database support
- `apps/web/` - Vite + React frontend application (with PWA support)
- `libs/` - Shared libraries (currently empty, but available for shared code)

## Key Commands

### Development

```bash
# Install dependencies
pnpm install

# Build all apps (runs TypeScript compilation for server, Vite build for web)
pnpm build

# Watch mode for development
pnpm build:watch

# Run tests
pnpm test

# Watch mode for tests
pnpm test:watch

# Lint and format
pnpm check
pnpm check:fix

# Clean build artifacts
pnpm clean
```

### Running Individual Apps

```bash
# Server (uses tsx in watch mode)
cd apps/server
pnpm dev

# Database operations
cd apps/server
pnpm db:generate  # Generate migration from schema changes
pnpm db:migrate   # Apply migrations to database
pnpm db:studio    # Open Drizzle Studio GUI

# Web (uses Vite dev server)
cd apps/web
pnpm dev
```

### Docker

Build with build args to specify app name and version:

```bash
docker build --build-arg APP_NAME=server --build-arg VERSION=1.0.0 -t app:latest .
docker build --build-arg APP_NAME=web --build-arg VERSION=1.0.0 -t web:latest .
```

## Architecture

### Backend (apps/server)

The server uses a dependency injection pattern with the `ApplicationContext` class coordinating all services.

**Configuration System:**
- Multi-source configuration: YAML files, environment variables, and defaults
- Configuration precedence: Environment variables override YAML, which overrides defaults
- Files searched in order: `config.local.yaml`, `config.yaml`, `config.local.yml`, `config.yml`
- Search starts in `CONFIG_PATH` env var or `process.cwd()`
- Schema validation with Zod
- Credential masking in logs via `maskCredentials()` utility

**Application Lifecycle:**
1. `run.ts` loads configuration from files and environment
2. Creates a logger based on config (JSON or text format)
3. Instantiates `ApplicationContext` with config and logger
4. `ApplicationContext.initialize()` starts all services (currently HTTPServer)
5. Graceful shutdown handlers (`SIGINT`, `SIGTERM`) trigger `ApplicationContext.shutdown()`

**HTTP Server:**
- Express-based with middleware setup (CORS, JSON parsing, URL encoding)
- Router pattern: Each router extends base router and is registered in `setupRouters()`
- Configurable base path and port
- Can be disabled via `api.enabled` config

**GraphQL API:**
- GraphQL Yoga server with WebSocket support for subscriptions
- Modular architecture using `graphql-modules` for code organization
- Code-first approach with schema generation from `.graphql` files
- Type-safe resolvers generated via GraphQL Code Generator
- PubSub system for real-time subscriptions (e.g., health monitoring)
- Custom scalars: `DateTime` and `Void`
- GraphQL endpoint: `/graphql` (HTTP queries/mutations + WebSocket subscriptions)
- Schema exported to `apps/server/schema.graphql` for client consumption

**Logger:**
- Winston-based with support for JSON or text format
- Rotating file transport when `log.destination` is configured
- Child loggers for component-specific logging

**File System Abstraction:**
- `AbstractFileSystem` interface with `LocalFileSystem` implementation
- Used by configuration loader to enable testing and alternative implementations

**Database:**
- Drizzle ORM with libsql driver for SQLite compatibility
- Database service managed by ApplicationContext
- Schema definitions in `src/database/schema.ts`
- Migrations stored in `drizzle/` directory
- Can be disabled via `database.enabled` config
- Access via `applicationContext.getDatabase().getDatabase()`
- Drizzle Kit for schema management and migrations

### Frontend (apps/web)

**Stack:**
- React 19 + React Router v7
- Vite build tool
- Tailwind CSS v4 (via @tailwindcss/vite plugin)
- shadcn/ui component library
- PWA support via vite-plugin-pwa

**Key Features:**
- Path alias `@/` maps to `src/`
- PWA with workbox caching strategy (StaleWhileRevalidate for app files, CacheFirst for images)
- PWA dev mode enabled when `PWA_DEV=true` environment variable is set
- Sonner for toast notifications
- Dark mode support via next-themes

**GraphQL Client:**
- Dual setup: Apollo Client for runtime operations + gql.tada for type safety
- Apollo Client configured with HTTP and WebSocket links for queries/mutations and subscriptions
- gql.tada provides compile-time type checking using the server's generated schema
- TypeScript plugin integration for IntelliSense and validation in IDE
- Schema introspection from `apps/server/schema.graphql`
- Type definitions auto-generated to `src/lib/graphql/graphql-env.d.ts`

**Component Structure:**
- UI components in `src/components/ui/` (shadcn components)
- Pages in `src/pages/`
- Router configured in `app.tsx`

### Code Quality

**Biome Configuration:**
- Formatter: Single quotes, 2-space indentation, 100 char line width, trailing commas (ES5)
- Linter: Recommended rules enabled with custom overrides
  - Unused variables: error
  - Non-null assertions: warn
  - Explicit any: warn
- Only checks files in `{apps,libs}/**/src/**/*.{ts,tsx}` plus root `*.ts`, `*.js`

**Pre-commit Hooks:**
- Husky + lint-staged configured
- Runs `biome check` on staged files before commit

**GitHub Actions:**
- Build workflow runs on main branch and PRs
- Runs: `pnpm check`, `pnpm build`, `pnpm test`
- Docker publish workflows for develop and latest tags (multi-arch)

## Configuration

### Server Configuration (apps/server/config.yaml)

Configuration is loaded via `ConfigurationLoader` which merges:
1. Default values from schema
2. YAML configuration file
3. Environment variables (highest priority)

**Environment Variable Mapping:**
- `SERVER_NAME` - Server identifier for logs
- `VERSION` - Version string
- `LOG_LEVEL` - debug, info, warn, error, fatal, notice
- `LOG_FORMAT` - json or text
- `LOG_DESTINATION` - File path for log output
- `DATABASE_ENABLED` - Enable/disable database (default: true)
- `DATABASE_CONNECTION_URL` - Database connection string (default: file:local.db)
- `API_ENABLED` - Enable/disable HTTP API
- `API_BIND_ADDRESS` - Bind address (default: 0.0.0.0)
- `API_PORT` - Port number (default: 8080)
- `API_BASE_PATH` - Base URL path (default: /)
- `API_PUBLIC_BASE_URL` - Public facing URL
- `API_CORS_ENABLED` - Enable CORS (default: true)

### Docker Environment

The Dockerfile sets these defaults:
- `NODE_ENV=production`
- `API_PORT=8080`
- `CONFIG_PATH=/data`

## Development Patterns

**Adding a New API Router:**
1. Create router class in `apps/server/src/http/routers/`
2. Extend base router pattern
3. Register in `HTTPServer.setupRouters()`

**Adding a New GraphQL Module:**
1. Create a directory in `apps/server/src/http/routers/` for your feature
2. Add `graphql/` subdirectory with `.graphql` schema files
3. Create resolver files (e.g., `*.query.ts`, `*.mutation.ts`, `*.subscription.ts`)
4. Create module file that uses `createModule()` from `graphql-modules`
5. Register module in `GraphQLRouter` initialization (in `HTTPServer.setupRouters()`)
6. Run `pnpm codegen` in `apps/server/` to generate TypeScript types
7. Generated types will be in `apps/server/src/http/routers/graphql/generated/`
8. Run `pnpm codegen` in `apps/web/` to update client types from `schema.graphql`

**GraphQL Code Generation:**
- Backend uses `@graphql-codegen/cli` with `graphql-modules` preset
- Configuration in `apps/server/codegen.ts`
- Generates resolvers with `GQL` suffix (e.g., `QueryGQL`, `ServerHealthGQL`)
- Custom scalars: `Void` → `String`, `DateTime` → `String`
- Context type: `GraphQLContext` from `graphQLContext.ts`
- Frontend uses `gql.tada` for compile-time type safety
- Types generated from `apps/server/schema.graphql`
- Run codegen before build/dev to ensure types are up-to-date

**Adding Shared Code:**
- Create packages in `libs/` directory
- Update `pnpm-workspace.yaml` if needed
- Import using workspace protocol: `"@repo/lib-name": "workspace:*"`

**Modifying Configuration:**
- Update Zod schema in `apps/server/src/config/configuration.ts`
- Add environment variable mapping in `defaultConfigOptions.mapper`
- Update this documentation with new variables

**Working with Database:**
- Define schema in `apps/server/src/database/schema.ts` using Drizzle ORM syntax
- Run `pnpm db:generate` to create migrations from schema changes
- Run `pnpm db:migrate` to apply migrations to database
- Use `pnpm db:studio` to open Drizzle Studio for visual database management
- Access database in resolvers via `applicationContext.getDatabase().getDatabase()`
- Drizzle Kit uses `CONFIG_JSON` env var (injected via `print-config.ts` script)
- Database can be disabled by setting `database.enabled: false` in config

## Important Notes

- Uses ESM modules (not CommonJS) - note `.js` extensions in imports
- Server uses `tsx` for development (TypeScript execution)
- Web uses absolute imports via `@/` alias
- All timestamps and dates handled via `date-fns`
- Package manager is locked to `pnpm@10.18.2` via `packageManager` field
