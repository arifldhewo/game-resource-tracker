# Issues

Tech debt and pending actions carried across sessions. Each file is one
item, written so a fresh session can execute it without the original
conversation.

## How to use

1. Pick a file, read it fully. Facts in it were verified when written.
2. Re-verify before acting: line numbers and file paths drift.
3. Work it, then delete the file or update `Status`.

One item per file. Do not merge unrelated items to "save files" — the
point is that each one survives a context reset.

## Status

| Status | Meaning |
| --- | --- |
| `open` | Ready to execute. No decision needed. |
| `needs-decision` | Needs a call from the owner before code changes. |
| `blocked` | Waiting on something outside this repo. |

## Index

| ID | Area | Status | Item |
| --- | --- | --- | --- |
| 001 | deploy | open | Old tag can overwrite the live site |
| 002 | release | open | Tag verify cannot pass for pre-migration tags |
| 003 | forecast | open | Split breakdown and pity panels (phase 3) |
| 004 | forecast | open | Split step sections and shrink the shell |
| 005 | tests | needs-decision | No component test environment |
| 006 | i18n | open | Step labels bypass the dictionary |
| 007 | i18n | open | Dead `tier.rule.*` keys |
| 008 | deploy | blocked | Pages still configured for a `/docs` source |

## Local hygiene

`.bash_history/` at the repo root is an empty git repository, untracked
and unrelated to this project. Not created by any commit here. Confirm
with the owner before removing it.

## Snapshot

At the time of writing, `master` is 6 commits ahead of `v0.6.3`, so none
of the work from these sessions is live yet. Pages deploys only from a
`v*` tag. Check with:

```bash
git log --oneline "$(git describe --tags --abbrev=0)..master"
```
