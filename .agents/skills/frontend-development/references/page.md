# Pages: route coordinators

A page exists to translate a URL into props. It reads params, query string and navigation state, hands them to a view, and does nothing else. Thirty lines is a generous upper bound; most are five.

Concentrating routing knowledge here keeps views reusable — the same view can be mounted at a different path, inside a dialog, or in a tab without touching it.

## Ask first

- **Name and route path**: `/dashboard`, `/profile/:userId`, `/products/:id`
- **Layout**: which shell wraps it, if any?
- **View**: does it render an existing view, or does one need creating?
- **Route data**: params, query parameters, navigation state?
- **Protection**: does the route require authentication?

## Implement

File: `apps/web/src/pages/{page-name}-page.tsx`. Router hooks come from `react-router`, not `react-router-dom`.

```typescript
import { useParams, useSearchParams } from 'react-router';
import { UserProfileView } from '@/views/user-profile-view';

export const UserProfilePage = () => {
  const { userId } = useParams();
  const [searchParams] = useSearchParams();

  return <UserProfileView userId={userId!} tab={searchParams.get('tab') ?? 'overview'} />;
};
```

`useParams` for `:segments`, `useSearchParams` for the query string, `useLocation` for state passed through `navigate(path, { state })`. Parse and default the values here — a view should receive a `string`, not a `string | null` it has to interpret.

Export the page from `apps/web/src/pages/index.ts`; `app.tsx` imports from that barrel.

## Register the route

`apps/web/src/app.tsx` holds a `RouteObject[]` fed to `createBrowserRouter` (or `createHashRouter`, depending on `isHashBasedRouting`). Add an entry to the right group, and give it a `handle.title` — the layout chrome reads that to render the page title:

```typescript
{
  element: <ResponsiveDashboardLayout />,
  children: [
    { path: '/products', element: <ProductsPage />, handle: { title: 'Products' } },
    { path: '/products/:productId', element: <ProductDetailPage />, handle: { title: 'Product' } },
  ],
}
```

Nested sections get their own layout and an index redirect:

```typescript
{
  path: '/settings',
  element: <SettingsLayout />,
  children: [
    { index: true, element: <Navigate to="profile" replace /> },
    { path: 'profile', element: <SettingsProfilePage />, handle: { title: 'Profile' } },
  ],
}
```

Protected routes wrap the layout element rather than each page — one auth check for the whole section instead of one per route.

## Report

The route path and its parameters, what gets extracted and passed on, which layout applies, and example navigation calls:

```typescript
navigate('/products/123');
navigate('/products/123', { state: { from: '/dashboard' } });
navigate('/search?q=react&filter=recent');
```
