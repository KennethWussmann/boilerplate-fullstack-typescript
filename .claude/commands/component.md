Create a new reusable Component in the frontend

This command guides you through creating a reusable common component. Components are presentational building blocks that solve specific UI problems and can be used across multiple views.

## Step 1: Gather Component Requirements

Ask the user about:
- **Component Name**: What is this component called? (e.g., "LikeButton", "Avatar", "EmptyState", "LoadingState")
- **Component Purpose**: What UI problem does it solve? (1-2 sentences)
- **Reusability**: Where will this component be used?
  - In 2+ different views (use `components/common/`)
  - In 1 view only (should be in view directory, not common)
  - As a standard UI pattern (use `components/common/`)

**Important**: Only create components in `components/common/` if they are truly reusable. View-specific components should stay co-located with their views.

## Step 2: Gather Component Design

Ask the user about:
- **Component Type**:
  - Presentational (displays data, no logic)
  - Interactive (handles user interactions)
  - Composite (composes other components)
- **Props Interface**:
  - What data does it need?
  - What callbacks/handlers does it need?
  - What configuration options?
- **Variants**: Does it have visual variants?
  - Sizes (sm, md, lg)
  - Colors/themes (primary, secondary, destructive)
  - States (loading, disabled, active)
- **Composition**: Can it accept children or is it self-contained?

## Step 3: Review Architecture Plan

Before implementing, create a brief implementation plan:

**Component Structure:**
- Component file: `apps/web/src/components/common/{component-name}.tsx`
- Test file (optional): `apps/web/src/components/common/{component-name}.test.tsx`
- Storybook file (optional): `apps/web/src/components/common/{component-name}.stories.tsx`

Present this plan to the user and confirm before proceeding.

## Step 4: Implement Component

Follow these architecture principles:

### Component File

**File**: `apps/web/src/components/common/{component-name}.tsx`

**Responsibilities:**
- Solve ONE specific UI problem
- Be composable and configurable via props
- Avoid internal state when possible (prefer controlled components)
- Be presentational (no data fetching)

**DO NOT:**
- Fetch data (components should receive data via props)
- Hard-code feature-specific logic
- Use routing hooks
- Manage application state

### Basic Component Pattern

```typescript
interface ComponentNameProps {
  // Required props
  id: string;
  name: string;

  // Optional props with defaults
  variant?: 'default' | 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;

  // Callbacks
  onClick?: () => void;

  // Children or composition
  children?: React.ReactNode;
}

export const ComponentName = ({
  id,
  name,
  variant = 'default',
  size = 'md',
  disabled = false,
  onClick,
  children,
}: ComponentNameProps) => {
  return (
    <div>
      {/* Component implementation */}
    </div>
  );
};
```

### Interactive Component (Controlled)

```typescript
interface LikeButtonProps {
  itemId: string;
  liked: boolean;
  onLikeChange: (liked: boolean) => void;
  likeCount?: number;
}

export const LikeButton = ({
  itemId,
  liked,
  onLikeChange,
  likeCount = 0,
}: LikeButtonProps) => {
  const handleClick = () => {
    onLikeChange(!liked);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      className="gap-2"
    >
      {liked ? <HeartFilled className="text-red-500" /> : <Heart />}
      {likeCount > 0 && <span>{likeCount}</span>}
    </Button>
  );
};
```

### Component with Variants

```typescript
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground',
        secondary: 'bg-secondary text-secondary-foreground',
        destructive: 'bg-destructive text-destructive-foreground',
        outline: 'border border-input bg-background',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export const Badge = ({ className, variant, ...props }: BadgeProps) => {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
};
```

### Composite Component

```typescript
import { Card } from '@/components/ui/card';
import { Avatar } from './avatar';

interface UserCardProps {
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
  };
  actions?: React.ReactNode;
  onClick?: () => void;
}

export const UserCard = ({ user, actions, onClick }: UserCardProps) => {
  return (
    <Card
      className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        <Avatar src={user.avatarUrl} name={user.name} />

        <div className="flex-1">
          <h3 className="font-semibold">{user.name}</h3>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>

        {actions && (
          <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
            {actions}
          </div>
        )}
      </div>
    </Card>
  );
};
```

### Loading/Error State Components

```typescript
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
}

export const LoadingState = ({ message = 'Loading...' }: LoadingStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      <p className="mt-4 text-sm text-muted-foreground">{message}</p>
    </div>
  );
};
```

```typescript
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ErrorStateProps {
  title?: string;
  message: string;
  retry?: () => void;
}

export const ErrorState = ({
  title = 'Error',
  message,
  retry,
}: ErrorStateProps) => {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
      {retry && (
        <Button variant="outline" size="sm" onClick={retry} className="mt-4">
          Try Again
        </Button>
      )}
    </Alert>
  );
};
```

