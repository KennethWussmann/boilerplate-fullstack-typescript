---
name: fullstack-feature
description: Plan and implement a feature that spans both apps/server and apps/web - database, GraphQL API, and the UI that consumes it. Use this skill when the user describes a capability rather than a file, such as "users should be able to manage tasks", "add product catalog", "build a comments feature", "let people upload avatars", or "I want a page that shows orders from the database". It also applies to explicitly scoped requests like "backend only for now" or "just the frontend, the API already exists". It sequences the work across layers and hands off to the backend-development and frontend-development skills for the details, so load it first whenever a request would touch more than one app.
---

# Fullstack Feature

A feature request describes an outcome, not a file list. The job is to turn it into a sequence of layers, each of which the more specific skills already know how to build. This skill owns the sequencing and the questions; it delegates the implementation.

## Establish scope first

Ask before assuming:

- **Name and description**: what is it, in one or two sentences?
- **Scope**: fullstack, backend only, or frontend only?
- **Data**: what does the feature store or read? Fields, types, relationships.
- **Operations**: read, create, update, delete, live updates?
- **Where it lives in the UI**: a new route, a section of an existing screen, a dialog?
- **Rules**: any validation or business constraints worth knowing before the schema is designed?

Frontend-only is a real answer — a settings screen backed by local state needs no server work. Backend-only is too — a scheduled job or an internal service has no UI. Do not build layers nobody asked for.

## Sequence the work

Build bottom-up. Each layer produces the types the next one consumes, so working in this order means never writing against a type that does not exist yet:

1. **Entity** — Drizzle table plus business object, then the migration
2. **Repository** — data access for that entity
3. **Service** — business rules, orchestration, `ApplicationContext` wiring
4. **GraphQL module** — schema, resolvers, registration, `pnpm codegen` in `apps/server`
5. **Codegen for the client** — `pnpm codegen` in `apps/web`, which picks up the refreshed `apps/server/schema.graphql`
6. **View** — the screen, its data fetching and its sub-components
7. **Page and route** — the URL that mounts the view, plus a navigation registry entry if it needs one

Read [backend-development](../backend-development/SKILL.md) before step 1 and [frontend-development](../frontend-development/SKILL.md) before step 6. Their reference files carry the per-layer questions and patterns; do not reconstruct them from memory.

Step 5 is the one most easily forgotten. The web app's types come from the server's exported schema, so skipping the second codegen leaves the frontend type-checking against a stale API and produces confusing errors that look like the operation is wrong when it is merely unknown.

## Confirm the plan

Before writing anything, present the layer-by-layer plan: which files get created, which get modified, and where the domain boundary sits. Domain boundaries are the thing users most often have an opinion about and the thing you can least reliably guess — "orders" and "products" might be one domain or two, and finding out afterwards is expensive.

## Verify

```bash
pnpm check:fix
pnpm build
pnpm test
```

For anything with real behaviour, run it: `pnpm dev` in `apps/server`, then in `apps/web`, and walk through the flow the user described. A feature that compiles is not a feature that works.

## Report

Files created and modified, how data flows from the UI through GraphQL down to the database, the route where the feature lives, the operations now available, and what you would suggest next.
