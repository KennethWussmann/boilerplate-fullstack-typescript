Create a new fullstack feature in this repository

This command guides you through creating a complete fullstack feature (backend API + frontend UI) or a backend/frontend-only feature in this TypeScript monorepo boilerplate.

## Step 1: Gather Feature Requirements

Ask the user about:
- **Feature Name**: What is this feature called? (e.g., "Task Management", "User Profile", "Product Catalog")
- **Feature Description**: What does it do? (1-2 sentences)
- **Scope**:
  - Fullstack (both backend and frontend)
  - Backend only (API/GraphQL)
  - Frontend only (UI components/pages)

## Step 2: Backend Requirements (if applicable)

Ask the user about:
- **API Type**:
  - GraphQL (default, recommended)
  - REST (only if specifically requested)
- **Operations Needed**:
  - Queries (read operations)
  - Mutations (create/update/delete operations)
  - Subscriptions (real-time updates)
- **Data Model**: What data does this feature work with? Ask for entity descriptions (fields, types, relationships)
- **Business Logic**: Any specific business rules or validations?

## Step 3: Frontend Requirements (if applicable)

Ask the user about:
- **Integration Point**: Where should this feature be added?
  - New page/route
  - Add to existing page
  - New component in existing view
  - Modal/Dialog
- **UI Components Needed**: What UI elements are required?
  - Forms (with which fields?)
  - Lists/Tables/Grids
  - Detail views
  - Real-time updates/subscriptions
  - Notifications (success/error messages)
- **User Interactions**: How do users interact with this feature?
  - Create/Edit/Delete flows
  - Search/Filter capabilities
  - Sorting/Pagination
  - Real-time monitoring

## Step 4: Review Architecture Plan

Before implementing, create a brief implementation plan based on the guidelines in `/docs/guidelines/`:

**Backend Plan (if applicable):**
- Feature module location: `apps/server/src/{feature-name or domain}/`
- GraphQL schema files needed
- Resolver types (queries/mutations/subscriptions)
- Services needed (business logic)
- Repositories needed (data access)
- Module registration

**Frontend Plan (if applicable):**
- Page location: `apps/web/src/pages/{feature-name}.tsx`
- View components: `apps/web/src/views/{feature-name}/`
- Common components needed (if any)
- GraphQL operations (queries/mutations/subscriptions)
- Routes to add to `app.tsx`

Present this plan to the user and confirm before proceeding.

## Step 5: Implement Backend (if applicable)

Follow the guidelines from `/docs/guidelines/2-development.md`:

### For GraphQL Features:

1. **Create feature directory**:
   ```
   apps/server/src/http/routers/{feature-name}/
   ├── graphql/
   │   ├── {feature-name}.graphql
   │   ├── {feature-name}.query.ts
   │   ├── {feature-name}.mutation.ts (if needed)
   │   └── {feature-name}.subscription.ts (if needed)
   ├── {feature-name}Module.ts
   └── index.ts
   ```

2. **Define GraphQL schema** in `.graphql` file:
   - Define types
   - Define queries/mutations/subscriptions
   - Include proper field types and descriptions

3. **Implement resolvers**:
   - Import `ResolversGQL` type
   - Create typed resolver objects
   - Access context for services: `{ applicationContext, logger, pubSub }`
   - Implement business logic

4. **Create module**:
   - Use `createModule` from `graphql-modules`
   - Load schema files with `@graphql-tools/load-files`
   - Register resolvers including scalars
   - Export module function

5. **Register module** in `apps/server/src/http/httpServer.ts`:
   - Import the module
   - Add to GraphQLRouter initialization array

6. **Generate types**:
   - Run `pnpm codegen` in `apps/server/`
   - Verify types in `apps/server/src/http/routers/graphql/generated/`

### For REST Features (if specifically requested):

1. **Create router** in `apps/server/src/http/routers/{feature-name}Router.ts`
2. **Define routes** with Express
3. **Implement route handlers** with proper validation
4. **Register router** in `httpServer.ts`

### Services and Repositories:

If business logic or data access is needed:

1. **Create service** in `apps/server/src/{feature-name or domain}/{feature-name}Service.ts`:
   - Implement business logic
   - Orchestrate repository calls
   - Handle business validations

2. **Create repository** in `aapps/server/src/{feature-name or domain}/{feature-name}Repository.ts`:
   - Implement data access
   - Abstract data source operations
   - Return domain objects

