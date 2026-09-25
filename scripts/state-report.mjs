#!/usr/bin/env node
/**
 * State report — what the code actually contains, for the person running it.
 *
 *   node scripts/state-report.mjs            print the report
 *   node scripts/state-report.mjs --save     also save it to .worklog/state/
 *   node scripts/state-report.mjs --no-fetch skip `git fetch` (offline)
 *
 * Why it exists: Jira, progress notes, chat summaries and memory all drift.
 * The code does not. This script gathers the facts an agent (or you) needs
 * before continuing work — which files exist in your modules, which routes and
 * screens are wired, which requirements the code mentions, what is on develop
 * versus only on your branch, and what changed on develop since you last
 * looked. It does NOT decide whether an acceptance criterion is met; that
 * takes reading the code it points to. See docs/workflow/agent-protocol.md.
 *
 * Read-only apart from `git fetch` and, with --save, one file under the
 * git-ignored .worklog/ folder. It never commits, pushes or switches branches.
 */
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, mkdirSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import {
  git, gitOr, repoRoot, loadTeam, currentEmail, memberByEmail, currentBranch, parseBranch, today,
} from "./lib/common.mjs";
import { loadRequirements, loadScreenIndex } from "./lib/spec.mjs";

const args = process.argv.slice(2);
const SAVE = args.includes("--save");
const FETCH = !args.includes("--no-fetch");

const root = repoRoot();
process.chdir(root);
const team = loadTeam(root);
const now = today(team);
const out = [];
const say = (s = "") => out.push(s);

// ---------------------------------------------------------------- helpers ---
const DEVELOP = "origin/develop";
const short = (sha) => (sha || "").slice(0, 7);
const stripComments = (src) =>
  src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:"'`])\/\/.*$/gm, "$1");
const meaningfulLines = (src) => stripComments(src).split("\n").filter((l) => l.trim() !== "").length;
const unique = (xs) => [...new Set(xs)];
const idsIn = (src) => unique(src.match(/\b(?:FR|NFR)-[A-Z]+-\d+\b/g) || []);

/** Concrete path patterns for a module (directories end with "/"). */
const pathsFor = (mod) => team.modulePaths.map((p) => p.replace("<module>", mod));

/** Files of a module at a git ref (committed state). */
function filesAtRef(ref, mod) {
  const listed = gitOr(["ls-tree", "-r", "--name-only", ref, "--", ...pathsFor(mod)]).split("\n").filter(Boolean);
  return listed.filter((f) => /\.(m?js|jsx|ts|tsx|json)$/.test(f));
}
/** Files of a module in the working copy (tracked or untracked-but-not-ignored). */
function filesInWorkingCopy(mod) {
  const listed = gitOr(["ls-files", "--cached", "--others", "--exclude-standard", "--", ...pathsFor(mod)]).split("\n").filter(Boolean);
  return listed.filter((f) => existsSync(f) && /\.(m?js|jsx|ts|tsx|json)$/.test(f));
}
const readAtRef = (ref, path) => gitOr(["show", `${ref}:${path}`]);
const readWorking = (path) => readFileSync(path, "utf8").replace(/\r\n/g, "\n");

/** Express mount prefixes from app.js: import binding → "/api/…". */
function mountPrefixes(appSrc) {
  const imports = new Map();
  for (const m of appSrc.matchAll(/import\s+(\w+)\s+from\s+["']\.\/modules\/([^/]+)\/[^"']+["']/g)) imports.set(m[1], m[2]);
  const prefixes = new Map();
  for (const m of appSrc.matchAll(/app\.use\(\s*["']([^"']+)["']\s*,\s*(\w+)\s*\)/g)) {
    if (imports.has(m[2])) prefixes.set(imports.get(m[2]), m[1]);
  }
  return prefixes;
}

