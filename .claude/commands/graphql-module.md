Create a new GraphQL Module in the backend

This command guides you through creating a complete GraphQL Module in the backend.

## Step 1: Gather Module Requirements

Ask the user about:
- **Domain**: Where does this module belong? (e.g., "user", "database", "products")
- **Module Name**: What is this module called? (e.g., "HealthModule", "ProductModule", "UserModule")
- **Module Purpose**: What is the general purpose of the module?

## Step 2: Gather Module Requirements

Ask the user about:
- **Operations Needed**:
  - Queries
  - Mutations
  - Subscriptions

## Step 3: Ask About Resolver Implementation

Ask the user about:
- **Implement Resolvers**:
   - Ask wether the user wants you to also implement the resolvers for the defined GraphQL Schema. Default: NO, you should not implement the resolver code itself, but create all the related `.query.ts`, `.mutation.ts`, `.subscription.ts` files with a low empty mock implementation.

Ask the user depending on the question wether to implement resolvers:
- **IF they want to implement resolvers**:
   - ASK about specific requirements for all the mentioned queries, mutations and subscriptions.

## Step 4: Implement GraphQL Module in Backend

Follow the guidelines from `/docs/guidelines/2-development.md`:

1. **Create GraphQL Module** in `apps/server/src/{domain}/graphql/{module-name}Module.ts`:
2. **Create GraphQL Schema** in `apps/server/src/{domain}/graphql/{module-name}.graphql`:
3. **Create Dummy GraphQL Resolvers** in `apps/server/src/{domain}/graphql/resolvers/{operation-name}.{query|mutation|subscription}.ts`:
4. **Optional: Create real resolvers if asked for** in `apps/server/src/{domain}/graphql/resolvers/{operation-name}.{query|mutation|subscription}.ts`:
5. **Register the GraphQL Module in setupRouters of the httpService.ts**

Ensure all files are properly exported via `index.ts` files and wildcard exports.

## Step 5: Summary

Provide the user with:

1. **Files Created/Modified**:
   - List all new files with their purposes
   - List modified files (routes, imports, etc.)

2. **Schema Overview**:
   - Important facts about the GraphQL Schema Design

3. **Implementation Overview**:
   - If resolvers were implemented, how?

3. **Next Steps**:
   - Suggested improvements or extensions
   - Testing recommendations
   - Documentation to add (if needed)

## Important Notes

- **Adhere to naming conventions**:
  - Backend: camelCase for files, kebab-case for folders
  - Frontend: kebab-case for all files and folders
- **Follow layered architecture**: Router/Resolver → Service → Repository
- **Use provided tools**: shadcn/ui, Apollo Client, gql.tada, TanStack Form
- **Keep components focused**: Break down complex components into smaller ones
- **Export via index.ts**: Every module/component directory should have one
- **Use ESM imports**: Always include `.js` extensions in backend imports
- **Type safety**: Use Zod for backend validation, TypeScript types throughout
- **Real-time updates**: Use GraphQL subscriptions with PubSub when needed
- **Error handling**: Show user-friendly error messages with Sonner
- **Loading states**: Always handle loading states in queries/mutations
- **Code generation**: Run `pnpm codegen` after schema changes

## Examples

## Example 1: GraphQL Module

`{module-name}Module.ts`:
```typescript
import { loadFiles } from '@graphql-tools/load-files';
import { createModule, type Module } from 'graphql-modules';
import { scalars } from '../index.js';
import { healthQuery } from './health.query.js';
import { healthSubscription } from './health.subscription.js';

export const ExampleModule = async (): Promise<Module> => {
  return createModule({
    id: 'example',
    dirname: import.meta.dirname,
    typeDefs: await loadFiles('**/*.graphql', {
      globOptions: {
        cwd: import.meta.dirname,
      },
    }),
    resolvers: [scalars, healthQuery, healthSubscription],
  });
};
```

## Example 2: GraphQL Schema

`{module-name}.graphql`:
```GraphQL
scalar Void
scalar DateTime

type Query {
}

type Mutation {
}

type Subscription {
}
```

The both scalars are only required if used.

## Example 3: GraphQL Resolver

You should always create individual resolver files for all created operations. 
They should have a low-effort mock implementation that something just so that the compiler is happy.

`apps/server/src/{domain}/graphql/resolvers/{operation-name}.{query|mutation|subscription}.ts`:
```typescript
import type { ResolversGQL } from '../../graphql/index.js';

export const exampleQuery: Partial<ResolversGQL> = {
  Query: {
    example: () => null,
  },
};
```

Note that resolvers need to be registered in the GraphQL Module