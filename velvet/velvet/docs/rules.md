# Rules: how Velvet UI is built and implemented

The project README is the brand book (voice, look, iconography). This file holds the engineering rules: token layers, what component CSS may read, how components compose, and what an implementation in any stack must keep. Read it before writing or porting a component.

Check: `node docs/lint-tokens.mjs` scans `components/bundle.css` for ref-token reads, colour literals and padding / margin / gap values off the spacing scale, and all specimens (`components/*/preview.html`, `guidelines/card.*`) for ref-token reads; it exits with code 1 on a violation. Exempt: `showcase/cards/*` (scale specimens whose subject is a ref scale). The rules below are the single source; there are no separate specimen cards for them.

## Token layers

Each layer reads only the one below. Compiled into `tokens.json` and `components/bundle.css`, named by layer:
1. **ref-*** — raw scales. `ref-color` (velvet / neutral / status ramps, `--hue-*`, `--white/--black`), `ref-type` (`--font-*`, `--font-size-*`, `--font-weight-*`, `--leading-*`, `--tracking-*`), `ref-space` (`--space-*`, `--radius-2xs…full`, `--border-width(-thick|-accent)`, `--size-*` (incl. `--size-avatar-xs…xl` 24/28/32/40/56), `--control-height-xs…lg` + `--control-height-inner/-inner-lg` (28/36 — a button nested in a field, toolbar, segmented track, calendar grid), `--row-height-sm/-/-lg` (40/48/56 — list rows, toolbars, accordions); all scale with density and coarse pointers, hit targets, containers, breakpoints), `ref-motion` (5 durations `--dur-instant/fast/base/slow/slower`, 5 curves `--ease-linear/standard/emphasized/exit/spring`, `--blur-*`, `--z-*`, `--opacity-*`). **Never read by component CSS.**
2. **sys-*** — intent tokens. `sys-color` + `sys-color-dark`: `--bg-*` (page · subtle · raised · sunken · overlay · field · inverse · brand · brand-subtle · glass · media) and state washes `--bg-hover/pressed/selected/selected-hover`; `--fg-*`; `--border-*`; `--action-*` (+ paired `-fg`); `--on-color-*` (fg · muted · subtle · hover · pressed · border · border-strong); `--status-<s>-fg/bg/border/solid`; `--scrim-*`; `--label-*`; `--dv-*`; `--code-*`. `sys-elevation`: `--shadow-xs…xl` + intents `--elevation-flat/control/card/card-hover/raised/popover/dialog/brand/media`. `sys-state`: `--focus-ring`, `-danger`, `-inset`, `--focus-outline`. `sys-type`: roles `--type-<role>` (+ `-family/-size/-leading/-weight/-tracking`) incl. `--type-section` (uppercase group headings) and `--type-heavy-weight`. `sys-motion`: `--motion-instant/fast/base/move/reveal/enter/exit/spring/bounce/pop/lift/slide/progress`, `--transition-colors`, distances `--motion-rise/nudge/stagger`.
3. **comp** — per-family knobs, in `components/bundle.css`: (`--surface-*`, `--card-*`, `--button-*`, `--control-*`, `--field-*`, `--check-*`, `--switch-*`, `--panel-*` floating panels, `--option-*`, `--dialog-*`, `--tooltip-*`, `--count-*`, `--badge-*`, `--tag-*`, `--tab-*`, `--nav-item-*`, `--table-*`, `--media-*`, `--footer-*`, `--topbar-*`, atoms `--meter-*`, `--swatch-*`, `--mark-*`, `--kbd-*`). Scoped to `:root,[data-theme],[data-density]` so a themed subtree recomputes them.
4. **mode-density** — `data-density="compact"` and coarse-pointer control heights.

**Example chains** (ref → sys → comp → UI):

| ref | sys | comp | UI |
|---|---|---|---|
| `--velvet-700` | `--action-primary` | `--button-primary-bg` | Primary Button |
| `--neutral-900` | `--fg-primary` | `--field-label-fg` | Field label |
| `--tint` at 7% | `--border-subtle` | `--surface-border` | Surface / Card border |
| `--radius-md` | — | `--control-radius` | Control (input shell) |
| `--shadow-sm` | `--elevation-card` | `--surface-shadow` | Surface / Card shadow |
| `--dur-fast` · `--ease-standard` | `--motion-fast` | `--transition-colors` | Hover colour transition |

## Token and CSS rules

**Quick reference.** What component CSS reads, and what it never reads:

