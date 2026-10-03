/**
 * Points git at the repository's shared hooks (.githooks/) for this clone.
 *
 * Runs automatically from the "prepare" script in backend/, mobile/ and
 * dashboard/package.json, so `npm install` in any surface installs the hooks.
 * Safe to run by hand at any time:  node scripts/install-hooks.mjs
 *
 * It changes one local git setting (core.hooksPath) and nothing else, and it
 * never fails: npm install must not break because of it.
 */
import { existsSync } from "node:fs";
import { join } from "node:path";
import { execFileSync } from "node:child_process";

try {
  const root = execFileSync("git", ["rev-parse", "--show-toplevel"], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  if (!existsSync(join(root, ".githooks", "pre-commit"))) {
    process.exit(0); // not this repository, or the hooks are not on this branch yet
  }
  const current = (() => {
    try {
      return execFileSync("git", ["config", "--get", "core.hooksPath"], { encoding: "utf8", cwd: root }).trim();
    } catch {
      return "";
    }
  })();
  if (current !== ".githooks") {
    execFileSync("git", ["config", "core.hooksPath", ".githooks"], { cwd: root });
    console.log("YouthLink: git hooks installed (core.hooksPath = .githooks).");
  }
} catch {
  // No git, not a clone, or a read-only config: skip quietly.
}
process.exit(0);
