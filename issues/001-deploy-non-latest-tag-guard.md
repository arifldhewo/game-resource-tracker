# 001 — Old tag can overwrite the live site

Status: `open`
Area: deploy

## What happened

Backfilling GitHub Releases for historical tags re-published every
release. Each old tag carries its own copy of `.github/workflows/deploy.yml`
from its own commit, and at that time the file still had
`release: types: [published]`. Publishing those releases therefore ran a
deploy of the old code. `v0.5.2` finished last and replaced the live
site, which then served the old tier cap.

Observed run: `v0.5.2`, event `release`, conclusion `success`, while the
`v0.6.x` runs around it were `cancelled` by the `pages` concurrency
group.

## Why it can happen again

Removing the trigger from `master` only fixes new tags. Every tag up to
`v0.6.3` still contains the old workflow, so editing or re-publishing an
old release can redeploy that old commit over the current site.

## What to do

Make the build job refuse to deploy a tag that is not the newest version
tag. It needs no checkout history:

```bash
latest="$(git ls-remote --tags --refs origin 'v*' \
  | sed 's#.*refs/tags/##' | sort -V | tail -n1)"
if [ "$latest" != "$GITHUB_REF_NAME" ]; then
  echo "::error::$GITHUB_REF_NAME is not the newest tag ($latest)"
  exit 1
fi
```

Run it only when `startsWith(github.ref, 'refs/tags/v')`, alongside the
existing version check.

## Done when

- Pushing an old tag fails the build job with the message above.
- Publishing a new tag still deploys and still opens its release.
- A workflow re-run on the current tag is unaffected.

## Files

- `.github/workflows/deploy.yml`
