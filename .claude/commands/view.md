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

**If the view includes forms, ask:**
- **Form Fields**:
  - What fields are needed? (text inputs, textareas, selects, checkboxes, etc.)
  - What are the field types and validation rules?
  - Are there any dynamic fields or array fields?
  - Should validation happen on submit, blur, or change?
- **Form Behavior**:
  - Is this a create or edit form?
  - What GraphQL mutation will be called on submit?
  - What should happen after successful submission? (redirect, close modal, show toast, etc.)
  - Should the form reset after submission?
  - Are there any default values to populate?

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

### Form Handling with TanStack Form

When your view needs to handle forms, use TanStack Form with Zod validation and shadcn/ui Field components.

**Install dependencies** (if not already installed):
```bash
cd apps/web
pnpm add @tanstack/react-form zod
```

**Basic Form Setup:**
```typescript
import { useForm } from '@tanstack/react-form';
import { useMutation } from '@apollo/client';
import { graphql } from '@/lib/graphql';
import { toast } from 'sonner';
import * as z from 'zod';
import { Field, FieldLabel, FieldDescription, FieldError } from '@/components/common/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const formSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters.'),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
});

const CreateItemMutation = graphql(`
  mutation CreateItem($input: CreateItemInput!) {
    createItem(input: $input) {
      id
      title
    }
  }
`);

export const CreateItemView = ({ onComplete }: CreateItemViewProps) => {
  const [createItem] = useMutation(CreateItemMutation);

  const form = useForm({
    defaultValues: {
      title: '',
      description: '',
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await createItem({ variables: { input: value } });
        toast.success('Item created successfully');
        onComplete?.();
      } catch (error) {
        toast.error('Failed to create item');
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <form.Field
        name="title"
        children={(field) => {
          const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel htmlFor={field.name}>Title</FieldLabel>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                aria-invalid={isInvalid}
              />
              <FieldDescription>Enter a descriptive title.</FieldDescription>
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          );
        }}
      />
      <Button type="submit">Create</Button>
    </form>
  );
};
```

**Form Field Types:**

**Input Field:**
```typescript
<form.Field
  name="username"
  children={(field) => {
    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
    return (
      <Field data-invalid={isInvalid}>
        <FieldLabel htmlFor={field.name}>Username</FieldLabel>
        <Input
          id={field.name}
          name={field.name}
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          aria-invalid={isInvalid}
        />
        {isInvalid && <FieldError errors={field.state.meta.errors} />}
      </Field>
    );
  }}
/>
```

**Textarea Field:**
```typescript
<form.Field
  name="description"
  children={(field) => {
    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
    return (
      <Field data-invalid={isInvalid}>
        <FieldLabel htmlFor={field.name}>Description</FieldLabel>
        <Textarea
          id={field.name}
          name={field.name}
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          aria-invalid={isInvalid}
        />
        {isInvalid && <FieldError errors={field.state.meta.errors} />}
      </Field>
    );
  }}
/>
```

**Select Field:**
```typescript
<form.Field
  name="category"
  children={(field) => {
    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
    return (
      <Field data-invalid={isInvalid}>
        <FieldLabel htmlFor={field.name}>Category</FieldLabel>
        <Select
          name={field.name}
          value={field.state.value}
          onValueChange={field.handleChange}
        >
          <SelectTrigger id={field.name} aria-invalid={isInvalid}>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bug">Bug</SelectItem>
            <SelectItem value="feature">Feature</SelectItem>
          </SelectContent>
        </Select>
        {isInvalid && <FieldError errors={field.state.meta.errors} />}
      </Field>
    );
  }}
/>
```

**Checkbox Field:**
```typescript
<form.Field
  name="agreedToTerms"
  children={(field) => {
    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
    return (
      <Field orientation="horizontal" data-invalid={isInvalid}>
        <Checkbox
          id={field.name}
          name={field.name}
          checked={field.state.value}
          onCheckedChange={field.handleChange}
          aria-invalid={isInvalid}
        />
        <FieldLabel htmlFor={field.name}>I agree to the terms</FieldLabel>
        {isInvalid && <FieldError errors={field.state.meta.errors} />}
      </Field>
    );
  }}
/>
```

**Checkbox Array (Multiple Selection):**
```typescript
<form.Field
  name="features"
  mode="array"
  children={(field) => {
    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
    return (
      <FieldSet>
        <FieldLegend variant="label">Features</FieldLegend>
        <FieldGroup data-slot="checkbox-group">
          {options.map((option) => (
            <Field key={option.id} orientation="horizontal" data-invalid={isInvalid}>
              <Checkbox
                id={`${field.name}-${option.id}`}
                name={field.name}
                checked={field.state.value.includes(option.id)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    field.pushValue(option.id);
                  } else {
                    const index = field.state.value.indexOf(option.id);
                    if (index > -1) field.removeValue(index);
                  }
                }}
                aria-invalid={isInvalid}
              />
              <FieldLabel htmlFor={`${field.name}-${option.id}`}>
                {option.label}
              </FieldLabel>
            </Field>
          ))}
        </FieldGroup>
        {isInvalid && <FieldError errors={field.state.meta.errors} />}
      </FieldSet>
    );
  }}
/>
```

