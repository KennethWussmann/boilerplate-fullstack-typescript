Create a new Layout component in the frontend

This command guides you through creating a Layout component. Layouts define the structural shell of your application, providing consistent navigation, spacing, and context for groups of pages.

## Step 1: Gather Layout Requirements

Ask the user about:
- **Layout Name**: What is this layout called? (e.g., "Dashboard", "Auth", "Settings", "Marketing")
- **Layout Purpose**: What section of the app does it serve? (1-2 sentences)
- **Pages Using Layout**: Which pages will use this layout?
- **Navigation Elements**:
  - Header/Top navigation
  - Sidebar navigation
  - Footer
  - Breadcrumbs
  - None (minimal layout)

## Step 2: Gather Structural Requirements

Ask the user about:
- **Layout Structure**:
  - Full-width or container-based
  - Sidebar position (left, right, both, none)
  - Fixed or scrollable header/footer
  - Mobile responsiveness needs
- **Navigation Items**:
  - What links/menu items in navigation?
  - Active route highlighting?
  - User menu or profile dropdown?
- **Context Providers**:
  - Does this layout need to wrap content with providers?
  - Theme provider, auth check, feature flags?

## Step 3: Review Architecture Plan

Before implementing, create a brief implementation plan:

**Layout Structure:**
- Layout file: `apps/web/src/layouts/{layout-name}-layout.tsx`
- Layout-specific components (if needed):
  - `{layout-name}-header.tsx`
  - `{layout-name}-sidebar.tsx`
  - `{layout-name}-footer.tsx`
- Route configuration in `app.tsx`
- Context providers (if needed)

Present this plan to the user and confirm before proceeding.

## Step 4: Implement Layout Component

Follow these architecture principles:

### Layout Component

**File**: `apps/web/src/layouts/{layout-name}-layout.tsx`

**Responsibilities:**
- Provide structural shell of application section
- Include persistent navigation (header, sidebar, footer)
- Define outlet area where page content renders
- Wrap content with section-specific providers
- Maintain consistent spacing and container structure

