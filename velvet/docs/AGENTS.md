# AGENTS.md — build Velvet UI in SolidJS

> Copy this file to the root of the Solid repo. All paths below are relative to `velvet/`.

You are porting the **Velvet UI** design system to **SolidJS + TypeScript**. The full design system is already in this repo at `velvet/` (downloaded as-is). It contains a working React reference implementation, the complete CSS, and visual specimens. You are **translating** existing code. You are not designing anything new.

## 0. Ground rules (read twice)
1. **`velvet/` is read-only.** Never edit, move, reformat or "fix" anything in it. Updating the DS later just means replacing that folder.
2. **Source of truth, in order of authority:** `<Name>.jsx` (markup, classes, behaviour, a11y) → `<Name>.d.ts` (props, defaults in JSDoc) → `*.card.html` (how it must look/behave) → `<Name>.prompt.md` (usage notes) → `velvet/docs/*.md` (rules). When they disagree, the higher one wins. If something is missing from the docs, read the code. Never guess.
3. **The CSS is finished.** Do not write component CSS. Do not change a class name, DOM nesting, `data-*` or `aria-*` attribute. The Solid component must output **the same DOM as the React reference**. That is how the existing CSS styles it.
4. **One component per task.** Never generate a batch of components from memory or from the index. Open the files of the component you are porting and nothing else.
5. **No new props, no dropped props, no renamed props** (except `className` → `class`). No new variants or tokens. No "improvements".
6. **Do not port `velvet/templates/`.** They are product screens in a design-tool format and out of scope.

## 1. What is in `velvet/`
Use:
- `styles.css`: the single CSS entry. It `@import`s `tokens/*` and every `components/**/*.css` in the correct cascade order. Fonts and icons resolve relative to it (icons are inline data URIs).
- `tokens/`, `fonts/`: imported by `styles.css`. Read the comments in `tokens/*.css` when you need a token's meaning.
- `components/<folder>/`: per component `<Name>.jsx`, `<Name>.d.ts`, CSS, `*.card.html`, optional `<Name>.prompt.md`. Also helpers (`*.js`).
- `docs/AGENTS.md`: this file.
- `docs/components.md`: map of all 183 components with deps, CSS, specimens and DS section. Use it to plan order and find files, not as a spec.
- `docs/foundations.md` (tokens, theming, hard rules, voice), `docs/composition.md` (which atom to use for what), `docs/solid-porting.md` (React → Solid translation, patterns, golden example).
- `assets/icons/*.svg`: raw icon sources (components render icons through `Glyph`; you rarely need these).
- `guidelines/*.html`: foundation specimens (colour, type, motion…). Visual reference only.

