/**
 * pre-commit hook — checks what is about to be committed, and where.
 *
 * Blocks (anyone):
 *   - committing on develop or main, or on a branch that breaks the naming
 *     convention, or on another member's branch
 *   - an unrecognised git author email (commits must be attributable)
 *   - secrets and local-only files (.env, Firebase keys, *.local.js, .worklog/)
 *   - private-key material in added lines
 *   - files in another member's module (a fix/<their-epic>-<you> branch only warns)
 * Blocks (members) / reminds (shared-components owner):
 *   - schema.prisma and migrations            -> AGENTS.md rule 1
 *   - package.json / package-lock.json        -> dependency changes
 *   - shared paths outside every module       -> owned by the shared-components owner
 * Warns:
 *   - backend/src/app.js (only the two mount lines are yours to add)
 *   - raw hex colours in mobile files (the prototype binds tokens)
 *
 * During a merge commit (e.g. merging develop in) only the secret checks run:
 * those files come from develop, not from you.
 *
 * Bypassable with --no-verify by design; see docs/workflow/agent-protocol.md.
 */
import { existsSync } from "node:fs";
import {
  git, gitOr, loadTeam, currentEmail, memberByEmail, currentBranch, parseBranch,
  moduleOfPath, isProtected, isNeverCommit, paint,
} from "../lib/common.mjs";

// The one rule that must hold even on a branch that predates team.json.
if (["develop", "main"].includes(currentBranch())) {
  console.error(paint.red(paint.bold(`\n✖ Commit blocked — you are on '${currentBranch()}'.`)));
  console.error("  Work never happens on develop or main directly. Switch to your epic branch, then commit there.\n");
  process.exit(1);
}

let team;
try {
  team = loadTeam();
} catch (err) {
  console.error(paint.yellow(`pre-commit: other checks skipped (${err.message})`));
  process.exit(0);
}

const blocks = [];
const warnings = [];
// --git-path answers relative to the current directory, which is where existsSync resolves too.
const merging = existsSync(git(["rev-parse", "--git-path", "MERGE_HEAD"]));

// --- Who is committing -------------------------------------------------------
const email = currentEmail();
const me = memberByEmail(team, email);
const owner = team.members.find((m) => m.role === "shared-owner");
if (!me) {
  blocks.push(`git user.email '${email || "(unset)"}' is not listed in docs/workflow/team.json. ` +
    `Set it to the address on your GitHub account (git config user.email "<address>") — ` +
    `or, if that address is new, ask ${owner?.name || "the shared-components owner"} to add it.`);
}
const isOwner = me?.role === "shared-owner";

// --- Where ------------------------------------------------------------------
const branch = currentBranch();
const b = parseBranch(team, branch);
if (!branch) {
  warnings.push("HEAD is detached — commits here belong to no branch. Switch to your epic branch.");
} else if (!b.valid) {
  blocks.push(`branch '${branch}': ${b.reason}.`);
} else if (me && b.owner !== me.id) {
  blocks.push(`branch '${branch}' belongs to '${b.owner}', not you (${me.id}). Work on your own branch.`);
}

// --- What -------------------------------------------------------------------
const staged = gitOr(["diff", "--cached", "--name-only", "--diff-filter=ACMRD"]).split("\n").filter(Boolean);

for (const path of staged) {
  if (isNeverCommit(team, path)) {
    blocks.push(`${path} — secrets, local-only files and .worklog/ are never committed. Unstage it: git restore --staged "${path}"`);
  }
}

if (!merging && me) {
  for (const path of staged) {
    if (isNeverCommit(team, path)) continue;

    if (isProtected(team, path)) {
      if (isOwner) warnings.push(`${path} — schema change: DoD clause 7, tell every affected teammate before this lands.`);
      else blocks.push(`${path} — schema and migrations are never changed without agreement (AGENTS.md rule 1). Escalate to ${owner.name}.`);
      continue;
    }
    if (team.dependencyFiles.includes(path)) {
      if (isOwner) warnings.push(`${path} — dependency change: if it is a native module, rebuild and redistribute the shared development build.`);
      else blocks.push(`${path} — dependency changes affect everyone's build. Escalate to ${owner.name} instead of committing it.`);
      continue;
    }

    const mod = moduleOfPath(team, path);
    if (mod) {
      const holder = team.members.find((m) => m.modules.includes(mod));
      if (me.modules.includes(mod)) {
        if (b.valid && b.module && b.module !== mod) warnings.push(`${path} — ${mod} work on a '${b.epic}' branch; each epic has its own branch.`);
        if (b.valid && b.shared) warnings.push(`${path} — module work on a shared branch; it belongs on your epic branch.`);
      } else if (b.valid && b.type === "fix" && b.module === mod) {
        warnings.push(`${path} — a fix in ${holder ? holder.id + "'s" : "an unassigned"} module on a fix/ branch: tell the owner before it merges.`);
      } else if (!holder) {
        blocks.push(`${path} — the '${mod}' module is not assigned to anyone in docs/workflow/team.json yet. Escalate to ${owner.name}.`);
      } else {
        blocks.push(`${path} — this is ${holder.id}'s module (AGENTS.md rule 2). If it needs a change, tell ${holder.id}.`);
      }
      continue;
    }

    if (team.mountFiles.includes(path)) {
      if (!isOwner) warnings.push(`${path} — only your module's import and app.use() mount line belong to you here.`);
      continue;
    }
    if (!isOwner) {
      blocks.push(`${path} — shared file, owned by ${owner.name}. Escalate the change you need instead of committing it.`);
    }
  }
}

// --- Added content ------------------------------------------------------------
const added = gitOr(["diff", "--cached", "-U0", "--no-color"]).split("\n");
let currentFile = "";
for (const line of added) {
  if (line.startsWith("+++ b/")) { currentFile = line.slice(6); continue; }
  if (!line.startsWith("+") || line.startsWith("+++")) continue;
  if (/-----BEGIN [A-Z ]*PRIVATE KEY-----|"private_key"\s*:/.test(line)) {
    blocks.push(`${currentFile} — contains private-key material. Never commit credentials.`);
  }
  if (!merging && currentFile.startsWith("mobile/src/") && /['"]#[0-9a-fA-F]{3,8}['"]/.test(line) && !/theme|tokens/.test(currentFile)) {
    warnings.push(`${currentFile} — raw hex colour; the prototype binds design tokens (docs/prototype/design-system.md §1).`);
  }
}

// --- Report -------------------------------------------------------------------
const unique = (xs) => [...new Set(xs)];
for (const w of unique(warnings)) console.error(paint.yellow(`pre-commit: warning — ${w}`));
if (blocks.length) {
  console.error(paint.red(paint.bold("\n✖ Commit blocked by the repository's local checks")));
  for (const x of unique(blocks)) console.error(`  • ${x}`);
  console.error("\n  Rules: AGENTS.md · CONTRIBUTING.md · docs/workflow/agent-protocol.md\n");
  process.exit(1);
}
process.exit(0);
