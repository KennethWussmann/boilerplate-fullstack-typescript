# Fullstack TypeScript Monorepo Boilerplate

An opinionated, production-ready boilerplate for building fullstack TypeScript applications with clear separation between backend and frontend. This template includes everything you need to start building a modern web application with best practices baked in.

## Features

### Monorepo Architecture
- **pnpm workspaces** for efficient dependency management
- **Turborepo** for fast, cached builds
- Clear separation: `apps/` for applications, `libs/` for shared code
- Support for multiple apps in the same repository

### Backend (Express + TypeScript + GraphQL)
- Express.js with TypeScript and ESM modules
- Dependency injection pattern with `ApplicationContext`
- Multi-source configuration system (YAML files + environment variables)
- Schema validation with Zod
- Winston logger with JSON/text formats and rotating file support
- Graceful shutdown handling
- File system abstraction for testability
- GraphQL API with GraphQL Yoga
- WebSocket support for GraphQL subscriptions
- Type-safe resolvers via GraphQL Code Generator
- Modular GraphQL architecture with `graphql-modules`
- Drizzle ORM for type-safe database operations
- SQLite database with libsql driver (file-based or in-memory)
- Database migrations via Drizzle Kit

### Frontend (React + Vite + GraphQL)
- React 19 with React Router v7
- Vite for lightning-fast builds and HMR
- Tailwind CSS v4 (via @tailwindcss/vite plugin)
- shadcn/ui component library pre-configured
- PWA support with Workbox caching strategies
- Dark mode support via next-themes
- Sonner for toast notifications
- TanStack Form for type-safe forms
- Apollo Client for GraphQL queries, mutations, and subscriptions
- gql.tada for compile-time type-safe GraphQL operations
- Full TypeScript integration with generated schema types

### Docker Support
- Multi-stage Dockerfile for optimized images
- Multi-architecture builds (ARM64 + AMD64)
- Separate builds for backend and frontend
- Production-ready with health checks

### Code Quality
- Biome for lightning-fast linting and formatting
- Pre-commit hooks with Husky + lint-staged
- Consistent code style enforced across the monorepo
- TypeScript strict mode enabled

### CI/CD
- GitHub Actions workflows included
- Automated linting, testing, and building
- Docker image publishing for develop and latest tags
- Multi-architecture Docker builds

### Developer Experience
- TypeScript path aliases (`@/` for imports)
- Watch modes for development
- Fast builds with caching
- Comprehensive npm scripts for common tasks

## Using This Template

### 1. Create Your Repository from This Template

On GitHub:
1. Click the "Use this template" button at the top of this repository
2. Choose "Create a new repository"
3. Name your repository and set visibility (public/private)
4. Click "Create repository from template"

Or via GitHub CLI:
```bash
gh repo create my-app --private --clone --template KennethWussmann/boilerplate-fullstack-typescript
cd my-app
```

### 2a. Customize for Your Project using Claude Code (automated)

This repository has a Claude Code compatible custom command `/bootstrap`.

It will guide you through the entire customization of your new project.

1. Open Claude Code in your new repository
2. Run `/bootstrap`
3. Reply to Claude's questions
4. Wait... Done!

You are now ready. Skip the next 2b. section.

### 2b. Customize for Your Project (manual)

After creating your repository, update the following files:

#### Root `package.json`
```json
{
  "name": "your-project-name",  // Change this
  "description": "Your project description",
  "author": "Your Name",
  "license": "MIT"  // Or your preferred license
}
```

#### `apps/server/package.json`
```json
{
  "name": "your-server-name",  // Change this
  "description": "Your server description",
  "author": "Your Name",
  "license": "MIT"
}
```

#### `apps/web/package.json`
```json
{
  "name": "your-web-app-name",  // Change this
  "version": "1.0.0"  // Set your initial version
}
```

#### `apps/web/index.html`
Update the title and meta tags:
```html
<title>Your App Name</title>
<meta name="description" content="Your app description">
```