/** Route lines from a *.routes.js file. */
function routesIn(src) {
  const code = stripComments(src);
  const globalAuth = /router\.use\(\s*requireAuth\b/.test(code);
  const routes = [];
  for (const m of code.matchAll(/router\.(get|post|put|patch|delete)\(\s*(['"`])([^'"`]*)\2\s*,([\s\S]*?)\)\s*;/g)) {
    const handlers = m[4].replace(/\s+/g, " ").trim();
    routes.push({ method: m[1].toUpperCase(), path: m[3], auth: globalAuth || /\brequireAuth\b/.test(handlers), handlers });
  }
  return routes;
}

/** Screen names registered in a module manifest. */
const screensIn = (src) => [...stripComments(src).matchAll(/name:\s*["'`]([A-Za-z0-9_]+)["'`]/g)].map((m) => m[1]);

/** Prisma model accessors used in code, e.g. prisma.gigPosting.findMany → gigPosting. */
function prismaModelsIn(src) {
  const code = stripComments(src);
  const found = [...code.matchAll(/\b(?:prisma|tx|db)\.([a-z]\w*)\.(?:find\w*|create\w*|update\w*|delete\w*|upsert|count|aggregate|groupBy)\b/g)].map((m) => m[1]);
  return unique(found);
}

/** Analyse one module's files, given a reader. */
function analyse(files, reader) {
  const result = { files: [], routes: [], screens: [], ids: new Map(), models: [], hex: [], localKit: [] };
  for (const f of files) {
    const src = reader(f);
    const lines = meaningfulLines(src);
    // The scaffold's placeholders: an empty default export, or a routes file with no routes.
    const code = stripComments(src);
    const stub = lines <= 4 || /export default (\{\s*\}|\[\s*\]);/.test(code) ||
      (f.endsWith(".routes.js") && routesIn(src).length === 0);
    result.files.push({ path: f, lines, stub });
    if (f.endsWith(".routes.js")) result.routes.push(...routesIn(src).map((r) => ({ ...r, file: f })));
    if (f.endsWith(".screens.js")) result.screens.push(...screensIn(src));
    for (const id of idsIn(src)) result.ids.set(id, [...(result.ids.get(id) || []), f]);
    result.models.push(...prismaModelsIn(src));
    const hex = (src.match(/['"]#[0-9a-fA-F]{3,8}['"]/g) || []).length;
    if (hex && f.startsWith("mobile/")) result.hex.push({ path: f, count: hex });
    if (/\/(theme|components\/(Button|TextField))\.js$/.test(f) && f.startsWith("mobile/src/screens/")) result.localKit.push(f);
  }
  result.models = unique(result.models);
  return result;
}

/** FR-tagged feat/fix commits touching a module, in a revision range. */
function taggedCommits(range, mod) {
  const log = gitOr(["log", range, "--no-merges", "--date=short", "--format=%h%x09%ad%x09%an%x09%s", "--", ...pathsFor(mod)]);
  return log.split("\n").filter(Boolean).map((l) => {
    const [sha, date, author, subject] = l.split("\t");
    return { sha, date, author, subject, ids: idsIn(subject), featOrFix: /^(feat|fix)\(/.test(subject) };
  });
}

// -------------------------------------------------------- 1. who & where ---
let fetchNote = "skipped (--no-fetch)";
if (FETCH) {
  try {
    execFileSync("git", ["fetch", "--prune", "--quiet", "origin"], {
      stdio: ["ignore", "ignore", "pipe"], timeout: 90_000, env: { ...process.env, GIT_TERMINAL_PROMPT: "0" },
    });
    fetchNote = "fetched just now";
  } catch {
    const fh = gitOr(["rev-parse", "--git-path", "FETCH_HEAD"]);
    const when = fh && existsSync(fh) ? statSync(fh).mtime.toISOString().slice(0, 16).replace("T", " ") : "never";
    fetchNote = `FETCH FAILED — remote refs may be stale (last successful fetch: ${when} UTC)`;
  }
}

const email = currentEmail();
const me = memberByEmail(team, email);
const branch = currentBranch();
const b = parseBranch(team, branch);
const developSha = gitOr(["rev-parse", DEVELOP]);
const headSha = gitOr(["rev-parse", "HEAD"]);
const [behind, ahead] = developSha
  ? gitOr(["rev-list", "--left-right", "--count", `${DEVELOP}...HEAD`], "0\t0").split(/\s+/).map(Number)
  : [NaN, NaN];
const dirty = gitOr(["status", "--porcelain"]).split("\n").filter(Boolean).length;
const hooksPath = gitOr(["config", "--get", "core.hooksPath"]);

say(`# State report — ${me ? me.name : "UNKNOWN AUTHOR"} — ${now.date} (${now.weekday}) ${now.time} ${now.tz}`);
say();
say("Generated by `scripts/state-report.mjs`. **Facts, not verdicts:** this lists what the code contains. " +
    "Whether each acceptance criterion is met is decided by reading the code it points to — the Reconciliation " +
    "section at the end is for that. Code on `develop` outranks every other claim (docs/workflow/agent-protocol.md §2).");
say();
say("## 1. Identity and branch");
say();
say(`- **Git author:** ${gitOr(["config", "user.name"]) || "(unset)"} <${email || "unset"}> → ${me ? `**${me.id}** (${me.role})` : "**not in docs/workflow/team.json** — commits will be blocked and may not be attributed on GitHub"}`);
say(`- **Branch:** \`${branch || "(detached HEAD)"}\` — ${b.valid ? (me && b.owner !== me.id ? `**belongs to ${b.owner}, not you**` : `valid${b.reason ? ` (${b.reason})` : ""}`) : `**invalid: ${b.reason}**`}`);
say(`- **HEAD:** ${short(headSha)} · **develop:** ${short(developSha) || "(no origin/develop)"} (${fetchNote})`);
say(`- **This branch vs develop:** ${Number.isNaN(behind) ? "unknown" : `${behind} behind, ${ahead} ahead`}`);
say(`- **Uncommitted changes:** ${dirty} file(s)`);
say(`- **Hooks:** ${hooksPath === ".githooks" ? "installed" : "**NOT installed** — run `node scripts/install-hooks.mjs`"}`);
say();

// -------------------------------------------- 2. your branches on remote ---
const unmerged = []; // remote refs of yours carrying module files that develop does not have
if (me) {
  const remotes = gitOr(["for-each-ref", "refs/remotes/origin", "--format=%(refname:short)"]).split("\n")
    .filter((r) => r && r !== "origin/HEAD" && r !== "origin");
  const mine = remotes.filter((r) => {
    const name = r.replace(/^origin\//, "");
    const pb = parseBranch(team, name);
    return pb.owner === me.id || name.endsWith(`-${me.id}`);
  });
  say("## 2. Your branches on the remote");
  say();
  if (!mine.length) say("_None found._");
  else {
    say("| Branch | Behind develop | Ahead of develop (unmerged) | Files in your modules not on develop | Last commit | Status |");
    say("| --- | --- | --- | --- | --- | --- |");
    for (const r of mine) {
      const name = r.replace(/^origin\//, "");
      const [bh, ah] = gitOr(["rev-list", "--left-right", "--count", `${DEVELOP}...${r}`], "?\t?").split(/\s+/);
      const moduleDiff = me.modules.length
        ? gitOr(["diff", "--name-only", `${DEVELOP}...${r}`, "--", ...me.modules.flatMap(pathsFor)]).split("\n").filter(Boolean).length
        : 0;
      const last = gitOr(["log", "-1", "--date=short", "--format=%ad", r]);
      const pb = parseBranch(team, name);
      const ignored = me.ignoredBranches?.includes(name);
      const status = ignored ? "ignored (team.json)" : pb.valid ? (name === branch ? "current" : "valid") : `off-convention: ${pb.reason}`;
      say(`| \`${name}\` | ${bh} | ${ah} | ${moduleDiff} | ${last} | ${status} |`);
      if (moduleDiff > 0 && !ignored && name !== branch) unmerged.push(r);
    }
    if (unmerged.length) {
      say();
      say(`**Unmerged work in your modules exists on: ${unmerged.map((r) => `\`${r}\``).join(", ")}.** ` +
          "It is not on develop, so no card it covers meets DoD clause 2 yet. Section 4 summarises what it contains; " +
          "bringing it onto develop comes before new work (docs/workflow/agent-protocol.md §3).");
    }
  }
  say();
}

// ------------------------------------ 3. develop since your last report ---
const stateDir = join(root, ".worklog", "state");
let lastDevelop = "";
if (existsSync(stateDir)) {
  const reports = readdirSync(stateDir).filter((f) => f.endsWith(".md")).sort();
  const latest = reports.at(-1);
  if (latest) {
    const m = readFileSync(join(stateDir, latest), "utf8").match(/\*\*develop:\*\* ([0-9a-f]{7,40})/);
    if (m) lastDevelop = m[1];
  }
}
say("## 3. What changed on develop since your last saved report");
say();
if (!lastDevelop) {
  say("_No earlier saved report — first run. Treat everything as unread: read the documents for your cards in full._");
} else if (!gitOr(["cat-file", "-t", lastDevelop])) {
  say(`_Last report's develop commit ${lastDevelop} is not in this clone; cannot diff._`);
} else if (gitOr(["rev-parse", lastDevelop]) === developSha) {
  say(`_develop has not moved since your last report (${short(lastDevelop)})._`);
} else {
  const changed = gitOr(["diff", "--name-only", `${lastDevelop}..${DEVELOP}`]).split("\n").filter(Boolean);
  const myPaths = me ? me.modules.flatMap(pathsFor) : [];
  const buckets = {
    "Your modules": changed.filter((f) => myPaths.some((p) => (p.endsWith("/") ? f.startsWith(p) : f === p))),
    "Schema / migrations": changed.filter((f) => team.protectedPaths.some((p) => (p.endsWith("/") ? f.startsWith(p) : f === p))),
    "Dependencies": changed.filter((f) => team.dependencyFiles.includes(f)),
    "Shared contracts (middleware, lib, utils, config, api client, components, navigation, theme)": changed.filter((f) =>
      /^backend\/src\/(middleware|lib|utils|config)\/|^backend\/src\/app\.js$|^mobile\/src\/(api\/client\.js|components\/|navigation\/|config\/|theme\/)/.test(f)),
    "Workflow and rules (AGENTS.md, CONTRIBUTING.md, docs/workflow/, scripts/)": changed.filter((f) =>
      /^(AGENTS\.md|CONTRIBUTING\.md|docs\/workflow\/|scripts\/|\.githooks\/)/.test(f)),
    "Specification (requirements, prototype, schema doc, decisions)": changed.filter((f) =>
      /^docs\/(requirements|database-schema|decisions|product-overview)\.md$|^docs\/prototype\//.test(f)),
  };
  say(`develop moved ${short(lastDevelop)} → ${short(developSha)} (${changed.length} files).`);
  say();
  for (const [label, files] of Object.entries(buckets)) {
    if (!files.length) continue;
    say(`- **${label}:** ${files.slice(0, 12).map((f) => `\`${f}\``).join(", ")}${files.length > 12 ? ` … +${files.length - 12}` : ""}`);
  }
  const mustMerge = ["Your modules", "Schema / migrations", "Dependencies", "Shared contracts (middleware, lib, utils, config, api client, components, navigation, theme)", "Workflow and rules (AGENTS.md, CONTRIBUTING.md, docs/workflow/, scripts/)"]
    .filter((k) => buckets[k].length);
  say();
  say(mustMerge.length
    ? `**Merge develop into your branch before continuing** — it changed: ${mustMerge.join("; ")}. Re-read any changed rule or specification file that touches your cards.`
    : "Nothing that affects your work directly; merge develop when convenient. Re-read any changed specification entry for your cards.");
}
say();

// --------------------------------------------- 4. code per module ---
const requirements = loadRequirements(root);
const screenIndex = loadScreenIndex(root);
const schemaSrc = existsSync("backend/prisma/schema.prisma") ? readWorking("backend/prisma/schema.prisma") : "";
const schemaModels = new Set([...schemaSrc.matchAll(/^model (\w+) \{/gm)].map((m) => m[1][0].toLowerCase() + m[1].slice(1)));
const workingApp = existsSync("backend/src/app.js") ? readWorking("backend/src/app.js") : "";
const developApp = developSha ? readAtRef(DEVELOP, "backend/src/app.js") : "";

const scope = [];
if (me && me.modules.length) {
  say("## 4. Code in your modules");
  say();
  say("Two columns of truth: your **working copy** (this branch plus uncommitted changes) and **develop** (what the team has). " +
      "\"stub?\" means the scaffold placeholder is still there (empty export, no routes) — open it to confirm.");
  say();
  for (const mod of me.modules) {
    const work = analyse(filesInWorkingCopy(mod), readWorking);
    const dev = developSha ? analyse(filesAtRef(DEVELOP, mod), (p) => readAtRef(DEVELOP, p)) : analyse([], () => "");
    const devByPath = new Map(dev.files.map((f) => [f.path, f]));
    const workPaths = new Set(work.files.map((f) => f.path));

    say(`### Module \`${mod}\` — epic ${team.modules[mod]?.epic || "?"}`);
    say();
    say("| File | Working copy (lines) | develop (lines) |");
    say("| --- | --- | --- |");
    const all = unique([...work.files.map((f) => f.path), ...dev.files.map((f) => f.path)]).sort();
    for (const p of all) {
      const w = work.files.find((f) => f.path === p);
      const d = devByPath.get(p);
      const cell = (x) => (x ? `${x.lines}${x.stub ? " stub?" : ""}` : "—");
      say(`| \`${p}\` | ${cell(w)} | ${cell(d)} |`);
    }
    if (!all.length) say("| _(no files)_ | | |");
    say();

    const prefixW = mountPrefixes(workingApp).get(mod) || "(not mounted in app.js)";
    const prefixD = mountPrefixes(developApp).get(mod) || "(not mounted in app.js)";
    say(`**Backend routes** — working copy (mounted at \`${prefixW}\`):`);
    if (!work.routes.length) say("- _none_");
    for (const r of work.routes) say(`- \`${r.method} ${prefixW}${r.path === "/" ? "" : r.path}\` — auth: ${r.auth ? "requireAuth" : "**none**"} — ${r.handlers.slice(0, 90)}`);
    if (prefixD !== prefixW || JSON.stringify(dev.routes.map((r) => r.method + r.path)) !== JSON.stringify(work.routes.map((r) => r.method + r.path))) {
      say(`- develop has: ${dev.routes.length ? dev.routes.map((r) => `\`${r.method} ${prefixD}${r.path === "/" ? "" : r.path}\`${r.auth ? "" : " (no auth)"}`).join(", ") : "_none_"}`);
    }
    say();
    say(`**Mobile screens registered** — working copy: ${work.screens.length ? work.screens.map((s) => `\`${s}\``).join(", ") : "_none_"}` +
        ` · develop: ${dev.screens.length ? dev.screens.map((s) => `\`${s}\``).join(", ") : "_none_"}`);
    say();
    const missingModels = work.models.filter((m) => !schemaModels.has(m));
    say(`**Prisma models used:** ${work.models.length ? work.models.map((m) => `\`${m}\``).join(", ") : "_none_"}` +
        (missingModels.length ? ` — **not in schema.prisma: ${missingModels.join(", ")}** (schema drift)` : ""));
    if (work.hex.length) say(`**Raw hex colours (UI conformance):** ${work.hex.map((h) => `\`${h.path}\` ×${h.count}`).join(", ")}`);
    if (work.localKit.length) say(`**Module-local theme/components (move to the shared kit when it lands):** ${work.localKit.map((f) => `\`${f}\``).join(", ")}`);
    for (const ref of unmerged) {
      const other = analyse(filesAtRef(ref, mod), (p) => readAtRef(ref, p));
      if (!other.files.length) continue;
      const realFiles = other.files.filter((f) => !f.stub);
      say(`**On \`${ref}\` (unmerged):** ${realFiles.length} non-stub file(s); routes: ${other.routes.length ? other.routes.map((r) => `\`${r.method} ${r.path}\`${r.auth ? "" : " (no auth)"}`).join(", ") : "none"}; ` +
          `screens: ${other.screens.length ? other.screens.map((s) => `\`${s}\``).join(", ") : "none"}; ` +
          `requirement IDs in its code: ${[...other.ids.keys()].sort().join(", ") || "none"}` +
          `${other.models.filter((m) => !schemaModels.has(m)).length ? `; **models not in the current schema: ${other.models.filter((m) => !schemaModels.has(m)).join(", ")}**` : ""}.`);
    }
    const onlyHere = [...workPaths].filter((p) => !devByPath.has(p));
    if (onlyHere.length) say(`**Only in your working copy, not on develop:** ${onlyHere.length} file(s) — not Done until merged (DoD clause 2).`);
    say();

    const commitsDev = taggedCommits(DEVELOP, mod);
    const commitsBranch = developSha ? taggedCommits(`${DEVELOP}..HEAD`, mod) : [];
    say(`**Commits touching this module:** ${commitsDev.length} on develop, ${commitsBranch.length} on this branch only. ` +
        "Commit tags are a pointer, not evidence — a tag says what someone intended, the code says what exists.");
    say();

    for (const [id, r] of requirements) {
      const prefixes = team.modules[mod]?.requirements || [];
      if (!prefixes.some((p) => id.startsWith(p + "-"))) continue;
      scope.push({
        id, mod, title: r.title, priority: r.priority || "?", amended: r.amendments,
        inWork: (work.ids.get(id) || []).length, inDev: (dev.ids.get(id) || []).length,
        tagDev: commitsDev.some((c) => c.featOrFix && c.ids.includes(id)),
        tagBranch: commitsBranch.some((c) => c.featOrFix && c.ids.includes(id)),
        screens: (screenIndex.get(id) || []).reduce((n, g) => n + g.ids.length, 0),
      });
    }
  }
}

// ------------------------------------------- 5. requirements in scope ---
say("## 5. Requirements in your modules");
say();
if (!scope.length) {
  say(me ? "_No modules assigned to you in docs/workflow/team.json._" : "_Unknown author — set your git email first._");
} else {
  say("\"Mentioned\" = the requirement ID appears in the module's code (comments included). It is where to look, not proof. " +
      "Cards and sprint scope come from docs/module-ownership.md and Jira; this table covers the whole module.");
  say();
  say("| Requirement | Priority | Title | Amended | Mentioned (working / develop) | feat/fix tag (develop / branch) | Screens |");
  say("| --- | --- | --- | --- | --- | --- | --- |");
  for (const s of scope) {
    say(`| ${s.id} | ${s.priority} | ${s.title} | ${s.amended.join(", ") || "—"} | ${s.inWork ? "yes" : "no"} / ${s.inDev ? "yes" : "no"} | ${s.tagDev ? "yes" : "no"} / ${s.tagBranch ? "yes" : "no"} | ${s.screens || "—"} |`);
  }
}
say();

// --------------------------------------------- 6. for the agent to fill ---
say("## 6. Reconciliation — fill in before writing any code");
say();
say("For every requirement on your current and next cards: open the files above, check each acceptance criterion " +
    "against the code, and record the result. Status is one of: absent · stub · partial · implemented-unverified · implemented-verified-E2E. " +
    "Where: develop · this branch (unmerged) · another branch (reference only).");
say();
say("| Requirement | Status | Where | Evidence (file:line, route, screen) | Acceptance criteria (met / not met, each) | UI conformance (screen IDs checked) |");
say("| --- | --- | --- | --- | --- | --- |");
say("| | | | | | |");
say();
say("## 7. Discrepancies — claims the code does not support");
say();
say("Private to you. Record them so your own work starts from the truth; they are not reported to anyone.");
say();
say("| Claim | Source (Jira / progress file / docs / a person) | What the code shows | What you will do |");
say("| --- | --- | --- | --- |");
say("| | | | |");

const text = out.join("\n") + "\n";
process.stdout.write(text);

if (SAVE) {
  mkdirSync(stateDir, { recursive: true });
  const name = `${now.date}-${now.time.replace(":", "")}-develop-${short(developSha) || "none"}-head-${short(headSha)}.md`;
  writeFileSync(join(stateDir, name), text);
  console.error(`\nSaved: .worklog/state/${name}`);
}
