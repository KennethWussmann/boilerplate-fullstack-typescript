Create a complete Frontend Feature

This command guides you through creating a complete frontend feature including page, view, and components. This is a higher-level command that orchestrates multiple frontend pieces.

## Step 1: Gather Feature Requirements

Ask the user about:
- **Feature Name**: What is this feature called? (e.g., "UserProfile", "TaskManagement", "ProductCatalog")
- **Feature Purpose**: What does it do from the user's perspective? (1-3 sentences)
- **Route Path**: What URL path should this feature use? (e.g., "/profile/:userId", "/tasks", "/products")
- **Layout**: Which layout should wrap this feature?
  - Default (no specific layout)
  - Dashboard layout (authenticated app shell)
  - Auth layout (login/signup pages)
  - Settings layout (with sidebar)
  - New custom layout (will need to create)

## Step 2: Gather Data Requirements

Ask the user about:
- **Data Source**:
  - GraphQL (from existing backend)
  - REST API
  - Local state only
  - Mock data for prototyping
- **Operations Needed** (if using GraphQL/API):
  - Queries (read data)
  - Mutations (create/update/delete)
  - Subscriptions (real-time updates)
- **Data Model**: What data does this feature work with?
  - Existing backend types (query which ones)
  - New types needed (need backend work first)
  - Local types only

## Step 3: Gather UI Requirements

Ask the user about:
- **UI Components Needed**:
  - Form (what fields?)
  - List/Table/Grid
  - Detail view
  - Tabs or sections
  - Modals/Dialogs
  - Search/Filter controls
  - Sorting/Pagination
- **User Interactions**:
  - View data
  - Create new items
  - Edit existing items
  - Delete items
  - Search/filter
  - Real-time monitoring
- **States to Handle**:
  - Loading state
  - Error state
  - Empty state
  - Success notifications

## Step 4: Review Architecture Plan

Before implementing, create a comprehensive implementation plan:

**Page Layer:**
- Page file: `apps/web/src/pages/{feature-name}-page.tsx`
- Route configuration in `app.tsx`
- Route parameters to extract
- Layout to use

**View Layer:**
- View directory: `apps/web/src/views/{feature-name}-view/`
- Main view: `{feature-name}-view.tsx`
- Sub-components:
  - `{feature-name}-list.tsx` (if needed)
  - `{feature-name}-detail.tsx` (if needed)
  - `{feature-name}-form.tsx` (if needed)
  - Other feature-specific components
- GraphQL operations (if needed)
- Custom hooks (if needed)

**Common Components:**
- Any new reusable components needed
- Existing components to use

**Dependencies:**
- Backend GraphQL types (if applicable)
- New common components (if needed)
- shadcn/ui components to use

Present this plan to the user and confirm before proceeding.

## Step 5: Implement Backend Integration (if needed)

If using GraphQL and backend types are needed:

1. **Verify backend schema** has required types and operations
2. **If backend work needed**, suggest creating it first using `/graphql-module` or `/feature` commands
3. **Run codegen** to get latest types:
   ```bash
   cd apps/web
   pnpm codegen
   ```

## Step 6: Create Page Component

**File**: `apps/web/src/pages/{feature-name}-page.tsx`

Create thin routing coordinator:
- Extract route parameters
- Extract query parameters (if needed)
- Pass data to view
- Keep under 30 lines

**Pattern**:
```typescript
import { useParams, useSearchParams } from 'react-router-dom';
import { FeatureNameView } from '@/views/{feature-name}-view';

export const FeatureNamePage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  return (
    <FeatureNameView
      itemId={id!}
      filter={searchParams.get('filter') || 'all'}
    />
  );
};
```

## Step 7: Create View Component

**Directory**: `apps/web/src/views/{feature-name}-view/`

### Main View File

**File**: `{feature-name}-view.tsx`

Create main view component:
- Accept props from page
- Fetch data with GraphQL/API (if needed)
- Manage view-level state (tabs, filters, modals)
- Compose sub-components
- Handle loading/error/empty states

