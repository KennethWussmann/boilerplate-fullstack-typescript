# GraphQL modules

The API is assembled from `graphql-modules`, one module per feature. Each module owns its schema files and its resolvers, which keeps the root schema from becoming a dumping ground and lets a feature be added or removed in one directory. `apps/server/src/http/routers/health/` is the working example — read it before writing a new one.

## Ask first

- **Domain and module name**: `products` → `ProductsModule`
- **Purpose**: what part of the API does it cover?
- **Operations**: which queries, mutations, subscriptions?
- **Resolver implementation**: real resolvers now, or stubs?

The default is **stubs**. Schema design and business logic are separate conversations, and generating a plausible-looking implementation before the schema is agreed on usually means writing it twice. Only implement resolvers when the user asks — and then ask what each operation should actually do.

## Implement

Layout, mirroring the health module:

```
apps/server/src/http/routers/{feature}/
├── graphql/
│   ├── {feature}.graphql
│   ├── {operation}.query.ts
│   ├── {operation}.mutation.ts
│   └── {operation}.subscription.ts
├── {feature}Module.ts
└── index.ts
```

1. **Schema** — `{feature}.graphql`

   ```graphql
   type Product {
     id: ID!
     name: String!
     createdAt: DateTime!
   }

   type Query {
     products(limit: Int, offset: Int): [Product!]!
   }
   ```

   Declare `scalar Void` and `scalar DateTime` only in a module that uses them. Extend `Query`, `Mutation` and `Subscription` with what this module contributes; the modules are merged at runtime.

2. **Resolvers** — one file per operation

   One operation per file keeps diffs readable and makes it obvious which resolver is missing when codegen complains.

   ```typescript
   import type { ResolversGQL } from '../../graphql/index.js';

   export const productsQuery: Partial<ResolversGQL> = {
     Query: {
       products: () => [],
     },
   };
   ```

   Stubs return whatever satisfies the compiler. Real resolvers pull services off the context (`{ applicationContext, logger, pubSub }`), delegate immediately, and map the result into the GraphQL shape. Business logic inside a resolver is a layering violation — push it into a service.

3. **Module** — `{feature}Module.ts`

   ```typescript
   import { loadFiles } from '@graphql-tools/load-files';
   import { createModule, type Module } from 'graphql-modules';
   import { scalars } from '../index.js';
   import { productsQuery } from './graphql/products.query.js';

   export const ProductsModule = async (): Promise<Module> => {
     return createModule({
       id: 'products',
       dirname: import.meta.dirname,
       typeDefs: await loadFiles('**/*.graphql', {
         globOptions: { cwd: import.meta.dirname },
       }),
       resolvers: [scalars, productsQuery],
     });
   };
   ```

   Every resolver must appear in that array. A resolver file that exists but is not registered fails silently — the field just resolves to `null`.

4. **Register the module** in `setupRouters()` in the HTTP server, adding it to the `GraphQLRouter` array.

5. **Export** everything through `index.ts` files with wildcard exports.

## Generate types

```bash
cd apps/server && pnpm codegen
```

This writes the `*GQL` types under `apps/server/src/http/routers/graphql/generated/` and refreshes `apps/server/schema.graphql`, which the web app consumes. If the frontend will use these operations, run `pnpm codegen` in `apps/web` afterwards.

## Report

Files created and modified, the shape of the schema and why it is shaped that way, whether resolvers are real or stubs, and what is left to implement.
