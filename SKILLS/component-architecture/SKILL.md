---
name: component-architecture
description: Place and structure React components in this repo. Use when creating a component, deciding whether it belongs in src/components or a route folder, splitting a page, or reviewing where logic should live.
---

# Component architecture

Placement is decided by one question: **how many pages use it?** Read this
before creating or moving any component.

## Current state

```text
src/
├─ app/
│  ├─ layout.tsx      shell: Topbar + Footer + StoreHydrator
│  ├─ page.tsx        landing (server)
│  ├─ forecast/
│  │  ├─ page.tsx     server
│  │  └─ components/  forecast-wizard, info-sheet
│  ├─ roadmap/page.tsx    server
│  └─ settings/page.tsx   client
├─ components/
│  ├─ layout/         footer, lang-switch, store-hydrator, topbar
│  └─ ui/             number-field, switch
└─ lib/               engine, store, i18n, data
```

Consumers today:

| Component | Imported by | Pages |
| --- | --- | --- |
| `layout/topbar`, `footer`, `store-hydrator` | `app/layout.tsx` | all |
| `layout/lang-switch` | `topbar` | all |
| `ui/number-field` | `forecast/components/forecast-wizard` | 1 |
| `ui/switch` | `app/settings/page.tsx` | 1 |
| `forecast/components/forecast-wizard` | `app/forecast/page.tsx` | 1 |
| `forecast/components/info-sheet` | `forecast-wizard` | 1 |

## Rules

### 1. Root `src/components/` is for shared code only

A component in `src/components/` **must be imported by more than one page**.
If it serves a single page, it does not belong there — see rule 2.

Two folders are exempt because they are shared by construction:

- `src/components/layout/` — app shell, mounted once in `app/layout.tsx`.
- `src/components/ui/` — domain-free primitives (inputs, toggles). They may
  have one consumer today. Keep them free of domain knowledge; if a `ui/`
  component starts importing tiers, products, or the engine, it is no longer
  a primitive and moves.

Nothing violates rule 1 today. `forecast-wizard` and `info-sheet` were the
last offenders and moved to `app/forecast/components/`; keep it that way.

### 2. Single-page components live next to their page

Route-specific components go in the route folder:

```text
src/app/<route>/components/<name>.tsx
```

Not in `src/components/`. The path then states the ownership, so nobody has to
trace imports to find out who owns a file.

Do not put `page.tsx`, `layout.tsx`, or `route.ts` inside a `components/`
folder — those names are routing conventions and would create a route.

### 3. Component shape

- Named exports only; `export default` is reserved for `page.tsx`.
- File names are kebab-case: `forecast-wizard.tsx`, not `ForecastWizard.tsx`.
- `"use client"` only when the component needs state, effects, or browser
  APIs. Pages stay server components wherever possible; 3 of 4 are today.
- Import with the `@/` alias; use a relative path only within the same folder
  (`./info-sheet`).

### 4. Dependencies point one way

`app → components → lib`. Code in `src/components` never imports from
`src/app`, and `src/lib` never imports a component. Business logic (basket
optimization, pity math, tier rules) stays in `src/lib/engine`; components
only render it.

The one allowed exception is inward-only: a file in `app/<route>/components/`
may import from its own route folder, since it is part of that route. It still
must not reach into a different route.

### 5. No barrel files

There are no `index.ts` re-export files, and none should be added. Import the
module directly so dead code and dependency edges stay visible to the
bundler.

### 6. Split by responsibility, not by line count

`forecast-wizard.tsx` is 1506 lines and is the repo's known outlier. When
touching it, extract a section into `app/forecast/components/` if that section
is self-contained. Do not split purely to reduce the number of lines.

## Validate

```bash
npm run lint && npm test && npm run build
```