**DO NOT:**
- Contain feature-specific logic
- Fetch data (except for navigation items if needed)
- Handle routing (use React Router's Outlet)

### Basic Layout Pattern

```typescript
import { Outlet } from 'react-router-dom';

export const LayoutNameLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        {/* Header content */}
      </header>

      <main className="flex-1">
        <div className="container mx-auto py-6">
          <Outlet />
        </div>
      </main>

      <footer className="border-t">
        {/* Footer content */}
      </footer>
    </div>
  );
};
```

### Layout with Sidebar

```typescript
import { Outlet } from 'react-router-dom';
import { Sidebar } from './dashboard-sidebar';
import { Header } from './dashboard-header';

export const DashboardLayout = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-auto">
          <div className="container py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
```

### Layout with Provider

```typescript
import { Outlet } from 'react-router-dom';
import { AuthProvider } from '@/lib/providers/auth-provider';

export const AuthLayout = () => {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <main className="flex items-center justify-center py-12">
          <div className="w-full max-w-md">
            <Outlet />
          </div>
        </main>
      </div>
    </AuthProvider>
  );
};
```

### Layout with Navigation

```typescript
import { Outlet, Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const navigationItems = [
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/projects', label: 'Projects' },
  { path: '/settings', label: 'Settings' },
];

export const AppLayout = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen">
      <header className="border-b">
        <nav className="container mx-auto px-4 py-4">
          <ul className="flex gap-6">
            {navigationItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    'text-sm font-medium transition-colors hover:text-primary',
                    location.pathname === item.path
                      ? 'text-primary'
                      : 'text-muted-foreground'
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
};
```

### Responsive Layout with Mobile Menu

```typescript
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sidebar } from './app-sidebar';

export const ResponsiveLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {/* Sidebar - hidden on mobile unless menu open */}
      <div className={cn(
        'fixed lg:static inset-0 z-40 lg:z-0',
        isMobileMenuOpen ? 'block' : 'hidden lg:block'
      )}>
        <Sidebar onNavigate={() => setIsMobileMenuOpen(false)} />
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="container py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
```

### Layout-Specific Components

Create reusable components for layout elements:

**File**: `apps/web/src/layouts/{layout-name}-header.tsx`
```typescript
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export const DashboardHeader = () => {
  return (
    <header className="border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="font-bold text-xl">
          App Name
        </Link>

        <nav className="flex items-center gap-4">
          <Button variant="ghost">Profile</Button>
          <Button variant="ghost">Logout</Button>
        </nav>
      </div>
    </header>
  );
};
```

**File**: `apps/web/src/layouts/{layout-name}-sidebar.tsx`
```typescript
import { Link, useLocation } from 'react-router-dom';
import { Home, Settings, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
  { icon: Home, label: 'Dashboard', path: '/dashboard' },
  { icon: Users, label: 'Users', path: '/users' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export const DashboardSidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-64 border-r bg-background">
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);

            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};
```

## Step 5: Register Layout in Router

**File**: `apps/web/src/app.tsx`

### Layout Wrapping Multiple Pages

```typescript
import { LayoutNameLayout } from '@/layouts/{layout-name}-layout';
import { PageOne } from '@/pages/page-one';
import { PageTwo } from '@/pages/page-two';

// Add to routes
{
  element: <LayoutNameLayout />,
  children: [
    { path: "/page-one", element: <PageOne /> },
    { path: "/page-two", element: <PageTwo /> },
  ]
}
```

### Multiple Layouts

```typescript
// Different layouts for different sections
const router = createBrowserRouter([
  {
    element: <MarketingLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/about", element: <AboutPage /> },
    ]
  },
  {
    element: <DashboardLayout />,
    children: [
      { path: "/dashboard", element: <DashboardPage /> },
      { path: "/projects", element: <ProjectsPage /> },
    ]
  },
  {
    element: <AuthLayout />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/signup", element: <SignupPage /> },
    ]
  },
]);
```

### Nested Layouts

```typescript
{
  element: <AppLayout />,
  children: [
    { path: "/", element: <HomePage /> },
    {
      element: <SettingsLayout />,
      children: [
        { path: "/settings/profile", element: <SettingsProfilePage /> },
        { path: "/settings/account", element: <SettingsAccountPage /> },
      ]
    }
  ]
}
```

## Step 6: Summary

Provide the user with:

1. **Files Created**:
   - Main layout file
   - Layout-specific components (header, sidebar, footer)
   - Any providers created

2. **Layout Overview**:
   - Structure and navigation elements
   - Which pages use this layout
   - Mobile responsiveness approach

3. **Usage Instructions**:
   - How pages are wrapped by layout
   - Navigation configuration
   - How to add new pages to layout

4. **Next Steps**:
   - Add pages to layout
   - Customize styling/branding
   - Add authentication checks (if needed)
   - Enhance mobile experience

## Important Naming Conventions

**Files**: Use kebab-case with `-layout` suffix
- `dashboard-layout.tsx`
- `auth-layout.tsx`
- `settings-layout.tsx`

**Layout Components**: Use kebab-case
- `dashboard-header.tsx`
- `dashboard-sidebar.tsx`
- `dashboard-footer.tsx`

**Exports**: Use PascalCase with `Layout` suffix
- File: `dashboard-layout.tsx` → Export: `DashboardLayout`
- File: `auth-layout.tsx` → Export: `AuthLayout`

## Architecture Rules

**DO:**
- Use `<Outlet />` from React Router for content area
- Include navigation that persists across routes
- Wrap outlets with section-specific providers
- Keep layouts structural (not feature-specific)
- Use Tailwind CSS for styling
- Support mobile responsiveness
- Use shadcn/ui components

**DON'T:**
- Contain feature-specific logic
- Fetch feature data (navigation data is OK)
- Use routing hooks like useParams (layouts should be route-agnostic)
- Hard-code page content (use Outlet)
- Duplicate navigation across layouts (extract to shared component if needed)

## Examples

### Example 1: Minimal Layout

Simple container without navigation:
```typescript
export const MinimalLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto py-8">
        <Outlet />
      </main>
    </div>
  );
};
```

### Example 2: Marketing Layout

Full-width header and footer with centered content:
```typescript
export const MarketingLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <nav className="container mx-auto px-4 py-4">
          {/* Navigation */}
        </nav>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t bg-gray-100">
        <div className="container mx-auto px-4 py-8">
          {/* Footer content */}
        </div>
      </footer>
    </div>
  );
};
```

### Example 3: App Dashboard

Sidebar + header with scrollable content:
```typescript
export const DashboardLayout = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
```

### Example 4: Settings Layout

Nested layout with secondary navigation:
```typescript
export const SettingsLayout = () => {
  return (
    <div className="container py-6">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <div className="flex gap-6">
        <aside className="w-48">
          <nav>{/* Settings nav */}</nav>
        </aside>
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
```
