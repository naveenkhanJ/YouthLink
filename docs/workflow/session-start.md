# Session start prompt

**Paste the block below as the first message of every new chat**, in any AI tool — and again after the chat has been compacted or summarised. Tools that load `AGENTS.md` automatically (Claude Code, Codex, Cursor, Copilot, Gemini CLI via `GEMINI.md`) follow the same procedure without it, but pasting it does no harm and guarantees the start.

```
You are working in the YouthLink repository. Before anything else:

1. Read AGENTS.md and docs/workflow/agent-protocol.md in full. Follow the protocol exactly.
2. Run `git config user.email` and `git branch --show-current`. Find me in docs/workflow/team.json and check my branch is mine and follows the convention. If it is not, stop and tell me the exact branch to switch to. Check `git config --get core.hooksPath` is `.githooks`; if not, tell me to run `node scripts/install-hooks.mjs`.
3. Read my .worklog/progress.md NEXT block and my latest .worklog/state/ report, if they exist.
4. Run `node scripts/state-report.mjs --save`. If you cannot run commands, tell me and I will paste its output. Do not write code before you have it. Take today's date from its first line.
5. Reconcile: check every acceptance criterion of my current and next cards against the actual code, and fill in the report's Reconciliation and Discrepancies tables. The code outranks Jira, my notes, the docs and what I tell you.
6. Report where things stand in a few lines, then continue with the next card in the protocol's queue. Stop only at the protocol's stop points.
```

If your tool cannot run commands, run these yourself and paste the output when the agent asks:

```bash
node scripts/state-report.mjs --save
node scripts/card-context.mjs <FR-ID>
node scripts/pr-check.mjs
```
