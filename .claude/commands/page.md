Create a new Page component in the frontend

This command guides you through creating a Page component with routing. Pages are thin routing coordinators that extract route data and render views.

## Step 1: Gather Page Requirements

Ask the user about:
- **Page Name**: What is this page called? (e.g., "Dashboard", "UserProfile", "Settings")
- **Route Path**: What URL path should it use? (e.g., "/dashboard", "/profile/:userId", "/settings")
- **Layout**: Which layout should wrap this page?
  - Default (no specific layout)
  - Dashboard layout (authenticated app shell)
  - Auth layout (login/signup pages)
  - Settings layout (with sidebar)
  - New custom layout (will need to create)
- **View**: Will this use an existing view or need a new one created?

## Step 2: Gather Route Data Requirements

Ask the user about:
- **Route Parameters**: Does the route have parameters? (e.g., `:userId`, `:postId`)
- **Query Parameters**: Does it need query string data?
- **Navigation State**: Does it need state passed via navigation? (e.g., returnTo, previousPage)
- **Route Protection**: Should this route be protected? (authentication required)

## Step 3: Review Architecture Plan

Before implementing, create a brief implementation plan:

**Page Structure:**
- Page file: `apps/web/src/pages/{page-name}-page.tsx`
- Route definition in `apps/web/src/app.tsx`
- Layout selection (if not default)
- View component to render (existing or to be created)

Present this plan to the user and confirm before proceeding.

## Step 4: Implement Page Component

Follow these architecture principles:

### Page Component

**File**: `apps/web/src/pages/{page-name}-page.tsx`

**Responsibilities (ONLY these):**
- Define route where it appears (via React Router)
- Extract route parameters, query strings, or navigation state
- Pass parsed data to view as props
- Keep minimal (typically < 30 lines)

**DO NOT:**
- Include business logic or API calls
- Render UI directly (except view + layout composition)
- Fetch data
- Manage state (beyond extracting route data)

### Basic Page Pattern (No Route Data)

```typescript
import { PageNameView } from '@/views/{page-name}-view';

export const PageNamePage = () => {
  return <PageNameView />;
};
```

### Page with Route Parameters

```typescript
import { useParams } from 'react-router-dom';
import { UserProfileView } from '@/views/user-profile-view';

export const UserProfilePage = () => {
  const { userId } = useParams();

  return <UserProfileView userId={userId!} />;
};
```

### Page with Query Parameters

```typescript
import { useSearchParams } from 'react-router-dom';
import { SearchView } from '@/views/search-view';

export const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const filter = searchParams.get('filter') || 'all';

  return <SearchView query={query} filter={filter} />;
};
```

### Page with Navigation State

```typescript
import { useParams, useLocation } from 'react-router-dom';
import { UserProfileView } from '@/views/user-profile-view';

export const UserProfilePage = () => {
  const { userId } = useParams();
  const location = useLocation();
  const returnTo = location.state?.from;

  return <UserProfileView userId={userId!} returnTo={returnTo} />;
};
```

### Page with Multiple Data Sources

```typescript
import { useParams, useSearchParams, useLocation } from 'react-router-dom';
import { PostView } from '@/views/post-view';

export const PostPage = () => {
  const { postId } = useParams();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const highlightComment = searchParams.get('comment');
  const editMode = location.state?.editMode || false;

  return (
    <PostView
      postId={postId!}
      highlightComment={highlightComment}
      editMode={editMode}
    />
  );
};
```

## Step 5: Add Route to Router

**File**: `apps/web/src/app.tsx`

### Route Without Layout

```typescript
import { PageNamePage } from '@/pages/{page-name}-page';

// Add to routes array
<Route path="/{route-path}" element={<PageNamePage />} />
```

### Route With Layout

```typescript
import { DashboardLayout } from '@/layouts/dashboard-layout';
import { DashboardPage } from '@/pages/dashboard-page';

// Layout wraps multiple pages
{
  element: <DashboardLayout />,
  children: [
    { path: "/dashboard", element: <DashboardPage /> },
    { path: "/profile/:userId", element: <UserProfilePage /> },
  ]
}
```

### Protected Route

If authentication is needed, wrap with auth check:

```typescript
import { ProtectedRoute } from '@/components/common/protected-route';
import { DashboardPage } from '@/pages/dashboard-page';

<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  }
/>
```

### Route with Dynamic Segments

```typescript
// Single parameter
<Route path="/users/:userId" element={<UserProfilePage />} />

// Multiple parameters
<Route path="/projects/:projectId/tasks/:taskId" element={<TaskDetailPage />} />

// Optional parameter
<Route path="/search/:category?" element={<SearchPage />} />

// Wildcard
<Route path="/docs/*" element={<DocsPage />} />
```

