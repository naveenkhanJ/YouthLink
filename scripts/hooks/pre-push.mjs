/**
 * pre-push hook — the three pushes this repository never makes:
 *
 *   - to develop or main directly (work reaches them only through a pull request)
 *   - deleting a branch on the remote (epic branches are long-lived, never deleted)
 *   - a force push that rewrites history already on the remote
 *
 * Git passes one line per ref on stdin:
 *   <local ref> <local sha> <remote ref> <remote sha>
 *
 * Bypassable with --no-verify by design. The repository has no server-side
 * branch protection, so this and the team's own care are what keep
 * develop's history intact.
 */
import { readFileSync } from "node:fs";
import { loadTeam, gitOr, paint } from "../lib/common.mjs";

// Falls back to the two integration branches if team.json is not on this branch yet.
let team = { integrationBranches: ["develop", "main"] };
try {
  team = loadTeam();
} catch (err) {
  console.error(paint.yellow(`pre-push: using defaults (${err.message})`));
}

const ZERO = /^0+$/;
const input = readFileSync(0, "utf8").split("\n").filter(Boolean);
const blocks = [];

for (const line of input) {
  const [localRef, localSha, remoteRef, remoteSha] = line.split(" ");
  if (!remoteRef?.startsWith("refs/heads/")) continue; // tags and notes are not our concern
  const remoteBranch = remoteRef.slice("refs/heads/".length);

  if (ZERO.test(localSha)) {
    blocks.push(`deleting '${remoteBranch}' on the remote — branches are never deleted (CONTRIBUTING.md).`);
    continue;
  }
  if (team.integrationBranches.includes(remoteBranch)) {
    blocks.push(`pushing to '${remoteBranch}' — work reaches ${remoteBranch} only through a pull request.`);
    continue;
  }
  if (!ZERO.test(remoteSha)) {
    // Is what the remote has an ancestor of what we are sending? If not, this rewrites history.
    const known = gitOr(["cat-file", "-t", remoteSha]) === "commit";
    if (!known) {
      console.error(paint.yellow(`pre-push: warning — cannot check '${remoteBranch}' for a history rewrite (run git fetch first).`));
    } else if (gitOr(["merge-base", "--is-ancestor", remoteSha, localSha], "no") === "no") {
      blocks.push(`'${localRef}' → '${remoteBranch}' rewrites history already on the remote (force push). ` +
        `Merge instead: git fetch, then git merge origin/${remoteBranch}.`);
    }
  }
}

if (blocks.length) {
  console.error(paint.red(paint.bold("\n✖ Push blocked by the repository's local checks")));
  for (const x of blocks) console.error(`  • ${x}`);
  console.error("");
  process.exit(1);
}
process.exit(0);