| Layer | Read | Never |
|---|---|---|
| Colour | `--fg-*` · `--bg-*` · `--border-*` · `--action-*` · `--status-*` · `comp tokens` | `--velvet-700` · `#hex` · `rgba()` |
| Type | `--type-<role>` · `--type-<role>-size / -weight` · `--type-strong-weight` · `--type-medium-weight` · `--type-heavy-weight` | `--font-size-*` · `--font-weight-*` · `15px` |
| Motion | `--motion-fast` · `-move` · `-enter` · `-spring …` | `--dur-*` · `--ease-*` · `180ms` |
| Depth | `--elevation-card` · `-popover` · `-dialog …` | `--shadow-*` · `raw box-shadow` |
| Space | `--space-* on the 4px grid` · `--track-pad` | `3` · `5` · `7` · `9` · `18px` |
| Box size | `--control-height-*` · `-inner` · `--row-height-*` · `--hit-target-min` | `28px` · `36px` · `52px` |
| Overlay | `--overlay-offset` · `--overlay-w-*` · `--overlay-max-h-*` | `min-width:220px` · `top:calc(100% + 8px)` |
| Rings | `--border-width(-medium/-thick/-accent)` · `--halo-*` | `1.5px` · `0 0 0 4px` |
| Markup | `Button` · `Control` · `Field` · `Glyph` · `Tag` · `Chip` · `ListItem` · `IconTile` | `class="vui-btn"` · `<select>` · `<i class="vui-icon">` |
| Keyframes | `vui-fade-in` · `rise-in` · `sheet-in` · `spin` · `pulse` · `pop-in` | `redeclaring them per component` |

Details:

- component CSS reads comp first, sys second, ref never.
- Type: read role parts (`--type-caption-size`, `--type-label-weight`…), never `--font-size-*`/`--font-weight-*`. Emphasis inside a component uses the weight intents `--type-heavy-weight` (700), `--type-strong-weight` (600), `--type-medium-weight` (500) and `--type-regular-weight` (400). A size that has no role of its own reads the size of the role with that value (e.g. `--type-h3-size` for 24px, `--type-kpi-size` for 30px).
- Motion: `--motion-*` intents, never `--dur-*`/`--ease-*` (infinite keyframe loops excepted).
- Depth: `--elevation-*`, never `--shadow-*`.
- Shared keyframes (`vui-fade-in`, `vui-rise-in`, `vui-sheet-in`, `vui-spin`, `vui-pop-in`) live in the base block of `components/bundle.css` — never redeclare.
- Icons render through `Glyph` (never a raw `<i class="vui-icon">` in JSX).
- Overlays: `--overlay-offset` (gap to trigger), `--overlay-min-w`/`-w-sm`/`-w`/`-w-md`/`-w-lg` (220/300/340/380/620), `--overlay-max-h-sm`/`-max-h`/`-max-h-lg` (280/360/520), `--viewport-margin`.
- Rings: `--border-width-medium` (1.5 — dashed drop zones, outlined markers), `--halo-sm/md/lg` (4/8/10 — press feedback, current step, empty-state icon).
- Tracks: `--track-pad` + `--radius-nested` for segmented/toolbar/stepper insets.
- `--underline-offset` for links.
- Micro type: `--type-micro` (10px mono — counters in pills, source indices).
- Atom geometry: `--switch-w/h(-sm)`, `--slider-thumb`, `--slider-track-h`.
- Box sizes: a control-ish box reads `--control-height-*`, a row `--row-height-*`, a touch target `--hit-target-min`, an icon `--size-icon-*` (scale 12/14/16/18/20/24 — no 15/17/22).
- Spacing is on the 4px grid only (no 3/5/7/9/11/18/22px).
- No raw px for radius/gap/padding on the 4px grid, no raw ms, no hex/rgb — literals only where functional (colour-picker gradients, masks).
- Every BEM block is self-contained: its own block in `components/bundle.css`, reading comp tokens first.
- Example path: `--velvet-700 → --action-primary → --button-primary-bg → .vui-btn--primary`.
- Composition: JSX renders atoms/components, not their classes — `Button`/`IconButton` (not `vui-btn`), `Listbox`/`ListboxOption` (not `vui-select__menu`/`__option`), `ChartLegend`/`ChartTooltip` (not `vui-chart__legend`/`__tip`), `PeriodNav`, `Control` (field shell), `Field`/`FieldLabel`/`FieldHint`, `Badge`, `Count`, `Indicator`, `Kbd`, `Dot`, `Meter`, `Skeleton`, `Checkmark`, `Tag`, `SectionLabel`, `Spinner` (loading states — `Button loading`), `Chip`, `Select`/`Input`/`SearchInput`/`Checkbox`/`Switch`/`Slider`/`OptionSwitcher` (never a native `<select>`, `<input type=checkbox|range>` or a hand-built search box inside a pattern).
- API convention: value-based components take `value` / `defaultValue` / `onValueChange` (`onChange` kept as alias); sizes are `size="xs|sm|md|lg"`; colour intent is `tone`; leading/trailing glyphs are `icon` / `iconLeft` / `iconRight` (name or node).
- Variants added for embedding: `Tag disabled`, `Chip color/dashed`, `IconTile halo` + sizes 2xl/3xl, `Select aria-label` (label-less), `SearchInput inputRef`, `Kbd plain`, `Badge icon/pulse`, `Checkmark round`, `Handle icon`, `Button/IconButton size="xs"`.

