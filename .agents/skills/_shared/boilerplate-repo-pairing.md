# Pairing a Project with its Boilerplate

Shared mechanics for `boilerplate-sync` and `boilerplate-backport`. Both skills ship inside the boilerplate, which means they also ship into every generated project — so the first thing either one has to work out is which side of the pair it is standing in.

## Why git cannot help here

A repository created from a GitHub template shares no commits with the template. There is no merge base, so `git merge`, `git rebase` and `git cherry-pick` are all off the table, and adding the boilerplate as a remote only produces two unrelated histories. Everything below is content diffing against a synthetic baseline instead. Do not try to be clever with `--allow-unrelated-histories`; it produces conflicts in every file and loses the classification that makes these skills useful.

## Step 1: Resolve the two repositories

One side is the current working directory, the other is a path the user gives (ask for it if they did not). Both must be git repositories with clean working trees — refuse and ask the user to commit or stash otherwise, because the whole workflow relies on `git diff` being meaningful and on being able to undo a bad copy.

Identify which one is the boilerplate:

- `git remote get-url origin` points at `KennethWussmann/boilerplate-fullstack-typescript`
- root `package.json` `name` is `boilerplate` and `description` is empty
- `.agents/skills/project-bootstrap/` exists (bootstrap deletes nothing, so this is weak evidence on its own — a project may still carry it)
- `apps/web/src/lib/constants.ts` has `productName = 'Boilerplate'`

The `constants.ts` and `package.json` signals are the strong ones. If both repositories look like a boilerplate, or neither does, stop and ask via the `questionnaire` tool rather than guessing — picking the wrong direction overwrites someone's product code.

State the resolved direction explicitly before doing anything else ("syncing *from* `../boilerplate` *into* this project"). It costs one sentence and prevents the worst possible outcome.

## Step 2: Establish a baseline

The project records what it last took from the boilerplate in `.boilerplate-sync.json` at its root:

```json
{
  "repository": "https://github.com/KennethWussmann/boilerplate-fullstack-typescript",
  "commit": "6485993...",
  "syncedAt": "2026-02-20"
}
```

`project-bootstrap` writes this file when a project is first set up, and `boilerplate-sync` updates it. With it, the boilerplate can be checked out at that commit into a temporary worktree and the comparison becomes three-way: baseline, upstream, project.

```bash
git -C <boilerplate> worktree add /tmp/boilerplate-baseline <commit>
```

If the file is missing — an older project, or one bootstrapped by hand — say so, fall back to a plain two-way tree diff, and warn that the result will contain noise from every intentional divergence the project ever made. In that case lean much harder on triage: present everything, assume nothing.

Clean the temporary worktree up when done (`git -C <boilerplate> worktree remove /tmp/boilerplate-baseline`).

## Step 3: Classify

Read [boilerplate-file-map.md](boilerplate-file-map.md) and sort every changed path into infrastructure, framework code, identity or product code. This classification is the actual value of these skills — a raw diff is something the user could have produced themselves.

## Step 4: Triage with the user

Present the classified list, grouped by bucket, with a one-line summary per file of what actually changed. Let the user drop anything. Apply per file, never per commit: upstream commits mix buckets freely, and a commit that bumps a workflow and also touches the example schema must not arrive as an all-or-nothing choice.

## Step 5: Branch and commit in the target

Never work on the target's default branch, never push, never amend. Branch names:

- sync: `chore/boilerplate-sync-<YYYY-MM-DD>`
- backport: `feat/backport-<topic>`

Commit grouped by theme — one commit per coherent change, so the reviewer can follow it and drop a single piece if they disagree. One giant "sync boilerplate" commit is unreviewable and unrevertable in parts.

## Step 6: Verify

```bash
pnpm install
pnpm check
pnpm build
pnpm test
```

`pnpm install` first and always: the lockfile is never copied across repositories, so it has to be regenerated in the target. If GraphQL schemas or the Drizzle schema moved, run `pnpm codegen` (both apps) and `pnpm db:generate` before building.

A broken build is not a handover note. Fix it, or revert the item that caused it and record it as not applied. The user asked for a working tree, not a puzzle.

## Step 7: Hand off

Print the push command and a ready-to-run draft PR creation, and let the user run them:

```bash
git push -u origin <branch>
gh pr create --draft --title "..." --body "..."
```

Close with a summary that includes a **not applied** section: what was skipped, and why. That list is how the user knows the sync was a judgement call rather than a mechanical copy, and it is the part they will want to argue with.