**Pattern**:
```typescript
import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { graphql } from '@/lib/graphql';
import { LoadingState } from '@/components/common/loading-state';
import { ErrorState } from '@/components/common/error-state';
import { EmptyState } from '@/components/common/empty-state';
import { FeatureNameList } from './feature-name-list';
import { FeatureNameForm } from './feature-name-form';

const GetItemsQuery = graphql(`
  query GetItems($filter: String) {
    items(filter: $filter) {
      id
      name
    }
  }
`);

interface FeatureNameViewProps {
  itemId?: string;
  filter?: string;
}

export const FeatureNameView = ({ itemId, filter }: FeatureNameViewProps) => {
  const { data, loading, error } = useQuery(GetItemsQuery, {
    variables: { filter }
  });

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error.message} />;
  if (!data?.items.length) return <EmptyState title="No items found" />;

  return (
    <div>
      <FeatureNameList items={data.items} />
    </div>
  );
};
```

### Sub-Components

Create view-specific components as needed:

**List Component** (`{feature-name}-list.tsx`):
```typescript
interface Item {
  id: string;
  name: string;
}

interface FeatureNameListProps {
  items: Item[];
  onItemClick?: (id: string) => void;
}

export const FeatureNameList = ({ items, onItemClick }: FeatureNameListProps) => {
  return (
    <div className="space-y-2">
      {items.map(item => (
        <Card key={item.id} onClick={() => onItemClick?.(item.id)}>
          <CardContent>
            <h3>{item.name}</h3>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
```

**Form Component** (`{feature-name}-form.tsx`):
```typescript
import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { graphql } from '@/lib/graphql';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const CreateItemMutation = graphql(`
  mutation CreateItem($input: CreateItemInput!) {
    createItem(input: $input) {
      id
      name
    }
  }
`);

interface FeatureNameFormProps {
  onSuccess?: () => void;
}

export const FeatureNameForm = ({ onSuccess }: FeatureNameFormProps) => {
  const [name, setName] = useState('');
  const [createItem, { loading }] = useMutation(CreateItemMutation);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createItem({ variables: { input: { name } } });
      toast.success('Item created successfully');
      setName('');
      onSuccess?.();
    } catch (error) {
      toast.error('Failed to create item');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Item name"
        required
      />
      <Button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Item'}
      </Button>
    </form>
  );
};
```

**Detail Component** (`{feature-name}-detail.tsx`):
```typescript
interface FeatureNameDetailProps {
  item: {
    id: string;
    name: string;
    description: string;
  };
  onEdit?: () => void;
  onDelete?: () => void;
}

export const FeatureNameDetail = ({ item, onEdit, onDelete }: FeatureNameDetailProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{item.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{item.description}</p>
      </CardContent>
      <CardFooter className="gap-2">
        <Button onClick={onEdit}>Edit</Button>
        <Button variant="destructive" onClick={onDelete}>Delete</Button>
      </CardFooter>
    </Card>
  );
};
```

### Exports

**File**: `index.ts`

```typescript
export { FeatureNameView } from './{feature-name}-view';
export type { FeatureNameViewProps } from './{feature-name}-view';
```

## Step 8: Create Common Components (if needed)

If any components are reusable across features, create them in `components/common/`:

Use the `/component` command to create reusable components.

## Step 9: Register Route

**File**: `apps/web/src/app.tsx`

Add route to router configuration:

```typescript
import { FeatureNamePage } from '@/pages/{feature-name}-page';

// Add to routes
<Route path="/{feature-path}" element={<FeatureNamePage />} />

// Or with layout
{
  element: <DashboardLayout />,
  children: [
    { path: "/{feature-path}", element: <FeatureNamePage /> },
  ]
}
```

## Step 10: Run Code Generation (if using GraphQL)

After creating GraphQL operations:

```bash
cd apps/web
pnpm codegen
```

