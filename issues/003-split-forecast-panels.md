# 003 — Split breakdown and pity panels (phase 3)

Status: `open`
Area: forecast

## Context

Phase 1 and 2 of the split are done: pure helpers moved to `lib/engine`
and the UI atoms now live in sibling files. The two panels are still
inside `forecast-wizard.tsx` and are the largest remaining blocks.

| Block | Approx lines | Inside |
| --- | --- | --- |
| `BreakdownPanel` | ~270 | delta strip, line rows, OP packs disclosure, Leviathan add-on |
| `PityPanel` | ~180 | four stat cells, notes builder |

## Why these two together

Both build the same outer shell by hand:

```text
<section className="mt-4 rounded-prts border border-line bg-card">
  <div className="flex flex-col gap-2 border-b border-line px-4 py-3
       min-[600px]:flex-row min-[600px]:items-start
       min-[600px]:justify-between">
    <h2 className="m-0 font-display text-[19px] uppercase tracking-[0.06em]">
```

That is the duplication worth removing. `MiniCard` does not fit: it uses
a smaller header and a different padding scale.

## What to do

1. Add `SectionPanel` to `section.tsx` with slots
   `{ title, sub, right, children }`, matching the markup above.
2. Create `app/forecast/components/breakdown-panel.tsx` and
   `pity-panel.tsx`, both using `SectionPanel`.
3. Lift `PityPanel`'s `notes` array into a pure builder in
   `src/lib/engine/`, so it can be tested — the test runner is
   `environment: "node"` with `include: ["tests/**/*.test.ts"]`, so pure
   functions are the only testable surface.
4. Keep props explicit: `{ state, view }`. Do not call `useForecast()`
   inside the panels; `view` is computed once in the shell.

## Risky details

- `BreakdownPanel` uses `useId()` for the OP packs panel id; keep it.
- `mergeBreakdownLines`, `groupOpPacks`, `leviExtras` are already
  extracted and tested — reuse, do not re-inline.
- The Leviathan sub-panel is only rendered when
  `state.selected === "LEVIATHAN"`. Keep that condition.

## Done when

- Both panels are their own files, shell no longer defines them.
- `SectionPanel` is used by both, no duplicated header markup left.
- Notes builder has tests.
- Steps 3 and 4 render identically; OP packs disclosure still toggles.

## Files

- `src/app/forecast/components/forecast-wizard.tsx`
- `src/app/forecast/components/section.tsx`
- `src/lib/engine/`
