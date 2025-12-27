Create a new View component in the frontend

This command guides you through creating a View component following the frontend architecture patterns. Views are feature-specific compositions that implement complete user tasks or workflows.

## Step 1: Gather View Requirements

Ask the user about:
- **View Name**: What is this view called? (e.g., "UserProfile", "Dashboard", "Settings")
- **View Purpose**: What user task or workflow does it fulfill? (1-2 sentences)
- **Data Requirements**:
  - Does it fetch data? (GraphQL queries/mutations/subscriptions)
  - What data does it display?
  - Does it need real-time updates?

## Step 2: Gather Component Composition

Ask the user about:
- **Sub-components Needed**:
  - Forms (with which fields?)
  - Lists/Tables
  - Detail displays
  - Tabs/Navigation within view
  - Modals/Dialogs
- **User Interactions**:
  - Create/Edit/Delete operations
  - Search/Filter capabilities
  - Sorting/Pagination
  - Loading/Error states

## Step 3: Review Architecture Plan

Before implementing, create a brief implementation plan:

**View Structure:**
- Main view file: `apps/web/src/views/{view-name}-view/{view-name}-view.tsx`
- View-specific components (co-located):
  - `{component-name}.tsx` for each sub-component
  - `use-{hook-name}.ts` for view-specific hooks
  - `{utility-name}.ts` for view-specific utilities
- GraphQL operations (if needed)
- State management approach (useState, custom hooks, context)

Present this plan to the user and confirm before proceeding.

## Step 4: Implement View Component

Follow these architecture principles:

### Directory Structure

Create view directory:
```
apps/web/src/views/{view-name}-view/
├── {view-name}-view.tsx       # Main view component
├── {sub-component}.tsx        # View-specific components
├── use-{hook-name}.ts         # View-specific hooks (optional)
├── {utility}.ts               # View-specific utilities (optional)
└── index.ts                   # Exports
```

### Main View Component

**File**: `apps/web/src/views/{view-name}-view/{view-name}-view.tsx`

**Responsibilities:**
- Accept configuration via props (NO routing hooks - pages handle routing)
- Fetch and manage feature-specific data (GraphQL queries/mutations)
- Handle view-level state (tabs, filters, modals)
- Compose sub-components into cohesive interface
- Be layout-agnostic (works in different layouts)

**Structure Pattern:**
```typescript
import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { graphql } from '@/lib/graphql';
import { LoadingState } from '@/components/common/loading-state';
import { Button } from '@/components/ui/button';

const GetDataQuery = graphql(`
  query GetData($id: ID!) {
    item(id: $id) {
      id
      name
    }
  }
`);

interface ViewNameViewProps {
  itemId: string;
  onComplete?: () => void;
}

export const ViewNameView = ({ itemId, onComplete }: ViewNameViewProps) => {
  const { data, loading } = useQuery(GetDataQuery, {
    variables: { itemId }
  });
  const [activeTab, setActiveTab] = useState('overview');

  if (loading) return <LoadingState />;

  return (
    <div>
      {/* Compose sub-components here */}
    </div>
  );
};
```

### View-Specific Components

**File**: `apps/web/src/views/{view-name}-view/{component-name}.tsx`

Keep components that are ONLY used in this view co-located with the view:
- `{view-name}-header.tsx`
- `{view-name}-form.tsx`
- `{view-name}-list.tsx`
- `{view-name}-tabs.tsx`
- etc.

**When to move to `components/common/`:**
- Component is used in 2+ different views
- Component represents a standard UI pattern
- Component should maintain consistent behavior app-wide

### GraphQL Operations

If the view fetches data, define GraphQL operations using `gql.tada`:

```typescript
import { graphql } from '@/lib/graphql';

const GetItemsQuery = graphql(`
  query GetItems {
    items {
      id
      name
      description
    }
  }
`);

const CreateItemMutation = graphql(`
  mutation CreateItem($input: CreateItemInput!) {
    createItem(input: $input) {
      id
      name
    }
  }
`);

const ItemUpdatesSubscription = graphql(`
  subscription ItemUpdates {
    itemUpdated {
      id
      name
    }
  }
`);
```

Use with Apollo Client hooks:
- `useQuery(GetItemsQuery)` for queries
- `useMutation(CreateItemMutation)` for mutations
- `useSubscription(ItemUpdatesSubscription)` for real-time updates

### State Management

