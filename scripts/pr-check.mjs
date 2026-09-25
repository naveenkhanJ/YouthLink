#!/usr/bin/env node
/**
 * Pull-request self-check — run it on your branch before opening a PR.
 *
 *   node scripts/pr-check.mjs            (fetches first)
 *   node scripts/pr-check.mjs --no-fetch
 *
 * Checks the whole branch against develop, the way a reviewer would:
 * branch and author, whether develop is merged in, commit subjects, which
 * files the PR would change, and a few things worth a second look in the added
 * lines. Ends with the PR skeleton CONTRIBUTING.md asks for.
 *
 * The result is yours. Nothing is sent anywhere; share it or not as you like.
 * Read-only apart from `git fetch`.
 */
import { execFileSync } from "node:child_process";
import {
  gitOr, repoRoot, loadTeam, currentEmail, memberByEmail, currentBranch, parseBranch,
  moduleOfPath, isProtected, isNeverCommit, commitSubjectRegex, paint,
} from "./lib/common.mjs";

const FETCH = !process.argv.includes("--no-fetch");
const root = repoRoot();
process.chdir(root);
const team = loadTeam(root);
const DEVELOP = "origin/develop";

const results = []; // { level: "FAIL" | "WARN" | "OK", text }
const fail = (text) => results.push({ level: "FAIL", text });
const warn = (text) => results.push({ level: "WARN", text });
const ok = (text) => results.push({ level: "OK", text });

if (FETCH) {
  try {
    execFileSync("git", ["fetch", "--quiet", "origin"], { stdio: "ignore", timeout: 90_000, env: { ...process.env, GIT_TERMINAL_PROMPT: "0" } });
  } catch {
    warn("git fetch failed — develop may be newer than this check assumes.");
  }
}

// --- branch and author --------------------------------------------------------
const me = memberByEmail(team, currentEmail());
const owner = team.members.find((m) => m.role === "shared-owner");
const branch = currentBranch();
const b = parseBranch(team, branch);
if (!me) fail(`git user.email '${currentEmail()}' is not in docs/workflow/team.json.`);
if (!b.valid) fail(`branch '${branch || "(detached)"}': ${b.reason}.`);
else if (me && b.owner !== me.id) fail(`branch '${branch}' belongs to ${b.owner}.`);
else ok(`branch '${branch}' is yours and follows the convention.`);

// --- develop merged in? -------------------------------------------------------------
const [behind, ahead] = gitOr(["rev-list", "--left-right", "--count", `${DEVELOP}...HEAD`], "0\t0").split(/\s+/).map(Number);
if (ahead === 0) fail("nothing to open a PR for — this branch has no commits that develop lacks.");
if (behind > 0) fail(`develop has ${behind} commit(s) this branch lacks. Merge it in first (git merge origin/develop), re-run the app, then re-run this check.`);
else ok("develop is merged in.");
const dirty = gitOr(["status", "--porcelain"]).split("\n").filter(Boolean);
if (dirty.length) warn(`${dirty.length} uncommitted change(s) will not be in the PR.`);

// --- commits ------------------------------------------------------------------
const subjectRe = commitSubjectRegex(team);
const commits = gitOr(["log", `${DEVELOP}..HEAD`, "--no-merges", "--format=%h%x09%ae%x09%s"]).split("\n").filter(Boolean)
  .map((l) => { const [sha, email, subject] = l.split("\t"); return { sha, email, subject }; });
const badSubjects = commits.filter((c) => !subjectRe.test(c.subject));
if (badSubjects.length) {
  warn(`${badSubjects.length} commit subject(s) break the convention (history is not rewritten here; note it in the PR): ` +
    badSubjects.slice(0, 5).map((c) => `${c.sha} "${c.subject}"`).join("; "));
} else if (commits.length) ok(`${commits.length} commit subject(s) follow the convention.`);
const foreign = commits.filter((c) => me && !me.emails.includes(c.email.toLowerCase()));
if (foreign.length) warn(`${foreign.length} commit(s) authored by another address (${[...new Set(foreign.map((c) => c.email))].join(", ")}) — check attribution.`);
const ids = [...new Set(commits.flatMap((c) => c.subject.match(/\b(?:FR|NFR)-[A-Z]+-\d+\b/g) || []))].sort();

