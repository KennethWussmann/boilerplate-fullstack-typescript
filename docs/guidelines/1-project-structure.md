# 1. Project Structure

This is a fullstack TypeScript monorepo boilerplate designed for building modern web applications. It provides a solid foundation with a Node.js/Express backend and a React/Vite frontend, organized as separate applications within a shared workspace. The project uses Turbo for build orchestration, pnpm for package management, and Biome for code quality enforcement.

## Technology Stack

### Core Infrastructure
- **Package Manager**: pnpm with workspace support
- **Build Tool**: Turbo for task orchestration and caching
- **Code Quality**: Biome for linting and formatting
- **Type Safety**: TypeScript throughout with strict mode enabled
- **Module System**: ES Modules (ESM)

### Backend
- **Runtime**: Node.js
- **Framework**: Express 5
- **GraphQL**: GraphQL Yoga with WebSocket support
- **GraphQL Modules**: graphql-modules for modular architecture
- **Code Generation**: GraphQL Code Generator for type-safe resolvers
- **Database**: Drizzle ORM with SQLite (libsql)
- **Validation**: Zod schemas
- **Logging**: Winston with daily rotate
- **Configuration**: YAML/JSON with environment variable overrides

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite 7
- **Routing**: React Router 7
- **GraphQL Client**: Apollo Client with HTTP and WebSocket links
- **Type-Safe GraphQL**: gql.tada for compile-time type checking
- **Styling**: TailwindCSS 4
- **UI Components**: shadcn/ui (Radix UI based)
- **Forms**: TanStack React Form
- **PWA**: vite-plugin-pwa

## Project Structure

```
.
├── apps/
│   ├── server/              # Backend Express application
│   │   ├── src/
│   │   │   ├── run.ts      # Application entry point
│   │   │   ├── index.ts    # Public exports
│   │   │   ├── applicationContext.ts  # Dependency injection container
│   │   │   ├── config/     # Configuration loading and validation
│   │   │   ├── database/   # Database service and schema
│   │   │   │   ├── databaseService.ts  # Database connection management
│   │   │   │   └── schema.ts           # Drizzle ORM schema definitions
│   │   │   ├── http/       # Express server and routers
│   │   │   │   ├── routers/
│   │   │   │   │   ├── graphql/  # GraphQL server setup
│   │   │   │   │   │   ├── graphQLRouter.ts
│   │   │   │   │   │   ├── graphQLContext.ts
│   │   │   │   │   │   ├── scalars.ts
│   │   │   │   │   │   ├── common.graphql
│   │   │   │   │   │   └── generated/  # Auto-generated types
│   │   │   │   │   └── [feature]/  # Feature modules
│   │   │   │   │       ├── graphql/
│   │   │   │   │       │   ├── *.graphql  # Schema files
│   │   │   │   │       │   ├── *.query.ts
│   │   │   │   │       │   ├── *.mutation.ts
│   │   │   │   │       │   └── *.subscription.ts
│   │   │   │   │       └── [feature]Module.ts
│   │   │   ├── error/      # Error handling
│   │   │   ├── file-system/  # File system abstraction
│   │   │   └── utils/      # Shared utilities
│   │   ├── drizzle/        # Database migrations
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── codegen.ts      # GraphQL Code Generator config
│   │   ├── drizzle.config.ts  # Drizzle Kit configuration
│   │   ├── schema.graphql  # Generated schema for client
│   │   └── config.yaml     # Application configuration
│   │
│   └── web/                # Frontend React application
│       ├── src/
│       │   ├── main.tsx    # React entry point
│       │   ├── app.tsx     # Router configuration
│       │   ├── index.css   # Global styles
│       │   ├── pages/      # Page components
│       │   ├── components/
│       │   │   ├── common/ # Application-specific components
│       │   │   └── ui/     # shadcn/ui components
│       │   └── lib/
│       │       ├── graphql/  # GraphQL setup
│       │       │   ├── apollo-client.ts
│       │       │   ├── gql-tada.ts
│       │       │   └── graphql-env.d.ts  # Generated types
│       │       └── utils/  # Utility functions
│       ├── public/         # Static assets
│       ├── package.json
│       ├── tsconfig.json
│       ├── vite.config.ts
│       └── components.json # shadcn/ui configuration
│
├── libs/                   # Shared libraries (future use)
├── turbo.json             # Turbo configuration
├── biome.json             # Biome linting/formatting rules
├── pnpm-workspace.yaml    # pnpm workspace definition
└── package.json           # Root package with scripts

```

## Workspace Organization

### Apps Directory
The `apps/` directory contains standalone applications that can be deployed independently:

- **server**: Backend API server that handles business logic, data persistence, and serves HTTP endpoints
- **web**: Frontend SPA that provides the user interface and consumes the backend API

### Libs Directory
The `libs/` directory (when used) contains shared packages that can be imported by multiple apps:
- Shared TypeScript types
- Common utilities
- Business logic that needs to be shared between frontend and backend

### Root Configuration
The root directory contains workspace-wide configuration:
- **turbo.json**: Defines build pipeline and task dependencies
- **biome.json**: Enforces consistent code style across all packages
- **pnpm-workspace.yaml**: Defines which directories are part of the workspace
- **package.json**: Contains workspace-wide scripts and dependencies

## Key Architectural Decisions

### Monorepo Benefits
- Shared TypeScript types between frontend and backend
- Consistent tooling and code quality standards
- Simplified dependency management
- Atomic commits across multiple packages

### Dependency Injection
The backend uses an `ApplicationContext` class that manages service lifecycle, initialization order, and graceful shutdown.

### Configuration Management
The backend supports hierarchical configuration loading:
1. Environment variables (highest priority)
2. YAML/JSON configuration files
3. Default values (lowest priority)

All configuration is validated at startup using Zod schemas.

### Database Integration
The backend includes Drizzle ORM for type-safe database operations:
- SQLite database with libsql driver (default: `file:local.db`)
- Schema definitions in `src/database/schema.ts`
- Database migrations managed via Drizzle Kit
- Can be disabled via configuration if not needed

### PWA Support
The frontend is configured as a Progressive Web App with:
- Service worker for offline support
- Web manifest for installability
- Optimized caching strategies

### Type Safety
Both apps use TypeScript with strict mode enabled, ensuring type safety throughout the stack. 
