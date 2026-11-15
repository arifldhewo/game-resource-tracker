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

## Release

The tag does everything: `v*` tag push → deploy job → release job, which opens
the GitHub Release with the `CHANGELOG.md` section as body. Never create a
release by hand. Ships are: `npm run bump -- patch --note "..."`, commit, push
`master`, then `git tag -a vX.Y.Z` and push the tag.