Ignore: `templates/`, `_ds_bundle.js`, `_ds_manifest.json`, `_adherence.oxlintrc.json`, `support.js`, `_sweep.html`, `thumbnail.html`, `styles.bundle.css`, `uploads/`, `readme.md`, `SKILL.md`, `CLAUDE.md` (`readme.md` is the design-tool overview; everything you need from it is in `docs/`). These belong to the design tool. (`_ds_bundle.js` and `styles.bundle.css` are still loaded by the reference specimens when you serve them. Just don't import them into the app.)

## 2. Target structure
```
velvet/                         ← downloaded DS, read-only
src/
  styles.ts                     ← import '../velvet/styles.css'  (once, nothing else)
  components/<folder>/<Name>.tsx  ← same <folder> names as velvet/components/
  components/<folder>/<helper>.ts ← ported helpers (cx, date, tone, useDismiss → createDismiss…)
  components/<folder>/index.ts
  index.ts                      ← re-exports every folder
specimens/<folder>/<card-name>.tsx ← Solid copy of each velvet *.card.html
tests/visual/*.spec.ts          ← Playwright: reference card vs Solid specimen
PORTING.md                      ← progress checklist (you maintain it)
```
- Keep the **folder** grouping from `velvet/components/` exactly (primitives, actions, forms, display, feedback, navigation, menus, data, charts, media, layout, patterns). Don't regroup.
- The design-system docs tab uses different, numbered **DS sections** (e.g. 16 Inputs, 17 Selection, 18 Pickers). They are listed in `docs/components.md`. Use them only for navigating the specimen app or Storybook, never for code folders.
- One `.tsx` per reference `.jsx`. If a `.jsx` exports several components (e.g. `DatePicker.jsx` → `DatePicker`, `DateRangePicker`, `TimePicker`, `DEFAULT_RANGE_PRESETS`, `parseTime`), the `.tsx` exports the same set.

## 3. Setup (once, before any component)
1. Vite + `vite-plugin-solid`, TypeScript strict, `eslint-plugin-solid`, Playwright.
2. `src/styles.ts` imports `velvet/styles.css`. Do not copy or split the CSS.
3. Port the helpers first (see `docs/solid-porting.md` §Helpers): `primitives/cx.js`, `date.js`, `tone.js`, `useDismiss.js`, `charts/useSize.js`, `media/time.js`, `display/recron-logo-paths.js`.
4. Write `createControllable` (controlled/uncontrolled value + `onChange`/`onValueChange` alias) as described in `docs/solid-porting.md`. Almost every input uses it.
5. Set up the verification harness (§5).
6. Generate `PORTING.md` from `docs/components.md`: one checkbox line per component, grouped by folder, in the order from §4.

## 4. Order
**Dependencies decide the order, not folders.** A component can be ported only when every entry in its **Deps** column (`docs/components.md`) is ticked in `PORTING.md`. Folder order is just the default sequence among components that are ready:
`primitives` → `actions` → `forms` → `display` → `feedback` → `navigation` → `menus` → `data` → `charts` → `media` → `layout` → `patterns`.
Deps cross folders often (`Button` → `feedback/Spinner`, `MultiSelect` → `display/Tag`, `Navbar` → `menus/Menu`, `DataGrid` → `patterns/QueryBuilder`…). When generating `PORTING.md`, sort it topologically by Deps.
Start with `Glyph` (+`renderIcon`), `Spinner`, `Surface`, `Field`, `Control`, `Option`, `Button`.

## 5. Verification harness
Reference specimens are live React pages. Serve the DS statically and open them:
```
npx serve velvet -l 4100
→ http://localhost:4100/components/actions/button-variants.card.html
```
Each `*.card.html` has its first line `<!-- @dsCard group="…" viewport="WxH" name="…" -->` and an inline script with the exact JSX it renders.

For every card the component appears in (the **Specimens** column):
1. Create `specimens/<folder>/<card-name>.tsx` that renders **the same content** with your Solid components: same props, labels, layout wrappers, same order. Copy the JSX from the card's inline script and translate it.
2. The specimen page loads the same frame as the card: `velvet/styles.css`, `velvet/assets/theme-toggle.js` (injects the card background and 18/20 gutter, and expects `#root > .pane` like the cards), plus any `<style>` from the card's `<head>`. Skip React, Babel and `_ds_bundle.js`.
3. The Playwright test opens both URLs at the card's `viewport` size and compares screenshots (`maxDiffPixelRatio` ≈ 0.01) in three modes: light, dark, compact. Set the theme **before load** with `page.addInitScript(() => localStorage.setItem('vui-theme', 'dark'))` (`theme-toggle.js` re-applies `data-theme` from this key, so setting the attribute directly gets overwritten). Compact = `data-density="compact"` on `<html>`.
4. Behaviour test (Playwright, same for reference and port): Tab order, Enter/Space, arrows/Home/End/Esc where the `.jsx` handles keys, focus return after close, `aria-*` values before/after interaction. Read the `.jsx` key handlers to know what to test.

## 6. Per-component procedure
1. Find it in `docs/components.md`. Confirm all Deps are done.
2. Read **in full**: `<Name>.jsx`, `<Name>.d.ts`, `<Name>.prompt.md` (if any), each listed `*.card.html`. Skim its CSS file to learn which classes/modifiers exist.
3. Write `src/components/<folder>/<Name>.tsx`:
   - Props interface = `.d.ts` translated (rules in `docs/solid-porting.md`). Keep JSDoc and `@default`s.
   - Markup = the `.jsx` render output, element for element, class for class.
   - Behaviour = every handler, effect, timer, keyboard branch and `aria-*` from the `.jsx`.
   - Render other DS components through their Solid ports. Never inline their markup.
4. Export it from the folder's `index.ts`.
5. Build its specimen(s) and tests (§5). Fix until screenshots match in all three modes and the behaviour tests pass.
6. `tsc --noEmit` and `eslint` clean.
7. Tick it in `PORTING.md`, with a one-line note if anything deviates and why.

**Done means:** same DOM classes as the reference · all props from `.d.ts` · all specimens match (light, dark, compact) · keyboard + aria parity · typecheck + lint clean · ticked in `PORTING.md`.

## 7. Solid non-negotiables
- Never destructure props. Use `splitProps` / `mergeProps`. Read props lazily inside JSX or `createMemo`.
- `<Show>` / `<For>` / `<Index>` / `<Switch>`, not `&&` / `.map()` with state.
- `class` / `classList`, `for`; style objects use kebab-case keys.
- Effects only for real side effects (DOM measure, listeners, timers), always with `onCleanup`.
- Portals via `<Portal>` from `solid-js/web`.
- Full mapping table and patterns (cloneElement triggers, Children, layout effects, forwardRef, context) are in `docs/solid-porting.md`.

## 8. Design rules you must not break (already true in the CSS; don't undo them in TSX)
- No inline styles carrying design values (colour, spacing, radius, shadow, font, duration). Inline `style` only for runtime geometry the reference also sets inline (positions, widths, transforms, CSS variables like `--pct`).
- Icons only via `Glyph` / `renderIcon`. Props named `icon*` accept a string name or `JSX.Element`.
- State contract for interactive components: default · hover · focus-visible · active · selected · disabled · loading · invalid. These are CSS-driven via classes/attributes, so keep the same attributes the reference sets (`aria-busy`, `aria-invalid`, `aria-pressed`, `aria-selected`, `data-state`, `disabled`…).
- Copy: sentence case, verb + object, no emoji. Keep the reference default strings exactly.

## 9. When stuck
- A prop's behaviour is unclear → read the `.jsx`, then the card that demonstrates it.
- The specimen differs visually → your DOM/classes/attributes differ. Diff `outerHTML` of reference vs port (strip React/Solid-specific attributes). Never "fix" it with CSS.
- A React API has no obvious Solid equivalent → `docs/solid-porting.md` §Patterns. If still unclear, stop and ask. Do not improvise an API change.
- Something in `velvet/` looks wrong → note it in `PORTING.md` under "DS issues", port it as-is, and move on.

## 10. Syncing design-system changes
The DS is edited elsewhere and re-downloaded. Never patch `src/` from memory of what changed. Diff the reference.
1. Replace `velvet/` with the new download in its own commit: `chore(velvet): sync <date>`. Nothing else goes in that commit.
2. `git diff --name-status HEAD~1 -- velvet/` is the change list. Handle each path:
   - `tokens/*.css`, `components/**/*.css`, `fonts/`, `assets/`: no code change (CSS is imported directly). Run the visual tests.
   - `<Name>.jsx` / `<Name>.d.ts` modified: `git diff HEAD~1 -- velvet/components/<folder>/<Name>.jsx` and apply **the same change** to the `.tsx` (markup, classes, props, behaviour). Don't re-port from scratch.
   - `<Name>.d.ts` added: new component. Normal procedure (§6), add it to `PORTING.md` in dependency order.
   - Component deleted or renamed: remove/rename in `src/`, its specimen and test, `index.ts`, `PORTING.md`. List the app call sites that break.
   - `*.card.html` added/changed: update the matching specimen, then run its visual test.
   - `docs/*.md` changed: reread them. A rule change may apply to already-ported components.
3. Run all visual + behaviour tests. A failure in a component you didn't touch means a shared dependency or CSS changed. Fix it via DOM/classes, never CSS.
4. Record in `PORTING.md`: `Last DS sync: <date>` + one line per affected component.