### Nested Routes

```typescript
{
  path: "/settings",
  element: <SettingsLayout />,
  children: [
    { index: true, element: <SettingsProfilePage /> },
    { path: "account", element: <SettingsAccountPage /> },
    { path: "security", element: <SettingsSecurityPage /> },
  ]
}
```

## Step 6: Create View (if needed)

If a new view is needed, ask the user if they want to create it now using the `/view` command.

## Step 7: Summary

Provide the user with:

1. **Files Created/Modified**:
   - New page file created
   - Route added to `app.tsx`
   - Layout created/modified (if applicable)

2. **Page Overview**:
   - Route path and parameters
   - What data is extracted and passed to view
   - Layout used (if any)

3. **Usage Instructions**:
   - How to navigate to the page (URL)
   - How to pass navigation state (if applicable)
   - Example navigation code:
     ```typescript
     // Basic navigation
     navigate('/page-path');

     // With parameters
     navigate(`/profile/${userId}`);

     // With state
     navigate('/profile/123', { state: { from: '/dashboard' } });

     // With query params
     navigate('/search?q=react&filter=recent');
     ```

4. **Next Steps**:
   - View implementation (if not done)
   - Add navigation links in UI
   - Add to navigation menu (if applicable)
   - Testing recommendations

## Important Naming Conventions

**Files**: Use kebab-case with `-page` suffix
- `dashboard-page.tsx`
- `user-profile-page.tsx`
- `settings-account-page.tsx`

**Directories**: Use kebab-case
- `pages/`

**Exports**: Use PascalCase with `Page` suffix
- File: `dashboard-page.tsx` → Export: `DashboardPage`
- File: `user-profile-page.tsx` → Export: `UserProfilePage`

## Architecture Rules

**DO:**
- Keep pages minimal (< 30 lines typically)
- Parse route data using React Router hooks
- Pass parsed data to views as props
- Use TypeScript for type safety
- Extract ALL routing logic in pages (views should never use routing hooks)

**DON'T:**
- Include business logic or API calls
- Render UI directly (except view composition)
- Manage application state
- Fetch data (views handle data fetching)
- Use multiple views in one page (usually one page = one view)

## Examples

### Example 1: Simple Static Page

```typescript
// pages/about-page.tsx
import { AboutView } from '@/views/about-view';

export const AboutPage = () => {
  return <AboutView />;
};

// app.tsx
<Route path="/about" element={<AboutPage />} />
```

### Example 2: Dynamic Route with Parameter

```typescript
// pages/product-detail-page.tsx
import { useParams } from 'react-router-dom';
import { ProductDetailView } from '@/views/product-detail-view';

export const ProductDetailPage = () => {
  const { productId } = useParams();
  return <ProductDetailView productId={productId!} />;
};

// app.tsx
<Route path="/products/:productId" element={<ProductDetailPage />} />
```

### Example 3: Search Page with Query Params

```typescript
// pages/search-page.tsx
import { useSearchParams } from 'react-router-dom';
import { SearchView } from '@/views/search-view';

export const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || 'all';
  const page = Number.parseInt(searchParams.get('page') || '1', 10);

  return (
    <SearchView
      query={query}
      category={category}
      page={page}
    />
  );
};

// app.tsx
<Route path="/search" element={<SearchPage />} />
```

### Example 4: Nested Settings Pages

```typescript
// pages/settings-profile-page.tsx
export const SettingsProfilePage = () => {
  return <SettingsProfileView />;
};

// pages/settings-account-page.tsx
export const SettingsAccountPage = () => {
  return <SettingsAccountView />;
};

// app.tsx
{
  path: "/settings",
  element: <SettingsLayout />,
  children: [
    { index: true, element: <Navigate to="profile" replace /> },
    { path: "profile", element: <SettingsProfilePage /> },
    { path: "account", element: <SettingsAccountPage /> },
  ]
}
```

### Example 5: Protected Dashboard

```typescript
// pages/dashboard-page.tsx
import { DashboardView } from '@/views/dashboard-view';

export const DashboardPage = () => {
  return <DashboardView />;
};

// app.tsx
{
  element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
  children: [
    { path: "/dashboard", element: <DashboardPage /> },
  ]
}
```

## Testing the Page

After creating the page:

1. **Build check**:
   ```bash
   cd apps/web
   pnpm build
   ```

2. **Test navigation**:
   - Start dev server: `pnpm dev`
   - Navigate to the route in browser
   - Verify route parameters work
   - Test query parameters
   - Test navigation state

3. **Lint check**:
   ```bash
   pnpm check
   ```
