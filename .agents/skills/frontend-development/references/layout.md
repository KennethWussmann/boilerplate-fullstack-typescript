# Layouts: the application shell

A layout is the frame around a group of routes: navigation, header, sidebar, footer, and the providers that section needs. It renders `<Outlet />` where page content goes and stays route-agnostic — a layout that inspects `useParams` has become a page in disguise.

The existing layouts are `public-layout.tsx`, `dashboard-layout.tsx`, `mobile-app-layout.tsx` and `responsive-dashboard-layout.tsx`. Read them before adding another; the answer is often "extend one" rather than "write one".

## Ask first

- **Name and purpose**: which section of the app? (`dashboard`, `auth`, `settings`, `marketing`)
- **Pages**: which routes will sit inside it?
- **Navigation elements**: header, sidebar, footer, breadcrumbs, or none?
- **Structure**: full-width or container, sidebar side, fixed or scrolling chrome?
- **Mobile**: does it need a separate mobile variant, like `ResponsiveDashboardLayout` switching on `useIsMobile()`?
- **Providers**: does this section need auth, theme, or feature-flag context?

## Navigation comes from the registry

Do not hand-write nav links into a layout. Navigation items live in `apps/web/src/components/common/navigation/navigation-registry.ts` and layouts pull the resolved list with `useNavigation('<tree>')`. That is what keeps the desktop sidebar, the mobile tab bar and the public header showing the same set of destinations, with the `devOnly` and `apiEnabledOnly` filters applied consistently. Adding a page to the navigation means registering an item and assigning it to a tree.

## Implement

File: `apps/web/src/layouts/{layout-name}-layout.tsx`, with chrome split into siblings once it grows. Router imports come from `react-router`.

```typescript
import { Outlet } from 'react-router';
import { DocumentTitle } from '@/components';
import { DashboardHeader } from './dashboard-header';
import { DashboardSidebar } from './dashboard-sidebar';

export const DashboardLayout = () => {
  return (
    <>
      <DocumentTitle />
      <div className="flex h-screen">
        <DashboardSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <DashboardHeader />
          <main className="flex-1 overflow-auto">
            <div className="container py-6">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </>
  );
};
```

Wrapping providers here rather than around individual pages means one instance for the whole section, so state such as an auth session survives navigation between its pages:

```typescript
export const AuthLayout = () => (
  <AuthProvider>
    <div className="flex min-h-screen items-center justify-center py-12">
      <div className="w-full max-w-md">
        <Outlet />
      </div>
    </div>
  </AuthProvider>
);
```

Active-link highlighting is the one legitimate use of `useLocation` in a layout — it describes where the user is in the nav, not what the page renders. `useNavigation` already resolves the active item for you.

Export the layout from `apps/web/src/layouts/index.ts`.

## Register in the router

In `apps/web/src/app.tsx` the layout is the `element` and the pages are its `children`:

```typescript
{
  element: <DashboardLayout />,
  children: [
    { path: '/dashboard', element: <DashboardPage />, handle: { title: 'Dashboard' } },
  ],
}
```

Layouts nest: a `SettingsLayout` with its own secondary navigation can sit inside another layout as a child route, and both outlets render.

## Report

Files created, the structure and where its navigation comes from, which routes it wraps, how mobile is handled, and how to add further pages to it.
