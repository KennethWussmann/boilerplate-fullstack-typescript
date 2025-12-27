Create a new Repository in the backend

This command guides you through creating a complete Repository in the backend.

## Step 1: Gather Repository Requirements

Ask the user about:
- **Domain**: Where does this repository belong? (e.g., "user", "database", "products")
- **Repository Name**: What is this repository called? (e.g., "UserService", "ProductService", "DatabaseService")
- **Repository Entity/Table**: What entity does it handle? (e.g., "user", "product", "settings")

## Step 2: Gather Business Logic Requirements

Ask the user about:
- **Operations Needed**:
  - Functions the repository should have in addition to the default?

## Step 3: Review Architecture Plan

Before implementing, create a brief implementation plan based on the guidelines in `/docs/guidelines/`:

Present this plan to the user and confirm before proceeding.

## Step 4: Implement Repository in Backend

Follow the guidelines from `/docs/guidelines/2-development.md`:

1. **Create repository** in `apps/server/src/{domain}/{entity}Repository.ts`:
   - Implement business logic
   - Every repository should have a `findById`, `findAll` with limit/offset pagination and flexible sorting that is dynamic and allows for change of database model changes, `upsert`, `create`, `update`, `delete`, `deleteById`. Mentioning the entity again in repository functions is forbidden. Functions should somehow read out to what they do in simple english, like `findById`. 
   - Repositories always take business objects as input and return business objects as output. Find the respective business object, usually located at `apps/server/src/{domain}/{entity}.ts`. Ensure that actual mapping happens inside the business object. 
   - Use the DatabaseService to obtain access to the drizzle database.

## Step 5: Summary

Provide the user with:

1. **Files Created/Modified**:
   - List all new files with their purposes
   - List modified files (routes, imports, etc.)

2. **Repository Overview**:
   - What the repository does
   - How it works (data flow from frontend → GraphQL → business logic)
   - Key components and their responsibilities

3. **Usage Instructions**:
   - How to access the service and use it
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
