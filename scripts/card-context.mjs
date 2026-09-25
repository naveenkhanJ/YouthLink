#!/usr/bin/env node
/**
 * Card pack — everything one requirement needs, cut from the full documents.
 *
 *   node scripts/card-context.mjs FR-POST-04
 *   node scripts/card-context.mjs FR-APPLY-09 FR-POST-12 FR-POST-13   (several at once)
 *   node scripts/card-context.mjs FR-DISC-01 --no-screens            (requirement + schema only)
 *
 * Prints, verbatim:
 *   1. the full requirement entry from docs/requirements.md, amendments included
 *   2. every screen the prototype index maps to it, from docs/prototype/M*.md
 *   3. the design-system components and tokens those screens use
 *   4. the schema.prisma models and enums the requirement names
 *
 * Why: the specification is large (requirements.md alone is ~220 KB, M1 is
 * ~340 KB). Reading whole files overflows most AI tools' context, and a tool
 * that has summarised a document has lost the detail that matters. The pack is
 * the exact text, not a summary. Open whole files only when the pack points
 * outside itself. Jira cards are not read here; the requirement is the
 * specification (docs/workflow/agent-protocol.md §2).
 */
import { repoRoot } from "./lib/common.mjs";
import { loadRequirements, loadScreenIndex, findScreenBlock, loadSchemaBlocks } from "./lib/spec.mjs";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const args = process.argv.slice(2);
const ids = args.filter((a) => /^(FR|NFR)-[A-Z]+-\d+$/i.test(a)).map((a) => a.toUpperCase());
const NO_SCREENS = args.includes("--no-screens");

if (!ids.length) {
  console.error("Usage: node scripts/card-context.mjs <FR-ID> [<FR-ID> ...] [--no-screens]");
  console.error("A Jira card names its requirement in its title, e.g. \"[FR-POST-04] …\".");
  process.exit(2);
}

const root = repoRoot();
const requirements = loadRequirements(root);
const index = loadScreenIndex(root);
const schema = loadSchemaBlocks(root);
const designSystem = readFileSync(join(root, "docs", "prototype", "design-system.md"), "utf8").replace(/\r\n/g, "\n").split("\n");
const out = [];
const say = (s = "") => out.push(s);
let missing = 0;

