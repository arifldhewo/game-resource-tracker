# 002 — Tag verify cannot pass for pre-migration tags

Status: `open`
Area: release

## Facts

The build job checks that the tag equals `package.json`'s version:

```yaml
- name: Verify tag matches package version
  if: startsWith(github.ref, 'refs/tags/v')
```

Seven tags predate the Next.js migration and contain no `package.json`
at all, so that step can never pass for them if they are ever re-cut:

```text
v0.1.0 v0.1.1 v0.2.0 v0.2.1 v0.3.0 v0.4.0 v0.4.1
```

Verified with `git cat-file -e "$tag:package.json"`. Every tag from
`v0.5.0` on has it.

## Why it matters

The repo has no branch protection, so this check is the only guard that a
tag matches the version it claims to ship. It should stay strict for the
tags that can satisfy it.

## What to do

Option A, keep strict and document the exception: skip the check when the
commit has no `package.json`, and print a notice instead of failing.

```bash
if ! git cat-file -e "HEAD:package.json" 2>/dev/null; then
  echo "::notice::pre-migration tag, no package.json to verify"
  exit 0
fi
```

Option B, treat old tags as immutable and never re-cut them. Cheaper, but
it relies on discipline rather than the workflow.

Pick one and note it in `README.md`. Also consider enabling branch
protection so the tag check is not the only guard.

## Done when

- The chosen guard is in the workflow and documented.
- A synthetic run on a pre-migration tag passes or fails as intended.
- A current tag still fails when its version does not match.

## Files

- `.github/workflows/deploy.yml`
- `README.md`
