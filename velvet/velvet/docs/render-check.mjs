#!/usr/bin/env node
// Render check: renders every exported component with a few fixed prop sets to static HTML and compares a hash of
// each result with docs/render-snapshot.json. It catches unintended changes of markup (classes, ids, aria, structure)
// after a refactor. It does not run effects, handle events or look at pixels — keep the preview.html specimens for that.
//
//   node docs/render-check.mjs                 compare with the snapshot (exit 1 on a difference)
//   node docs/render-check.mjs --update        rewrite the snapshot from the current bundle
//   node docs/render-check.mjs --html Select#1 print the HTML of one entry (name#prop-set)
//   node docs/render-check.mjs --bundle FILE   check another bundle.js (e.g. a previous version) against the snapshot
//
// Needs react and react-dom (18 or newer) resolvable from the working directory — the bundle does not pack them.
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

process.env.TZ = 'UTC';
const require = createRequire(process.cwd() + '/');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');

const here = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const flag = n => args.includes(n);
const opt = n => (args.includes(n) ? args[args.indexOf(n) + 1] : null);
const bundlePath = opt('--bundle') || path.join(here, '..', 'components', 'bundle.js');
const snapPath = path.join(here, 'render-snapshot.json');

// deterministic environment: fixed clock, no matchMedia, quiet console
const FIXED = new Date('2026-06-15T12:00:00Z').valueOf();
const RealDate = Date;
globalThis.Date = class extends RealDate {
  constructor(...a) { if (a.length === 0) super(FIXED); else super(...a); }
  static now() { return FIXED; }
};
globalThis.window = globalThis;
globalThis.React = React;
globalThis.ReactDOM = {};
globalThis.self = globalThis;
globalThis.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {} });
const realError = console.error, realWarn = console.warn;
console.error = () => {};
console.warn = () => {};

delete globalThis.VelvetUIDesignSystem_ee2bd8;
(0, eval)(fs.readFileSync(bundlePath, 'utf8'));
const ns = globalThis.VelvetUIDesignSystem_ee2bd8;
if (!ns) { console.error = realError; console.error('bundle did not define VelvetUIDesignSystem_ee2bd8'); process.exit(2); }

const options = [{ value: 'a', label: 'Alpha' }, { value: 'b', label: 'Beta' }];
const PROP_SETS = [
  {},
  { label: 'Label', hint: 'Hint', options, items: [{ id: 1, title: 't', label: 'l' }], children: 'x' },
  { label: 'Label', error: 'Error', options, items: [], children: 'x' },
  { label: 'Label', options, defaultOpen: true, defaultValue: 'a', children: 'x', title: 'Title', trigger: 'Open' },
];

const norm = html => {
  const map = {};
  let n = 0;
  return html.replace(/(_R_[A-Za-z0-9_]+_|[:«]r[0-9a-z]+[:»])/g, m => map[m] || (map[m] = 'ID' + n++));
};
const hash = s => crypto.createHash('sha1').update(s).digest('hex').slice(0, 12);

const html = {};
const entries = {};
for (const name of Object.keys(ns).sort()) {
  if (name.startsWith('__') || typeof ns[name] !== 'function' || !/^[A-Z]/.test(name)) continue;
  PROP_SETS.forEach((props, i) => {
    let out;
    try { out = norm(renderToStaticMarkup(React.createElement(ns[name], props))); }
    catch (e) { out = 'ERR ' + String(e.message).split('\n')[0]; }
    html[name + '#' + i] = out;
    entries[name + '#' + i] = hash(out);
  });
}
console.error = realError;
console.warn = realWarn;

if (opt('--html')) {
  const k = opt('--html');
  console.log(html[k] ?? 'no such entry: ' + k);
  process.exit(html[k] === undefined ? 2 : 0);
}
if (flag('--update')) {
  fs.writeFileSync(snapPath, JSON.stringify({ version: 1, count: Object.keys(entries).length, entries }, null, 0) + '\n');
  console.log('snapshot written:', Object.keys(entries).length, 'entries ->', path.relative(process.cwd(), snapPath));
  process.exit(0);
}
if (!fs.existsSync(snapPath)) { console.error('no snapshot yet — run with --update'); process.exit(2); }
const snap = JSON.parse(fs.readFileSync(snapPath, 'utf8')).entries;
const changed = Object.keys(entries).filter(k => k in snap && snap[k] !== entries[k]);
const added = Object.keys(entries).filter(k => !(k in snap));
const removed = Object.keys(snap).filter(k => !(k in entries));
const byName = {};
for (const k of changed) { const n = k.split('#')[0]; byName[n] = (byName[n] || 0) + 1; }
console.log(`entries: ${Object.keys(entries).length}  unchanged: ${Object.keys(entries).length - changed.length - added.length}  changed: ${changed.length}  new: ${added.length}  removed: ${removed.length}`);
if (changed.length) console.log('changed components:', Object.entries(byName).map(([n, c]) => `${n} (${c})`).join(', '), '\n  inspect one with: node docs/render-check.mjs --html <name#n>');
if (added.length) console.log('new entries:', added.slice(0, 12).join(', '), added.length > 12 ? '…' : '');
if (removed.length) console.log('removed entries:', removed.slice(0, 12).join(', '), removed.length > 12 ? '…' : '');
process.exit(changed.length || removed.length ? 1 : 0);