// --- files --------------------------------------------------------------------
const files = gitOr(["diff", "--name-only", `${DEVELOP}...HEAD`]).split("\n").filter(Boolean);
const isOwner = me?.role === "shared-owner";
for (const f of files) {
  if (isNeverCommit(team, f)) { fail(`${f} — secrets and local-only files never go into a PR.`); continue; }
  if (isProtected(team, f)) { (isOwner ? warn : fail)(`${f} — schema/migration change${isOwner ? ": affected teammates told first? (DoD clause 7)" : ` — only by agreement with ${owner.name}.`}`); continue; }
  if (team.dependencyFiles.includes(f)) { (isOwner ? warn : fail)(`${f} — dependency change${isOwner ? ": native? rebuild the shared development build." : ` — escalate to ${owner.name}.`}`); continue; }
  const mod = moduleOfPath(team, f);
  if (mod && me && !me.modules.includes(mod) && !(b.type === "fix" && b.module === mod)) {
    const holder = team.members.find((m) => m.modules.includes(mod));
    fail(`${f} — ${holder ? `${holder.id}'s module` : "an unassigned module"}.`);
  } else if (!mod && !isOwner && !team.mountFiles.includes(f)) {
    fail(`${f} — shared file (owned by ${owner.name}).`);
  }
}
ok(`${files.length} file(s) changed against develop.`);

// Documentation changes must leave links, the agent core block and team.json consistent.
if (files.some((f) => /\.(md|mdc)$/.test(f) || f === "docs/workflow/team.json")) {
  try {
    execFileSync("node", ["scripts/check-docs.mjs"], { stdio: "pipe" });
    ok("check-docs passed (links, agent core block, protocol version, team.json).");
  } catch (err) {
    fail(`check-docs found problems — run: node scripts/check-docs.mjs\n        ${String(err.stderr || "").trim().split("\n").slice(0, 6).join("\n        ")}`);
  }
}

// --- added lines --------------------------------------------------------------
const diff = gitOr(["diff", "-U0", "--no-color", `${DEVELOP}...HEAD`]).split("\n");
let file = "";
const notes = { hex: new Set(), todo: new Set(), log: new Set(), host: new Set() };
for (const line of diff) {
  if (line.startsWith("+++ b/")) { file = line.slice(6); continue; }
  if (!line.startsWith("+") || line.startsWith("+++")) continue;
  if (/-----BEGIN [A-Z ]*PRIVATE KEY-----|"private_key"\s*:/.test(line)) fail(`${file} — private-key material.`);
  if (!/^(backend|mobile|dashboard)\/src\//.test(file)) continue;
  if (/^\+\s*(\/\/|\*|\/\*)/.test(line)) continue; // comments explain; only code is checked below
  if (file.startsWith("mobile/src/") && /['"]#[0-9a-fA-F]{3,8}['"]/.test(line) && !/theme|tokens/.test(file)) notes.hex.add(file);
  if (/\b(TODO|FIXME|XXX|HACK)\b/.test(line)) notes.todo.add(file);
  if (/console\.log\(/.test(line)) notes.log.add(file);
  if (/\b(?:\d{1,3}\.){3}\d{1,3}\b|localhost:\d+/.test(line) && !/10\.0\.2\.2/.test(line)) notes.host.add(file);
}
if (notes.hex.size) warn(`raw hex colours (bind design tokens instead): ${[...notes.hex].join(", ")}`);
if (notes.todo.size) warn(`TODO/FIXME added — is something in the acceptance criteria being left for later? ${[...notes.todo].join(", ")}`);
if (notes.log.size) warn(`console.log added: ${[...notes.log].join(", ")}`);
if (notes.host.size) warn(`hard-coded IP or localhost address (use configuration): ${[...notes.host].join(", ")}`);

// --- report -------------------------------------------------------------------
const colour = { FAIL: paint.red, WARN: paint.yellow, OK: paint.green };
console.log(paint.bold(`\nPR self-check — ${branch} → develop\n`));
for (const r of results.sort((a, b2) => ["FAIL", "WARN", "OK"].indexOf(a.level) - ["FAIL", "WARN", "OK"].indexOf(b2.level))) {
  console.log(`${colour[r.level](r.level.padEnd(4))}  ${r.text}`);
}
const failed = results.some((r) => r.level === "FAIL");
console.log(`
${failed ? paint.red("Not ready: fix the FAIL lines first.") : paint.green("Ready to open, once the app has been run end to end (or the PR says it hasn't).")}

Pull request (CONTRIBUTING.md → Writing the pull request)
  Base: develop   ·   Merge with: "Create a merge commit" (never squash)   ·   Do not delete the branch afterwards
  Title: <type>(<surface>): <description>${ids.length ? ` [${ids.join(", ")}]` : ""}
  Body:
    **What and why** — one or two sentences. Requirements: ${ids.join(", ") || "(none tagged)"}
    **How to check it** — the screen to open, the endpoint to hit, the command to run
    **Anything to watch** — a trade-off, something that looks odd but isn't, a follow-up left for later
    **End to end** — self (screenshot attached) · integration (run on the shared build) · pending (not run yet)
`);
process.exit(failed ? 1 : 0);
