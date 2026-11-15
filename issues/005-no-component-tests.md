# 005 — No component test environment

Status: `needs-decision`
Area: tests

## Facts

`vitest.config.mts` is:

```text
environment: "node"
include: ["tests/**/*.test.ts"]
```

No DOM, no `.tsx`, no testing library. Consequences:

- Engine, store and format logic is testable and covered.
- No component has any test, and none can be added without config work.
- Every UI change is verified by hand, usually by rendering the static
  export and looking at it.

That is why the forecast split (issues 003 and 004) has to be validated
visually rather than by test. Phase 1 could be tested only because its
helpers are pure functions.

## The decision to make

Adding component tests is a separate, deliberate choice — it is not
required for the refactor to proceed.

Option A, stay node-only: keep helpers pure, extract logic out of
components, accept manual visual checks. Cheapest, and it is working.

Option B, add a browser environment: `jsdom` plus
`@testing-library/react` plus `@testing-library/user-event`, widen
`include` to `tests/**/*.test.{ts,tsx}`, and add setup for `cleanup`.
Then component behaviour like the OP packs disclosure and the info
dialog can be asserted instead of eyeballed.

If Option B, also decide whether to keep the node project for engine
tests and add a second project for DOM tests, or run everything under
jsdom. A split config keeps engine tests fast.

## Done when

- The owner picks A or B.
- If B: config, setup file and one representative component test exist,
  and `npm test` still passes for the existing suite.
- If A: this file is deleted and the constraint is noted where it
  matters.

## Related

Issues 003 and 004 lean on manual verification until this is settled.
