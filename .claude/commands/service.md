Create a new Service in the backend

This command guides you through creating a complete Service in the backend.

## Step 1: Gather Service Requirements

Ask the user about:
- **Domain**: Where does this Service belong? (e.g., "user", "database", "products")
- **Service Name**: What is this service called? (e.g., "UserService", "ProductService", "DatabaseService")
- **Service Description**: What does it do? (1-2 sentences)

## Step 2: Gather Business Logic Requirements

Ask the user about:
- **Domain Connections**:
  - What other services is this service connected to?
  - How is the service initialized?
  - What other package dependencies does it?

- **Operations Needed**:
  - Functions the service should have?

## Step 3: Review Architecture Plan

Before implementing, create a brief implementation plan based on the guidelines in `/docs/guidelines/`:

Present this plan to the user and confirm before proceeding.

## Step 4: Implement Service in Backend

Follow the guidelines from `/docs/guidelines/2-development.md`:

1. **Create service** in `apps/server/src/{feature-name or domain}/{feature-name}Service.ts`:
   - Implement business logic
   - Orchestrate repository calls
   - Handle business validations

2. **Initialize in ApplicationContext** (if needed for dependency injection)

## Step 5: Test the Service

1. **Verify backend** (if applicable):
   - Check that server builds: `cd apps/server && pnpm build`

2. **Run quality checks**:
   ```bash
   pnpm check
   ```

3. **Fix any linting issues**:
   ```bash
   pnpm check:fix
   ```

## Step 6: Summary

Provide the user with:

1. **Files Created/Modified**:
   - List all new files with their purposes
   - List modified files (routes, imports, etc.)

2. **Service Overview**:
   - What the Service does
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
