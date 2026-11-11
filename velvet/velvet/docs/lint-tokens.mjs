#!/usr/bin/env node
// Token lint (replaces the TokenLint card).
//   node docs/lint-tokens.mjs            run from the project root; exit code 1 on a violation
//   node docs/lint-tokens.mjs --px       also list the blocks with the most px literals
// 1. components/bundle.css: component CSS never reads ref tokens, has no colour literals except
//    where functional (colour-picker gradients), and its padding / margin / gap px literals sit on
//    the spacing scale (a --space-* value, or a multiple of 4). Other px literals are only tracked.
// 2. Specimens (components/*/preview.html, guidelines/card.css|js): no ref-token reads either, so
//    typography reads role parts and the weight intents, shadows read --elevation-*, colours read sys;
//    their padding / margin / gap values sit on the spacing scale too (CSS text and JS style objects).
//    Not scanned: showcase/cards/* (scale specimens whose subject IS a ref scale) and the files in
//    ALLOW_SPECIMENS below (empty).
import { readFileSync, readdirSync, existsSync } from 'node:fs';

const css = readFileSync('components/bundle.css', 'utf8');
const REF = /var\(--(velvet|neutral|success|warning|danger|info|hue|syntax|font-size|font-weight|dur|shadow)-[a-z0-9-]+/g;
const ALLOW_REF = ['var(--shadow-media'];
const ALLOW_COLOUR_BLOCKS = new Set(['ColorPicker']);
// Specimens that paint a ref value on purpose (none today).
const ALLOW_SPECIMENS = new Set([]);

const cut = css.lastIndexOf('/*', css.indexOf('.vui-surface'));
const blocks = css.slice(cut).split(/(?=^\/\*)/m);

// Spacing scale from tokens.json (px values); 0 and the half steps are included.
const scale = new Set(JSON.parse(readFileSync('tokens.json', 'utf8')).spacing.tokens
  .filter((t) => t.name.startsWith('space-')).map((t) => parseFloat(t.value)).filter((n) => Number.isFinite(n)));
const SPACING_PROP = /^(padding|margin|gap|row-gap|column-gap)(-[a-z]+)?$/;
const offGrid = [];

const refs = [], cols = [], px = [];
for (const b of blocks) {
  const m = b.match(/^\/\*\s*([^\u2014*\n]{2,40}?)\s*(?:\u2014|\*\/|\n)/);
  const name = m ? m[1] : '(unlabelled)';
  const t = b.replace(/\/\*[\s\S]*?\*\//g, '').replace(/@media[^{]+\{/g, '{');
  const r = [...new Set((t.match(REF) || []).filter((x) => !ALLOW_REF.some((a) => x.startsWith(a))).map((x) => x.slice(4)))];
  if (r.length) refs.push([name, r]);
  const c = t.match(/#[0-9a-f]{3,8}\b|\b(rgba?|hsla?|oklch)\(/gi) || [];
  if (c.length && !ALLOW_COLOUR_BLOCKS.has(name)) cols.push([name, c]);
  const n = (t.match(/[\s:(,]-?\d+(\.\d+)?px/g) || []).length;
  if (!/\.vui-ld-/.test(t)) px.push([name, n]);
  for (const rule of t.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const sel = rule[1].trim().split('\n').pop().trim();
    if (/\.vui-ld-/.test(sel)) continue;
    for (const decl of rule[2].split(';')) {
      const i = decl.indexOf(':');
      if (i < 0 || !SPACING_PROP.test(decl.slice(0, i).trim())) continue;
      const value = decl.slice(i + 1).replace(/(env|min|max|clamp|calc|var)\((?:[^()]|\([^()]*\))*\)/g, ' ');
      for (const [, n] of value.matchAll(/(?<![\w.-])(-?\d+(?:\.\d+)?)px/g)) {
        const x = Math.abs(parseFloat(n));
        if (!scale.has(x) && x % 4 !== 0) offGrid.push([name, sel, decl.trim()]);
      }
    }
  }
}

console.log(`blocks scanned: ${blocks.length}`);
console.log(`ref-token reads: ${refs.reduce((a, [, r]) => a + r.length, 0)}`);
for (const [n, r] of refs) console.log(`  ${n}: ${r.join(' ')}`);
console.log(`colour literals: ${cols.reduce((a, [, c]) => a + c.length, 0)}`);
for (const [n, c] of cols) console.log(`  ${n}: ${c.join(' ')}`);
console.log(`spacing off the grid: ${offGrid.length}`);
for (const [name, sel, d] of offGrid) console.log(`  ${name} ${sel}: ${d}`);
console.log(`px literals (excl. loaders): ${px.reduce((a, [, n]) => a + n, 0)}`);
if (process.argv.includes('--px'))
  for (const [n, v] of px.sort((a, b) => b[1] - a[1]).slice(0, 12)) console.log(`  ${n}: ${v}`);

const FN = /(env|min|max|clamp|calc|var)\((?:[^()]|\([^()]*\))*\)/g;
const onScale = (x) => scale.has(x) || x % 4 === 0;
const SP_CSS = /(?<![\w-])((?:padding|margin|gap|row-gap|column-gap)(?:-[a-z]+)?)(\s*:\s*)([^;}"'<]+)/g;
const SP_JSS = /(?<![\w-])((?:padding|margin|gap|rowGap|columnGap)(?:Left|Right|Top|Bottom|Inline|Block)?)(\s*:\s*)(['"])([^'"]*)\3/g;
const SP_JSN = /(?<![\w-])((?:padding|margin|gap|rowGap|columnGap)(?:Left|Right|Top|Bottom|Inline|Block)?)(\s*:\s*)(\d+(?:\.\d+)?)(\s*[,}])/g;
function specimenSpacing(text) {
  const out = [];
  const pxs = (v) => [...v.replace(FN, ' ').matchAll(/(?<![\w.-])(\d+(?:\.\d+)?)px/g)].map((m) => parseFloat(m[1]));
  for (const m of text.matchAll(SP_CSS)) if (pxs(m[3]).some((x) => !onScale(x))) out.push(`${m[1]}${m[2]}${m[3].trim()}`);
  for (const m of text.matchAll(SP_JSS)) if (pxs(m[4]).some((x) => !onScale(x))) out.push(`${m[1]}: '${m[4]}'`);
  for (const m of text.matchAll(SP_JSN)) if (!onScale(parseFloat(m[3]))) out.push(`${m[1]}: ${m[3]}`);
  return out;
}

const specimens = [
  ...readdirSync('components', { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => `components/${d.name}/preview.html`),
  'guidelines/card.css', 'guidelines/card.js',
].filter((f) => existsSync(f) && !ALLOW_SPECIMENS.has(f));
const specRefs = [], specSpacing = [];
for (const f of specimens) {
  const text = readFileSync(f, 'utf8');
  const r = [...new Set(text.match(REF) || [])].map((x) => x.slice(4));
  if (r.length) specRefs.push([f, r]);
  const sp = specimenSpacing(text);
  if (sp.length) specSpacing.push([f, sp]);
}
console.log(`specimens scanned: ${specimens.length}`);
console.log(`ref-token reads in specimens: ${specRefs.reduce((a, [, r]) => a + r.length, 0)}`);
for (const [f, r] of specRefs) console.log(`  ${f}: ${r.join(' ')}`);

console.log(`spacing off the grid in specimens: ${specSpacing.reduce((a, [, r]) => a + r.length, 0)}`);
for (const [f, r] of specSpacing) console.log(`  ${f}: ${[...new Set(r)].join(' | ')}`);

process.exit(refs.length || cols.length || offGrid.length || specRefs.length || specSpacing.length ? 1 : 0);
