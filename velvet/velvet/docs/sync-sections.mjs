#!/usr/bin/env node
// Syncs everything that depends on the order of sections from ONE file: showcase/sections.json.
//   node docs/sync-sections.mjs          (run from the project root; --check = report only, write nothing)
// Rewrites:
//   components/bundle.js    line 1 `@ds-bundle` header: component order shown by the design-system page
//   components/<X>/preview.html  line 1 `group="…"` (the page's group name for the card)
//   showcase/cards.json     order, `path` and `group` of every Showcase card (name / subtitle / viewport are carried over)
//   docs/components.md      the whole file: sections, one table per source folder (deps, level, CSS, description), helpers
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';

const CHECK = process.argv.includes('--check');
const read = (p) => readFileSync(p, 'utf8');
const write = (p, t) => { if (!CHECK) writeFileSync(p, t); };
const kebab = (s) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
const warn = (m) => console.warn('! ' + m);
const changed = [];

const src = JSON.parse(read('showcase/sections.json'));
const norm = (it) => (typeof it === 'string' ? { name: it } : it);
const sections = src.sections.map((s) => ({ ...s, items: s.items.map(norm) }));

// ---- validation -----------------------------------------------------------
for (const s of sections) if (!s.blurb) warn(`section ${s.n} ${s.title} has no blurb (the Showcase shows it under the section title)`);
const seen = new Map();
for (const s of sections) for (const it of s.items) {
  if (seen.has(it.name)) warn(`duplicate item ${it.name} (sections ${seen.get(it.name)} and ${s.n})`);
  seen.set(it.name, s.n);
  if (it.card && !existsSync(it.card)) warn(`${it.name}: card file ${it.card} is missing`);
  if (!it.card && !existsSync(`components/${it.name}/preview.html`)) warn(`${it.name}: components/${it.name}/preview.html is missing`);
}
const IGNORE = new Set(['Cover', 'Showcase']);
for (const d of readdirSync('components', { withFileTypes: true })) {
  if (d.isDirectory() && existsSync(`components/${d.name}/preview.html`) && !seen.has(d.name) && !IGNORE.has(d.name))
    warn(`components/${d.name} has a preview but is in no section (leftover? delete it, or add it to sections.json)`);
}

// ---- 1. bundle.js header ---------------------------------------------------
{
  const text = read('components/bundle.js');
  const nl = text.indexOf('\n');
  const first = text.slice(0, nl);
  const m = /^\/\* @ds-bundle: (.*) \*\/$/.exec(first);
  if (!m) throw new Error('components/bundle.js line 1 is not an @ds-bundle header');
  const header = JSON.parse(m[1]);
  const byName = new Map(header.components.map((c) => [c.name, c]));
  const order = [];
  for (const s of sections) for (const it of s.items) {
    if (it.card) continue;                       // Showcase-only card, not a bundle export
    order.push(byName.get(it.name) ?? { name: it.name });
  }
  const next = '/* @ds-bundle: ' + JSON.stringify({ ...header, components: order }) + ' */';
  if (next !== first) { write('components/bundle.js', next + text.slice(nl)); changed.push('components/bundle.js (header order)'); }
}

// ---- 2. group= marker of every preview ------------------------------------
for (const s of sections) for (const it of s.items) {
  if (it.card) continue;
  const p = `components/${it.name}/preview.html`;
  if (!existsSync(p)) continue;
  const t = read(p);
  const nl = t.indexOf('\n');
  const line = t.slice(0, nl);
  if (!line.includes('@dsCard')) { warn(`${p}: line 1 is not an @dsCard marker`); continue; }
  if (line.slice(4, -3).includes('--')) warn(`${p}: the marker contains "--" inside the comment (e.g. a CSS variable in subtitle); the page then drops its group. Use a different character.`);
  const fixed = /group="[^"]*"/.test(line) ? line.replace(/group="[^"]*"/, `group="${s.group}"`) : line.replace('@dsCard', `@dsCard group="${s.group}"`);
  if (fixed !== line) { write(p, fixed + t.slice(nl)); changed.push(p); }
}

