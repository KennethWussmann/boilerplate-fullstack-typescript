Create a new Entity in the backend

This command guides you through creating an Entity with Business Object and Database Model in the backend.

## Step 1: Gather Entity Requirements

Ask the user about:
- **Domain**: Where does this Entity belong? (e.g., "user", "database", "products")
- **Entity Name**: What is this entity called? (e.g., "User", "Product", "Token")
- **Entity Description**: What is the purpose of this entity? (1-2 sentences)

## Step 2: Gather Data Model Requirements

Ask the user about:
- **Data Model**:
  - What fields should the entity have?
  - What what relations should the entity have?

## Step 3: Review Architecture Plan

Before implementing, create a brief implementation plan based on the guidelines in `/docs/guidelines/`:

Present this plan to the user and confirm before proceeding.

## Step 4: Implement Entity in Backend

Follow the guidelines from `/docs/guidelines/2-development.md`:

1. **Create drizzle table** in `apps/server/src/database/schema.ts`:
   - Create a new table or update existing
   - Export a type to be passed to the Business Object that we create in the next step

2. **Create business object as class** in `apps/server/src/{domain}/{entity-name}.ts`:
   - It should be the main object that is passed around through services
   - It takes the database model as constructor input to map to class level fields
   - It can output to database models with a `toModel` function
   - This business object should be optimized for handling in the application. The database model is optimized for data storage.

3. Ensure that the `apps/server/src/{domain}/index.ts` exports the new entity via `*` exports.

## Step 6: Drizzle Migrate

Run `pnpm db:migrate` to ensure the database migration tool understands the changes correctly.

Cross check that the generated SQL is correct.

## Step 6: Summary

Provide the user with:

1. **Files Created/Modified**:
   - List all new files with their purposes
   - List modified files (routes, imports, etc.)

2. **Entity Overview**:
   - What fields were created and which data type do they have
   - What relations the entity has to others

3. **Usage Instructions**:
   - How to access the entity and use it
   - What functions are available

4. **Next Steps**:
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