#### `apps/web/public/manifest.json` (PWA)
Update the PWA manifest with your app details:
```json
{
  "name": "Your App Name",
  "short_name": "YourApp",
  "description": "Your app description",
  "theme_color": "#your-color",
  "background_color": "#your-color"
}
```

#### Docker Build Arguments
When building Docker images, use your app names:
```bash
docker build --build-arg APP_NAME=your-server-name --build-arg VERSION=1.0.0 .
```

#### GitHub Actions (Optional)
If you plan to use Docker image publishing workflows, update `.github/workflows/*.yml`:
- Update repository references
- Configure Docker registry credentials
- Update image naming conventions

#### Remove or Update Documentation
- Delete or update `CLAUDE.md` (this is specific to Claude Code editor)
- Update this README with your project-specific information
- Add your own license file if you changed the license

## Getting Started

### Prerequisites
- Node.js 24
- pnpm 10.18.2 (will be automatically used via `packageManager` field)

### Installation

```bash
# Clone your new repository
git clone https://github.com/your-username/your-repo.git
cd your-repo

# Install dependencies (pnpm will be automatically installed if needed)
pnpm install
```

### Development

```bash
# Build all apps
pnpm build

# Build in watch mode
pnpm build:watch

# Run the backend server (in apps/server/)
cd apps/server
pnpm dev  # Runs on http://localhost:8080 by default
# GraphQL endpoint: http://localhost:8080/graphql
# GraphQL subscriptions: ws://localhost:8080/graphql

# Database operations (in apps/server/)
pnpm db:generate  # Generate migration from schema changes
pnpm db:migrate   # Apply migrations to database
pnpm db:studio    # Open Drizzle Studio GUI

# Run the frontend (in apps/web/)
cd apps/web
pnpm dev  # Runs on http://localhost:5173 by default

# Generate GraphQL types (backend)
cd apps/server
pnpm codegen  # Generates TypeScript types from .graphql files

# Generate GraphQL types (frontend)
cd apps/web
pnpm codegen  # Generates gql.tada types from server schema

# Run linting and formatting
pnpm check

# Auto-fix linting issues
pnpm check:fix

# Run tests (when you add them)
pnpm test
pnpm test:watch
```

### Production Build

```bash
# Build all applications for production
pnpm build

# Build Docker images
docker build --build-arg APP_NAME=server --build-arg VERSION=1.0.0 -t your-server:latest .
docker build --build-arg APP_NAME=web --build-arg VERSION=1.0.0 -t your-web:latest .

# Run Docker containers
docker run -p 8080:8080 your-server:latest
docker run -p 80:80 your-web:latest
```

## Project Structure

```
.
├── apps/
│   ├── server/              # Backend Express application
│   │   ├── src/
│   │   │   ├── config/      # Configuration management
│   │   │   ├── database/    # Database service and schema
│   │   │   ├── http/        # HTTP server and routers
│   │   │   ├── logger/      # Winston logger setup
│   │   │   ├── utils/       # Utility functions
│   │   │   ├── application-context.ts  # DI container
│   │   │   └── run.ts       # Application entry point
│   │   ├── drizzle/         # Database migrations
│   │   ├── drizzle.config.ts  # Drizzle Kit configuration
│   │   └── config.yaml      # Server configuration
│   │
│   └── web/                 # Frontend React application
│       ├── src/
│       │   ├── components/  # React components
│       │   │   └── ui/      # shadcn/ui components
│       │   ├── pages/       # Page components
│       │   ├── lib/         # Utilities
│       │   └── app.tsx      # App entry point with routing
│       └── public/          # Static assets
│
├── libs/                    # Shared libraries (empty by default)
│
├── .github/
│   └── workflows/           # GitHub Actions CI/CD
│
├── biome.json              # Biome configuration
├── turbo.json              # Turborepo configuration
├── pnpm-workspace.yaml     # pnpm workspace configuration
└── Dockerfile              # Multi-stage Docker build
```

## Available Scripts

