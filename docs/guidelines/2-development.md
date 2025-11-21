# 2. Development

This document outlines the coding conventions and best practices for developing in this project. Following these guidelines ensures consistency across the codebase and makes it easier for developers to navigate and maintain the code.

## Backend (apps/server)

### Naming Conventions

**File Names**
- Use lowerCamelCase for TypeScript files: `applicationContext.ts`, `configurationLoader.ts`
- Keep names descriptive and focused on a single responsibility

**Folder Names**
- Use lower-kebab-case for directories: `file-system/`, `http/`
- Group related functionality together

### Project Organization

**Domain-Based Structure**
Organize code by domain or feature rather than by technical layer. This keeps related functionality together and makes the codebase easier to navigate.

Example structure for a hypothetical e-commerce domain:
```
src/
├── products/
│   ├── http/
│   │   └── productsRouter.ts
│   ├── service/
│   │   └── productsService.ts
│   ├── repository/
│   │   └── productsRepository.ts
│   ├── model/
│   │   └── product.ts
│   └── index.ts
├── orders/
│   ├── http/
│   │   └── ordersRouter.ts
│   ├── service/
│   │   └── ordersService.ts
│   └── index.ts
```

**Layered Architecture**
Follow a three-tier architecture pattern with clear separation of concerns:

1. **Routers/Resolvers** (`http/routers/`): Handle HTTP/GraphQL requests and responses
   - REST: Parse request parameters and body
   - GraphQL: Implement resolvers for queries, mutations, and subscriptions
   - Validate input using Zod schemas
   - Delegate to services
   - Format responses
   - Handle HTTP-specific concerns (status codes, headers)

2. **Services** (`service/`): Contain business logic
   - Orchestrate operations across multiple repositories
   - Implement business rules and validations
   - Transform data between representations
   - Handle transactions and error scenarios

3. **Repositories** (`repository/`): Manage data persistence
   - Abstract database or data source operations
   - Provide CRUD operations
   - Handle data mapping to/from storage

Flow: `Router/Resolver → Service → Repository`

### Application Context

The `ApplicationContext` class serves as the dependency injection container:
- Manages service initialization and lifecycle
- Handles startup order and dependencies
- Provides graceful shutdown capabilities
- Makes services available throughout the application

When adding new services:
1. Initialize them in `ApplicationContext`
2. Store references as properties
3. Expose via getter methods
4. Add cleanup logic in the `stop()` method

### Module Exports

**Index Files**
Every folder should have an `index.ts` file that re-exports its public API:

```typescript
// Good: Export entire modules
export * from './productsRouter.js'
export * from './ordersRouter.js'

// This allows clean imports
import { ProductsRouter, OrdersRouter } from './http/routers/index.js'
```

**ESM Imports**
This is an ESM project. Always use `.js` extensions in imports:
```typescript
import { logger } from '../utils/logger.js'
```

### Type Safety with Zod

**Schema Naming**
- Schemas: Suffix with `Schema` → `productCreateRequestSchema`
- Types: Infer from schemas without suffix → `ProductCreateRequest`

```typescript
// schemas.ts
import { z } from 'zod'

export const productCreateRequestSchema = z.object({
  name: z.string(),
  price: z.number(),
})

export type ProductCreateRequest = z.infer<typeof productCreateRequestSchema>
```

**Schema Usage**
- Validate all external input (HTTP requests, config files, env variables)
- Export both schemas and types from dedicated schema files
- Use `.parse()` for validation with errors, `.safeParse()` for validation without throwing

### Business Objects

Use classes for domain entities that encapsulate both data and behavior:

```typescript
export class Product {
  constructor(
    public readonly id: string,
    public name: string,
    public price: number,
  ) {}

  // Business logic methods
  applyDiscount(percentage: number): void {
    this.price = this.price * (1 - percentage / 100)
  }

  // Mapping methods
  toDTO(): ProductDTO {
    return {
      id: this.id,
      name: this.name,
      price: this.price,
    }
  }

  static fromDTO(dto: ProductDTO): Product {
    return new Product(dto.id, dto.name, dto.price)
  }
}
```

Benefits:
- Centralized transformation logic
- Type-safe representations
- Clear domain model
- Single source of truth for entity behavior