**Local UI State** (tabs, modals, filters):
```typescript
const [activeTab, setActiveTab] = useState('overview');
const [isModalOpen, setIsModalOpen] = useState(false);
const [filters, setFilters] = useState({ search: '', status: 'all' });
```

**Custom Hooks** for complex state:
```typescript
// use-{view-name}-form.ts
export const useViewNameForm = (initialData: Data) => {
  const [values, setValues] = useState(initialData);
  const [errors, setErrors] = useState({});

  const updateField = (field: string, value: string) => {
    setValues(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  return { values, errors, updateField };
};
```

### Error and Loading States

Always handle loading and error states:

```typescript
const { data, loading, error } = useQuery(GetDataQuery);

if (loading) return <LoadingState />;
if (error) return <ErrorState message={error.message} />;
if (!data) return <EmptyState />;

return <div>{/* render data */}</div>;
```

### Exports

**File**: `apps/web/src/views/{view-name}-view/index.ts`

```typescript
export { ViewNameView } from './{view-name}-view';
export type { ViewNameViewProps } from './{view-name}-view';
```

## Step 5: Code Generation (if GraphQL used)

After creating GraphQL operations:

```bash
cd apps/web
pnpm codegen
```

This generates TypeScript types from the server schema.

## Step 6: Integration Instructions

Provide the user with integration steps:

1. **Import the view** in a page component:
   ```typescript
   import { ViewNameView } from '@/views/{view-name}-view';
   ```

2. **Use in page** with props:
   ```typescript
   export const ExamplePage = () => {
     const { id } = useParams();
     return <ViewNameView itemId={id!} />;
   };
   ```

## Step 7: Summary

Provide the user with:

1. **Files Created**:
   - List all new files with their purposes
   - Explain the structure and organization

2. **View Overview**:
   - What the view does
   - What data it fetches/manages
   - Key sub-components and their roles

3. **Usage Instructions**:
   - How to use the view (props interface)
   - Example integration in a page
   - Available operations (if GraphQL used)

4. **Next Steps**:
   - Suggested improvements
   - Testing recommendations
   - Additional sub-components to consider

## Important Naming Conventions

**Files**: Use kebab-case for ALL files
- Main view: `{view-name}-view.tsx`
- Components: `{component-name}.tsx`
- Hooks: `use-{hook-name}.ts`
- Utils: `{utility-name}.ts`

**Directories**: Use kebab-case
- `{view-name}-view/`
- `components/common/`

**Exports**: Use PascalCase for components, camelCase for hooks/utils
- File: `user-profile-view.tsx` → Export: `UserProfileView`
- File: `use-profile-form.ts` → Export: `useProfileForm`
- File: `format-date.ts` → Export: `formatDate`

## Architecture Rules

**DO:**
- Keep views layout-agnostic (no assumptions about navigation/shell)
- Accept configuration via props from pages
- Handle data fetching (GraphQL queries, API calls)
- Manage view-level state (tabs, filters, modals)
- Organize view-specific components in same directory
- Use TypeScript interfaces for all props
- Handle loading/error states for all data fetching
- Use Sonner for notifications (success/error messages)
- Use shadcn/ui components from `@/components/ui/`

**DON'T:**
- Use routing hooks (useParams, useNavigate, useLocation) - pages handle routing
- Assume a specific layout or navigation structure
- Hard-code feature-specific values that should be props
- Create components in `common/` unless they're reused
- Fetch data in components (components are presentational, views fetch data)

## Examples

### Example 1: Simple Display View

User wants to display item details:
- Single GraphQL query
- Display data in organized layout
- No mutations or forms
- Simple loading/error states

### Example 2: Form View

User wants to create/edit items:
- Query for initial data (if editing)
- Mutation for save operation
- Form validation and state management
- Success/error notifications
- Loading states during submission

### Example 3: List with Actions View

User wants to display and manage a list:
- Query for list data
- Mutations for actions (delete, update status)
- Filters and search
- Pagination or infinite scroll
- Optimistic updates

### Example 4: Real-time Dashboard View

User wants real-time data monitoring:
- Initial query for data
- Subscription for real-time updates
- Auto-updating UI when data changes
- Multiple metric displays
- Status indicators

### Example 5: Tabbed View

User wants multiple sections in one view:
- Tab state management
- Different data queries per tab
- Lazy loading of tab content
- Shareable tab state via props