**Radio Group Field:**
```typescript
<form.Field
  name="plan"
  children={(field) => {
    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
    return (
      <FieldSet>
        <FieldLegend>Plan</FieldLegend>
        <RadioGroup
          name={field.name}
          value={field.state.value}
          onValueChange={field.handleChange}
        >
          {plans.map((plan) => (
            <FieldLabel key={plan.id} htmlFor={`${field.name}-${plan.id}`}>
              <Field orientation="horizontal" data-invalid={isInvalid}>
                <FieldContent>
                  <FieldTitle>{plan.title}</FieldTitle>
                  <FieldDescription>{plan.description}</FieldDescription>
                </FieldContent>
                <RadioGroupItem
                  value={plan.id}
                  id={`${field.name}-${plan.id}`}
                  aria-invalid={isInvalid}
                />
              </Field>
            </FieldLabel>
          ))}
        </RadioGroup>
        {isInvalid && <FieldError errors={field.state.meta.errors} />}
      </FieldSet>
    );
  }}
/>
```

**Switch Field:**
```typescript
<form.Field
  name="notifications"
  children={(field) => {
    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
    return (
      <Field orientation="horizontal" data-invalid={isInvalid}>
        <FieldContent>
          <FieldLabel htmlFor={field.name}>Enable Notifications</FieldLabel>
          <FieldDescription>Receive email notifications</FieldDescription>
          {isInvalid && <FieldError errors={field.state.meta.errors} />}
        </FieldContent>
        <Switch
          id={field.name}
          name={field.name}
          checked={field.state.value}
          onCheckedChange={field.handleChange}
          aria-invalid={isInvalid}
        />
      </Field>
    );
  }}
/>
```

**Array Fields (Dynamic Lists):**
```typescript
<form.Field
  name="emails"
  mode="array"
  children={(field) => {
    return (
      <FieldSet>
        <FieldLegend variant="label">Email Addresses</FieldLegend>
        <FieldGroup>
          {field.state.value.map((_, index) => (
            <form.Field
              key={index}
              name={`emails[${index}].address`}
              children={(subField) => {
                const isInvalid = subField.state.meta.isTouched && !subField.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <InputGroup>
                      <InputGroupInput
                        id={`${subField.name}-${index}`}
                        name={subField.name}
                        value={subField.state.value}
                        onBlur={subField.handleBlur}
                        onChange={(e) => subField.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        type="email"
                      />
                      {field.state.value.length > 1 && (
                        <InputGroupAddon align="inline-end">
                          <InputGroupButton
                            type="button"
                            variant="ghost"
                            size="icon-xs"
                            onClick={() => field.removeValue(index)}
                          >
                            <XIcon />
                          </InputGroupButton>
                        </InputGroupAddon>
                      )}
                    </InputGroup>
                    {isInvalid && <FieldError errors={subField.state.meta.errors} />}
                  </Field>
                );
              }}
            />
          ))}
        </FieldGroup>
        <Button
          type="button"
          variant="outline"
          onClick={() => field.pushValue({ address: '' })}
        >
          Add Email
        </Button>
      </FieldSet>
    );
  }}
/>
```

**Validation Modes:**

TanStack Form supports different validation strategies:
```typescript
const form = useForm({
  defaultValues: { /* ... */ },
  validators: {
    onSubmit: formSchema,    // Validate on form submission
    onChange: formSchema,    // Validate on every change
    onBlur: formSchema,      // Validate when field loses focus
  },
});
```

**Form Actions:**
```typescript
<div>
  <Button type="submit">Submit</Button>
  <Button type="button" variant="outline" onClick={() => form.reset()}>
    Reset
  </Button>
</div>
```

**Integration with GraphQL Mutations:**
```typescript
const [updateItem, { loading }] = useMutation(UpdateItemMutation);

const form = useForm({
  defaultValues: initialData,
  validators: { onSubmit: formSchema },
  onSubmit: async ({ value }) => {
    try {
      const { data } = await updateItem({
        variables: { id: itemId, input: value }
      });
      toast.success('Item updated successfully');
      onComplete?.(data.updateItem);
    } catch (error) {
      toast.error('Failed to update item');
    }
  },
});
```

**Loading States During Submission:**
```typescript
<Button type="submit" disabled={form.state.isSubmitting}>
  {form.state.isSubmitting ? 'Saving...' : 'Save'}
</Button>
```

### State Management

**Local UI State** (tabs, modals, filters):
```typescript
const [activeTab, setActiveTab] = useState('overview');
const [isModalOpen, setIsModalOpen] = useState(false);
const [filters, setFilters] = useState({ search: '', status: 'all' });
```

