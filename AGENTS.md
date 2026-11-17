# Memory

## Start here

Before making any UI/styling change — or before searching the repo for color,
spacing, variant, or responsive conventions — read
`SKILLS/tailwind-conventions/SKILL.md` first. It is the single source for this
project's Tailwind v4 tokens, canonical utilities, variants, responsive rules,
and validation workflow.

Before creating, moving, or splitting a component — or before deciding where a
file belongs — read `SKILLS/component-architecture/SKILL.md` first. It is the
single source for component placement, route colocation, and dependency
direction.

## Project

- Next.js static export; Tailwind CSS v4 is CSS-first in `src/app/globals.css`
  (`@theme`); there is no `tailwind.config.js`.
- Never hardcode hex/rgba colors or raw shadows in components; add a token
  instead.
- Validate changes with `npm run lint && npm test && npm run build`.

## Issues

`issues/README.md` indexes known tech debt and pending actions, one file per
item. Read it before starting work that touches deploys, releases, the
forecast wizard, i18n, or tests — the item may already describe the change
you are about to make.

## Workflow

- Pull the latest `master` before starting any change:
  `git pull origin master`. Never start from a stale local `master`.
- Never work from a tag or a detached HEAD. Base commits on up-to-date
  `master`; a tag is only a pointer, not a place to commit.
- Never force-push `master` or tags. If a push is rejected, fetch and reconcile
  first.

## Release

The tag does everything: `v*` tag push → deploy job → release job, which opens
the GitHub Release with the `CHANGELOG.md` section as body. Never create a
release by hand.

Ship from `master`, never directly from an older tag or release lineage:

```bash
git pull origin master
npm run bump -- patch --note "..."
git add -A && git commit -m "chore(release): vX.Y.Z"
git push origin master
git tag -a vX.Y.Z -m "vX.Y.Z"
git push origin vX.Y.Z
```

The tag must point at the commit just pushed to `master`. Verify with
`git merge-base --is-ancestor origin/master vX.Y.Z^{}` before pushing the tag.
