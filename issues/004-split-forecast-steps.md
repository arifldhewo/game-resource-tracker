# 004 — Split step sections and shrink the shell

Status: `open`
Area: forecast

## Context

`forecast-wizard.tsx` is ~1260 lines after phases 1 and 2. What remains
is the shell plus the four step sections.

| Section | Approx lines | Note |
| --- | --- | --- |
| `StepTarget` | ~250 | two modes, six selects, date input. Dense. |
| `StepResources` | ~172 | inventory grid, OP conversion slider |
| `StepMatrix` | ~73 | grid of tier cards |
| `StepOutlook` | ~113 | stat tiles, tier chips |
| `TierCard` | ~96 | plus the `TIER_SHORT` label map |

## Order of work

Do one section per commit, each building green on its own:

1. `step-matrix` + `tier-card` (smallest, lowest risk)
2. `step-outlook`
3. `step-resources`
4. `step-target` (last: densest, two modes)
5. Shell: extract `StepNav` and the sticky footer if it is still worth it

Stop whenever you like; each step is independently shippable.

## Fix this while here

`endText` and `dateHint` live in the shell but only `StepTarget` uses
them. That is four props plus a `useEffect` threaded through
`ForecastWizard`. Move the state into `step-target.tsx` and delete the
props. The sync is:

```ts
useEffect(() => {
  if (store.endDate) setEndText(isoToDMY(store.endDate));
}, [store.endDate]);
```

## Constraints

- Steps keep taking `{ state, view }`. Do not add store reads inside them.
- `view` is computed and guarded once in the shell; do not recompute it.
- `STEP_NAMES` stays in the shell or moves to `StepNav`, not per step.

## Done when

- Each section is its own file under `app/forecast/components/`.
- The shell is roughly a router: guard, step nav, active step, footer.
- All four steps verified visually at desktop and mobile widths.

## Files

- `src/app/forecast/components/forecast-wizard.tsx`