// ---- 3. showcase/cards.json ------------------------------------------------
{
  const old = JSON.parse(read('showcase/cards.json'));
  const key = (path) => path.startsWith('components/') ? path.split('/')[1]
    : [...seen.keys()].find((n) => kebab(n) === path.split('/').pop().replace(/\.html$/, ''));
  const meta = new Map(old.map((c) => [key(c.path), c]));
  const cards = [];
  for (const s of sections) for (const it of s.items) {
    if (it.showcase === false) continue;
    const path = it.card ?? `components/${it.name}/preview.html`;
    let m = meta.get(it.name);
    if (!m) {                                    // new card: derive captions from its @dsCard marker
      const line = existsSync(path) ? read(path).split('\n', 1)[0] : '';
      const h = /height=(\d+)/.exec(line)?.[1] ?? '300';
      const w = /width=(\d+)/.exec(line)?.[1] ?? '960';
      const sub = /subtitle="([^"]*)"/.exec(line)?.[1] ?? '';
      m = { name: it.name, subtitle: sub.replace(new RegExp('^' + it.name + ' — '), ''), viewport: `${w}x${h}` };
    }
    cards.push({ path, group: `${s.n} ${s.title}`, viewport: m.viewport, subtitle: m.subtitle, name: m.name });
  }
  const next = JSON.stringify(cards, null, 2) + '\n';
  if (next !== read('showcase/cards.json')) { write('showcase/cards.json', next); changed.push('showcase/cards.json'); }
}

