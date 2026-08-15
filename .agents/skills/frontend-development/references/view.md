# Views: the screen itself

A view implements one complete user task. It fetches its own data, holds view-level state (active tab, open dialog, current filter), and composes the sub-components that make up the screen. Everything route-shaped arrives as props, which is what lets the same view be dropped into a modal or a different route unchanged.

Look at `apps/web/src/views/settings-view/` and `apps/web/src/views/dashboard-view/` for the established shape.

## Ask first

- **Name and purpose**: what task does the user accomplish here?
- **Data**: what does it display, where does it come from, does it need live updates?
- **Sub-components**: forms, lists, tables, detail panels, tabs, dialogs?
- **Interactions**: create, edit, delete, search, filter, sort, paginate?
- **Forms**: if there are any, read [forms.md](forms.md) and ask the questions there too.

## Structure

```
apps/web/src/views/{view-name}-view/
├── {view-name}-view.tsx      # the view
├── {view-name}-list.tsx      # view-specific components, co-located
├── {view-name}-form.tsx
├── use-{hook-name}.ts        # view-specific hooks
└── index.ts                  # exports
```

Sub-components live next to the view that uses them. Promoting one into `components/common/` is a decision to make when a second view needs it — moving it early produces a `common/` folder full of things with exactly one caller and a props type shaped by that caller.

## Implement

```typescript
import { useQuery } from '@apollo/client/react';
import { useState } from 'react';
import { EmptyState, LoadingState } from '@/components';
import { graphql } from '@/lib/graphql';
import { ProductList } from './product-list';

const GetProductsQuery = graphql(`
  query GetProducts($filter: String) {
    products(filter: $filter) {
      id
      name
    }
  }
`);

type ProductsViewProps = {
  filter?: string;
  onSelect?: (id: string) => void;
};

export const ProductsView = ({ filter, onSelect }: ProductsViewProps) => {
  const { data, loading, error } = useQuery(GetProductsQuery, { variables: { filter } });
  const [activeTab, setActiveTab] = useState('all');

  if (loading) return <LoadingState />;
  if (error) return <EmptyState title="Could not load products" description={error.message} />;
  if (!data?.products.length) return <EmptyState title="No products yet" />;

  return <ProductList products={data.products} onSelect={onSelect} />;
};
```

`index.ts` re-exports the view and its props type.

Note the import sources: Apollo hooks come from `@apollo/client/react`, shared components from the `@/components` barrel, and `graphql` from `@/lib/graphql`.

### GraphQL

Declare operations with `graphql()` and run them with `useQuery`, `useMutation`, `useSubscription`. gql.tada types them against the server schema, so after the backend changes run `pnpm codegen` in `apps/web` — a typo in a field name then becomes a compile error instead of a runtime `undefined`.

For live data, either `useSubscription` alongside the query (see `apps/web/src/lib/graphql/use-server-status.ts`), or `subscribeToMore` when updates should fold into the existing query cache.

### State

`useState` for local UI state: tabs, dialogs, filters. Server state stays in the Apollo cache — copying query results into `useState` guarantees the two drift apart the first time a mutation refetches. Cross-view state that must persist uses the jotai atoms in `@/lib/settings`. Forms belong to TanStack Form, described in [forms.md](forms.md).

### Navigation

Views do not navigate. If something on screen should move the user elsewhere, expose a callback prop (`onSelect`, `onComplete`) and let the page decide what that means.

## Report

Files created, what the view fetches and renders, its props type, an example of mounting it from a page, and what could be improved.
