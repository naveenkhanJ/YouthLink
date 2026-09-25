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
 * Two things are always allowed, because the change is not yours to own:
 *   - in a merge commit, files exactly as one side of the merge has them
 *     (a file you edited while resolving the merge is checked like any other)
 *   - a file restored to exactly origin/develop's version, when every commit on
 *     this branch that touched it was yours — how an earlier edit to a shared
 *     file is taken back out of a branch. Someone else's change can't be undone
 *     this way, and neither can develop's own newer work via a stale fetch.
 *
 * Paths are read NUL-separated with renames split (--no-renames), so a move
 * is checked at both ends and unusual file names can't slip past.
 * Bypassable with --no-verify by design; see docs/workflow/agent-protocol.md.
 */
import { existsSync } from "node:fs";
import {
  git, gitOr, loadTeam, currentEmail, memberByEmail, currentBranch, parseBranch,
  moduleOfPath, isProtected, isNeverCommit, diffPaths, paint,
} from "../lib/common.mjs";

const gitPathExists = (name) => existsSync(git(["rev-parse", "--git-path", name]));
const rebasing = gitPathExists("rebase-merge") || gitPathExists("rebase-apply");

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
const merging = gitPathExists("MERGE_HEAD");

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
  if (!rebasing) warnings.push("HEAD is detached — commits here belong to no branch. Switch to your epic branch.");
} else if (!b.valid) {
  blocks.push(`branch '${branch}': ${b.reason}.`);
} else if (me && b.owner !== me.id) {
  blocks.push(`branch '${branch}' belongs to '${b.owner}', not you (${me.id}). Work on your own branch.`);
}

// --- What -------------------------------------------------------------------
const staged = diffPaths(["--cached", "--diff-filter=ACMRDT"]);

for (const path of staged) {
  if (isNeverCommit(team, path)) {
    blocks.push(`${path} — secrets, local-only files and .worklog/ are never committed. Unstage it: git restore --staged "${path}"`);
  }
}

// Paths whose staged content differs from develop (one call, not one per file).
const hasDevelop = gitOr(["rev-parse", "--verify", "--quiet", "origin/develop"]) !== "";
const differsFromDevelop = hasDevelop ? new Set(diffPaths(["--cached", "origin/develop"])) : null;
const stagedBlob = (path) => gitOr(["rev-parse", `:${path}`]);
const blobAt = (ref, path) => gitOr(["rev-parse", `${ref}:${path}`]);

/** Restoring develop's copy of a file only you had changed on this branch. */
function isOwnRestore(path) {
  if (!differsFromDevelop || differsFromDevelop.has(path)) return false;
  const authors = gitOr(["log", "origin/develop..HEAD", "--no-merges", "--format=%ae", "--", path])
    .split("\n").filter(Boolean).map((a) => a.toLowerCase());
  return authors.length > 0 && authors.every((a) => me.emails.map((e) => e.toLowerCase()).includes(a));
}

/** In a merge: taken unchanged from one side, so not an edit of yours. */
function isUnchangedMergeSide(path) {
  const s = stagedBlob(path);
  // "" on both sides of a comparison means "absent", so a deletion taken from develop counts too.
  return s === blobAt("HEAD", path) || s === blobAt("MERGE_HEAD", path);
}

if (me) {
  for (const path of staged) {
    if (isNeverCommit(team, path)) continue;
    if (merging && isUnchangedMergeSide(path)) continue;
    if (isOwnRestore(path)) continue;

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
        const sliceBranch = me.moduleBranches?.[mod] === b.epic; // e.g. notification work on the discovery-search branch
        if (b.valid && b.module && b.module !== mod && !sliceBranch) warnings.push(`${path} — ${mod} work on a '${b.epic}' branch; each epic has its own branch.`);
        if (b.valid && b.shared) warnings.push(`${path} — module work on a shared branch; it belongs on your epic branch.`);
      } else if (b.valid && b.type === "fix" && b.module === mod) {
        warnings.push(`${path} — a fix in ${holder ? holder.id + "'s" : "an unassigned"} module on a fix/ branch: agree it with the owner before it merges.`);
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
      blocks.push(`${path} — shared file, owned by ${owner.name}. Escalate the change you need instead of committing it. ` +
        `(To take out an earlier edit of yours: git checkout origin/develop -- "${path}", or git rm if develop has no such file.)`);
    }
  }
}

// --- Added content ------------------------------------------------------------
const added = gitOr(["-c", "core.quotePath=false", "diff", "--cached", "-U0", "--no-color", "--no-renames"]).split("\n");
let currentFile = "";
for (const line of added) {
  if (line.startsWith("+++ ")) { currentFile = line.replace(/^\+\+\+ (b\/)?/, ""); continue; }
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
  process.exitCode = 1;
}
