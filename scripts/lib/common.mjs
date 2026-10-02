/**
 * Shared helpers for the repository's local tooling: the git hooks in
 * .githooks/ and the scripts in scripts/. Node built-ins only, so nothing
 * needs installing at the repository root.
 *
 * Everything here reads; nothing here commits, pushes or switches branches.
 */
import { execFileSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

/** Run git and return trimmed stdout. Throws on a non-zero exit. */
export function git(args, options = {}) {
  return execFileSync("git", args, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    maxBuffer: 64 * 1024 * 1024,
    ...options,
  }).trim();
}

/** Run git and return stdout, or `fallback` if git fails (missing ref, no remote, ...). */
export function gitOr(args, fallback = "") {
  try {
    return git(args);
  } catch {
    return fallback;
  }
}

/** Absolute path of the repository root. */
export function repoRoot() {
  return git(["rev-parse", "--show-toplevel"]);
}

/** Load docs/workflow/team.json. Throws a readable error if it is missing or malformed. */
export function loadTeam(root = repoRoot()) {
  const file = join(root, "docs", "workflow", "team.json");
  if (!existsSync(file)) {
    throw new Error(`docs/workflow/team.json not found — merge develop into your branch first.`);
  }
  let team;
  try {
    team = JSON.parse(readFileSync(file, "utf8"));
  } catch (err) {
    throw new Error(`docs/workflow/team.json is not valid JSON: ${err.message}`);
  }
  // Fail with a readable message rather than a TypeError deep inside a hook.
  const arrays = ["members", "modulePaths", "mountFiles", "protectedPaths", "dependencyFiles", "neverCommit",
    "branchTypes", "commitTypes", "commitSurfaces", "integrationBranches"];
  const missing = arrays.filter((k) => !Array.isArray(team[k]));
  if (!team.modules || typeof team.modules !== "object") missing.push("modules");
  if (missing.length) throw new Error(`docs/workflow/team.json is missing or malformed: ${missing.join(", ")}`);
  return team;
}

/**
 * Paths from a `git diff --name-only`, NUL-separated so that spaces and
 * non-ASCII names arrive unquoted, with renames split into their two sides
 * (--no-renames) so the path a file came FROM is checked as well.
 */
export function diffPaths(args) {
  const out = gitOr(["-c", "core.quotePath=false", "diff", "--name-only", "--no-renames", "-z", ...args]);
  return out.split("\0").filter(Boolean);
}

/** Subjects git writes itself (merge, revert, reapply) — correct as they are. */
export function isGitGeneratedSubject(subject) {
  return /^Merge (branch|remote-tracking branch|pull request|commit|tag|branches) /.test(subject) ||
    /^(Revert|Reapply) "/.test(subject);
}

/** The configured git author email, lower-cased ("" if unset). */
export function currentEmail() {
  return gitOr(["config", "user.email"]).toLowerCase();
}

/** Find the team member whose listed emails include `email`, or null. */
export function memberByEmail(team, email) {
  const e = (email || "").toLowerCase();
  return team.members.find((m) => m.emails.some((x) => x.toLowerCase() === e)) || null;
}

/** Current branch name, or "" when HEAD is detached. */
export function currentBranch() {
  return gitOr(["symbolic-ref", "--quiet", "--short", "HEAD"]);
}

/**
 * Classify a branch name against the convention in CONTRIBUTING.md.
 * Returns { valid, type, epic, module, shared, area, owner, reason }.
 */