### Empty State Component

```typescript
import { FileQuestion } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState = ({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-muted p-4 mb-4">
        {icon || <FileQuestion className="h-8 w-8 text-muted-foreground" />}
      </div>

      <h3 className="text-lg font-semibold mb-2">{title}</h3>

      {description && (
        <p className="text-sm text-muted-foreground mb-4 max-w-sm">
          {description}
        </p>
      )}

      {action && (
        <Button onClick={action.onClick}>{action.label}</Button>
      )}
    </div>
  );
};
```

## Step 5: Export Component

**File**: `apps/web/src/components/common/index.ts`

Add export to central index (if it doesn't exist, create it):

```typescript
export { ComponentName } from './{component-name}';
export type { ComponentNameProps } from './{component-name}';
```

This allows importing like:
```typescript
import { ComponentName } from '@/components/common';
```

## Step 6: Usage Examples

Provide usage examples in the summary:

```typescript
// Basic usage
<ComponentName id="1" name="Example" />

// With variants
<ComponentName variant="primary" size="lg" />

// With callbacks
<ComponentName onClick={() => console.log('clicked')} />

// With children
<ComponentName>
  <div>Child content</div>
</ComponentName>
```

## Step 7: Summary

Provide the user with:

1. **Files Created**:
   - Component file location
   - Exports added to index

2. **Component Overview**:
   - What the component does
   - Props interface
   - Available variants/options

3. **Usage Instructions**:
   - Import statement
   - Basic usage example
   - Common patterns
   - Integration with shadcn/ui (if applicable)

4. **Next Steps**:
   - Add tests (if needed)
   - Add to Storybook (if using)
   - Document edge cases
   - Suggested enhancements

## Important Naming Conventions

**Files**: Use kebab-case
- `like-button.tsx`
- `user-avatar.tsx`
- `empty-state.tsx`
- `loading-state.tsx`

**Directories**: Use kebab-case
- `components/common/`
- `components/ui/` (shadcn components)

**Exports**: Use PascalCase
- File: `like-button.tsx` → Export: `LikeButton`
- File: `user-avatar.tsx` → Export: `UserAvatar`

## Architecture Rules

**DO:**
- Keep components small and focused (one responsibility)
- Use TypeScript interfaces for props
- Provide sensible defaults
- Make components controlled when they manage state
- Use Tailwind CSS for styling
- Leverage shadcn/ui components
- Use `cn()` utility for conditional classes
- Support composition via children prop when appropriate
- Handle edge cases (empty, loading, error states)

**DON'T:**
- Fetch data (components should be presentational)
- Hard-code feature-specific logic
- Use routing hooks
- Create in `common/` unless used in 2+ views
- Over-engineer with unnecessary abstraction
- Include business logic
- Manage application-level state

## When to Create Common Components

**Create in `components/common/` when:**
- Used in 2+ different views
- Represents a standard UI pattern (buttons, badges, cards)
- Should maintain consistent behavior app-wide
- Is a state component (loading, error, empty)

**Keep in view directory when:**
- Specific to one view's domain logic
- Tightly coupled to view's data structure
- Unlikely to be reused elsewhere

**Use from `components/ui/` when:**
- shadcn/ui component already exists
- Standard UI primitive (Button, Input, Dialog, etc.)

## Examples

### Example 1: Simple Presentational Component

```typescript
// avatar.tsx
interface AvatarProps {
  src?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Avatar = ({ src, name, size = 'md' }: AvatarProps) => {
  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
  };

  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return src ? (
    <img
      src={src}
      alt={name}
      className={cn('rounded-full object-cover', sizeClasses[size])}
    />
  ) : (
    <div className={cn(
      'rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold',
      sizeClasses[size]
    )}>
      {initials}
    </div>
  );
};
```

### Example 2: Interactive Controlled Component

```typescript
// toggle-button.tsx
interface ToggleButtonProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  label: string;
  disabled?: boolean;
}

export const ToggleButton = ({
  value,
  onValueChange,
  label,
  disabled = false,
}: ToggleButtonProps) => {
  return (
    <button
      type="button"
      onClick={() => onValueChange(!value)}
      disabled={disabled}
      className={cn(
        'px-4 py-2 rounded-lg font-medium transition-colors',
        value
          ? 'bg-primary text-primary-foreground'
          : 'bg-secondary text-secondary-foreground',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      {label}
    </button>
  );
};
```

### Example 3: Composite Component with Children

```typescript
// section-header.tsx
interface SectionHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children?: React.ReactNode;
}

export const SectionHeader = ({
  title,
  description,
  actions,
  children,
}: SectionHeaderProps) => {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>
        {actions && <div className="flex gap-2">{actions}</div>}
      </div>
      {children}
    </div>
  );
};
```
