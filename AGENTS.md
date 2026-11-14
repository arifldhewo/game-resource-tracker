# Memory

## Start here

Before making any UI/styling change — or before searching the repo for color,
spacing, variant, or responsive conventions — read
`SKILLS/tailwind-conventions/SKILL.md` first. It is the single source for this
project's Tailwind v4 tokens, canonical utilities, variants, responsive rules,
and validation workflow.

## Project

- Next.js static export; Tailwind CSS v4 is CSS-first in `src/app/globals.css`
  (`@theme`); there is no `tailwind.config.js`.
- Never hardcode hex/rgba colors or raw shadows in components; add a token
  instead.
- Validate changes with `npm run lint && npm test && npm run build`.
