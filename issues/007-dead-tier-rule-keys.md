# 007 — Dead `tier.rule.*` keys

Status: `open`
Area: i18n

## Facts

Both dictionaries carry six `tier.rule.*` keys:

```text
data/i18n/en.json   6 keys
data/i18n/id.json   6 keys
```

Nothing reads them. The UI takes the rule from the tier data:

```tsx
src/app/forecast/components/forecast-wizard.tsx:  {row.tier.rule}
```

and `row.tier` is the object from `data/tiers.json`, which already has
its own `rule` field:

```json
{ "key": "GOLDFISH", "rule": "$5–$30.98/mo", "cap": 30.98, ... }
```

So there are two sources of truth and the unused one has already drifted
once: when the GOLDFISH cap moved to 30.98, the JSON was the one that
mattered and the dictionary keys had to be edited by hand to stop
misleading readers.

## What to do

Delete the six keys from both locales. `data/tiers.json` is the source;
`tier.rule.*` is a duplicate that no code consults.

If instead you want translatable tier rules, that is a different change:
wire `t(\`tier.rule.${row.tier.key}\`)` in the UI and remove `rule` from
the JSON. Do not keep both.

## Done when

- `grep -rn "tier.rule" data/i18n` returns nothing.
- The forecast matrix still shows the same rule strings in both locales.
- `npm run build` passes (missing keys fall back at runtime, so build
  alone is not proof — check the page).

## Files

- `data/i18n/en.json`
- `data/i18n/id.json`
- `data/tiers.json` (source of truth)