**Form State** (use TanStack Form):
```typescript
const form = useForm({
  defaultValues: { /* ... */ },
  validators: { onSubmit: formSchema },
  onSubmit: async ({ value }) => { /* ... */ },
});
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
- Use TanStack Form with Zod for form handling and validation
- Use Field components from `@/components/common/field` for accessible forms
- Add `data-invalid` to `<Field />` and `aria-invalid` to form controls for error styling
- Display errors using `<FieldError errors={field.state.meta.errors} />`
- Use `form.state.isSubmitting` to show loading states during form submission

**DON'T:**
- Use routing hooks (useParams, useNavigate, useLocation) - pages handle routing
- Assume a specific layout or navigation structure
- Hard-code feature-specific values that should be props
- Create components in `common/` unless they're reused
- Fetch data in components (components are presentational, views fetch data)
- Build custom form state management - use TanStack Form instead
- Skip validation - always use Zod schemas with TanStack Form validators
- Forget to handle form submission errors with try/catch and toast notifications

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
- TanStack Form with Zod validation
- Field components with proper error handling
- Success/error notifications using Sonner
- Loading states during submission (disable button, show loading text)
- Form reset after successful submission
- Accessible form fields with `aria-invalid` attributes
- Real-time validation feedback (onBlur, onChange, or onSubmit)

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

### Example 6: Complete Form View with TanStack Form

Complete form view implementation with all best practices:

```typescript
import { useForm } from '@tanstack/react-form';
import { useMutation, useQuery } from '@apollo/client';
import { graphql } from '@/lib/graphql';
import { toast } from 'sonner';
import * as z from 'zod';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldLegend,
} from '@/components/common/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { LoadingState } from '@/components/common/loading-state';
import { ErrorState } from '@/components/common/error-state';

const formSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters.').max(100),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  category: z.enum(['bug', 'feature', 'improvement'], {
    errorMap: () => ({ message: 'Please select a category.' }),
  }),
  priority: z.enum(['low', 'medium', 'high']),
});

const GetItemQuery = graphql(`
  query GetItem($id: ID!) {
    item(id: $id) {
      id
      title
      description
      category
      priority
    }
  }
`);

const UpdateItemMutation = graphql(`
  mutation UpdateItem($id: ID!, $input: UpdateItemInput!) {
    updateItem(id: $id, input: $input) {
      id
      title
      description
    }
  }
`);

interface EditItemViewProps {
  itemId: string;
  onComplete?: () => void;
}

export const EditItemView = ({ itemId, onComplete }: EditItemViewProps) => {
  const { data, loading, error } = useQuery(GetItemQuery, {
    variables: { itemId },
  });

  const [updateItem] = useMutation(UpdateItemMutation);

  const form = useForm({
    defaultValues: {
      title: data?.item.title || '',
      description: data?.item.description || '',
      category: data?.item.category || 'bug',
      priority: data?.item.priority || 'medium',
    },
    validators: {
      onSubmit: formSchema,
      onBlur: formSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await updateItem({
          variables: { id: itemId, input: value },
        });
        toast.success('Item updated successfully');
        onComplete?.();
      } catch (error) {
        toast.error('Failed to update item');
        console.error('Update error:', error);
      }
    },
  });

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error.message} />;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="space-y-6"
    >
      <FieldGroup>
        <form.Field
          name="title"
          children={(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Title</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                />
                <FieldDescription>A brief title for the item.</FieldDescription>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />

        <form.Field
          name="description"
          children={(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                <Textarea
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  className="min-h-[120px]"
                />
                <FieldDescription>Provide detailed information.</FieldDescription>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />

        <form.Field
          name="category"
          children={(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field orientation="responsive" data-invalid={isInvalid}>
                <FieldContent>
                  <FieldLabel htmlFor={field.name}>Category</FieldLabel>
                  <FieldDescription>Select the item category.</FieldDescription>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </FieldContent>
                <Select
                  name={field.name}
                  value={field.state.value}
                  onValueChange={field.handleChange}
                >
                  <SelectTrigger id={field.name} aria-invalid={isInvalid}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bug">Bug</SelectItem>
                    <SelectItem value="feature">Feature</SelectItem>
                    <SelectItem value="improvement">Improvement</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            );
          }}
        />

        <form.Field
          name="priority"
          children={(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field orientation="responsive" data-invalid={isInvalid}>
                <FieldContent>
                  <FieldLabel htmlFor={field.name}>Priority</FieldLabel>
                  <FieldDescription>Set the priority level.</FieldDescription>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </FieldContent>
                <Select
                  name={field.name}
                  value={field.state.value}
                  onValueChange={field.handleChange}
                >
                  <SelectTrigger id={field.name} aria-invalid={isInvalid}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            );
          }}
        />
      </FieldGroup>

      <div className="flex gap-2">
        <Button type="submit" disabled={form.state.isSubmitting}>
          {form.state.isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => form.reset()}
          disabled={form.state.isSubmitting}
        >
          Reset
        </Button>
      </div>
    </form>
  );
};
```

**Key Features Demonstrated:**
- Query for initial data before rendering form
- TanStack Form with Zod validation
- Multiple field types (Input, Textarea, Select)
- Error handling with accessible error messages
- Loading and error states
- Form submission with GraphQL mutation
- Success/error toast notifications
- Disabled state during submission
- Form reset functionality
- Responsive field layouts using `orientation="responsive"`
