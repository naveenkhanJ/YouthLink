/**
 * Readers for the specification documents, so scripts can print exactly the
 * part of a large document that a card needs instead of the whole file.
 *
 *   docs/requirements.md          requirement entries (#### FR-XXX-NN — Title)
 *   docs/prototype/README.md      the requirement → screen index
 *   docs/prototype/M*.md, MHF/MNAV screen blocks (### `1.4err2` — Title)
 *   backend/prisma/schema.prisma  model and enum blocks
 *
 * The documents stay the source of truth. If a parser here stops matching a
 * document's format, fix the parser, never the document to suit it.
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const read = (p) => readFileSync(p, "utf8").replace(/\r\n/g, "\n");

/** Map of requirement id → { id, title, priority, text, amendments: [dates] }. */
export function loadRequirements(root) {
  const lines = read(join(root, "docs", "requirements.md")).split("\n");
  const out = new Map();
  let current = null;
  const close = () => {
    if (!current) return;
    current.text = current.lines.join("\n").trimEnd();
    delete current.lines;
    out.set(current.id, current);
    current = null;
  };
  for (const line of lines) {
    const head = line.match(/^#### ((?:FR|NFR)-[A-Z]+-\d+) — (.+)$/);
    if (head) {
      close();
      current = { id: head[1], title: head[2].trim(), priority: null, amendments: [], lines: [line] };
      continue;
    }
    if (current && /^#{2,4} /.test(line)) {
      close();
      continue;
    }
    if (!current) continue;
    current.lines.push(line);
    if (!current.priority) {
      // FR tables are "| Actor(s) | Priority |", NFR tables just "| Priority |": take the last cell.
      const p = line.match(/^(?:\|.*)?\|\s*((?:Must|Should|Could|Won't)[^|]*?)\s*\|\s*$/);
      if (p) current.priority = p[1].trim();
    }
    const a = line.match(/^> \*\*Amended (\d{4}-\d{2}-\d{2})/);
    if (a) current.amendments.push(a[1]);
  }
  close();
  return out;
}

/** Map of requirement id → [{ file, ids: [screen ids] }] from the prototype README index. */
export function loadScreenIndex(root) {
  const file = join(root, "docs", "prototype", "README.md");
  const out = new Map();
  if (!existsSync(file)) return out;
  for (const line of read(file).split("\n")) {
    const row = line.match(/^\| `((?:FR|NFR)-[A-Z]+-\d+)` \|[^|]*\|[^|]*\| (.+) \|\s*$/);
    if (!row) continue;
    const groups = [];
    for (const seg of row[2].split(" · ")) {
      const f = seg.match(/\]\(([^)]+\.md)\)/);
      const ids = [...seg.matchAll(/`([^`]+)`/g)].map((m) => m[1]);
      if (f && ids.length) groups.push({ file: f[1], ids });
    }
    out.set(row[1], groups);
  }
  return out;
}

/** Every screen-spec file in docs/prototype (not README or design-system). */
function screenFiles(root) {
  const dir = join(root, "docs", "prototype");
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((f) => /^M.*\.md$/.test(f)).map((f) => join(dir, f));
}

/**
 * The full block for one screen id: from its `### \`id\` — …` heading to the
 * next ### or ## heading. Searches every screen file, because four screens are
 * documented on a neighbouring module's page (see the prototype README).
 */
export function findScreenBlock(root, id, preferFile) {
  const files = screenFiles(root);
  if (preferFile) files.sort((a, b) => Number(b.endsWith(preferFile)) - Number(a.endsWith(preferFile)));
  const heading = new RegExp("^### `" + id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "` — ");
  for (const f of files) {
    const lines = read(f).split("\n");
    const start = lines.findIndex((l) => heading.test(l));
    if (start === -1) continue;
    let end = lines.length;
    for (let i = start + 1; i < lines.length; i++) {
      if (/^#{2,3} /.test(lines[i])) { end = i; break; }
    }
    return { file: f.split(/[\\/]/).pop(), text: lines.slice(start, end).join("\n").trimEnd() };
  }
  return null;
}

/** Map of model/enum name → block text from schema.prisma. */
export function loadSchemaBlocks(root) {
  const file = join(root, "backend", "prisma", "schema.prisma");
  const out = new Map();
  if (!existsSync(file)) return out;
  const text = read(file);
  for (const m of text.matchAll(/^(model|enum) (\w+) \{[\s\S]*?^\}/gm)) {
    out.set(m[2], { kind: m[1], text: m[0] });
  }
  return out;
}
