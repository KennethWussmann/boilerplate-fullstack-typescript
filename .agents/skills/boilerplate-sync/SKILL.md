---
name: boilerplate-sync
description: Pull upstream improvements from the fullstack TypeScript boilerplate into a project that was generated from it - CI workflows, Dockerfile, tooling config, framework code under apps/server/src and apps/web/src, dependency bumps and the bundled agent skills. Use this skill whenever the user wants their project to catch up with the template, with phrasings like "sync the boilerplate", "pull in the latest template changes", "update this project from the boilerplate", "the boilerplate got a new CI workflow, bring it over", "am I behind the template", or "what changed upstream since I bootstrapped". It also applies when the user points at a local boilerplate checkout and asks what is worth taking. Load it before touching any file, because it classifies which paths may be overwritten and which are project-owned - a blanket copy destroys product code and resets the project's identity.
---

# Boilerplate Sync

A project generated from this boilerplate keeps living, and so does the boilerplate. Months later the template has better CI, a fixed Dockerfile, an improved config loader — and the project has all of that in its original form, plus a product built on top. Syncing is the act of moving the first set forward without disturbing the second.

The direction matters: **boilerplate → project**. The project is the thing with real users, so when in doubt the project wins. Overwriting product code or resetting the project's name is a far worse failure than skipping an upstream improvement, and the skipped improvement is recoverable on the next sync.

## Shared mechanics

Read [../_shared/boilerplate-repo-pairing.md](../_shared/boilerplate-repo-pairing.md) first — it covers resolving which repository is which, establishing the baseline, triage, branching, verification and handoff. Read [../_shared/boilerplate-file-map.md](../_shared/boilerplate-file-map.md) for the four-bucket classification. Everything below is what is specific to the forward direction.

Confirm early that the target really is a project and not a second boilerplate. If the current working directory *is* the boilerplate, the user most likely wants the other skill (`boilerplate-backport`) — ask before proceeding.

## Determine the range

With a baseline commit from `.boilerplate-sync.json`:

```bash
git -C <boilerplate> log --oneline <baseline>..HEAD
git -C <boilerplate> diff --stat <baseline>..HEAD
```

The commit log is worth keeping around verbatim. Upstream commit subjects are already a changelog written by whoever made the change, and reusing them in the triage list and the eventual PR body tells the reviewer *why* something is arriving far better than a diff summary you invent.

Without a baseline, diff the two working trees directly and expect noise:

```bash
diff -ru --exclude=node_modules --exclude=.git --exclude=dist --exclude=.turbo <boilerplate> <project>
```

Everything the project intentionally changed shows up here as a difference. That is unavoidable; it just means triage carries the whole weight and nothing gets applied without the user seeing it.

## Apply per bucket

**Infrastructure** — copy near-verbatim, then restore the project's identity inside those files: `APP_NAME` build args, image names, registry paths, workflow names. Merge `.gitignore` rather than replacing it. When the project deleted a workflow on purpose, do not resurrect it; ask.

**Framework code** — this is where the work actually is. For every framework file changed both upstream and in the project since the baseline, reason three ways before writing anything:

1. What did the file look like at the baseline?
2. What did upstream change, and why (read the commit)?
3. What did the project change, and why?

Then apply the upstream *change* to the project's version by hand. A project that added three config keys to the Zod schema, or registered two services in `applicationContext.ts`, or extended the Apollo link chain, must keep those; the upstream edit gets woven in. Overwriting is only correct when the project never touched the file.

If an upstream change genuinely conflicts with a deliberate project divergence — upstream removed the thing the project extended — stop and explain both sides. That is a decision for the user, not a merge.

**Identity** — excluded unconditionally, not even offered.

**Product code** — never overwritten. The one exception worth flagging is `apps/server/src/database/schema.ts` and the demo modules: if the project still carries the boilerplate's example health module untouched, upstream fixes to it are fair game. Ask rather than assume.

## Generated output is not input

Do not copy `schema.graphql`, `src/http/routers/graphql/generated/`, `graphql-env.d.ts` or `drizzle/*.sql`. They describe the boilerplate's schema, not the project's, and a copied artefact only fails at runtime. Copy the *sources*, then regenerate:

```bash
cd apps/server && pnpm codegen && pnpm db:generate
cd apps/web && pnpm codegen
```

## Dependencies

Apply upstream version ranges for packages the project still depends on, in root and both app `package.json` files. Two rules keep this safe:

- Never remove a dependency the project added. Upstream not having it means nothing.
- Never copy `pnpm-lock.yaml`. Run `pnpm install` in the project and let it resolve.

A major version bump upstream is a bump the project also has to survive. If it breaks the build, either fix the call sites — usually a small, well-understood change — or leave that dependency behind and record it as not applied with the error.

## Commit shape

Group by theme, in this order, so the reviewer reads the safe changes first:

1. `chore: sync CI and tooling from boilerplate`
2. `chore: sync <framework area> from boilerplate`
3. `chore: bump dependencies from boilerplate`
4. `chore: regenerate GraphQL types`
5. `chore: record boilerplate sync baseline` — updating `.boilerplate-sync.json`

The baseline update lands last and only if everything before it worked. Recording a baseline for changes that were reverted means the next sync silently skips them forever.

```json
{
  "repository": "https://github.com/KennethWussmann/boilerplate-fullstack-typescript",
  "commit": "<upstream HEAD sha>",
  "syncedAt": "<YYYY-MM-DD>"
}
```

If some items were skipped, say so in the file's neighbourhood — the PR body — not by fudging the commit. The baseline is a claim that everything up to that commit was *considered*, not that all of it was taken.

## Reporting

The PR body should read as a changelog, because that is what the user needs at review time:

- **Why**: the project last synced at `<baseline>`; `<n>` upstream commits since
- **What**: grouped list, each line traceable to an upstream commit subject
- **Not applied**: every skipped item with the reason — project diverged, dependency broke the build, user dropped it in triage

That last section is the part worth spending sentences on. It is the difference between a sync the user trusts and one they have to re-verify by hand.