## Components

Every component has a README (what it is, props, what it is built from) and a live preview under `components/<Name>/`. The map of groups, dependencies, CSS blocks and previews is `docs/components.md`; the props contract is `components/index.d.ts`.

Composition rule: a new component should assemble atoms (Surface for any container, Field + Control for any input, Option for any list row, Text for type) rather than re-declaring background/border/shadow/typography.

### Container hierarchy
```
Surface      ← paints: bg · border · radius · elevation · padding · tone · behaviour (--surface-*)
├─ Card      ← Surface + header / body / footer regions (--card-pad-*, --card-footer-bg, --card-divider)
│   ├─ FeatureCard · FlipCard (faces) · Stat (+ trend) · ScoreCard · QuestionCard   ← Card + an interior only
├─ StructuredCard  ← Surface + media / scrim / hairline regions
└─ Floating panels (Popover · Menu · Toast · Dialog · Sheet) ← Surface layers overlay / dialog directly
```
Rule: a layer never re-declares what a layer below provides. Derived cards pass Card/Surface props through; their CSS styles only `> .vui-card__body` interiors.


Picking between look-alikes: **Tabs** swap panels · **OptionSwitcher** is a required value · **ChipGroup** filters · **MenuChip** filters with many values. **Tooltip** hover text · **Popover** click, rich · **Menu** actions. **Dialog** decisions · **Dialog placement="right"** side tasks · **BottomSheet** mobile. **Table** read-mostly · **DataGrid** editing · **VirtualTable** huge lists. **Skeleton** when shape is known · **Progress** when % is known · **Spinner** otherwise.

## Composition rules

One need → one atom:

| Need | Compose with | Never re-declare |
|---|---|---|
| Container — bg, border, radius, shadow | Surface · Card | own background + border + box-shadow |
| Bordered input shell | Field + Control | custom input box, own focus ring |
| Row in a menu, list or listbox | Option · ListItem | flex row with own hover / selected |
| Dropdown panel under a field | Listbox · ListboxOption | `ul.vui-select__menu + li.vui-select__option` |
| Chart key / chart read-out | ChartLegend · ChartTooltip | hand-written legend and tip markup |
| Today + previous / next | PeriodNav · PeriodNavButton | IconButtons wired per component |
| Group heading (uppercase) | SectionLabel · Weekday (date grids) | text-transform + letter-spacing literals |
| Round step / event badge | Marker (+ Rail for the connector) | `28px circle with border + ::before line` |
| Glyph in a tinted box | IconTile | grid + width/height + tone background |
| Person or series | Avatar (color= for series) | initials circle |
| Status point · numeric pill | Dot · Count | `6px circle` · min-width pill |
| Status / category chip | Badge | tinted pill with own tones |
| Filter / keyword / removable chip | Tag (soft · dashed · pill · tone) | inline-flex pill + × |
| One-of-N switch in a track | Segmented (OptionSwitcher, Tabs segmented) | sunken track + raised thumb |
| Independent pressed toggles | ToggleButton · ToggleGroup | aria-pressed buttons |
| Bar · task progress · ring | Meter · Progress · ProgressRing | track + fill span |
| Check / radio glyph (non-native) | Checkmark | `::after tick` |
| × · key cap · search highlight | CloseButton · Kbd · Mark | `icon button, bordered span, <b>` |

Atoms own paint, size and state; hosts set only layout (gap, padding, position). Tune a family via its comp tokens (--segment-*, --marker-*, --rail-*, --tag-*) — never by overriding atom CSS. Tune a family via its comp tokens (`--segment-*`, `--marker-*`, `--rail-*`, `--tag-*`) — never by overriding atom CSS.

Rows that need more than a name: dropdown panel + option row (select, combobox, picker menu) → Listbox + ListboxOption (+ ListboxEmpty / ListboxSkeleton); a single period arrow → PeriodNavButton; labelled task progress → Progress (renders Meter); One-of-N in a track → Segmented (OptionSwitcher track, Tabs segmented, ThemeToggle segmented, LocaleSwitcher and MarkdownEditor read `--segment-*`); filter / keyword / removable chip → Tag (`variant` outline · soft · dashed, `tone`, `shape="pill"`).

