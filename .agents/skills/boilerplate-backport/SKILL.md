---
name: boilerplate-backport
description: Push a generalized improvement from a project back into the fullstack TypeScript boilerplate it was generated from - strip the product-specific parts, land it in the template, and document it in README, CLAUDE.md and the relevant agent skill. Use this skill whenever the user wants something they built to become part of the template, with phrasings like "backport the auth middleware to the boilerplate", "this rate limiter should be in the template", "upstream this", "put my Sentry setup into the boilerplate", "every project I start needs this, move it up", or "what in this project is worth generalizing". It also applies when the user is standing in the boilerplate and points at a project as the source. Load it before copying anything, because the de-identification and documentation steps are the entire point - a raw copy leaks product code into every future project.
---

# Boilerplate Backport

Something built in a real project turns out to be generic: a middleware, a config pattern, a CI job, a component. Backporting moves it into the boilerplate so the next generated project starts with it.

The direction is **project → boilerplate**, and it is the more dangerous of the two. The boilerplate is a public template that gets copied into every future repository, so anything that leaks upstream — a domain table name, an internal URL, a credential, a business rule — leaks into all of them, permanently and publicly. De-identification is not a cleanup pass at the end; it is the job.

## Shared mechanics

Read [../_shared/boilerplate-repo-pairing.md](../_shared/boilerplate-repo-pairing.md) for resolving the two repositories, branching, verification and handoff, and [../_shared/boilerplate-file-map.md](../_shared/boilerplate-file-map.md) for the four-bucket classification. This skill covers what is specific to going upstream.

There is no baseline diff to drive this direction. A mature project has diverged so far from the template that a blanket diff is mostly noise, so the input is what the user names.

## Start from intent, not from a diff

Ask what should move. "The auth middleware", "the Sentry wiring", "the release workflow" — a named thing, scoped by a human who knows why it is generic.

If the user does not know yet, offer **scan mode**: list candidates and let them pick.

- Files in the project with no counterpart in the boilerplate, under infrastructure or framework paths
- Framework files the project modified relative to the boilerplate
- New root-level tooling config, new workflows, new patches

Present that as a shortlist with a one-line description each, and be opinionated: say which ones you think are genuinely generic and which look product-shaped. Scan mode is a conversation starter, not a work order — nothing gets copied from it without the user choosing it.

## Generalize before committing anything

Work on the copy in the boilerplate, and go through it line by line asking "would this make sense in a repository that knows nothing about this product?"

- **Rename** product-specific types, tables, routes, env vars and files to neutral ones. `OrderAuditService` becomes `AuditService`; `orders_events` becomes `events`.
- **Strip business logic.** Keep the mechanism, drop the rules. A rate limiter keeps the limiter and loses "except for enterprise customers".
- **Replace real values with placeholders.** URLs become `https://example.com`, IDs become obviously fake, config values become sane defaults.
- **Remove secrets outright** — keys, tokens, internal hostnames, account IDs, bucket names, VPN or SSO endpoints. Grep the staged change for them before committing; a secret in a public template's git history cannot be taken back by a follow-up commit.
- **Drop anything tied to internal infrastructure.** If it only works inside the user's cloud account or behind their VPN, it is not template material.
- **Keep the vocabulary neutral.** Comments, log messages, test fixtures and GraphQL descriptions carry domain language just as loudly as type names do.

If a change cannot survive this without being gutted, say so and reject it. "This is 80% your booking rules, and the remaining 20% is a `setInterval`" is a useful answer. Landing a hollowed-out shell in the template is worse than landing nothing, because it becomes something every future project has to read and delete.

## Hard refusals

Do not backport these, even when asked directly. Explain why instead:

- **Product code** — domain entities, repositories, services, GraphQL modules, pages and views that exist to serve the product
- **Drizzle migrations** containing domain tables. Migrations are history; the boilerplate's schema needs its own migration generated with `pnpm db:generate` from a generalized `schema.ts`.
- **`.env` files, `config.yaml` values, deployment manifests** — configuration carrying real values
- **`libs/` packages** that only make sense for that product
- **Anything the user cannot explain the generic use of.** If the answer to "when would another project need this?" is vague, it is not ready.

## A backport is not done until the docs are

The boilerplate's value is that a generated project *knows what it has*. A feature that lands in the code but not the documentation is a feature the next project discovers by accident, months later, after building its own version of it. So every backport that adds capability updates:

- **`README.md`** — the feature list, and the tech stack table if a dependency arrived
- **`CLAUDE.md`** — the architecture section for the app it touches, the environment variable table if it reads config, and "Development Patterns" if it introduces a way of doing things
- **The relevant agent skill** — `backend-development` or `frontend-development` (and their `references/`), so agents working in generated projects use the new thing instead of reinventing it
- **`docs/guidelines/`** if it changes a convention, and `docs/configuration.md` if it adds config

Treat the docs update as part of the same change, in the same PR. Splitting it into a follow-up is how it never happens.

## Verify harder than the forward direction

The boilerplate has no product code to hide behind: if it does not build, every future project starts broken.

```bash
pnpm install
pnpm check
pnpm build
pnpm test
```

Then do a sanity read of the result:

```bash
grep -rn "<product name>\|<product slug>\|<internal domain>" --exclude-dir=node_modules --exclude-dir=.git .
git diff origin/main -- . | grep -in "secret\|token\|api[_-]key\|password\|https://"
```

The boilerplate must still introduce itself as "Boilerplate" everywhere — `package.json`, `constants.ts`, `index.html`, the PWA manifest, the README hero. If the product name survived anywhere in the diff, the generalization pass was incomplete; go back rather than patching the grep hits one by one, because the same sloppiness is usually present in the parts grep cannot see.

## Commit and hand off

Branch `feat/backport-<topic>` in the boilerplate. Commit the code and its documentation together, or as two commits in the same PR if the change is large enough that separating them helps review.

`.boilerplate-sync.json` lives in projects, not in the boilerplate — do not create or touch it here. Instead close the PR body with a reminder that projects pick this up on their next `boilerplate-sync`, including the source project (by name only, if the project is private).

The PR body follows Why/What:

- **Why**: what problem this solved in a real project, and why every project has it
- **What**: what landed, what was generalized away, and which docs and skills were updated