export function parseBranch(team, branch) {
  const result = { valid: false, type: null, epic: null, module: null, shared: false, area: null, owner: null, reason: "" };
  if (!branch) {
    result.reason = "HEAD is detached (no branch)";
    return result;
  }
  if (team.integrationBranches.includes(branch)) {
    result.reason = `'${branch}' is an integration branch — work never happens on it directly`;
    return result;
  }
  // Explicitly accepted legacy names belong to a named member.
  for (const m of team.members) {
    if ((m.acceptedBranches || []).includes(branch)) {
      const legacyEpic = Object.entries(team.modules).find(([, v]) => branch.includes(v.epic));
      return {
        ...result,
        valid: true,
        type: branch.split("/")[0],
        epic: legacyEpic ? legacyEpic[1].epic : null,
        module: legacyEpic ? legacyEpic[0] : null,
        shared: !legacyEpic,
        owner: m.id,
        reason: "accepted legacy name (listed in docs/workflow/team.json)",
      };
    }
    if ((m.ignoredBranches || []).includes(branch)) {
      result.reason = `'${branch}' is listed as ignored in docs/workflow/team.json (not a working branch)`;
      result.owner = m.id;
      return result;
    }
  }
  const match = branch.match(/^([a-z]+)\/(.+)-([a-z]+)$/);
  if (!match) {
    result.reason = "does not match <type>/<epic>-<yourname> or <type>/shared-<area>-<yourname>";
    return result;
  }
  const [, type, middle, owner] = match;
  if (!team.branchTypes.includes(type)) {
    result.reason = `type '${type}' is not one of ${team.branchTypes.join(", ")}`;
    return result;
  }
  if (!team.members.some((m) => m.id === owner)) {
    result.reason = `name '${owner}' is not a team member id (${team.members.map((m) => m.id).join(", ")})`;
    return result;
  }
  if (middle.startsWith("shared-")) {
    const area = middle.slice("shared-".length);
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(area)) {
      result.reason = "shared area must be lower-case words joined by hyphens";
      return result;
    }
    return { ...result, valid: true, type, shared: true, area, owner, reason: "" };
  }
  const mod = Object.entries(team.modules).find(([, v]) => v.epic === middle);
  if (!mod) {
    result.reason = `'${middle}' is not one of the thirteen epic segments in CONTRIBUTING.md`;
    return result;
  }
  return { ...result, valid: true, type, epic: middle, module: mod[0], owner, reason: "" };
}

/** Which module a path belongs to (by team.json's modulePaths), or null for shared paths. */
export function moduleOfPath(team, path) {
  const p = path.replace(/\\/g, "/");
  for (const mod of Object.keys(team.modules)) {
    for (const pattern of team.modulePaths) {
      const concrete = pattern.replace("<module>", mod);
      if (concrete.endsWith("/") ? p.startsWith(concrete) : p === concrete) return mod;
    }
  }
  return null;
}

/** True when `path` is under one of the protected (schema/migration) paths. */
export function isProtected(team, path) {
  return team.protectedPaths.some((pp) => (pp.endsWith("/") ? path.startsWith(pp) : path === pp));
}

/** True when `path` must never be committed (secrets, local-only files, worklog). */
export function isNeverCommit(team, path) {
  return team.neverCommit.some((re) => new RegExp(re).test(path));
}

/** Today's date and weekday in the team's timezone, from the system clock. */
export function today(team) {
  const tz = team?.timezone || "Asia/Colombo";
  const now = new Date();
  const date = new Intl.DateTimeFormat("en-CA", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
  const weekday = new Intl.DateTimeFormat("en-GB", { timeZone: tz, weekday: "short" }).format(now);
  const time = new Intl.DateTimeFormat("en-GB", { timeZone: tz, hour: "2-digit", minute: "2-digit", hour12: false }).format(now);
  return { date, weekday, time, tz };
}

/** Commit-subject convention from CONTRIBUTING.md, built from team.json's lists. */
export function commitSubjectRegex(team) {
  const types = team.commitTypes.join("|");
  const surfaces = team.commitSurfaces.join("|");
  const id = "(?:FR|NFR)-[A-Z]+-\\d+";
  return new RegExp(`^(${types})\\((${surfaces})\\): (\\S.*?)(?: \\[(${id}(?:, ${id})*)\\])?$`);
}

/** Terminal colour helpers that degrade to plain text when not on a TTY. */
const tty = process.stderr.isTTY;
export const paint = {
  red: (s) => (tty ? `\x1b[31m${s}\x1b[0m` : s),
  yellow: (s) => (tty ? `\x1b[33m${s}\x1b[0m` : s),
  green: (s) => (tty ? `\x1b[32m${s}\x1b[0m` : s),
  bold: (s) => (tty ? `\x1b[1m${s}\x1b[0m` : s),
};
