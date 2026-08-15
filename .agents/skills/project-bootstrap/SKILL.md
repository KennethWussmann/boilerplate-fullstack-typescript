---
name: project-bootstrap
description: Turn this freshly cloned fullstack TypeScript boilerplate into a named, described, ready-to-develop application - package metadata, PWA manifest, product constants, README, CLAUDE.md, dependency update and a green build. Use this skill when the user has just created a repository from the template and says things like "set this up for my project", "bootstrap this", "rename this to X", "make this into a habit tracker app", "I just cloned the boilerplate, what now", or otherwise wants the placeholder identity replaced with a real one. Do not use it for adding features to an already-bootstrapped project - it rewrites project-wide metadata and documentation.
---

# Project Bootstrap

This repository is a template. Everything works, but it introduces itself as "Boilerplate" / "Application" / "Example application". Bootstrapping replaces that identity with the user's and leaves them with a healthy tree they can start building in immediately.

The demo pieces stay. Health check endpoints, the GraphQL health module, dev tools, the docs pages — those are working references, and deleting them removes the fastest way to see how a working feature is wired. Only the placeholder identity goes.

## Step 1: Ask

- **Name**: used for package names, titles and the PWA manifest
- **Short description**: one sentence
- **Use case**: what it does and who it is for — this drives the README's feature list
- **License**: default to MIT if the user has no preference

## Step 2: Read the current state

Read `README.md` and `CLAUDE.md` before editing anything. They describe the template as it stands, and knowing what is generic boilerplate prose versus what is genuinely useful architecture documentation is the difference between a clean rewrite and deleting something the user needed.

## Step 3: Metadata

**Root `package.json`** — `name` becomes the kebab-case app name, `description` the user's sentence, `license` their choice.

**`apps/server/package.json`** and **`apps/web/package.json`** — leave `name` alone (workspace tooling depends on it). Set `description` and `license`. Reset the web app's `version` to `1.0.0`; the template's version number is meaningless in a new project.

**`LICENSE`** — update the year and copyright holder.

## Step 4: Web identity

- `apps/web/index.html` — `<title>` and `<meta name="description">`
- `apps/web/vite.config.ts` — the PWA `manifest`: `name`, `short_name` (twelve characters at most, it appears under a home screen icon), `description`
- `apps/web/src/lib/constants.ts` — `productName` and `productNameSlug`. The slug prefixes localStorage keys, so changing it later orphans every user's stored settings. Get it right now.

While in `constants.ts`, walk the feature flags (`footerEnabled`, `landingPageEnabled`, `graphqlExplorerEnabled`, `allowPublicDeveloperMode`) with the user — the defaults suit a demo, not necessarily their app.

## Step 5: Rewrite the README

Replace it entirely. The template README explains how to use a template, which is exactly what the reader no longer needs. Write for a developer who wants to run or contribute to *this* application:

1. **Hero** — H1 with the app name, a paragraph or two on what it does and why it exists
2. **Features** — what the app does, plus the technical capabilities that matter (PWA, GraphQL, real-time updates)
3. **Getting started** — prerequisites, install, run backend and frontend, with real ports (`http://localhost:8080`, `http://localhost:5173`) and the GraphQL endpoint
4. **Production build** — build commands and Docker examples with the correct `APP_NAME` arguments
5. **Configuration** — the environment variables that matter, not the exhaustive list
6. **Tech stack** — brief
7. **Scripts** — the handful people actually run: `build`, `dev`, `test`, `check`
8. **Project structure** — a small tree of `apps/` and `libs/`
9. **License**

Drop the template-specific sections and the deep architecture explanations; the latter live in `CLAUDE.md` and duplicating them guarantees they diverge. Keep the example endpoints — they are useful references.

## Step 6: CLAUDE.md

Touch only the "Repository Overview" section: describe what this application is, keep the sentence about the monorepo structure, and fix the Docker examples. Everything else still describes the architecture accurately, and rewriting it loses hard-won detail.

## Step 7: Leave it healthy

```bash
pnpm update -r
pnpm check:fix
pnpm build
```

`pnpm update -r` pulls every dependency to its latest version, which is the right moment to do it — before any application code exists to break. Watch for a changed `biome.json` schema version after a Biome bump, and confirm every `package.json` was actually updated.

Fix what these surface rather than reporting it as a known issue. Handing over a project that does not build defeats the point.

## Step 8: Report

- Every file changed
- What the application is now configured as
- How to start developing: install, run backend, run frontend
- That the example endpoints and modules remain as references
- What the dependency update changed and anything that needed fixing