Token lint: run `node docs/lint-tokens.mjs` (ref-token reads in component CSS and in specimens, colour literals in component CSS and off-scale padding / margin / gap values must stay at 0, apart from the colour picker's gradients and the exemption named above; other px literals are only tracked).

IconButton takes `shape="circle"` and floating variants `raised` (arrows over content — Carousel) and `overlay` (on media — Lightbox); ghost buttons show `aria-pressed`. Use them instead of hand-rolled nav arrows. The **Tone contrast** card (`components/ColorToneContrast/preview.html`) checks --tone-fg legibility live in both themes.

`ColumnResize` (primitives) is the shared column-width handle for Table + DataGrid (drag · ←/→ · double-click reset · role="separator"); both read `--table-header-*`, `--table-row-*`, `--table-pin-shadow*`, and DataGrid rows use `--grid-row-height` (density-aware). Popover and BottomSheet take paint only from the Surface registry. A11y: DataGrid announces its result count; Kanban columns are lists; Scheduler day columns are keyboard-reachable "Add event" targets.

## Shared behaviour helpers

Behaviour that more than one component needs lives in one helper; do not re-implement it in a component.

| Need | Use | Instead of |
|---|---|---|
| Write text to the clipboard | `copyText(text)` · `useCopy(resetMs)` → `[done, copy]` | `navigator.clipboard.writeText` + a timeout per component |
| Arrow-key movement over a list of items | `rovingIndex(key, i, len, {orientation, homeEnd, loop})` (pure) · `rovingKeyDown(e, root, selector, opts)` (moves focus) | per-component `ArrowDown` / `ArrowUp` arithmetic |
| Label, hint, error and aria wiring of a field | `Field` (render-prop `children(ctl)` gives `id`, `invalid`, `describedBy`) | `useId` + `-hint` ids + `FieldLabel` / `FieldHint` by hand |
| Inline error inside a dialog or panel | `Alert tone="danger"` | a bespoke error box with inline margins |
| Panel anchored to a trigger | `Popover` (`panelClassName`, `bare` for a panel that lays out its own regions) · `Menu` for actions | `vui-popover-wrap` + `useDismiss` by hand |
| Month grid | `startOfMonth(d)` · `monthOffset(d, weekStartsOn)` | `new Date(y, m, 1)` and `(getDay() - weekStartsOn + 7) % 7` |
| Leaves of a tree node | `treeLeaves(node)` | a local `leaves` function per tree component |
| A timer that sets state after a delay | `useLater()` → `later(fn, ms)` (pending timers are cleared on unmount) | a bare `setTimeout` in an event handler |
| Hover / keyboard cursor of a point chart | `chartKeyDown(e, setHover, count)` · `chartPointerIndex` · `indexX` · `tickEvery` | a per-chart copy of `onKey` / `onMove` (and missing Home / End) |
| A number with fixed fraction digits | `fmtNum(v, digits, locale, grouping)`; components that show numbers take `locale` (default `'en-US'`) | `toLocaleString('en-US')` or `toFixed` inside a component |

## Checks

- `node docs/lint-tokens.mjs` — ref-token reads, colour literals, off-grid spacing (see above).
- `node docs/render-check.mjs` — renders every exported component with fixed props and compares the markup with `docs/render-snapshot.json`; run it after any refactor, and with `--update` once a markup change is intended. It does not exercise events, effects or pixels, so the `preview.html` specimens stay the acceptance test for those.
- `docs/css-audit.md` — a snapshot of what the rules above forbid but the CSS still contains (raw sizes, `!important`, literal durations, `outline:none`), with the accepted exceptions marked.

## Implementation rules (any stack)

These are already true in the CSS and the React reference. Do not undo them in another stack.

- No inline styles carrying design values (colour, spacing, radius, shadow, font, duration). Inline style only for runtime geometry the reference also sets inline (positions, widths, transforms, CSS variables such as `--pct`).
- Icons only through `Glyph` / `renderIcon`. Props named `icon*` accept a string name or a node.
- State contract for interactive components: default · hover · focus-visible · active · selected · disabled · loading · invalid. States are CSS-driven through classes and attributes, so keep the attributes the reference sets (`aria-busy`, `aria-invalid`, `aria-pressed`, `aria-selected`, `data-state`, `disabled`).
- Copy: sentence case, verb + object, no emoji. Keep the reference default strings.
- Components never own app concerns: no auth or session context, no role checks, no data fetching, no persistence (localStorage, view import/export), no record creation. They expose state and callbacks (`signedIn` / `error`, `view` / `onViewChange`, `onMove`, `addRow.onAdd`); the app decides and stores. Need one of these? Request it in the design system first.