Note: For simple transformations specific to a single use case, inline mapping is acceptable.

### Utility Functions

**Organization**
Group utilities by category in `src/utils/`:
- `converter.ts` - Data format conversions
- `date.ts` - Date/time operations
- `logger.ts` - Logging utilities
- `uuid.ts` - ID generation
- `error.ts` - Error handling utilities

**Guidelines**
- Only move functions to utils when they're used across multiple domains
- Keep utilities pure and side-effect free when possible
- Make utilities generally applicable, not tied to specific business logic
- Export individual functions, not default exports

### Configuration

All configuration should:
- Be defined with Zod schemas in `config/configuration.ts`
- Support environment variable overrides
- Have sensible defaults
- Be loaded and validated at startup
- Be accessed through the ApplicationContext

### GraphQL Development

**Module Structure**
GraphQL features are organized as modules using `graphql-modules`:

```
http/routers/feature/
├── graphql/
│   ├── feature.graphql           # Schema definition
│   ├── feature.query.ts          # Query resolvers
│   ├── feature.mutation.ts       # Mutation resolvers
│   └── feature.subscription.ts   # Subscription resolvers
├── featureModule.ts              # Module definition
└── index.ts                      # Exports
```

**Schema Definition**
Define GraphQL schemas in `.graphql` files:
```graphql
type Query {
  product(id: ID!): Product
}

type Product {
  id: ID!
  name: String!
  price: Float!
}
```

**Resolver Implementation**
Create typed resolvers using generated types:
```typescript
import type { ResolversGQL } from '../../graphql/index.js';

export const productQuery: Partial<ResolversGQL> = {
  Query: {
    product: async (_, { id }, { applicationContext }) => {
      // Business logic here
      return {
        id,
        name: 'Product Name',
        price: 99.99,
      };
    },
  },
};
```

**Module Registration**
Create a module using `createModule`:
```typescript
import { loadFiles } from '@graphql-tools/load-files';
import { createModule } from 'graphql-modules';
import { scalars } from '../graphql/index.js';
import { productQuery } from './graphql/product.query.js';

export const ProductModule = async () => {
  return createModule({
    id: 'product',
    dirname: import.meta.dirname,
    typeDefs: await loadFiles('**/*.graphql', {
      globOptions: { cwd: import.meta.dirname },
    }),
    resolvers: [scalars, productQuery],
  });
};
```

**Context Access**
Access services through GraphQL context:
```typescript
export const productQuery: Partial<ResolversGQL> = {
  Query: {
    product: async (_, { id }, context) => {
      const { applicationContext, logger, pubSub } = context;
      // Use applicationContext to access services
      // Use logger for logging
      // Use pubSub for subscriptions
    },
  },
};
```

**Subscriptions**
Implement real-time subscriptions using PubSub:
```typescript
export const productSubscription: Partial<ResolversGQL> = {
  Subscription: {
    productUpdated: {
      subscribe: (_, __, { pubSub }) => pubSub.subscribe('product:updated'),
      resolve: (payload) => payload,
    },
  },
};

// Publish from anywhere with access to pubSub
pubSub.publish('product:updated', product);
```

**Code Generation**
Run `pnpm codegen` to generate TypeScript types from schemas:
- Generated types have `GQL` suffix (e.g., `ProductGQL`, `QueryGQL`)
- Resolvers type is `ResolversGQL`
- Types are in `http/routers/graphql/generated/`

**Custom Scalars**
Define custom scalars in `scalars.ts`:
```typescript
import { DateTimeResolver } from 'graphql-scalars';

export const scalars: Partial<ResolversGQL> = {
  DateTime: DateTimeResolver,
};
```

### Error Handling

- Use custom error classes that extend the base `Error` class
- Include relevant context in error messages
- Let errors bubble up to the router/resolver layer
- Handle errors appropriately at the HTTP/GraphQL boundary
- Log errors with appropriate severity levels

---

## Frontend (apps/web)

### Naming Conventions

**File Names**
- Use lower-kebab-case for all files: `product-grid.tsx`, `user-profile.ts`
- Component files should match component name: `Button` → `button.tsx`