3. **Initialize in ApplicationContext** (if needed for dependency injection)

## Step 6: Implement Frontend (if applicable)

Follow the guidelines from `/docs/guidelines/2-development.md`:

### Code Generation:

1. **Generate types** from server schema:
   ```bash
   cd apps/web
   pnpm codegen
   ```

### Create GraphQL Operations:

1. **Define queries/mutations/subscriptions** in view files:
   ```typescript
   import { graphql } from '@/lib/graphql';

   const GetItemsQuery = graphql(`
     query GetItems {
       items {
         id
         name
       }
     }
   `);
   ```

### Create View Components:

1. **Create view directory**:
   ```
   apps/web/src/views/{feature-name}/
   ├── {feature-name}-view.tsx
   ├── {feature-name}-list.tsx (if needed)
   ├── {feature-name}-form.tsx (if needed)
   ├── {feature-name}-detail.tsx (if needed)
   └── index.ts
   ```

2. **Implement main view component**:
   - Use Apollo Client hooks (`useQuery`, `useMutation`, `useSubscription`)
   - Handle loading/error states
   - Compose UI and common components
   - Implement user interactions

3. **Create form components** (if needed):
   - Use TanStack Form for type-safe forms
   - Add validation
   - Handle submission with mutations
   - Show success/error notifications with Sonner

4. **Create list/detail components** (if needed):
   - Display data from queries
   - Handle real-time updates with subscriptions
   - Add user interactions (edit/delete buttons)

### Create or Update Page:

1. **Create page component** in `apps/web/src/pages/{feature-name}.tsx`:
   ```typescript
   import { FeatureNameView } from '@/views/{feature-name}';

   export function FeatureNamePage() {
     return <FeatureNameView />;
   }
   ```

2. **Add route** in `apps/web/src/app.tsx`:
   ```typescript
   <Route path="/{feature-name}" element={<FeatureNamePage />} />
   ```

### UI Components:

1. **Use shadcn/ui components** from `@/components/ui/`
2. **Create common components** (if reusable):
   - Place in `apps/web/src/components/common/{feature-name}/`
   - Break down complex UI into smaller components
   - Export via index.ts

## Step 7: Test the Feature

1. **Verify backend** (if applicable):
   - Check that server builds: `cd apps/server && pnpm build`
   - Start server: `cd apps/server && pnpm start` (not dev, as per user instructions)
   - Test GraphQL endpoint: `http://localhost:8080/graphql`
   - Verify queries/mutations work in GraphQL Playground

2. **Verify frontend** (if applicable):
   - Check that web builds: `cd apps/web && pnpm build`
   - Start web: `cd apps/web && pnpm start`
   - Navigate to feature page
   - Test all user interactions
   - Verify real-time updates (if subscriptions used)

3. **Run quality checks**:
   ```bash
   pnpm check
   ```

4. **Fix any linting issues**:
   ```bash
   pnpm check:fix
   ```

## Step 8: Summary

Provide the user with:

1. **Files Created/Modified**:
   - List all new files with their purposes
   - List modified files (routes, imports, etc.)

2. **Feature Overview**:
   - What the feature does
   - How it works (data flow from frontend → GraphQL → business logic)
   - Key components and their responsibilities

3. **Usage Instructions**:
   - How to access the feature (URL/route)
   - What operations are available
   - Example GraphQL queries/mutations (if applicable)

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

## Examples

### Example 1: Simple Query Feature
User wants to display a list of items fetched from the backend.
- Backend: Create GraphQL query with Item type
- Frontend: Use useQuery hook, display in list component
- No mutations or subscriptions needed

### Example 2: CRUD Feature
User wants full create/read/update/delete functionality.
- Backend: Create queries (list, get), mutations (create, update, delete)
- Frontend: List view, detail view, form component with TanStack Form
- Add success/error notifications

### Example 3: Real-time Monitoring
User wants to monitor data changes in real-time.
- Backend: Create subscription with PubSub
- Frontend: Use useSubscription hook to receive updates
- Update UI automatically when data changes

### Example 4: Frontend-Only Feature
User wants a new settings page with local state.
- No backend changes
- Create page component, view with forms
- Use localStorage or React state

### Example 5: Backend-Only Feature
User wants a background job or scheduled task.
- No frontend changes
- Create service with business logic
- Add to ApplicationContext if needed for lifecycle management
