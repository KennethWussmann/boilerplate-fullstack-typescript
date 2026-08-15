---
name: backend-development
description: Build backend code in apps/server - Drizzle entities and business objects, repositories, services, and GraphQL modules with queries, mutations and subscriptions. Use this skill whenever work touches apps/server, or when the user asks for a new table, database schema change, migration, domain model, business object, repository, data access layer, service, business logic class, ApplicationContext wiring, GraphQL schema, resolver, or subscription. It also applies to phrasings that never name the layer, like "store users in the database", "add an endpoint that returns projects", "the server needs to send live updates", or "add a query for X". Load it before writing any server-side file so the layering, naming, and codegen steps stay consistent.
---

# Backend Development

The server follows one flow, always in this direction: **Resolver/Router → Service → Repository → Database**. Each layer only knows the one below it. When that boundary blurs, business logic ends up scattered across resolvers and the code stops being testable, so keep the layers honest even when a shortcut looks harmless.

Read [docs/guidelines/2-development.md](../../../docs/guidelines/2-development.md) for the authoritative conventions. This skill is the workflow on top of them.

## Before writing anything

Ask the user what is missing, then confirm a short plan before implementing. The questions that actually matter differ per layer, so read the relevant reference first:

| The user wants | Read |
| --- | --- |
| A table, schema change, domain model, business object | [references/entity.md](references/entity.md) |
| Data access, CRUD, queries against the database | [references/repository.md](references/repository.md) |
| Business logic, orchestration, a long-running service | [references/service.md](references/service.md) |
| A GraphQL schema, resolvers, subscriptions | [references/graphql-module.md](references/graphql-module.md) |

Most requests need several of these. A "list products with pagination" request usually means entity → repository → service → GraphQL module, in that order, because each layer depends on the types the previous one exports.

Present the plan (files to create, files to modify) and get confirmation before writing code. The user often has an opinion about domain boundaries that is impossible to guess from the request alone.

## Conventions that apply to every layer

- **Files** are lowerCamelCase (`productsRepository.ts`), **folders** are lower-kebab-case (`file-system/`).
- **Imports** always carry the `.js` extension. This is an ESM project and omitting it breaks at runtime, not at compile time.
- **Every folder gets an `index.ts`** that re-exports its public API with `export * from './x.js'`. Consumers import from the folder, never from deep paths.
- **Zod for anything crossing the boundary** into the process: HTTP bodies, config, environment. Schemas end in `Schema`, the inferred type does not (`productCreateRequestSchema` → `ProductCreateRequest`).
- **Business objects are classes** that own their mapping. Database models are shaped for storage; business objects are shaped for the application. The translation between them lives in the class, not in a repository or a resolver.
- **Services are wired into `ApplicationContext`** when they hold state or need lifecycle management. Initialize in `initialize()`, expose via a getter, clean up in the shutdown path.

## Finishing

Run these before reporting back, in this order:

```bash
pnpm codegen   # in apps/server, only if GraphQL schema files changed
pnpm check:fix
pnpm build
```

`pnpm db:generate` then `pnpm db:migrate` after a schema change, and read the generated SQL before applying it. Drizzle infers intent from a diff and occasionally guesses wrong about renames, which silently drops columns.

Then summarize: files created and modified, what the code does, how to call it, and what you would suggest next. Keep it factual — the user is about to review a diff, not read a brochure.
