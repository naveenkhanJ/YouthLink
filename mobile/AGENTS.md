# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing any code.

## Repository rules

**This file adds to the repository-root [`AGENTS.md`](../AGENTS.md); it does not replace it.** Some tools read only the nearest `AGENTS.md`, so the root file's mandatory core is copied below. Read the root `AGENTS.md` and [`docs/workflow/agent-protocol.md`](../docs/workflow/agent-protocol.md) in full before anything else.

<!-- agent-core:start -->
**Mandatory at the start of every chat, and again after any compaction or summary. Protocol version 1.**

1. **Identity and branch.** `git config user.email` must be listed in `docs/workflow/team.json`, and the branch must be the developer's own and follow `CONTRIBUTING.md`. If not, stop and give the exact branch name.
2. **Code first.** Before any work, establish what the code actually implements: run `node scripts/state-report.mjs --save` (no shell: ask the developer to run it and paste the output), then check each acceptance criterion of the current cards against the code. Code on `develop` outranks Jira, progress notes, documents, chat summaries and what anyone says. Write no code until this is done.
3. **Full procedure:** read `docs/workflow/agent-protocol.md` in full. For each card, read the output of `node scripts/card-context.mjs <FR-ID>` in full.
4. **The developer runs git.** Never run `git commit`, `git push`, `git checkout` or `git merge` yourself. Give the exact commands, the commit message (`<type>(<surface>): <description> [<FR-ID>]`), and say when a pull request is due (`node scripts/pr-check.mjs`; base `develop`, merge commit, never squash, never delete the branch).
5. **Refuse** anything that breaks `AGENTS.md` or `CONTRIBUTING.md`: commits to `develop`/`main`, squash, force-push, `--no-verify`, schema or dependency changes by a member, another member's module or a shared file, secrets, excluded features, invented behaviour.
6. **Escalate** schema needs, unclear or contradictory requirements and missing shared pieces with the `ESCALATE TO AFHAM (shared-components owner)` block in the protocol, park the card, and continue with the next one.
7. **UI is exact per `docs/prototype/`:** design tokens, components, copy, structure, and every drawn state.
8. **Record progress** in the developer's git-ignored `.worklog/` (templates in `docs/workflow/templates/`), dated from the State Report's header (Asia/Colombo time), never from memory. It is the developer's own record; never report on them.
9. **Stop only** for a commit, a pull request, an end-to-end run, a command only the developer should run, a refusal, or an escalation. Otherwise keep going.
<!-- agent-core:end -->
