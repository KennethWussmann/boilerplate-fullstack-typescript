# Boilerplate File Map

Shared classification used by the `boilerplate-sync` and `boilerplate-backport` skills. Both directions have to agree on what a file *is*, otherwise a file that syncs downstream as "framework code" and back upstream as "identity" produces asymmetric, surprising results.

Every path in the repository falls into exactly one of four buckets. When a path is not listed, reason from the closest neighbour and say out loud which bucket you put it in — the user can correct you, but a silent guess is what causes damage.

## 1. Infrastructure — sync near-verbatim

Build, tooling and agent configuration. Nothing here encodes what the product *is*, so upstream almost always knows better.

- `Dockerfile`, `.dockerignore`, `docker-compose.yaml`, `apps/*/docker-compose.yaml`
- `.github/workflows/`, `.github/actions/`, `.github/dependabot.yml`
- `biome.json`, `turbo.json`, `pnpm-workspace.yaml`, `lefthook.yaml`, `.nvmrc`, `patches/`
- `tsconfig.json` at root and in every app
- `apps/server/codegen.ts`, `apps/server/drizzle.config.ts`, `apps/server/scripts/`
- `apps/web/vite.config.ts` — **except** the PWA `manifest` block and the `base`/env wiring a project may have customised (see Identity)
- `.agents/skills/` including these two skills themselves
- `.gitignore` — merge rather than overwrite; projects add their own entries

Caveat: `Dockerfile` and the workflows carry `APP_NAME`, image names and registry paths. Those lines are identity; the rest of the file is infrastructure. Sync the file, then restore the project's names.

## 2. Framework code — sync with review

The scaffolding the boilerplate exists to provide. A project may legitimately have extended these files, so never overwrite blind; reason about baseline, upstream and project versions and merge by hand.

- `apps/server/src/config/` — the Zod schema and loader. Projects add their own config keys here.
- `apps/server/src/log-streaming/`, `apps/server/src/file-system/`, `apps/server/src/error/`, `apps/server/src/utils/`
- `apps/server/src/redis/`, `apps/server/src/database/databaseService.ts`
- `apps/server/src/http/httpServer.ts`, `apps/server/src/http/authMiddleware.ts`
- `apps/server/src/http/routers/graphql/` infrastructure (context, module wiring, scalars), `routers/static/`, `routers/health/`, `routers/log-streaming/`
- `apps/server/src/applicationContext.ts`, `run.ts`, `index.ts` — projects register their own services here, so these are merge-always files
- `apps/web/src/components/ui/` (shadcn), `apps/web/src/components/common/`
- `apps/web/src/lib/graphql/` (except `graphql-env.d.ts`), `apps/web/src/lib/{settings,theme,shortcuts,analytics,utils}/`
- `apps/web/src/layouts/`, `apps/web/src/app.tsx`, `main.tsx`, `index.css`
- `apps/web/src/pages/{dev-tools,docs}/`, `not-found-page.tsx`
- `docs/guidelines/`, `docs/configuration.md`
- `package.json` dependency sections in root and both apps — versions only, never `name`/`description`/`version`

## 3. Identity — never synced in either direction

What makes a repository *this* product. Copying identity downstream renames the user's app back to "Boilerplate"; copying it upstream leaks the user's product into the template. Both are unacceptable, so identity is excluded unconditionally and does not even get offered in triage.

- Root `package.json`: `name`, `description`, `version`, `author`, `license`, `keywords`
- `apps/server/package.json` and `apps/web/package.json`: `description`, `version`, `license`
- `README.md`, `CLAUDE.md`, `AGENTS.md`, `LICENSE`
- `apps/web/index.html` — `<title>`, `<meta name="description">`
- `apps/web/vite.config.ts` — the PWA `manifest` block (`name`, `short_name`, `description`, icons)
- `apps/web/src/lib/constants.ts` — `productName`, `productNameSlug`, `githubUrl`, `legalUrl`, `privacyPolicyUrl`, and the project's chosen feature-flag defaults
- `apps/web/public/` icons, favicons, screenshots
- `Dockerfile` / workflow lines carrying `APP_NAME`, image or registry names
- `apps/server/config.yaml` values, any `.env*`, any deployment manifest

`README.md` and `CLAUDE.md` are identity as *files*, but their content still matters: a backport that adds a feature must be documented there in the boilerplate (see the backport skill), and a sync must not carry the boilerplate's prose into a project. So: never copy the file, sometimes edit it in place.

## 4. Product code — project-owned

Everything the project built. Downstream it is never overwritten; upstream it is never blindly copied, only ever a deliberately generalised extraction (see `boilerplate-backport`).

- `apps/server/src/**` outside the framework paths above — domain entities, repositories, services, GraphQL modules
- `apps/server/src/database/schema.ts` — the boilerplate ships an example schema; a bootstrapped project owns this file
- `apps/server/drizzle/*.sql` and `meta/` — migrations are history, and history cannot be merged across repositories
- `apps/web/src/{pages,views}/**` outside the framework paths above
- `libs/**`
- `apps/server/config.yaml` beyond structural keys

## Generated artefacts — never copied, always regenerated

These are outputs. Copying them across repositories produces files that disagree with the sources that generate them, and the disagreement only surfaces at runtime.

- `apps/server/schema.graphql`
- `apps/server/src/http/routers/graphql/generated/`
- `apps/web/src/lib/graphql/graphql-env.d.ts`
- `apps/server/drizzle/` migration SQL
- `pnpm-lock.yaml` — lockfiles resolve a specific dependency set; regenerate with `pnpm install` in the target repo
- `dist/`, `node_modules/`, `.turbo/`

After any sync or backport that touches GraphQL schemas or the Drizzle schema, run `pnpm codegen` and `pnpm db:generate` in the target repository instead.