// ---- 4. docs/components.md (fully generated) -----------------------------------
{
  const bundle = read('components/bundle.js');
  const header = JSON.parse(/^\/\* @ds-bundle: (.*) \*\/$/m.exec(bundle.split('\n', 1)[0])[1]);
  const isPublic = new Set(header.components.map((c) => c.name));

  // modules: marker line `// components/<folder>/<File>.jsx` up to the next marker
  const marks = [...bundle.matchAll(/^\/\/ ((?:components|assets|guidelines)\/[^\n]+\.jsx?)$/gm)].map((m) => ({ path: m[1], at: m.index }));
  const modules = new Map();
  marks.forEach((mk, i) => {
    const text = bundle.slice(mk.at, i + 1 < marks.length ? marks[i + 1].at : bundle.length);
    const exports = [];
    for (const m of text.matchAll(/Object\.assign\(__ds_scope,\s*\{([^}]*)\}\)/g))
      for (const part of m[1].split(',')) { const n = part.split(':')[0].trim(); if (n) exports.push(n); }
    modules.set(mk.path, { path: mk.path, text, exports: [...new Set(exports)] });
  });
  const definedIn = new Map();
  for (const mod of modules.values()) for (const e of mod.exports) definedIn.set(e, mod.path);

  const usesOf = (mod) => {
    const names = new Set([...mod.text.matchAll(/__ds_scope\.([A-Za-z_$][\w$]*)/g)].map((m) => m[1]));
    names.delete('cx');                                  // imported by nearly every module
    return [...names].filter((n) => definedIn.has(n) && definedIn.get(n) !== mod.path).sort();
  };
  const depsOf = new Map([...modules.values()].map((mod) => [mod.path, usesOf(mod)]));
  const levelMemo = new Map();
  const level = (path, stack = new Set()) => {
    if (levelMemo.has(path)) return levelMemo.get(path);
    if (stack.has(path)) return 0;
    stack.add(path);
    const ds = depsOf.get(path) ?? [];
    const lv = ds.length ? 1 + Math.max(...ds.map((d) => level(definedIn.get(d), stack))) : 0;
    stack.delete(path); levelMemo.set(path, lv); return lv;
  };
  const cssOf = (mod) => {
    const count = new Map();
    for (const m of mod.text.matchAll(/vui-[a-z0-9]+(?:-[a-z0-9]+)*/g)) count.set(m[0], (count.get(m[0]) ?? 0) + 1);
    const top = [...count].sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1)).slice(0, 2).map(([c]) => `.${c}*`);
    return top.length ? top.join(' ') : 'shared';
  };
  const summaryOf = (name) => {
    const p = `components/${name}/README.md`;
    if (!existsSync(p)) return '—';
    const first = read(p).trim().split('\n')[0].replace(/`/g, '').replace(/\|/g, '/');
    const sentence = first.match(/^.*?[.!?](?=\s|$)/)?.[0] ?? first;
    return sentence.length > 140 ? sentence.slice(0, 137).trimEnd() + '…' : sentence;
  };

  const rowsByFolder = new Map(), pages = [];
  let publicCount = 0;
  for (const sec of sections) for (const it of sec.items) {
    const mod = it.card ? undefined : modules.get(definedIn.get(it.name));
    if (!mod || !isPublic.has(it.name)) { pages.push([it, sec]); continue; }
    publicCount++;
    const folder = mod.path.split('/')[1];
    const also = mod.exports.filter((e) => e !== it.name && !/^[a-z]/.test(e) && !isPublic.has(e)).slice(0, 8);
    const row = { name: it.name, group: sec.group, mod: mod.path.replace(/^components\//, ''), lv: level(mod.path),
      deps: depsOf.get(mod.path).filter((d) => d !== it.name), also, css: cssOf(mod), desc: summaryOf(it.name) };
    if (!rowsByFolder.has(folder)) rowsByFolder.set(folder, []);
    rowsByFolder.get(folder).push(row);
  }

  const L = [];
  L.push('<!-- Generated by docs/sync-sections.mjs from components/bundle.js, components/<Name>/README.md and showcase/sections.json. Do not edit by hand. -->', '');
  L.push('# Components', '');
  L.push(`${publicCount} components with their own folder, preview and README, built from ${modules.size} source modules in \`components/bundle.js\`. This file is a map: what each component is built from, how deep its dependency chain is, which CSS block styles it. For props read its section in \`components/index.d.ts\`; for behaviour read its module in \`components/bundle.js\`.`, '');
  L.push('**Where things live.**');
  L.push('- **Behaviour and markup**: module `// components/<folder>/<File>.jsx` inside `components/bundle.js` (React, compiled from JSX to `React.createElement`; same DOM and class names). See `docs/AGENTS.md` §4 for a one-line extractor.');
  L.push('- **Props contract**: section `// <Name>/<Name>.d.ts` inside `components/index.d.ts` (JSDoc and `@default`s included).');
  L.push('- **Look**: component CSS is a block of `components/bundle.css`. The **CSS** column shows the most used `vui-*` classes of the module (`.vui-btn*` = every `.vui-btn…` selector); `shared` means no CSS of its own.');
  L.push('- **Specimens = acceptance tests**: `components/<Name>/preview.html`. First line: `<!-- @dsCard group="…" -->`.');
  L.push('- **Usage notes**: `components/<Name>/README.md`.', '');
  L.push('**Level** is the length of the longest dependency chain: 0 = depends on nothing, so port level 0 first, then 1, and so on. **Deps** are the components and helpers the module reads from the bundle (`cx` is omitted: nearly every module uses it). **Also exports** lists the parts the same module exports (sub-components without a folder of their own).', '');
  L.push('**Order in the Components view.** The page has no section headers: it lists components flat, in the order of the component list in line 1 of `components/bundle.js` (`@ds-bundle` header). That order, the sections below and the Showcase order are generated from `showcase/sections.json`. The `group=` marker of a preview is metadata only (it appears in `manifest.json` and the generated `api/` pages).', '');
  L.push('## Sections', '');
  for (const sec of sections) {
    const names = sec.items.filter((i) => !i.card).map((i) => i.name);
    if (names.length) L.push(`- **${sec.n} ${sec.title}** (\`${sec.group}\`) — ${names.join(', ')}`);
  }
  L.push('');
  const folders = [...rowsByFolder.keys()].sort((a, b) => (a === 'primitives' ? -1 : b === 'primitives' ? 1 : a < b ? -1 : 1));
  for (const folder of folders) {
    L.push(`## ${folder}`, '', '| Component | Group | Module | Level | Deps | CSS | Also exports | Description |', '| --- | --- | --- | --- | --- | --- | --- | --- |');
    for (const r of rowsByFolder.get(folder).sort((a, b) => a.lv - b.lv || (a.name < b.name ? -1 : 1)))
      L.push(`| **${r.name}** | ${r.group} | \`${r.mod}\` | ${r.lv} | ${r.deps.join(', ') || '—'} | ${r.css} | ${r.also.join(', ') || '—'} | ${r.desc} |`);
    L.push('');
  }
  const helpers = new Map();
  for (const h of header.unexposedExports ?? []) {
    const k = h.sourcePath ?? '?'; if (!helpers.has(k)) helpers.set(k, []); helpers.get(k).push(h.name);
  }
  L.push('## Helpers', '', 'Plain JavaScript exported by modules of the bundle but not part of its public API. Port them before the components that import them.', '', '| Module | Exports |', '| --- | --- |');
  for (const [k, v] of [...helpers].sort((a, b) => (a[0] < b[0] ? -1 : 1))) L.push(`| \`${k.replace(/^components\//, '')}\` | ${v.sort().join(', ')} |`);
  L.push('');
  L.push('## Previews that are not components', '', 'Foundation specimens (native previews in `components/`, flagged `page`) and Showcase-only cards (`showcase/cards/`). They are not bundle exports; do not port them.', '', '| Name | Section | Where |', '| --- | --- | --- |');
  for (const [it, sec] of pages)
    L.push(`| **${it.name}** | ${sec.n} ${sec.title} | ${it.card ? `\`${it.card}\` (Showcase only)` : `\`components/${it.name}/preview.html\``}${it.showcase === false ? ' (hidden in the Showcase)' : ''} |`);
  L.push('');

  const next = L.join('\n');
  const prev = existsSync('docs/components.md') ? read('docs/components.md') : '';
  if (next !== prev) { write('docs/components.md', next); changed.push('docs/components.md'); }
}

console.log(CHECK ? 'would change:' : 'changed:', changed.length ? '\n  ' + changed.join('\n  ') : 'nothing (already in sync)');
