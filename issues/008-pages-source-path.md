# 008 — Pages still configured for a `/docs` source

Status: `blocked`
Area: deploy

## Facts

`gh api repos/arifldhewo/game-resource-tracker/pages` reports:

```json
build_type: "workflow"
source: { branch: "master", path: "/docs" }
```

But there is no `docs/` directory in the repository any more — it was the
pre-migration static site, and the Next.js export deploys through the
workflow instead. The branch source is vestigial.

Deploys work today, so this is cleanup, not a bug. It matters because
`source.path: /docs` makes it look like Pages is served from a folder
that does not exist, which will confuse anyone debugging a deploy.

## Why blocked

`build_type` is already `workflow`, so the branch source is not in use.
Clearing it means changing repository settings through the GitHub API or
the web UI, which is shared state outside the repo and should be the
owner's call.

## What to do

Set the Pages source to "GitHub Actions" only, so no branch is recorded:

```bash
gh api -X PUT repos/arifldhewo/game-resource-tracker/pages \
  -f build_type=workflow
```

Then confirm `source` no longer carries a branch and path, and re-run the
deploy workflow from a tag to prove publishing still works.

## Done when

- `gh api .../pages` shows no `branch`/`path` source.
- A tag push still deploys to the custom domain.
- The custom domain and HTTPS certificate are unaffected.

## Files

- none in the repo; this is a settings change