**Folder Names**
- Use lower-kebab-case: `components/common/`, `lib/utils/`

### Project Organization

**Component Structure**
Organize components by their role and reusability:

```
src/
├── components/
│   ├── common/          # Application-specific reusable components
│   │   ├── product-grid/
│   │   │   ├── product-grid.tsx
│   │   │   ├── product-item.tsx
│   │   │   ├── product-image.tsx
│   │   │   └── index.ts
│   │   └── typography.tsx
│   └── ui/              # shadcn/ui components (generated)
│       ├── button.tsx
│       └── sonner.tsx
├── views/               # View components with page logic
│   └── product-details/
│       ├── product-details-view.tsx
│       ├── product-details-header.tsx
│       ├── product-details-footer.tsx
│       └── index.ts
├── pages/               # Route pages (thin wrapper)
│   ├── home.tsx
│   └── products.tsx
└── lib/
    └── utils/           # Utility functions
        ├── class.ts
        └── index.ts
```

### Component Decomposition

**Break Down Complex Components**
Large components should be split into smaller, focused sub-components within their own directory:

```
components/common/product-grid/
├── product-grid.tsx      # Main container component
├── product-item.tsx      # Individual product card
├── product-image.tsx     # Image with loading states
├── product-price.tsx     # Price display logic
└── index.ts              # Export public components
```

Benefits:
- Easier to test individual pieces
- Better code reusability
- Clearer separation of concerns
- Easier to understand and maintain

### Component Categories

**UI Components** (`components/ui/`)
- Generated and managed by shadcn/ui CLI
- Low-level, highly reusable components
- No business logic
- Styled with Tailwind and variants
- Examples: Button, Input, Dialog

**Common Components** (`components/common/`)
- Application-specific reusable components
- May contain some business logic
- Can compose UI components
- Shared across multiple views/pages
- Examples: UserAvatar, ProductCard, NavigationMenu

**View Components** (`views/`)
- High-level components that implement specific features
- Contain business logic and state management
- Compose common and UI components
- May have view-specific sub-components
- Connected to data fetching and forms
- Examples: ProductDetailsView, CheckoutView

**Page Components** (`pages/`)
- Thin wrappers that define routes
- Should mostly just import and render a View
- Minimal logic - primarily routing concerns
- Handle route parameters and pass to Views

```typescript
// pages/product-details.tsx
import { ProductDetailsView } from '@/views/product-details'

export function ProductDetails() {
  return <ProductDetailsView />
}
```

### Module Exports

**Index Files**
Each component directory should have an `index.ts` that exports public components:

```typescript
// components/common/product-grid/index.ts
export { ProductGrid } from './product-grid'
export { ProductItem } from './product-item'
// Note: Don't export internal components like ProductImage if not needed elsewhere
```

This enables clean imports:
```typescript
import { ProductGrid } from '@/components/common/product-grid'
```

### Styling

**TailwindCSS**
- Use Tailwind utility classes for styling
- Leverage the `cn()` utility for conditional classes:
```typescript
import { cn } from '@/lib/utils'

<div className={cn('base-class', isActive && 'active-class')} />
```

**Variants**
For components with multiple visual variants, use `class-variance-authority`:
```typescript
import { cva } from 'class-variance-authority'

const buttonVariants = cva('base-classes', {
  variants: {
    variant: {
      default: 'bg-primary',
      secondary: 'bg-secondary',
    },
    size: {
      sm: 'h-8',
      md: 'h-10',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
})
```

### State Management

- Use React's built-in hooks (useState, useReducer) for local state
- Use TanStack React Form for form state
- Keep state as close to where it's used as possible
- Lift state only when multiple components need access

### Type Safety

- Define TypeScript types for all props
- Use interfaces for component props
- Export shared types from dedicated type files
- Leverage Zod schemas shared from backend when possible

### Utilities

**Organization**
Place utility functions in `src/lib/utils/`:
- `class.ts` - Class name utilities (cn function)
- `format.ts` - Formatting functions (dates, currency, etc.)
- `validation.ts` - Client-side validation helpers

**Guidelines**
- Keep utilities pure functions
- Make them generally applicable
- Document complex utilities with JSDoc comments
- Test utility functions independently