### Root Level
- `pnpm build` - Build all apps in the monorepo
- `pnpm build:watch` - Build all apps in watch mode
- `pnpm test` - Run tests across all apps
- `pnpm test:watch` - Run tests in watch mode
- `pnpm check` - Run Biome linting and formatting checks
- `pnpm check:fix` - Auto-fix linting issues (includes unsafe fixes)
- `pnpm clean` - Remove all build artifacts
- `pnpm update-dependencies` - Update all dependencies across the monorepo

### Backend (apps/server)
- `pnpm dev` - Run server in development mode with hot reload
- `pnpm build` - Compile TypeScript to JavaScript
- `pnpm build:watch` - Compile in watch mode
- `pnpm db:generate` - Generate database migration from schema changes
- `pnpm db:migrate` - Apply pending migrations to database
- `pnpm db:studio` - Open Drizzle Studio to browse and edit data

### Frontend (apps/web)
- `pnpm dev` - Run Vite dev server with HMR
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build locally
- `pnpm shadcn` - Add shadcn/ui components

## Technology Stack

### Backend
- [Express.js](https://expressjs.com/) - Web framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [GraphQL Yoga](https://the-guild.dev/graphql/yoga-server) - GraphQL server
- [graphql-modules](https://the-guild.dev/graphql/modules) - Modular GraphQL architecture
- [GraphQL Code Generator](https://the-guild.dev/graphql/codegen) - Type generation
- [graphql-ws](https://github.com/enisdenjo/graphql-ws) - GraphQL subscriptions over WebSocket
- [Drizzle ORM](https://orm.drizzle.team/) - Type-safe ORM
- [Drizzle Kit](https://orm.drizzle.team/kit-docs/overview) - Database migrations
- [libsql](https://github.com/tursodatabase/libsql) - SQLite-compatible database
- [Zod](https://zod.dev/) - Schema validation
- [Winston](https://github.com/winstonjs/winston) - Logging
- [date-fns](https://date-fns.org/) - Date manipulation

### Frontend
- [React 19](https://react.dev/) - UI framework
- [React Router v7](https://reactrouter.com/) - Client-side routing
- [Vite](https://vitejs.dev/) - Build tool
- [Apollo Client](https://www.apollographql.com/docs/react/) - GraphQL client
- [gql.tada](https://gql-tada.0no.co/) - Type-safe GraphQL operations
- [Tailwind CSS v4](https://tailwindcss.com/) - Utility-first CSS
- [shadcn/ui](https://ui.shadcn.com/) - Component library
- [TanStack Form](https://tanstack.com/form) - Form management
- [Sonner](https://sonner.emilkowal.ski/) - Toast notifications
- [next-themes](https://github.com/pacocoursey/next-themes) - Dark mode

### Development Tools
- [Turborepo](https://turbo.build/) - Monorepo build system
- [pnpm](https://pnpm.io/) - Package manager
- [Biome](https://biomejs.dev/) - Linter and formatter
- [Husky](https://typicode.github.io/husky/) - Git hooks
- [tsx](https://github.com/privatenumber/tsx) - TypeScript execution

## Configuration

### Backend Configuration
The server supports configuration through YAML files and environment variables. Environment variables take precedence over YAML configuration.

**Configuration files** (searched in order):
- `config.local.yaml`
- `config.yaml`
- `config.local.yml`
- `config.yml`

**Environment variables**:
- `SERVER_NAME` - Server identifier
- `VERSION` - Application version
- `LOG_LEVEL` - Logging level (debug, info, warn, error)
- `LOG_FORMAT` - Log format (json or text)
- `LOG_DESTINATION` - Log file path
- `DATABASE_ENABLED` - Enable/disable database (default: true)
- `DATABASE_CONNECTION_URL` - Database connection string (default: file:local.db)
- `API_ENABLED` - Enable/disable API server
- `API_PORT` - Server port (default: 8080)
- `API_BIND_ADDRESS` - Bind address (default: 0.0.0.0)
- `API_BASE_PATH` - API base path (default: /)
- `API_PUBLIC_BASE_URL` - Public-facing URL
- `API_CORS_ENABLED` - Enable CORS (default: true)

### PWA Configuration
The web app includes PWA support. To enable PWA features in development:
```bash
PWA_DEV=true pnpm dev
```

## GraphQL Development

### Backend GraphQL Setup

The backend uses a modular GraphQL architecture:

**File Structure:**
```
apps/server/src/http/routers/
├── graphql/
│   ├── graphQLRouter.ts       # GraphQL server setup
│   ├── graphQLContext.ts      # Context and PubSub types
│   ├── scalars.ts             # Custom scalar definitions
│   ├── common.graphql         # Common scalars
│   └── generated/             # Auto-generated types
└── [feature]/
    ├── graphql/
    │   ├── [feature].graphql  # Schema definition
    │   ├── [feature].query.ts # Query resolvers
    │   ├── [feature].mutation.ts  # Mutation resolvers (optional)
    │   └── [feature].subscription.ts  # Subscription resolvers (optional)
    └── [feature]Module.ts     # Module registration
```

**Adding a New GraphQL Feature:**

1. Create feature directory with schema:
```bash
cd apps/server/src/http/routers
mkdir -p myfeature/graphql
```

2. Define schema in `myfeature/graphql/myfeature.graphql`:
```graphql
type Query {
  myData: MyData!
}

type MyData {
  id: ID!
  name: String!
}
```

3. Create resolvers in `myfeature/graphql/myfeature.query.ts`:
```typescript
import type { ResolversGQL } from '../../graphql/index.js';

export const myFeatureQuery: Partial<ResolversGQL> = {
  Query: {
    myData: () => ({
      id: '1',
      name: 'Example',
    }),
  },
};
```

4. Create module in `myfeature/myFeatureModule.ts`:
```typescript
import { loadFiles } from '@graphql-tools/load-files';
import { createModule } from 'graphql-modules';
import { scalars } from '../graphql/index.js';
import { myFeatureQuery } from './graphql/myfeature.query.js';

export const MyFeatureModule = async () => {
  return createModule({
    id: 'myfeature',
    dirname: import.meta.dirname,
    typeDefs: await loadFiles('**/*.graphql', {
      globOptions: { cwd: import.meta.dirname },
    }),
    resolvers: [scalars, myFeatureQuery],
  });
};
```

5. Register in `HTTPServer.setupRouters()` (apps/server/src/http/httpServer.ts):
```typescript
new GraphQLRouter(
  /* ... */,
  [HealthModule, MyFeatureModule]  // Add your module
)
```

6. Generate types:
```bash
cd apps/server
pnpm codegen
```

### Frontend GraphQL Setup

The frontend uses Apollo Client with gql.tada for type safety:

**Usage Example:**
```typescript
import { useQuery, useSubscription } from '@apollo/client/react';
import { graphql } from '@/lib/graphql';

// Define query with gql.tada
const MyQuery = graphql(`
  query MyData {
    myData {
      id
      name
    }
  }
`);

// Use in component
function MyComponent() {
  const { data } = useQuery(MyQuery);
  return <div>{data?.myData.name}</div>;
}
```

**Subscriptions Example:**
```typescript
const MySubscription = graphql(`
  subscription OnDataChange {
    dataChanged {
      id
      name
    }
  }
`);

function MyComponent() {
  useSubscription(MySubscription, {
    onData: ({ data }) => {
      console.log('Data updated:', data);
    },
  });
}
```

### GraphQL Configuration

**Environment Variables:**
- `VITE_API_URL` - GraphQL HTTP endpoint (default: `http://localhost:8080/graphql`)
- `VITE_WS_URL` - GraphQL WebSocket endpoint (default: `ws://localhost:8080/graphql`)

**TypeScript Integration:**
- Backend types generated to `apps/server/src/http/routers/graphql/generated/`
- Frontend types generated to `apps/web/src/lib/graphql/graphql-env.d.ts`
- Schema exported to `apps/server/schema.graphql` for client consumption

## Adding Shared Libraries

To create shared code between apps:

1. Create a new package in `libs/`:
```bash
mkdir -p libs/my-shared-lib
cd libs/my-shared-lib
pnpm init
```

2. Add it to your workspace and import it in apps:
```json
{
  "dependencies": {
    "@repo/my-shared-lib": "workspace:*"
  }
}
```