for (const id of ids) {
  const r = requirements.get(id);
  say(`# Card pack — ${id}${r ? ` — ${r.title}` : ""}`);
  say();
  if (!r) {
    say(`**${id} is not in docs/requirements.md.** Check the ID on the card. Do not implement from the card text alone — escalate if the card names a requirement that does not exist.`);
    say();
    missing++;
    continue;
  }

  say("## 1. Requirement — verbatim from docs/requirements.md");
  say();
  say(`Priority: **${r.priority || "?"}** · Amendments: ${r.amendments.length ? r.amendments.join(", ") : "none"}. ` +
      "Amendment notes are part of the requirement; where one changes an acceptance criterion, the amendment wins.");
  say();
  say(r.text);
  say();
  const related = [...new Set((r.text.match(/\b(?:FR|NFR)-[A-Z]+-\d+\b/g) || []).filter((x) => x !== id))];
  if (related.length) {
    say(`**Named in this entry:** ${related.join(", ")}. If the text says to implement them together, or depends on their rule, run this script on them too.`);
    say();
  }

  const groups = index.get(id) || [];
  const screenIds = groups.flatMap((g) => g.ids.map((sid) => ({ sid, file: g.file })));
  say(`## 2. Screens — ${screenIds.length ? screenIds.map((s) => `\`${s.sid}\``).join(", ") : "none mapped"}`);
  say();
  if (!screenIds.length) {
    say("The prototype index maps no screen to this requirement. Check docs/prototype/README.md → \"Requirements with no interface\" for the ruling; backend-only work is expected in that case.");
    say();
  }
  const components = new Map();
  const tokens = new Map();
  if (!NO_SCREENS) {
    say("Each block is the specification of one screen: node tree, components, tokens, exact copy, and where it leads. " +
        "How to read a block: docs/prototype/README.md → \"How to read a screen\". Every drawn state here must be built; states that are not drawn are covered by design-system.md §8.");
    say();
    for (const { sid, file } of screenIds) {
      const block = findScreenBlock(root, sid, file);
      if (!block) {
        say(`### \`${sid}\` — **not found** in docs/prototype. Raise it: the index and the screen files disagree.`);
        say();
        continue;
      }
      say(`<!-- from docs/prototype/${block.file} -->`);
      say(block.text);
      say();
      for (const m of block.text.matchAll(/ of ([A-Za-z]+(?:\/[A-Za-z0-9 ]+)?)/g)) components.set(m[1].trim(), (components.get(m[1].trim()) || 0) + 1);
      for (const m of block.text.matchAll(/INSTANCE ([\w/]+) /g)) components.set(m[1], (components.get(m[1]) || 0) + 1);
      for (const m of block.text.matchAll(/\b((?:color|space|radius|elevation)\/[\w/-]+|(?:mobile|desktop)\/[\w-]+)\b/g)) tokens.set(m[1], (tokens.get(m[1]) || 0) + 1);
    }
  }

  if (!NO_SCREENS && (components.size || tokens.size)) {
    say("## 3. Design system — what these screens use");
    say();
    say("Build with these, by name. Definitions live in docs/prototype/design-system.md: §1 colour, §2 spacing and radius, §3 type, §4 effects, §5 components, §8 state coverage. " +
        "A raw hex value or an unnamed style in code is a conformance defect.");
    say();
    const compNames = [...components.keys()].filter((c) => /[A-Z]/.test(c[0]) || c.includes("/"));
    if (compNames.length) {
      say("**Components:**");
      for (const c of compNames.sort()) {
        const needle = c.includes("/") ? c : c;
        const hits = designSystem.map((l, i) => ({ l, i })).filter(({ l }) => l.includes(needle)).slice(0, 2);
        say(`- \`${c}\` ×${components.get(c)}${hits.length ? ` — design-system.md line ${hits.map((h) => h.i + 1).join(", ")}: ${hits[0].l.trim().slice(0, 140)}` : " — not named in design-system.md (layer name; check the `of …` component on the screen)"}`);
      }
      say();
    }
    if (tokens.size) {
      say(`**Tokens and text styles:** ${[...tokens.keys()].sort().map((t) => `\`${t}\``).join(", ")}`);
      say();
    }
  }

  // Models and enums named directly, plus the models that own any field the text names (`payAmount` → GigPosting).
  const words = [...new Set([...r.text.matchAll(/`(\w+)(?:\.(\w+))?(?: = \w+)?`/g)].flatMap((m) => [m[1], m[2]]).filter(Boolean))];
  const named = words.filter((n) => schema.has(n));
  const fieldOwners = new Map();
  for (const w of words.filter((x) => !schema.has(x) && /^[a-z]/.test(x))) {
    for (const [name, block] of schema) {
      if (block.kind === "model" && new RegExp(`^\\s+${w}\\s`, "m").test(block.text)) {
        fieldOwners.set(name, [...(fieldOwners.get(name) || []), w]);
      }
    }
  }
  for (const n of fieldOwners.keys()) if (!named.includes(n)) named.push(n);
  // The enums behind those fields (payKind → PayKind), since their values are the allowed inputs.
  for (const [model, fields] of fieldOwners) {
    for (const f of fields) {
      const type = schema.get(model).text.match(new RegExp(`^\\s+${f}\\s+(\\w+)`, "m"))?.[1];
      if (type && schema.get(type)?.kind === "enum" && !named.includes(type)) named.push(type);
    }
  }
  say(`## 4. Schema — ${named.length ? named.map((n) => `\`${n}\``).join(", ") : "no model or enum named in the requirement"}`);
  say();
  if (named.length) {
    say("From backend/prisma/schema.prisma (read-only for everyone but the schema owner — AGENTS.md rule 1). Field meanings: docs/database-schema.md.");
    say();
    say("```prisma");
    for (const n of named) {
      if (fieldOwners.has(n)) say(`// ${n} — owns ${fieldOwners.get(n).join(", ")}`);
      say(schema.get(n).text + "\n");
    }
    say("```");
  } else {
    say("Find the tables this touches in docs/database-schema.md before writing data access. Never add a model or field; escalate if one seems missing.");
  }
  say();
  say("## 5. Before writing code");
  say();
  say("- Quote every acceptance criterion above back, and say which the code already meets (from your State Report).");
  say("- List the screens and states you will build, by ID, and the components and tokens each uses.");
  say("- Name the files you will touch; all must be inside your module (docs/workflow/team.json).");
  say();
  say("---");
  say();
}

process.stdout.write(out.join("\n"));
process.exit(missing ? 1 : 0);
