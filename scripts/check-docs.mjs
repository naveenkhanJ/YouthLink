#!/usr/bin/env node
/**
 * Documentation consistency check — keeps the docs from drifting apart.
 *
 *   node scripts/check-docs.mjs
 *
 * 1. Every relative Markdown link resolves: the file exists and, for #anchors
 *    into Markdown files, the heading exists (GitHub's anchor rules).
 * 2. The agent core block is identical in every file that carries a copy
 *    (AGENTS.md is the source; tools that cannot import it get a copy).
 * 3. AGENTS.md and docs/workflow/agent-protocol.md state the same protocol version.
 * 4. docs/workflow/team.json agrees with CONTRIBUTING.md's epic table, and
 *    every module it assigns exists.
 * 5. Every functional requirement in docs/requirements.md appears in the
 *    prototype's requirement index or its "no interface" table.
 *
 * Exits 1 on any failure. pr-check.mjs runs it whenever a PR touches docs.
 */
import { readFileSync, existsSync } from "node:fs";
import { join, dirname, normalize } from "node:path";
import { gitOr, repoRoot, loadTeam, paint } from "./lib/common.mjs";
import { loadRequirements } from "./lib/spec.mjs";

const root = repoRoot();
process.chdir(root);
const problems = [];
const read = (p) => readFileSync(p, "utf8").replace(/\r\n/g, "\n");

// GitHub heading → anchor: lower-case, drop punctuation (keep letters, digits, spaces, _ and -), spaces → "-".
const slug = (h) => h.trim().toLowerCase().replace(/<[^>]+>/g, "").replace(/[^\p{L}\p{N}\s_-]/gu, "").replace(/ /g, "-");
const anchorCache = new Map();
function anchorsOf(file) {
  if (anchorCache.has(file)) return anchorCache.get(file);
  const seen = new Map();
  const set = new Set();
  let fence = false;
  for (const line of read(file).split("\n")) {
    if (/^(```|~~~)/.test(line)) fence = !fence;
    if (fence) continue;
    const m = line.match(/^#{1,6} (.+?)\s*#*\s*$/);
    if (!m) continue;
    const base = slug(m[1]);
    const n = seen.get(base) || 0;
    set.add(n ? `${base}-${n}` : base);
    seen.set(base, n + 1);
  }
  anchorCache.set(file, set);
  return set;
}

// --- 1. links -------------------------------------------------------------------
const mdFiles = gitOr(["ls-files", "--cached", "--others", "--exclude-standard", "*.md", "*.mdc"]).split("\n").filter((f) => f && existsSync(f));
for (const file of mdFiles) {
  let fence = false;
  read(file).split("\n").forEach((line, i) => {
    if (/^(```|~~~)/.test(line)) fence = !fence;
    if (fence) return;
    const noCode = line.replace(/`[^`]*`/g, "");
    for (const m of noCode.matchAll(/\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)) {
      const target = m[1];
      if (/^(https?:|mailto:|tel:)/.test(target)) continue;
      const [pathPart, anchor] = target.split("#");
      const resolved = pathPart ? normalize(join(dirname(file), decodeURIComponent(pathPart))) : file;
      if (pathPart && !existsSync(resolved)) {
        problems.push(`${file}:${i + 1} — link to missing file: ${target}`);
        continue;
      }
      if (anchor && /\.mdc?$/.test(resolved) && !anchorsOf(resolved).has(anchor.toLowerCase())) {
        problems.push(`${file}:${i + 1} — link to missing heading: ${target}`);
      }
    }
  });
}

// --- 2. agent core block -----------------------------------------------------------
const CORE_FILES = ["AGENTS.md", "mobile/AGENTS.md", ".github/copilot-instructions.md", ".cursor/rules/youthlink.mdc", ".windsurf/rules/youthlink.md"];
const coreOf = (f) => {
  if (!existsSync(f)) return null;
  const m = read(f).match(/<!-- agent-core:start -->\n([\s\S]*?)\n<!-- agent-core:end -->/);
  return m ? m[1].trim() : undefined;
};
const source = coreOf("AGENTS.md");
if (!source) problems.push("AGENTS.md — agent core block (<!-- agent-core:start/end -->) not found.");
for (const f of CORE_FILES.slice(1)) {
  const c = coreOf(f);
  if (c === null) problems.push(`${f} — missing (it carries a copy of the agent core block for tools that do not read AGENTS.md).`);
  else if (c === undefined) problems.push(`${f} — agent core block markers not found.`);
  else if (source && c !== source) problems.push(`${f} — agent core block differs from AGENTS.md. Copy it again from AGENTS.md.`);
}

// --- 3. protocol version -----------------------------------------------------------
const version = (f) => (existsSync(f) ? read(f).match(/Protocol version (\d+)/)?.[1] : null);
const vAgents = version("AGENTS.md");
const vProtocol = version("docs/workflow/agent-protocol.md");
if (!vAgents || !vProtocol) problems.push("protocol version line (\"Protocol version N\") missing from AGENTS.md or docs/workflow/agent-protocol.md.");
else if (vAgents !== vProtocol) problems.push(`protocol version differs: AGENTS.md says ${vAgents}, agent-protocol.md says ${vProtocol}.`);

// --- 4. team.json vs CONTRIBUTING ---------------------------------------------------
const team = loadTeam(root);
const contributing = read("CONTRIBUTING.md");
for (const [mod, v] of Object.entries(team.modules)) {
  if (!contributing.includes(`\`${v.epic}\``)) problems.push(`team.json module '${mod}' → epic '${v.epic}' is not in CONTRIBUTING.md's epic table.`);
}
for (const m of team.members) {
  for (const mod of m.modules) if (!team.modules[mod]) problems.push(`team.json — ${m.id} owns unknown module '${mod}'.`);
}
const holders = new Map();
for (const m of team.members) for (const mod of m.modules) {
  if (holders.has(mod)) problems.push(`team.json — module '${mod}' is assigned to both ${holders.get(mod)} and ${m.id}; a module is never split.`);
  holders.set(mod, m.id);
}

// --- 5. every FR has a screen ruling --------------------------------------------------
const proto = existsSync("docs/prototype/README.md") ? read("docs/prototype/README.md") : "";
for (const id of loadRequirements(root).keys()) {
  if (!id.startsWith("FR-")) continue;
  if (!proto.includes(`\`${id}\``)) problems.push(`${id} — neither in the prototype requirement index nor in "Requirements with no interface".`);
}

// --- report -------------------------------------------------------------------
if (problems.length) {
  console.error(paint.red(paint.bold(`check-docs: ${problems.length} problem(s)`)));
  for (const p of problems) console.error(`  • ${p}`);
  process.exit(1);
}
console.log(paint.green(`check-docs: OK — ${mdFiles.length} Markdown files, links, core block, protocol version, team.json, prototype index.`));
