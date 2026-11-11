# AGENTS.md: implement Velvet UI in any stack

You are implementing the **Velvet UI** design system (look and feel; the app, data and behaviour beyond the UI are not part of it). The system is already finished: CSS, tokens, a working React reference and live specimens. You **translate** it. You do not design anything new.

Reading order: this file → `README.md` (brand book: voice, colour, type, motion, iconography) → `docs/rules.md` (token, CSS and composition rules) → the component you are working on. Using SolidJS? Also read `docs/AGENTS-solid.md`.

## 1. Ground rules
1. The exported `project/` folder is **read-only**. Updating the design system later means replacing it.
2. **Source of truth, highest first:** component module in `components/bundle.js` (markup, classes, behaviour, a11y) → its section in `components/index.d.ts` (props, defaults in JSDoc) → `components/<Name>/preview.html` (how it must look and behave) → `components/<Name>/README.md` (when to use it, what it is built from) → `docs/rules.md` and the project `README.md`. When they disagree, the higher one wins. If something is missing, read the code. Never guess.
3. **The CSS is finished.** Do not write component CSS and do not change a class name, DOM nesting, `data-*` or `aria-*` attribute. Your component must output the same DOM as the React reference; that is what the CSS styles.
4. One component per task. Never generate a batch from memory.
5. No new props, no dropped props, no renamed props (framework spellings such as `className` → `class` aside), no new variants or tokens.
6. Do not port `showcase/` (it presents the library; it is not part of it).

## 2. What to use
- `tokens.json`: source of the tokens (colour light/dark, type roles, spacing, radius, sizes, z-index, blur…). `tokens.css` is generated from it and declares the fonts, so keep the folder layout (`fonts/…`).
- `components/bundle.css`: all component and element CSS, icon masks and the intent tokens built with `color-mix()`. Load it after `tokens.css`.
- `components/bundle.js`: the React reference, one classic script that assigns `window.VelvetUIDesignSystem_ee2bd8`. Line 1 is a JSON header (`@ds-bundle: {…}`) with the component list (page order) and a `sourceHashes` map. Below it, one module per source file, each starting with a marker line `// components/<folder>/<Name>.jsx`.
- `components/index.d.ts`: props contracts, one section per component starting with `// <Name>/<Name>.d.ts`.
- `components/<Name>/preview.html`: live specimens. They are the **acceptance tests**: your component must reproduce them.
- `docs/components.md`: map of components with dependencies, CSS block and group. Use it to plan order, not as a spec.
- `assets/icons/*.svg`: raw icon sources for native or non-web targets. On the web icons render through `Glyph` (CSS masks), so you rarely need these.
- Ignore: `showcase/`, `SKILL.md`, `design-system.json`, `artifact-type/`, `index.html`, `manifest.json`, `api/` (design-tool and browsing files).

## 3. Targets
- **Plain HTML / any templating:** load `tokens.css` and `components/bundle.css`, set `data-theme="light|dark"` (and `data-density="compact"` on any subtree) and use the `vui-*` classes. Example: `<button class="vui-btn vui-btn--primary">Save</button>`.
- **React:** use `components/bundle.js` as is, or ship its modules.
- **Solid, Vue, Svelte, Angular, web components:** re-implement each component's DOM, classes and attributes with the framework's own reactivity. The CSS stays untouched. Solid has a dedicated addendum (`docs/AGENTS-solid.md`, `docs/solid-porting.md`).
- **Native or other platforms:** take values from `tokens.json` and icons from `assets/icons/`; the CSS classes do not apply.

## 4. Reading a component
```bash
# module (replace the path; marker lines are in the bundle header and in docs/components.md)
node -e "const s=require('fs').readFileSync('components/bundle.js','utf8');const n='components/actions/Button.jsx';const i=s.indexOf('\n// '+n+'\n')+1;const m=s.slice(i).search(/\n\n\/\/ (components|assets|guidelines)\//);console.log(s.slice(i,m<0?undefined:i+m))"
# props contract
awk '/^\/\/ Button\/Button.d.ts/{f=1;print;next} f&&/^\/\/ [A-Za-z]+\/[A-Za-z]+\.d\.ts/{exit} f' components/index.d.ts
```
The module is JSX compiled to `React.createElement(tag, props, ...children)`: `className` is the CSS class, `__ds_scope.X` is another component of the system, `_extends(...)` is an object spread. One source file can export several components (`DatePicker.jsx` → `DatePicker`, `DateRangePicker`, `TimePicker`, …).

## 5. Conventions you must keep
- Value components take `value` / `defaultValue` / `onValueChange` (`onChange` stays as an alias). Sizes are `size="xs|sm|md|lg"`, colour intent is `tone`, glyphs are `icon` / `iconLeft` / `iconRight` (name or node).
- Compose from atoms (Surface, Field + Control, Option, Listbox, Text, Badge, Tag…) instead of re-declaring background, border, shadow or type. JSX renders components, never their internal classes. Details and the full table: `docs/rules.md`.
- Tokens: component CSS reads comp tokens first, sys tokens second, never ref tokens. Theme and density come from attributes, not from component props.
- State contract: default, hover, focus-visible, active, selected, disabled, loading, invalid, driven by classes and attributes the reference sets.

## 6. Order of work
1. Tokens and base: load `tokens.css`, `components/bundle.css`, set the theme attribute. Check the Theme switch card.
2. Helpers imported by many modules (`cx`, `helpers`, `date`, `tone`, `useDismiss`, `useSize`, `time`; see `docs/components.md`).
3. Atoms (`Surface`, `Glyph`, `Text`, `Field`, `Control`, `Option`, `Listbox`…), then actions, inputs, selection, overlays, data, patterns. `docs/components.md` lists dependencies so you can port leaves first.

## 7. Verification
For each component, render every specimen from its `preview.html` in your stack next to the reference and compare: same DOM (`outerHTML` with framework attributes stripped), same computed styles, same keyboard behaviour. If a specimen differs visually, your DOM, classes or attributes differ. Never "fix" it with CSS.

## 8. When stuck
- A prop's behaviour is unclear → read the module, then the preview section that demonstrates it.
- The reference looks wrong → port it as-is and note it as a design-system issue; do not improvise.
- You need a feature the system does not have → request it in the design system first.

## 9. Syncing changes
The system is edited elsewhere and re-exported. Replace the exported folder in its own commit, then compare the `sourceHashes` map in line 1 of `components/bundle.js` between the old and new export: a changed hash = that module changed, a new key = new component, a missing key = removed. Never patch from memory of what changed.
Sections and their order are defined once in `showcase/sections.json`; `node docs/sync-sections.mjs` propagates them. Do not edit the bundle header, `group=` markers or `showcase/cards.json` by hand.
