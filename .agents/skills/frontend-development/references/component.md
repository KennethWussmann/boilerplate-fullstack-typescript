# Components: reusable UI

A component in `components/common/` solves one UI problem and knows nothing about any feature. It receives data through props and reports events through callbacks. That ignorance is what makes it reusable — the moment it knows which GraphQL query filled it, it belongs to one view.

## Where it goes

- **`components/ui/`** — shadcn primitives. Check here first; run `pnpm shadcn add <name>` before writing your own button, dialog or select.
- **`components/common/`** — used by two or more views, or a standard pattern the app should keep consistent (`empty-state`, `loading-state`, `status-indicator`, `data-table`).
- **Inside the view directory** — everything else. Promote it to `common/` when a second caller appears, not in anticipation of one.

## Ask first

- **Name and purpose**: what UI problem does it solve?
- **Where it will be used**: genuinely more than one view?
- **Props**: what data, which callbacks, what configuration?
- **Variants**: sizes, tones, states?
- **Composition**: does it take `children`?

## Implement

File: `apps/web/src/components/common/{component-name}.tsx`, or a directory with an `index.ts` when it splits into several files.

```typescript
import { Heart, HeartOff } from 'lucide-react';
import { Button } from '@/components/ui';

type LikeButtonProps = {
  liked: boolean;
  likeCount?: number;
  disabled?: boolean;
  onLikeChange: (liked: boolean) => void;
};

export const LikeButton = ({ liked, likeCount = 0, disabled = false, onLikeChange }: LikeButtonProps) => (
  <Button variant="ghost" size="sm" disabled={disabled} onClick={() => onLikeChange(!liked)}>
    {liked ? <Heart className="text-red-500" /> : <HeartOff />}
    {likeCount > 0 && <span>{likeCount}</span>}
  </Button>
);
```

Prefer controlled components. One that owns state the parent also needs forces the parent to mirror it, and the two go out of sync — pass the value in, report changes out.

For visual variants use `cva` with `cn()` instead of conditional class strings, so the variants stay enumerable and the consumer can still override through `className`:

```typescript
const badgeVariants = cva('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold', {
  variants: {
    variant: {
      default: 'bg-primary text-primary-foreground',
      destructive: 'bg-destructive text-destructive-foreground',
      outline: 'border border-input bg-background',
    },
  },
  defaultVariants: { variant: 'default' },
});

type BadgeProps = React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>;

export const Badge = ({ className, variant, ...props }: BadgeProps) => (
  <div className={cn(badgeVariants({ variant }), className)} {...props} />
);
```

Add the export to `apps/web/src/components/common/index.ts` so consumers can import from the `@/components` barrel.

## Report

Where the file lives, the props type, available variants, and a short usage example.