## Step 11: Test the Feature

1. **Build check**:
   ```bash
   cd apps/web
   pnpm build
   ```

2. **Run dev server**:
   ```bash
   cd apps/web
   pnpm dev
   ```

3. **Manual testing**:
   - Navigate to feature route
   - Test all user interactions
   - Verify loading states
   - Test error scenarios
   - Check empty states
   - Verify notifications

4. **Lint check**:
   ```bash
   pnpm check
   ```

5. **Fix issues**:
   ```bash
   pnpm check:fix
   ```

## Step 12: Summary

Provide the user with:

1. **Files Created**:
   - Page component
   - View directory with all components
   - Common components (if any)
   - Route configuration
   - List all files with their purposes

2. **Feature Overview**:
   - What the feature does
   - How to access it (URL)
   - Data flow (page → view → components)
   - GraphQL operations used (if any)

3. **Architecture Summary**:
   - Page layer: route coordination
   - View layer: data fetching and composition
   - Components: UI building blocks
   - State management approach
   - Error handling strategy

4. **Usage Instructions**:
   - How to navigate to feature
   - Available interactions
   - Example navigation code
   - GraphQL queries/mutations (if applicable)

5. **Next Steps**:
   - Add tests
   - Enhance error handling
   - Add loading skeletons
   - Implement advanced features (search, filter, pagination)
   - Add analytics tracking
   - Improve mobile responsiveness
   - Add keyboard shortcuts

## Important Naming Conventions

**Files**: Use kebab-case for ALL files
- Pages: `{feature-name}-page.tsx`
- Views: `{feature-name}-view.tsx`
- Components: `{component-name}.tsx`
- Hooks: `use-{hook-name}.ts`

**Directories**: Use kebab-case
- `{feature-name}-view/`
- `components/common/`

**Exports**: Use PascalCase for components, camelCase for hooks
- `FeatureNamePage`, `FeatureNameView`, `FeatureNameList`
- `useFeatureNameForm`, `useFeatureNameFilters`

## Architecture Rules

**Page Layer:**
- Thin routing coordinator (< 30 lines)
- Extract route data only
- Pass props to view
- No business logic
- No data fetching
- No UI rendering (except view composition)

**View Layer:**
- Fetch and manage data
- Compose sub-components
- Handle view-level state
- Layout-agnostic
- No routing hooks

**Component Layer:**
- Presentational and focused
- Receive data via props
- No data fetching
- Reusable when possible

**State Management:**
- Local state for UI (useState)
- GraphQL cache for server state
- Custom hooks for complex logic
- Context for cross-cutting concerns

**Styling:**
- Tailwind CSS utilities
- shadcn/ui components
- Consistent spacing and colors
- Mobile-first responsive design

## Examples

### Example 1: Simple List Feature

User wants to display a list of items:
- Page: Extract route params
- View: Query items, display list
- List component: Render items
- No forms or mutations

### Example 2: CRUD Feature

User wants full create/read/update/delete:
- Page: Extract item ID from route
- View: Query for item, handle mutations
- List component: Display items with actions
- Form component: Create/edit form
- Detail component: Show item details
- Delete confirmation dialog

### Example 3: Dashboard Feature

User wants a dashboard with metrics:
- Page: Simple coordinator
- View: Query multiple metrics, manage refresh
- Metric cards: Display individual metrics
- Charts: Visualize data
- Real-time subscription for updates

### Example 4: Search Feature

User wants search with filters:
- Page: Extract query params (search, filter, page)
- View: Query with variables, manage filter state
- Search bar: Input component
- Filter controls: Dropdowns/checkboxes
- Results list: Display paginated results
- Pagination: Page controls

### Example 5: Form Wizard Feature

User wants multi-step form:
- Page: Simple coordinator
- View: Manage wizard state (current step)
- Step components: Individual form steps
- Navigation: Next/Previous buttons
- Summary: Review before submit
- Success: Confirmation screen
