---
name: tailwind-conventions
description: Style UI changes in this repo with Tailwind CSS v4 conventions — utility-first classes, design tokens from globals.css, canonical utilities, variants, responsive layout, theme config, and conflict-free composition. Use whenever editing JSX/TSX styles, colors, spacing, responsive layout, or fixing Tailwind warnings.
---

# Tailwind v4 conventions

## Source of truth

- Tokens live in `src/app/globals.css` → `@theme` (CSS-first; no
  `tailwind.config.js`).
- Add missing semantic tokens there (`--color-*`, `--shadow-*`, `--radius-*`),
  then use generated utilities (`bg-surface-raised`, `shadow-menu`).
- Never hardcode `#hex`, `rgba()`, or raw shadows in TSX. Dynamic/data values
  (tier colors from JSON) may use `style`.

## Core rules

1. Style in markup. No new CSS class unless reusable (`@layer components` /
   `@utility`); no `@apply` for one-offs.
2. Reuse tokens: `bg`, `card`, `card-2`, `inset`, `line`, `line-soft`,
   `line-strong`, `fg`, `muted`, `muted-2`, `accent`, `success`, `danger`,
   `amber`, `control`, `surface-*`.
3. Prefer canonical utilities over brackets: spacing `px-4.5` `py-2.75`
   `my-3.75` `max-w-230` `size-6.5` `h-13` `min-h-8` `z-60`; type
   `tracking-widest` (0.1em) `tracking-wider` (0.05em) `leading-normal` (1.5);
   shape `rounded-xs` (2px) `bg-accent/3` `bg-linear-to-b` `wrap-break-word`.
4. Never put conflicting utilities on one element; choose with `cn()`.
   Intentional overrides (`border-b last:border-b-0`,
   `border-line focus-within:border-accent/60`) are fine; LSP `cssConflict`
   warnings there are expected.
5. Repeated markup → loop or React component. `!`/`!important` is a last resort.

## Variants (states)

- `variant:utility`; stack left→right (leftmost outermost):
  `dark:md:hover:bg-...`.
- `hover:` only under `@media (hover:hover)`; use `focus-visible:` for keyboard
  rings, `focus-within:` on input wrappers, `active:` for press.
- Form: `disabled:` `enabled:` `checked:` `indeterminate:` `required:`
  `invalid:` `user-invalid:` `placeholder-shown:` `autofill:`.
- Structure: `first:` `last:` `only:` `odd:` `even:` `nth-3:` `nth-[3n+1]:`
  `empty:`.
- Parent/sibling: `group` + `group-hover:`; `peer` + `peer-checked:` (peer must
  be an earlier sibling); name nested ones `group/name` + `group-hover/name:`.
- Conditional: `has-[img]:` matches a descendant; combine as `group-has-[a]:` /
  `peer-has-checked:`; `not-focus:`; `in-focus:` matches any ancestor state
  without a `group`.
- Data/ARIA: `data-active:` (presence), `data-[size=large]:`, `aria-checked:`
  (true), `aria-[sort=ascending]:`.
- Media: `dark:` `motion-safe:` `motion-reduce:` `pointer-fine:`
  `pointer-coarse:` `portrait:` `landscape:` `print:`
  `supports-[display:grid]:`.
- Pseudo-elements: `before:` `after:` (auto content), `placeholder:` `file:`
  `marker:` `selection:`. Children: `*:` direct, `**:` all descendants.

## Responsive

- Mobile-first: unprefixed = mobile; `sm` `md` `lg` `xl` `2xl` =
  40/48/64/80/96rem and up.
- `max-*` is strict below (`max-md` < 48rem); range `md:max-xl:`; arbitrary
  `min-[760px]:` `max-[760px]:`.
- Keep this repo's custom `min-[...]`/`max-[...]` widths unless a value repeats;
  then add `--breakpoint-*` in `@theme`.
- Container queries: `@container` parent + `@md:` child; named
  `@container/main` + `@md/main:`.

## Theme & colors

- `@theme` is top-level; tokens emit a CSS var **and** utilities. Namespaces:
  `--color-*`, `--font-*`, `--font-weight-*`, `--text-*`, `--tracking-*`,
  `--leading-*`, `--spacing`, `--radius-*`, `--shadow-*`, `--breakpoint-*`,
  `--container-*`.
- `--spacing` is one scalar; never define `--spacing-4` — spacing utilities calc
  from it.
- Override a default by redeclaring it; remove one with
  `--color-lime-*: initial`; reset all with `--*: initial`.
- `@theme inline` when a token references another var
  (`--font-sans: var(--font-inter)`).
- Custom CSS: `var(--color-...)`; arbitrary values can use `calc()`,
  `--alpha(...)`, `--spacing(...)`.
- Palette is OKLCH. Opacity: `bg-black/75`, `bg-pink-500/[71%]`, runtime
  `bg-cyan-400/(--alpha)`. Arbitrary colors `bg-[#...]` only for true one-offs.
- Add a token when a value repeats or carries design intent; use an arbitrary
  value for unique/one-off values.

## Custom CSS, detection, directives

- Prefer utilities; custom CSS only for third-party overrides or selectors
  utilities can't express.
- Arbitrary value `top-[117px]`, property `[mask-type:luminance]`, variant
  `[&:nth-child(-n+3)]:`. Spaces → `_`; `fill-(--brand)` = `fill-[var(--brand)]`
  (no `var()` inside shorthand); ambiguous shorthand needs `text-(length:--x)`.
- `@utility name { ... }` = reusable custom utility;
  `@custom-variant name (...)` = custom variant; `@variant dark { ... }` inside
  CSS.
- `@layer base` for element defaults, `@layer components` for classes utilities
  must still override. `@apply` for third-party overrides only;
  `@reference "../app.css"` in CSS modules/Svelte/Vue styles.
- Class detection scans plain text: emit complete class strings. Never
  `bg-${color}-600`; use lookup maps/conditionals. Template literals and object
  values are fine.
- Scans skip `.gitignore`d files, `node_modules`, CSS, lockfiles. Add paths with
  `@source "..."`, exclude `@source not "..."`, safelist
  `@source inline("{hover:,}underline")`.
- `@import "tailwindcss";` is the entry. `source("../src")` sets the scan base;
  `source(none)` disables auto-scan. v4 drops JS
  `corePlugins`/`safelist`/`separator`.

## Workflow

1. Read `@theme` in `globals.css`; reuse tokens and canonical utilities.
2. `npm run lint && npm test && npm run build`.
3. Optional: open changed TSX in Neovim; fix `The class X can be written as Y`
   from `tailwindcss-language-server`.

## Docs

- <https://tailwindcss.com/docs/styling-with-utility-classes>
- <https://tailwindcss.com/docs/hover-focus-and-other-states>
- <https://tailwindcss.com/docs/responsive-design>
- <https://tailwindcss.com/docs/theme>
- <https://tailwindcss.com/docs/colors>
- <https://tailwindcss.com/docs/adding-custom-styles>
- <https://tailwindcss.com/docs/detecting-classes-in-source-files>
- <https://tailwindcss.com/docs/functions-and-directives>
