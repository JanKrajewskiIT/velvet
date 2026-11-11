# AGENTS-solid.md — build Velvet UI in SolidJS

> Solid-specific addendum to `docs/AGENTS.md` (the stack-neutral guide, read it first). Copy both to the root of the Solid repo. All paths below are relative to `velvet/`, the exported `project/` folder of the Velvet UI Design System.

You are porting the **Velvet UI** design system to **SolidJS + TypeScript**. The full design system is already in this repo at `velvet/`. It contains a working React reference implementation, the complete CSS, and live previews. You are **translating** existing code. You are not designing anything new.

## 0. Ground rules (read twice)
1. **`velvet/` is read-only.** Never edit, move, reformat or "fix" anything in it. Updating the DS later just means replacing that folder.
2. **Source of truth, in order of authority:** the component's module in `components/bundle.js` (markup, classes, behaviour, a11y) → its section in `components/index.d.ts` (props, defaults in JSDoc) → `components/<Name>/preview.html` (how it must look/behave) → `components/<Name>/README.md` (usage notes, when present) → `docs/*.md` (rules). When they disagree, the higher one wins. If something is missing from the docs, read the code. Never guess.
3. **The CSS is finished.** Do not write component CSS. Do not change a class name, DOM nesting, `data-*` or `aria-*` attribute. The Solid component must output **the same DOM as the React reference**. That is how the existing CSS styles it.
4. **One component per task.** Never generate a batch of components from memory or from the index. Open the module of the component you are porting and nothing else.
5. **No new props, no dropped props, no renamed props** (except `className` → `class`). No new variants or tokens. No "improvements".
6. **Do not port `velvet/showcase/`.** It is a browsing page for this system, not part of the library.

## 1. What is in `velvet/`
Use:
- `tokens.json`: the tokens (colour light/dark, type roles, spacing, radius, sizes, z-index, blur…). It is the source; **`tokens.css` is generated from it** (see below).
- `components/bundle.css`: all component and element CSS, the icon masks, and the intent tokens built with `color-mix()` that `tokens.json` cannot hold. It declares no `@font-face`: load `tokens.css` as well, which declares the fonts (`fonts/…` relative to it), so keep the folder layout.
- `components/bundle.js`: the React reference, one classic script that assigns `window.VelvetUIDesignSystem_ee2bd8`. Its first line is a JSON header (`@ds-bundle: {…}`) listing every component, its source path and a `sourceHashes` map. Below it, **one module per source file**, each starting with a marker line `// components/<folder>/<Name>.jsx`.
- `components/index.d.ts`: the props contracts, one section per component starting with `// <Name>/<Name>.d.ts`.
- `components/<Name>/preview.html` + `README.md`: live specimens (acceptance tests) and usage notes.
- `fonts/`: self-hosted woff2 (latin + latin-ext). `assets/icons/*.svg`: raw icon sources (components render icons through `Glyph`; you rarely need these).
- `guidelines/`: only the shared scaffold of the foundation cards (`card.css`, `card.js`, `theme-toggle.js`). Foundation specimens are previews in `components/` and, for pure scales, `showcase/cards/`. Visual reference only.
- `docs/components.md`: map of all components with deps, CSS block, preview and group. Use it to plan order and find things, not as a spec.
- `README.md` (the brand book: voice, look, theming, iconography), `docs/rules.md` (token, CSS and composition rules, which atom to use for what), `docs/solid-porting.md` (React → Solid translation, patterns, golden example), `docs/AGENTS-solid.md`: this file.

Ignore: `showcase/`, `guidelines/`, `SKILL.md`, `design-system.json`, `artifact-type/`, `index.html` (browsing pages and design-tool files).

**Reading a component.** Print its module and its types:
```bash
# module (replace the path; the marker lines are in the bundle header and in components.md)
node -e "const s=require('fs').readFileSync('velvet/components/bundle.js','utf8');const n='components/actions/Button.jsx';const i=s.indexOf('\n// '+n+'\n')+1;const m=s.slice(i).search(/\n\n\/\/ (components|assets|guidelines)\//);console.log(s.slice(i,m<0?undefined:i+m))"
# props contract
awk '/^\/\/ Button\/Button.d.ts/{f=1;print;next} f&&/^\/\/ [A-Za-z]+\/[A-Za-z]+\.d\.ts/{exit} f' velvet/components/index.d.ts
```
The module is JSX compiled to `React.createElement(tag, props, ...children)`: `className` is the CSS class, `__ds_scope.X` is another component of the system, `_extends(...)` is an object spread. Translate it back to JSX mentally; the DOM it produces is the contract. One source file can export several components (`DatePicker.jsx` → `DatePicker`, `DateRangePicker`, `TimePicker`, …): the `.tsx` exports the same set.

