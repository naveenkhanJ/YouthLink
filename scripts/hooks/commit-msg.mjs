/**
 * commit-msg hook — checks the subject line against CONTRIBUTING.md:
 *
 *   <type>(<surface>): <description> [<FR-ID>, <FR-ID>]
 *
 * Blocks: a malformed subject, fixup!/squash! commits (we never squash).
 * Warns:  feat/fix with no requirement ID, a subject over 100 characters.
 * Allows: git's own merge and revert subjects, and any body or trailers.
 *
 * Installed by scripts/install-hooks.mjs. Deliberately bypassable with
 * `git commit --no-verify` — it is a convenience that catches mistakes,
 * not a security control.
 */
import { readFileSync } from "node:fs";
import { loadTeam, commitSubjectRegex, paint } from "../lib/common.mjs";

const file = process.argv[2];
if (!file) process.exit(0);

let team;
try {
  team = loadTeam();
} catch (err) {
  // Without team.json there is nothing to check against — never block on our own gap.
  console.error(paint.yellow(`commit-msg: skipped (${err.message})`));
  process.exit(0);
}

const lines = readFileSync(file, "utf8").split(/\r?\n/).filter((l) => !l.startsWith("#"));
const subject = (lines.find((l) => l.trim() !== "") || "").trim();

// Git-generated subjects that are correct as they are.
if (/^Merge (branch|remote-tracking branch|pull request|commit|tag) /.test(subject) || /^Revert "/.test(subject)) {
  process.exit(0);
}

const fail = (why, hint) => {
  console.error(paint.red(paint.bold("\n✖ Commit blocked — message does not follow CONTRIBUTING.md")));
  console.error(`  Subject: ${subject || "(empty)"}`);
  console.error(`  Problem: ${why}`);
  if (hint) console.error(`  ${hint}`);
  console.error(`  Format:  <type>(<surface>): <description> [<FR-ID>, <FR-ID>]`);
  console.error(`  Example: feat(backend): add posting creation endpoint [FR-POST-01]\n`);
  process.exit(1);
};

if (/^(fixup|squash|amend)! /.test(subject)) {
  fail("fixup!/squash! commits exist to be squashed later, and this repository never squashes.",
       "Write a normal commit instead — history records who built what.");
}

const match = subject.match(commitSubjectRegex(team));
if (!match) {
  const typeOk = new RegExp(`^(${team.commitTypes.join("|")})\\(`).test(subject);
  const surfaceHint = typeOk
    ? `Surface must be one of: ${team.commitSurfaces.join(", ")}. Requirement IDs go in square brackets at the end, comma-separated.`
    : `Type must be one of: ${team.commitTypes.join(", ")} (abbreviated 'feat', not 'feature').`;
  fail("the subject does not match the convention.", surfaceHint);
}

const [, type, , description, ids] = match;
if (/^[A-Z]/.test(description) && !/^[A-Z]{2,}/.test(description)) {
  console.error(paint.yellow(`commit-msg: note — descriptions start lower-case in this repo ("${description.slice(0, 30)}…").`));
}
if ((type === "feat" || type === "fix") && !ids) {
  console.error(paint.yellow("commit-msg: warning — a feat/fix commit usually implements a requirement. Add [FR-…] unless there genuinely is none."));
}
if (subject.length > 100) {
  console.error(paint.yellow(`commit-msg: warning — subject is ${subject.length} characters; keep it readable in git log.`));
}
process.exit(0);
