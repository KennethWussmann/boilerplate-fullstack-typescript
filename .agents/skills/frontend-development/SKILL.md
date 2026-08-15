---
name: frontend-development
description: Build frontend code in apps/web - pages and routes, views that fetch data, reusable components, layouts, and TanStack Form forms with Zod validation. Use this skill whenever work touches apps/web, or when the user asks for a new screen, route, URL, page, view, React component, dialog, list, table, detail screen, sidebar, navigation shell, layout, form, input validation, or anything rendered in the browser. It also applies when the request never names a layer, like "users should be able to edit their profile", "add a settings screen", "show the projects somewhere", or "put a delete button on the card". Load it before writing any file under apps/web so the page/view/component split, naming, and Apollo usage stay consistent.
---

# Frontend Development

The web app splits responsibilities across four layers, and the split is the whole point: each layer can change without dragging the others along.

| Layer | Location | Owns | Never does |
| --- | --- | --- | --- |
| **Layout** | `src/layouts/` | The shell: navigation, header, sidebar, providers | Feature logic, route-specific behaviour |
| **Page** | `src/pages/` | Reading the route: params, query string, navigation state | Data fetching, UI, business logic |
| **View** | `src/views/` | Fetching data, view state, composing the screen | Touching routing hooks |
| **Component** | `src/components/common/` | One reusable UI concern | Fetching data, knowing about features |

Routing knowledge stops at the page. That is what makes a view usable inside a modal, a tab, or a different route without rewriting it — and why views must never reach for `useParams` or `useNavigate` themselves. If a view needs to navigate, it takes a callback.

Read [docs/guidelines/2-development.md](../../../docs/guidelines/2-development.md) for the underlying conventions.

## Before writing anything

Work out which layers the request actually touches, ask about what you cannot infer, then confirm a short plan before implementing.

| The user wants | Read |
| --- | --- |
| A new screen at a URL | [references/page.md](references/page.md), then the view reference |
| A screen's content, data fetching, composition | [references/view.md](references/view.md) |
| A reusable UI building block | [references/component.md](references/component.md) |
| A navigation shell around a group of routes | [references/layout.md](references/layout.md) |
| Any form | [references/forms.md](references/forms.md) |

A "let users edit their profile" request typically means page + view + form, in that order. Build the deepest layer last so you know what props it actually needs.

## Conventions that apply everywhere

- **Every file is kebab-case**, including directories: `user-profile-view.tsx`, `use-profile-form.ts`, `views/user-profile-view/`.
- **Suffixes are load-bearing**: `-page.tsx`, `-view.tsx`, `-layout.tsx`. They make the layer obvious in an import statement and in the editor's file switcher.
- **Exports are PascalCase for components** (`UserProfileView`), camelCase for hooks and utilities (`useProfileForm`, `formatDate`).
- **`type` over `interface`** for props, and no `function` keyword — arrow functions throughout.
- **Imports use the `@/` alias**, never long relative chains.
- **shadcn/ui first.** Check `@/components/ui/` before building a primitive. Add missing ones with `pnpm shadcn add <name>` rather than hand-rolling.
- **GraphQL through gql.tada**: declare operations with `graphql()` from `@/lib/graphql`, run them with Apollo's `useQuery` / `useMutation` / `useSubscription`. Types come from the server schema, so run `pnpm codegen` in `apps/web` after the backend schema changes.
- **Loading, error and empty are three separate states.** Handle all three at the point of fetching; a spinner that never resolves and a blank screen look identical to a user and hide real bugs.
- **Sonner for feedback**: `toast.success` / `toast.error` after mutations.

## Finishing

```bash
cd apps/web
pnpm codegen   # only if GraphQL operations changed
pnpm build
pnpm check     # from the repo root; check:fix to autofix
```

Then summarize: files created and modified, the route the user can visit, how data flows from page to view to components, and what you would suggest next.
