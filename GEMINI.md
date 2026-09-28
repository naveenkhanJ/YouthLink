# YouthLink — Gemini CLI context

Gemini CLI imports the repository's agent instructions from `AGENTS.md`, which holds the mandatory session protocol:

@./AGENTS.md

---

**CRITICAL AGENT INSTRUCTION REGARDING CONTEXT COMPACTION:**
Whenever this conversation is compacted or summarized, you will lose your memory of prior workflow steps. When this happens, you MUST treat it as a brand new session and immediately execute Section 3 ("Every session") of `docs/workflow/agent-protocol.md`. 
Specifically, you must NEVER write code until you have explicitly:
1. Checked your branch identity (`git branch --show-current`).
2. Run `node scripts/state-report.mjs --save`.
3. Executed Section 3.2 Reconciliation (checking acceptance criteria vs actual code).
