# 006 — Step labels bypass the dictionary

Status: `open`
Area: i18n

## Facts

The dictionary already has the strings, and the components ignore them.

In `forecast-wizard.tsx`:

```ts
const STEP_NAMES = ["TARGET", "RESOURCES", "MATRIX", "OUTLOOK"];
```

and the pane kickers are literals:

```tsx
kicker="01 · TARGET MISSION"
kicker="02 · RESOURCES"
kicker="03 · PRE-FLIGHT MATRIX"
kicker="04 · OUTLOOK"
```

Meanwhile `data/i18n/en.json` contains `step.target`, `step.resources`,
`step.matrix`, `step.outlook`, `head.step`, `step1.mission`,
`step2.mission` — all with zero references in `src`.

Verified by grepping for each key under `--include=*.tsx`.

## Why it matters

Every other visible label on the forecast page goes through `t()`. These
are the exception, so the page is not fully translatable even though the
translations exist. Any future locale work will look done and not be.

## What to do

1. Replace `STEP_NAMES` with the dictionary keys, keeping the array for
   ordering only.
2. Replace each `kicker` literal with `t(...)` on the matching key. Add
   keys for the missing kickers if `step3`/`step4` have none.
3. Delete keys that end up unused, or wire the ones you kept.
4. Check the same is true in `id.json` so both dictionaries stay level.

## Done when

- No step name or kicker string is hardcoded.
- `grep -rn '"step.target"' src` shows a real use.
- Both dictionaries have the same key set for these.

## Files

- `src/app/forecast/components/forecast-wizard.tsx`
- `data/i18n/en.json`
- `data/i18n/id.json`