**Generating `tokens.css`.** The design-system page generates it from `tokens.json`. If your export has none, build it (this output is identical to what the previous release's stylesheet produced for all 945 custom properties in light, dark, compact and both trend-colour modes):
```js
// node build-tokens-css.mjs velvet/tokens.json > velvet/tokens.css
import { readFileSync } from 'node:fs';
const j = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const alias = (v) => String(v).replace(/\{([A-Za-z0-9_.-]+)\}/g, 'var(--$1)');
const light = [], dark = [];
const add = (name, v) => {
  if (v && typeof v === 'object') {
    if (v.light != null) light.push([name, alias(v.light)]);
    if (v.dark != null && v.dark !== v.light) dark.push([name, alias(v.dark)]);
  } else light.push([name, alias(v)]);
};
for (const t of j.color.tokens) add(t.name, t.value);
for (const k of ['spacing', 'radius', 'sizing', 'opacity', 'zIndex', 'blur', 'leading', 'tracking'])
  for (const t of j[k].tokens) add(t.name, t.value);
for (const [k, v] of Object.entries(j.type.families)) light.push([`font-${k}`, v]);
for (const g of j.type.groups) for (const s of g.styles) {
  const r = s.name.replace(/^t-/, ''), fam = `var(--font-${s.family ?? 'sans'})`, tr = s.letterSpacing ?? 'normal';
  light.push([`type-${r}-family`, fam], [`type-${r}-size`, s.fontSize], [`type-${r}-leading`, String(s.lineHeight)],
    [`type-${r}-weight`, String(s.fontWeight)], [`type-${r}-tracking`, tr],
    [`type-${r}`, `${s.fontWeight} ${s.fontSize}/${s.lineHeight} ${fam}`]);
}
const block = (sel, rows) => `${sel}{\n${rows.map(([n, v]) => `--${n}:${v};`).join('\n')}\n}\n`;
process.stdout.write(block(':root', light) + block('[data-theme="dark"]', dark));
```
`node build-tokens-css.mjs velvet/tokens.json > velvet/tokens.css`. Load `tokens.css` first, then `components/bundle.css`.

## 2. Target structure
```
velvet/                         ← exported DS, read-only
src/
  styles.ts                     ← import '../velvet/tokens.css'; import '../velvet/components/bundle.css'  (once, nothing else)
  components/<folder>/<n>.tsx  ← same <folder> names as the module paths in bundle.js
  components/<folder>/<helper>.ts ← ported helpers (cx, date, tone, useDismiss → createDismiss, useModal → createModal…)
  components/<folder>/index.ts
  index.ts                      ← re-exports every folder
specimens/<Name>.tsx            ← Solid copy of each section of velvet components/<Name>/preview.html
tests/visual/*.spec.ts          ← Playwright: reference preview vs Solid specimen
PORTING.md                      ← progress checklist (you maintain it)
```
- Keep the **folder** grouping from the module paths exactly (primitives, actions, forms, display, feedback, navigation, menus, data, charts, media, layout, patterns). Don't regroup.
- The design-system page groups components differently (**groups** such as Inputs, Selection, Pickers; listed in `docs/components.md`). Use them only for navigating the specimen app or Storybook, never for code folders.
- One `.tsx` per reference module. If a module exports several components, the `.tsx` exports the same set.

## 3. Setup (once, before any component)
1. Vite + `vite-plugin-solid`, TypeScript strict, `eslint-plugin-solid`, Playwright.
2. `src/styles.ts` imports `velvet/tokens.css` and `velvet/components/bundle.css`. Do not copy or split the CSS.
3. Port the helpers first (see `docs/solid-porting.md` §Helpers): `primitives/cx.js`, `helpers.js` (`normOption`, `escapeHtml`, `shouldFlipUp`), `date.js`, `tone.js`, `useDismiss.js`, `charts/useSize.js`, `media/time.js`, `display/recron-logo-paths.js`, `display/quantcore-logo-data.js`.
4. Write `createControllable` (controlled/uncontrolled value + `onChange`/`onValueChange` alias) as described in `docs/solid-porting.md`. Almost every input uses it.
5. Set up the verification harness (§5).
6. Generate `PORTING.md` from `docs/components.md`: one checkbox line per component, grouped by folder, sorted by the **Level** column (then by §4).

## 4. Order
**Dependencies decide the order, not folders.** A component can be ported only when every entry in its **Deps** column (`docs/components.md`) is ticked in `PORTING.md`; the **Level** column gives the same order (0 first). Folder order is just the default sequence among components that are ready:
`primitives` → `actions` → `forms` → `display` → `feedback` → `navigation` → `menus` → `data` → `charts` → `media` → `layout` → `patterns`.
Deps cross folders often (`Button` → `feedback/Spinner`, `MultiSelect` → `primitives/Tag`, `Navbar` → `menus/Menu`, `DataGrid` → `patterns/QueryBuilder`…). When generating `PORTING.md`, sort it topologically by Deps.
Start with `Glyph` (+`renderIcon`), `Spinner`, `Surface`, `Field`, `Control`, `Option`, `Button`.

## 5. Verification harness
Each `components/<Name>/preview.html` is a page body that expects the system to be preloaded: first line `<!-- @dsCard group="…" -->`, then stacked sections (`.vcard` with the original specimen title, mount points `#root-0`, `#root-1`…) and inline scripts with the exact content each specimen renders. To open one outside the design-system page, wrap it with the four things the page normally injects:
```js
// make-ref.mjs  →  node make-ref.mjs Button > ref/Button.html
import { readFileSync } from 'node:fs';
const name = process.argv[2], root = '../velvet';           // adjust to where ref/ is served from
const html = readFileSync(`velvet/components/${name}/preview.html`, 'utf8');
const head = `<link rel="stylesheet" href="${root}/tokens.css"><link rel="stylesheet" href="${root}/components/bundle.css">`
  + `<script src="https://unpkg.com/react@18.3.1/umd/react.development.js"></script>`
  + `<script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js"></script>`
  + `<script src="${root}/components/bundle.js"></script>`;
process.stdout.write(html.replace('<head>', '<head>' + head));
```
Serve the repo statically (`npx serve . -l 4100`) and open `http://localhost:4100/ref/Button.html`.

For every preview the component appears in (`components/<Name>/preview.html`, plus the previews of the components listed in the **Also exports** column or sharing its **Module**):
1. Create `specimens/<Name>.tsx` that renders **the same sections** with your Solid components: same props, labels, layout wrappers, same order. Copy the content from the preview's inline scripts and translate it. A preview can hold several specimens (`Button` has four); keep them all.
2. The specimen page uses the same frame as the preview: `tokens.css`, `components/bundle.css`, the `<style>` block from the preview's `<head>`, and the `.vcard` / `.vcard-t` wrappers. Skip React and `bundle.js`.
3. The Playwright test opens both URLs at the same viewport (width 960) and compares screenshots (`maxDiffPixelRatio` ≈ 0.01) in three modes: light, dark, compact. Dark = `document.documentElement.setAttribute('data-theme','dark')` **after load** (the previews have no theme script). Compact = `data-density="compact"` on `<html>`.
4. Make the comparison deterministic: inject `*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}`, freeze the clock (`page.clock.setFixedTime(...)`) and wait one frame. Known noise even between two renders of the same reference: `LogViewer` (live timestamps) and `Surface` in dark (two time-dependent states). Mask or skip those regions; they are not port bugs.
5. Behaviour test (Playwright, same for reference and port): Tab order, Enter/Space, arrows/Home/End/Esc where the module handles keys, focus return after close, `aria-*` values before/after interaction. Read the module's key handlers to know what to test.

## 6. Per-component procedure
1. Find it in `docs/components.md`. Confirm all Deps are done.
2. Read **in full**: its module in `bundle.js`, its section in `index.d.ts`, `README.md` (if any), each listed `preview.html`. Search `components/bundle.css` for the CSS column's class (e.g. `.vui-btn`) to learn which classes/modifiers exist.
3. Write `src/components/<folder>/<Name>.tsx`:
   - Props interface = the `index.d.ts` section translated (rules in `docs/solid-porting.md`). Keep JSDoc and `@default`s.
   - Markup = the module's render output, element for element, class for class.
   - Behaviour = every handler, effect, timer, keyboard branch and `aria-*` from the module.
   - Render other DS components through their Solid ports. Never inline their markup.
4. Export it from the folder's `index.ts`.
5. Build its specimen(s) and tests (§5). Fix until screenshots match in all three modes and the behaviour tests pass.
6. `tsc --noEmit` and `eslint` clean.
7. Tick it in `PORTING.md`, with a one-line note if anything deviates and why.

**Done means:** same DOM classes as the reference · all props from `index.d.ts` · all specimens match (light, dark, compact) · keyboard + aria parity · typecheck + lint clean · ticked in `PORTING.md`.

## 7. Solid non-negotiables
- Never destructure props. Use `splitProps` / `mergeProps`. Read props lazily inside JSX or `createMemo`.
- `<Show>` / `<For>` / `<Index>` / `<Switch>`, not `&&` / `.map()` with state.
- `class` / `classList`, `for`; style objects use kebab-case keys.
- Effects only for real side effects (DOM measure, listeners, timers), always with `onCleanup`.
- Portals via `<Portal>` from `solid-js/web`.
- Full mapping table and patterns (cloneElement triggers, Children, layout effects, forwardRef, context) are in `docs/solid-porting.md`.

## 8. Design rules you must not break
They are stack-neutral and live in `docs/rules.md` (section "Implementation rules" and the token and CSS rules). Already true in the CSS; don't undo them in TSX. In Solid specifically: inline `style` only for runtime geometry the reference also sets inline.

## 9. When stuck
- A prop's behaviour is unclear → read the module, then the preview section that demonstrates it.
- The specimen differs visually → your DOM/classes/attributes differ. Diff `outerHTML` of reference vs port (strip React/Solid-specific attributes). Never "fix" it with CSS.
- A React API has no obvious Solid equivalent → `docs/solid-porting.md` §Patterns. If still unclear, stop and ask. Do not improvise an API change.
- Something in `velvet/` looks wrong → note it in `PORTING.md` under "DS issues", port it as-is, and move on.

## 10. Syncing design-system changes
The DS is edited elsewhere and re-exported. Never patch `src/` from memory of what changed. Diff the reference.
1. Replace `velvet/` with the new export in its own commit: `chore(velvet): sync <date>`. Nothing else goes in that commit.
2. Find which components changed: compare the `sourceHashes` map in the first line of `components/bundle.js` between the old and new export. A changed hash = that source module changed; a new key = new component; a missing key = removed.
   ```bash
   node -e "const h=f=>JSON.parse(require('fs').readFileSync(f,'utf8').split('\n')[0].replace(/^.*@ds-bundle:/,'').replace(/\*\/\s*$/,'')).sourceHashes;const a=h(process.argv[1]),b=h(process.argv[2]);for(const k of new Set([...Object.keys(a),...Object.keys(b)]))if(a[k]!==b[k])console.log(a[k]?(b[k]?'changed':'removed'):'added',k)" old/components/bundle.js velvet/components/bundle.js
   ```
3. Handle each path:
   - `tokens.json`, `components/bundle.css`, `fonts/`, `assets/`: no code change (CSS is imported directly; regenerate `tokens.css`). Run the visual tests.
   - A module **changed**: diff that module between the two `bundle.js` files and apply **the same change** to the `.tsx` (markup, classes, props, behaviour). Don't re-port from scratch. If its section in `index.d.ts` changed, update the props too.
   - A module **added**: new component. Normal procedure (§6), add it to `PORTING.md` in dependency order.
   - A module **removed or renamed**: remove/rename in `src/`, its specimen and test, `index.ts`, `PORTING.md`. List the app call sites that break.
   - `components/<Name>/preview.html` changed: update the matching specimen, then run its visual test.
   - `docs/*.md` changed: reread them. A rule change may apply to already-ported components.
4. Run all visual + behaviour tests. A failure in a component you didn't touch means a shared dependency or CSS changed. Fix it via DOM/classes, never CSS.
5. Record in `PORTING.md`: `Last DS sync: <date>` + one line per affected component.