### GraphQL Client

**Setup**
The project uses a dual GraphQL client setup:
- **Apollo Client** for runtime operations (queries, mutations, subscriptions)
- **gql.tada** for compile-time type safety

**Defining Operations**
Use `gql.tada` to define type-safe GraphQL operations:
```typescript
import { graphql } from '@/lib/graphql';

const GetProductQuery = graphql(`
  query GetProduct($id: ID!) {
    product(id: $id) {
      id
      name
      price
    }
  }
`);
```

**Queries**
Use Apollo Client's `useQuery` hook:
```typescript
import { useQuery } from '@apollo/client/react';
import { graphql } from '@/lib/graphql';

const GetProductsQuery = graphql(`
  query GetProducts {
    products {
      id
      name
      price
    }
  }
`);

function ProductList() {
  const { data, loading, error } = useQuery(GetProductsQuery);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {data?.products.map(product => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  );
}
```

**Mutations**
Use Apollo Client's `useMutation` hook:
```typescript
import { useMutation } from '@apollo/client/react';
import { graphql } from '@/lib/graphql';

const CreateProductMutation = graphql(`
  mutation CreateProduct($input: ProductInput!) {
    createProduct(input: $input) {
      id
      name
      price
    }
  }
`);

function CreateProductForm() {
  const [createProduct, { loading }] = useMutation(CreateProductMutation);

  const handleSubmit = async (data) => {
    await createProduct({
      variables: { input: data },
    });
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

**Subscriptions**
Use Apollo Client's `useSubscription` hook for real-time updates:
```typescript
import { useSubscription } from '@apollo/client/react';
import { graphql } from '@/lib/graphql';

const ProductUpdatedSubscription = graphql(`
  subscription OnProductUpdated {
    productUpdated {
      id
      name
      price
    }
  }
`);

function ProductMonitor() {
  useSubscription(ProductUpdatedSubscription, {
    onData: ({ data }) => {
      console.log('Product updated:', data.data?.productUpdated);
    },
  });

  return <div>Monitoring products...</div>;
}
```

**Type Safety**
All GraphQL operations are fully type-safe:
- TypeScript knows the exact shape of query results
- Variables are type-checked
- Field selections are validated against the schema
- Types are updated automatically when schema changes

**Code Generation**
Run `pnpm codegen` in `apps/web/` to regenerate types:
- Reads schema from `apps/server/schema.graphql`
- Updates `src/lib/graphql/graphql-env.d.ts`
- Provides IntelliSense in your IDE

---

## Common Practices

### Code Quality

**Biome**
- Run `pnpm biome check` before committing
- Fix issues with `pnpm biome check --write`
- Configured in `biome.json` at the root

**Linting Rules**
- No unused variables
- Prefer const over let
- Consistent array types
- Avoid non-null assertions

### Testing

- Write tests alongside implementation
- Use descriptive test names
- Test behavior, not implementation
- Run tests with `pnpm test` from root or specific app

### Git Workflow

- Make atomic commits with clear messages
- Run lint checks before committing (enforced by husky)
- Keep pull requests focused on single features/fixes
- Test changes locally before pushing

### Development Scripts

**Backend**
```bash
cd apps/server
pnpm dev          # Start dev server with watch mode (runs codegen first)
pnpm build        # Build for production (runs codegen first)
pnpm build:watch  # Build in watch mode (runs codegen first)
pnpm codegen      # Generate GraphQL types from schemas
```

**Frontend**
```bash
cd apps/web
pnpm dev          # Start Vite dev server
pnpm build        # Build for production (runs codegen first)
pnpm preview      # Preview production build
pnpm codegen      # Generate gql.tada types from server schema
pnpm shadcn       # Add shadcn/ui components
```

**Root**
```bash
pnpm build        # Build all apps (includes codegen)
pnpm test         # Run all tests
```

**GraphQL Development Flow**
1. Define schema in `.graphql` files (backend)
2. Create resolvers in feature modules (backend)
3. Run `pnpm codegen` in `apps/server/` to generate types
4. Schema is exported to `apps/server/schema.graphql`
5. Run `pnpm codegen` in `apps/web/` to update client types
6. Use typed queries/mutations in React components

