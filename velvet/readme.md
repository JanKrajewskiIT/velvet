# Velvet UI Design System

A modern, professional, framework-agnostic design system built from scratch around a single brand colour: **velvet `#8b0036`**. It ships light and dark themes, a responsive foundation, and a starter component library.

**Sources:** none — created from a brief ("modern, professional DS from scratch; brand colour #8b0036; fundamentals first; light + dark; responsive"). No logo, codebase, Figma or existing product was provided.

## How it's built (portable by design)
Velvet is **CSS-first**. All styling lives in plain CSS: tokens as custom properties, components as `vui-*` classes. The React components are thin wrappers that apply those classes — so the same visuals can be rebuilt in Vue, Svelte, Angular, native web components, or plain HTML by reusing `styles.css` and the class names.

```html
<link rel="stylesheet" href="styles.css">
<html data-theme="dark">  <!-- or any subtree -->
<button class="vui-btn vui-btn--primary">Save</button>
```

**Theme switching:** set `data-theme="dark"` or `"light"` on `<html>` (e.g. from a toggle, stored in localStorage; default to `prefers-color-scheme`). Everything re-themes through semantic tokens — no component changes needed.

Token layers — each reads only the one below. Files in `tokens/`, prefixed by layer:
1. **ref-*** — raw scales. `ref-color` (velvet / neutral / status ramps, `--hue-*`, `--white/--black`), `ref-type` (`--font-*`, `--font-size-*`, `--font-weight-*`, `--leading-*`, `--tracking-*`), `ref-space` (`--space-*`, `--radius-2xs…full`, `--border-width(-thick|-accent)`, `--size-*` (incl. `--size-avatar-xs…xl` 24/28/32/40/56), `--control-height-xs…lg` + `--control-height-inner/-inner-lg` (28/36 — a button nested in a field, toolbar, segmented track, calendar grid), `--row-height-sm/-/-lg` (40/48/56 — list rows, toolbars, accordions); all scale with density and coarse pointers, hit targets, containers, breakpoints), `ref-motion` (5 durations `--dur-instant/fast/base/slow/slower`, 5 curves `--ease-linear/standard/emphasized/exit/spring`, `--blur-*`, `--z-*`, `--opacity-*`). **Never read by component CSS.**
2. **sys-*** — intent tokens. `sys-color` + `sys-color-dark`: `--bg-*` (page · subtle · raised · sunken · overlay · field · inverse · brand · brand-subtle · glass · media) and state washes `--bg-hover/pressed/selected/selected-hover`; `--fg-*`; `--border-*`; `--action-*` (+ paired `-fg`); `--on-color-*` (fg · muted · subtle · hover · pressed · border · border-strong); `--status-<s>-fg/bg/border/solid`; `--scrim-*`; `--label-*`; `--dv-*`; `--code-*`. `sys-elevation`: `--shadow-xs…xl` + intents `--elevation-flat/control/card/card-hover/raised/popover/dialog/brand/media`. `sys-state`: `--focus-ring`, `-danger`, `-inset`, `--focus-outline`. `sys-type`: roles `--type-<role>` (+ `-family/-size/-leading/-weight/-tracking`) incl. `--type-section` (uppercase group headings) and `--type-heavy-weight`. `sys-motion`: `--motion-instant/fast/base/move/reveal/enter/exit/spring/bounce/pop/lift/slide/progress`, `--transition-colors`, distances `--motion-rise/nudge/stagger`.
3. **comp** — `tokens/comp.css`: per-family knobs (`--surface-*`, `--card-*`, `--button-*`, `--control-*`, `--field-*`, `--check-*`, `--switch-*`, `--panel-*` floating panels, `--option-*`, `--dialog-*`, `--tooltip-*`, `--count-*`, `--badge-*`, `--tag-*`, `--tab-*`, `--nav-item-*`, `--table-*`, `--media-*`, `--footer-*`, `--topbar-*`, atoms `--meter-*`, `--swatch-*`, `--mark-*`, `--kbd-*`). Scoped to `:root,[data-theme],[data-density]` so a themed subtree recomputes them.
4. **mode-density** — `data-density="compact"` and coarse-pointer control heights.

Rules: component CSS reads comp first, sys second, ref never. Type: read role parts (`--type-caption-size`, `--type-label-weight`…), never `--font-size-*`/`--font-weight-*`. Motion: `--motion-*` intents, never `--dur-*`/`--ease-*` (infinite keyframe loops excepted). Depth: `--elevation-*`, never `--shadow-*`. Shared keyframes (`vui-fade-in`, `vui-rise-in`, `vui-sheet-in`, `vui-spin`, `vui-pop-in`) live in `tokens/base.css` — never redeclare. Icons render through `Glyph` (never a raw `<i class="vui-icon">` in JSX). Overlays: `--overlay-offset` (gap to trigger), `--overlay-min-w`/`-w-sm`/`-w`/`-w-md`/`-w-lg` (220/300/340/380/620), `--overlay-max-h-sm`/`-max-h`/`-max-h-lg` (280/360/520), `--viewport-margin`. Rings: `--border-width-medium` (1.5 — dashed drop zones, outlined markers), `--halo-sm/md/lg` (4/8/10 — press feedback, current step, empty-state icon). Tracks: `--track-pad` + `--radius-nested` for segmented/toolbar/stepper insets. `--underline-offset` for links. Micro type: `--type-micro` (10px mono — counters in pills, source indices). Atom geometry: `--switch-w/h(-sm)`, `--slider-thumb`, `--slider-track-h`. Box sizes: a control-ish box reads `--control-height-*`, a row `--row-height-*`, a touch target `--hit-target-min`, an icon `--size-icon-*` (scale 12/14/16/18/20/24 — no 15/17/22). Spacing is on the 4px grid only (no 3/5/7/9/11/18/22px). No raw px for radius/gap/padding on the 4px grid, no raw ms, no hex/rgb — literals only where functional (colour-picker gradients, masks). Every BEM block has its own CSS file next to its JSX. Example path: `--velvet-700 → --action-primary → --button-primary-bg → .vui-btn--primary`. Composition: JSX renders atoms/components, not their classes — `Button`/`IconButton` (not `vui-btn`), `Control` (field shell), `Field`/`FieldLabel`/`FieldHint`, `Badge`, `Count`, `Indicator`, `Kbd`, `Dot`, `Meter`, `Skeleton`, `Checkmark`, `Tag`, `SectionLabel`, `Spinner` (loading states — `Button loading`), `Chip`, `Select`/`Input`/`SearchInput`/`Checkbox`/`Switch`/`Slider`/`OptionSwitcher` (never a native `<select>`, `<input type=checkbox|range>` or a hand-built search box inside a pattern). API convention: value-based components take `value` / `defaultValue` / `onValueChange` (`onChange` kept as alias); sizes are `size="xs|sm|md|lg"`; colour intent is `tone`; leading/trailing glyphs are `icon` / `iconLeft` / `iconRight` (name or node). Variants added for embedding: `Tag disabled`, `Chip color/dashed`, `IconTile halo` + sizes 2xl/3xl, `Select aria-label` (label-less), `SearchInput inputRef`, `Kbd plain`, `Badge icon/pulse`, `Checkmark round`, `Handle icon`, `Button/IconButton size="xs"`.

Naming migration (old → new): `--surface-page/raised/…` → `--bg-*` · `--text-primary/…` → `--fg-*` · `--text-xs…` → `--font-size-*` · `--weight-*` → `--font-weight-*` · `--text-on-brand`, `--text-on-solid` → `--on-color-fg` · `--material-N` → `--bg-raised/overlay` · `--material-N-shadow` → `--elevation-*` · `--overlay-backdrop/media/scrim` → `--scrim-backdrop/media/image` · `--overlay-bg/border/…` → `--panel-*` · `--control-sm/md/lg` → `--control-height-*` · `--control-px` → `--control-pad-x` · `--control-thumb` → `--thumb-bg` · `--dur-moderate` → `--dur-base` · `--ease-out-expo` → `--ease-emphasized` · `--ease-pop` → `--ease-spring` · `--enter-rise` → `--motion-rise`.

## Index
- `styles.css` — single entry point (imports only)
- `tokens/` — `ref-*`, `sys-*`, `comp.css`, `mode-density.css`, plus `fonts.css`, `icons.css`, `base.css` (element defaults + `.vui-h1…`, `.vui-title`, `.vui-kpi`, `.vui-body`, `.vui-container` helpers)
- `components/` — React wrappers + one CSS file per component, `.d.ts` contracts, `.prompt.md` notes, `.card.html` specimens
- `guidelines/` — foundation cards on a shared scaffold (`card.css`, `card.js`: live contrast ratios, computed values). Groups: Foundations · Color · Type · Space · Shape · Elevation · Motion · State · Layout · Brand. Dark mode is never shown beside light — the **Theme switch** card re-themes every card.
- `assets/theme-toggle.js` — shared theme listener (`localStorage['vui-theme']`)
- `thumbnail.html`, `SKILL.md`

## Components
Also in the set: `ButtonGroup` (actions), `ScrollArea`, `Footer` (layout), `Anchor` (navigation), `FilterBar`, `QueryBuilder`, `ColumnManager`, `Scheduler` (patterns), `DateTimePicker`, `TreeSelect` (forms), `MediaFrame` (media), `RadarChart` (charts).

Card groups (Design System tab): Foundations · Color · Type · Space · Shape · Elevation · Motion · State · Layout · Brand · Atoms · then component families. One problem per card, shown as a variant × state matrix; token names are the only copy.

- **primitives/** (atoms — one CSS file per atom) — `ColumnResize` (column-width handle: drag, ←/→, double-click reset), `Rail` + `RailItem` (connector line under stacked Markers; done / active / dashed), `Weekday` (date-grid header label; names from `weekdayNames()` in date.js), `Marker` (round step / event badge: number, icon, avatar or dot; soft · outline · solid, tone, ring, gap — Stepper + Timeline render it), `Segmented` + `SegmentedItem` (sunken track + raised item; OptionSwitcher track renders it, Tabs segmented + ThemeToggle segmented read `--segment-*`), `Checkmark` (check / mixed / radio glyph box for non-native rows), `Meter` (track + fill; sizes, tone, segmented steps, rating, shimmer, indeterminate — Progress renders it), `Swatch` (colour chip; sizes, round, selectable, fill grid), `Mark` (highlight · text · mention + diacritic-insensitive `highlightMatch()` — used by Autocomplete, SearchInput, CommandPalette, TransferList), `Glyph` (CSS-mask icon `<i>` + `renderIcon()` — every `icon` prop renders through it), `Chevron` (disclosure arrow; down/right/up/left, `open` rotates), `CloseButton` (the one ×: button · field · tag · bare; `as="span"` inside another button), `Handle` (drag grip; focusable or decorative), `Separator` (inline line · dash · text; block breaks = Divider), `EmptyText` (inline "nothing here" for lists/panels; whole views = EmptyState); date helpers in `primitives/date.js` (`pad`, `sameDay`, `startOfDay`, `addDays`, `addMonths`, `toDate` — "YYYY-MM-DD" as local midnight, `ymd`, `fmtDate`; Calendar re-exports them), helper `cx()` in `primitives/cx.js` (class joiner — every component imports it), hook `useDismiss(open, onDismiss, ref)` in `primitives/useDismiss.js` (outside-click + Escape with refocus — TreeSelect, FilterBar, DatePicker), `Kbd` (key cap / combo), `ListItem` (row atom: leading · title · description · meta · trailing — List, NotificationCenter, ImportSourcesDialog, ColorLabelManager), `IconTile` (glyph in a tinted box — tone, sm–xl, circle, outline; notification / source / file / feature / confirm icons), `Chip` (forms — selectable pill; ChipGroup / DualFilterBar render it), `SectionLabel` (uppercase group heading — menus, listboxes, sidebars, panels; `icon`, `end`, `tone`, `sticky`), `tone.js` (`TONE_ICON` — the one status→glyph map used by Alert, Toast, NotificationCenter), `Surface` (the one container painter: default · low · flat · raised · subtle · sunken · brand · brand-solid · inverse · overlay · dialog · glass; `tone`, `accent`, `hoverable` / `interactive` / `tonal`, `selected`, `reveal`, `padding`; tokens `--surface-*`), `Text` (applies a `--type-*` role + text tone), `Dot` (status/presence marker), `Field` + `FieldLabel` + `FieldHint` (label/control/hint stack with ids, aria, error lane, counter), `Control` (bordered field shell with adornments and states), `Option` (one listbox/menu row), `Count` (numeric pill, 99+), `Indicator` (anchors a Count or Dot to an icon, button or avatar). Surface also carries `tonal` hover and `reveal` stagger; its CSS holds the paint registry — the only place containers get background, border, radius and elevation (Popover, Menu, Select list, Toast, Tour, Dialog, Sheet, Toolbar, DualFilterBar, Kanban card, Pricing tier…). `Card` is built on `Surface`, and FeatureCard / FlipCard / Stat / ScoreCard / QuestionCard on `Card`; `Input` on `Field` + `Control`; Menu items and Select options share the `Option` row styles.
- **actions/** — `Button` (primary · secondary · soft · ghost · danger · link · dashed — `variant="dashed" block` is the "+ Add …" row at the end of lists/tables; sm/md/lg; loading), `ToggleButton` + `ToggleGroup` (aria-pressed actions; single / multiple), `IconButton`, `CopyButton` + `CopyField`, `Fab` (extended, speed dial), `AuthButton`, `ThemeToggle` (ring pair from Recron · light / navbar / dark), `LocaleSwitcher`
- **forms/** — `Cascader` (column-by-column path pick), `Input` (prefix/suffix, counter, read-only, `validate` on blur with fixed message lane; email/URL are recipes), `Textarea` (auto-grow, maxRows, counter), `PhoneInput` (country picker, mask, E.164), `TimeStepper` (inline h/m stepper, AM/PM), `PasswordInput` (strength), `SearchInput` (suggestions), `NumberInput`, `OtpInput`, `TagInput`, `InlineEdit`, `FileUpload`, `Slider` (single/range), `Rating` + `RatingSummary` (average, distribution, filter by star), `ChipGroup`, `OptionSwitcher`, `Select` (typeahead, Home/End, activedescendant), `Autocomplete` (local/async, allowCustom), `MultiSelect` (async, cap), `ColorPicker`, `Calendar` (single/range, marks), `DatePicker`, `DateRangePicker` (presets, `DEFAULT_RANGE_PRESETS`), `TimePicker`, `RichTextEditor`, `ErrorSummary` (submit-time validation), `Checkbox` (indeterminate), `Radio`, `Switch`, `TransferList` (two-list picker), `EditableCollection` (rename · reorder · weight · remove)
- **menus/** — `Menu` + `MenuPanel`, `ContextMenu`, `DropdownButton` (split), `MenuChip` (option menu chip), `CommandPalette` (⌘K), `Toolbar` (overflow)
- **display/** — `Card` (Surface + header · actions · body · footer · padding — every Surface prop passes through), `StructuredCard` (hairline regions: media + scrim + floating tag / header / body / footer), `Badge`, `Tag`, `Icon`, `BrandLogo` (`brand="velvet|recron"`, lockup · mark, `tone="inverse"` on brand fills)
- **navigation/** — `Tabs` (underline, segmented, vertical; sliding indicator), `Breadcrumb` (collapsing), `Pagination`, `Stepper`, `Wizard`, `TreeView`, `HierarchyNavigator` (drill-down), `BottomNav` (centre action), `BackToTop`, `Navbar` (brand · links · actions; brand tone; burger on mobile), `Link` (default · plain · quiet · standalone arrow · external · disabled)
- **feedback/** — `Dialog` (modal · right/left drawer; focus trap; bottom sheet on mobile), `BottomSheet`, `ConfirmDialog` + `ConfirmAction`, `Popover`, `Tooltip`, `Tour`, `Toast` + `ToastRegion` (countdown, undo), `Alert`, `Banner`, `Progress` + `ProgressRing`, `Skeleton` + `SkeletonText`, `Spinner` + `LoadingOverlay`, `EmptyState`, `ErrorState`, `StatusPage` (404/403/500/offline), `NotificationCenter` + `NotificationList`, `Countdown`
- **data/** — `Table` (sort, selection + bulk bar, keyboard, skeleton loading), `DataGrid` (editable cells), `VirtualTable` (100k+ rows), `Accordion`, `DescriptionList`, `Timeline` (default rail · compact activity feed · `status` pipeline: done/current/upcoming), `List` (people/file rows), `SkillBar`, `EventCalendar` (month + agenda), `ScoreCard` (Card: ring + criteria), `Kanban`, `CodeSnippet`, `FlipCard` (two Card faces) + `FeatureCard` (Card), `Stat` (Card; `accent` tone strip, `spark` trend), `QuestionCard` (Card: category · difficulty · tags · expandable answer), `Avatar` (presence) + `AvatarGroup`, `Divider`
- **charts/** — `BarChart` (grouped/stacked), `LineChart` (crosshair + table view), `DonutChart` (legend toggles), `Sparkline`, `Heatmap` (calendar density) — all keyboard-readable, coloured from `--dv-*`
- **media/** — `Carousel`, `ImageGrid` + `Lightbox`, `Marquee`
- **layout/** — `Sidebar` (248px ↔ 64px icon rail) + `NavItem` + `NavSection`, `SearchTrigger` (⌘K), `PageHeader` (breadcrumb · back · status · meta · tabs), `SplitPane` (nestable, collapsible), `Stack` + `Grid`
- **patterns/** (product-specific compositions) — `DualFilterBar`, `ColorLabelManager` (`LABEL_COLORS`), `ImportSourcesDialog`, `FlashcardSetup` + `FlashcardSession` + `FlashcardSummary`, `CalendarOrganizer`, `CommentThread`, `AiResultPanel`, `PricingTable`

Added from the legacy VelvetUi (Solid) package review: `Loader` + `PageLoader` (feedback — 14 decorative loaders ported 1:1), `MarkdownEditor` + `MarkdownEditDialog` (display — preview is `Markdown`), `CalendarEventButton` (actions — Google / Outlook / .ics), `VirtualList` (data), `FormLayout` + `FormSection` + `FormGrid` + `FormSpan` + `ActionRow` (forms), `ComparisonBar` + `ComparisonDialog` (charts), `ColorLabelSelectionDialog` (patterns — assign labels, search + create inline), `AnalysisRequest` + `AtsAnalysisPanel` (patterns — request AI analysis from CV / offer / notes, then show score, breakdown, keywords, recommendations). Added from the Recron app review: `SetupChecklist` (feedback — first-run "Get started" card, list / grid, hides when done), `LoadMore` (navigation — "Showing 20 of 120" + Show more), `RangeInput` (forms — from–to number, optional currency + period selects; salary / budget). `Avatar` gained `color="auto"` (stable --dv hue hashed from name). Extended: `Accordion` (variant="elevated", item tone, gap), `FeatureCard` (look="lift", layout="inline"), `Timeline` (badge, meta, row actions with inline confirm, onAdd), `TransferList` (rebuilt: search, groups, drag, orderable, max).

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

---

## CONTENT FUNDAMENTALS
Voice: **calm, precise, quietly confident.** Velvet is premium without being precious — it explains, it doesn't sell.

- **Address the user as "you"**; the product speaks as "we" only when it acts ("We'll email you the CSV").
- **Sentence case everywhere** — buttons, titles, tabs, labels. Never Title Case, never ALL CAPS (except `.vui-overline` micro-labels, styled via CSS, not typed in caps).
- **Buttons are verbs + object**: "Create project", "Save changes", "Update card". Avoid "OK", "Submit", "Yes".
- **Short, specific, human.** "This name is already taken" not "Error: validation failed". Error messages say what happened and how to fix it.
- **Destructive copy names the thing**: "Delete project?" + "“Atlas” and its 24 files will be removed. This can't be undone."
- **Empty states**: one line, factual — "No projects match these filters."
- **No emoji** in UI. No exclamation marks except genuine celebration (rare).
- Numbers: tabular figures; use real typographic characters — `…` `’` `“ ”` `−` `×` `⌘`.
- Greeting tone example: "Good morning, Anna" / "Here's what's happening across your workspace."

## VISUAL FOUNDATIONS
- **Colour.** One hero colour — velvet `#8b0036` (velvet-700) — used sparingly for primary actions, selection, focus and brand moments. Everything else rests on warm, faintly rose-tinted neutrals so the wine tone feels intentional, never loud. Status colours are deliberately distinct from the brand: danger is an orange-red (`#c22b1d`), so errors are never confused with brand accents. Aim for ~90% neutral, ≤10% velvet on any screen.
- **Dark mode** is designed, not inverted: near-black warm surfaces (`#121011` page, `#1d1a1b` raised), hairline white-alpha borders, velvet-600 for primary buttons and velvet-300 for brand text to preserve contrast.
- **Type.** Three self-hosted families. **Space Grotesk** (display & headings — h1–h4, page titles, card/dialog titles, KPI values; semibold 600, tight negative tracking; its quirky geometric details carry the brand's personality). **Hanken Grotesk** (UI & body — labels, buttons, inputs, paragraphs; 400/500, clean and highly legible at small sizes). **JetBrains Mono** (code, IDs, tabular data). Display sizes are fluid via `clamp()`. Body 14px/1.5 in app UI, 16px/1.65 for reading. All three support Polish / Latin Extended.
- **Spacing.** 4px grid (`--space-1` = 4px). Cards pad 20px, dialogs 24px, page gutter `clamp(16px, 4vw, 32px)`.
- **Radii.** Soft but crisp: 6px small controls, 8px inputs/buttons, 12px cards, 16px dialogs, full for badges/switches. No pill buttons.
- **Cards.** White (raised) surface, 1px `--border-subtle`, 12px radius, `--shadow-sm`. Paint variants come from Surface (flat = border only, raised = shadow, no border, subtle, sunken, brand, brand-solid…). Footers use a tinted `--bg-subtle` bar. No coloured left-border accents.
- **Shadows.** Wine-tinted (`rgba(56,0,20,…)`) layered shadows in light mode so elevation feels warm; in dark mode pure black shadows plus a 1px inset top highlight. Five steps xs→xl.
- **Borders.** 1px hairlines everywhere; three strengths (subtle/default/strong). 2px only for focus and the active-tab indicator.
- **Backgrounds.** Flat colour only — no decorative gradients. No patterns or textures. Imagery, when used, should be warm, low-saturation, slightly dark — photography that lets the wine colour sit on top.
- **Motion.** Quick and decisive: 140ms for hover/colour, 200ms for state, 320ms for entering overlays. Easing `cubic-bezier(.2,0,0,1)` (standard) and `(.3,0,0,1)` (emphasized); a gentle spring only on the switch thumb. Overlays fade + rise 8px; sheets slide up. All durations collapse to 0 under `prefers-reduced-motion`.
- **Hover.** Filled buttons darken one step (velvet-700 → 800); neutral controls get a translucent `--bg-hover` wash or stronger border; interactive cards lift 1px with a larger shadow.
- **Press.** Buttons nudge down 1px and darken again (velvet-900). No scale-shrink.
- **Focus.** Always visible on keyboard: 3px soft velvet ring (`--focus-ring`) plus border colour change on fields.
- **Transparency & blur.** Only on overlays: the sticky topbar (82% page colour + 12px blur) and the dialog backdrop (4px blur). Never on content cards.
- **Layout.** Sidebar 248px + sticky 60px topbar on desktop; sidebar becomes an off-canvas drawer below 768px. Content max ~1200px. Breakpoints 640 / 768 / 1024 / 1280 / 1536, mobile-first.
- **Touch.** Control heights 32/40/48px grow to 36/44/52px on coarse pointers automatically (`@media (pointer:coarse)`).

## LAYERS, DENSITY, DATA-VIZ, ACCESSIBILITY
- **Layers.** Backgrounds stack page → subtle → raised → overlay (`--bg-*`); in dark each step is lighter, in light they share white and separate by elevation (`--elevation-card` → `--elevation-popover` → `--elevation-dialog`). `--highlight-inset` adds a 1px top light edge; `--glow-brand` (via `--elevation-brand`) is for the single hero/promo surface only.
- **Density.** Comfortable is default. `data-density="compact"` on `<html>` or any subtree drops controls to 28/32/40, rows to 36px (`--row-height`, `--cell-py`, `--cell-px`, `--control-pad-x`). Use compact for tables, consoles, admin; never for marketing or onboarding.
- **Labels.** 8 decorative hues `--label-blue/indigo/violet/magenta/teal/cyan/olive/slate` (uniform OKLCH L 57%, white text reads on every fill), clear of velvet, red, green and orange so a label never reads as brand or status. Use via `data-tone="violet"` → `--tone`, `--tone-bg`, `--tone-fg`.
- **Data-viz.** 8 categorical series `--dv-1…8` (velvet, amber, green, blue, violet, coral, teal, slate) retuned per theme; always assign in order. Sequential single-measure ramp `--dv-seq-1…5` (low → high). Never use `--dv-*` for UI status — use `--status-*`.
- **Contrast.** Body copy only in `--fg-primary` / `--fg-secondary` (AA). `--fg-tertiary` is for metadata, captions and 18px+ — check the Contrast card. Status colour never alone: pair with icon or label.
- **State contract.** Every interactive component supports: default, hover, focus-visible, active/pressed, selected/checked, disabled, loading (where async), invalid (where input). See the State matrix card.

## ICONOGRAPHY
- **System:** **Velvet Icons** — an original outline set designed for this system (141 glyphs in 8 categories, inspired by modern outline sets but drawn from scratch). Not Lucide or any third-party set. Covers the full Recron icon vocabulary; Recron names `close`, `trash`, `edit`, `alert-triangle`, `check-circle`, `x-circle`, `help-circle`, `grid`, `attach`, `badge`, `chat`, `message`, `warning`, `success`, `error`, `help`, `logout`, `expand` work as aliases (`IconAliases`) — prefer canonical names in new code.
- **Filled twins:** `home`, `bell`, `user`, `folder`, `bookmark`, `heart`, `message-square`, `star` have a `<name>-filled` version. Filled = **selected state only**: active BottomNav tab, active mobile Navbar rail item, pressed ToggleButton (all swap automatically; `filledIcon(name, on)` helper). Never as decoration; no duotone.
- **Construction:** 24 × 24 grid, 20 × 20 live area (2px padding), 1.75 stroke, round caps & joins, 2–3px outer corner radius, filled dots (r 1.15–1.5). Signature details: uneven menu line, hexagonal settings nut, four-point sparkle.
- **Delivery:** `tokens/icons.css` renders every glyph as a CSS mask → `<i class="vui-icon icon-NAME"></i>` works in any stack, sized by `font-size` (default 1.15em), coloured by `currentColor`. React: `<Icon name="…" size strokeWidth />` (inline SVG). Raw SVGs for native/other platforms: `assets/icons/<name>.svg`.
- **Sizes:** 16px in controls, 17–18px in navigation, 20–24px standalone. Stroke 2 at ≤14px, 1.5 at ≥32px.
- **Colour:** `--fg-secondary`/`--fg-tertiary` at rest; `--fg-brand` for active nav; status colours only in toasts/alerts.
- **Adding icons:** stay on the grid, reuse the stroke and radii, add the SVG to `assets/icons/`, the path to `VelvetIcons` in `Icon.jsx`, and a mask rule to `tokens/icons.css`.
- **No emoji, no unicode-as-icon** (exceptions: `⌘` and `…` in text). No PNG icons.

## Brand mark
**No logo was provided.** Wherever a mark is needed, the name is set in type as a placeholder wordmark: `velvet/ui` in Space Grotesk Bold (−4% tracking, “/ui” at 55% opacity), velvet on light surfaces or white on velvet. Replace with a real logo in `assets/` when available.
**Recron mark (additional option).** Ported from Recron and rebuilt on Velvet foundations: `<BrandLogo brand="recron" />` — the Recron vector logotype: “R” signet with circuit-node stem + wordmark. Signet fills with `--action-primary`, wordmark with `--fg-primary` (both follow the theme); `tone="inverse"` turns both `--on-color-fg` on brand fills. Clear space 0.5× height; min 32px tall.
**QuantCore mark (additional option).** `<BrandLogo brand="quantcore" />` — the QuantCore vector logotype: “Q” signet (with inner dot) in `--action-primary` + “uantcore” wordmark in `--fg-primary`; `tone="inverse"` on brand fills; `variant="mark"` = signet only. Same clear-space / min-size rules as Recron. Paths in `components/display/quantcore-logo-data.js`.
## Fonts
Space Grotesk, Hanken Grotesk (incl. italic) and JetBrains Mono are self-hosted as variable woff2 in `fonts/` (latin + latin-ext subsets — covers Polish), declared in `tokens/fonts.css`. No external requests. Tokens: `--font-display`, `--font-sans`, `--font-mono`.

## Composition map
Generated from imports — what each component is built from. Atoms live in `components/primitives/`.

### actions
- **AuthButton** → Spinner, Glyph
- **Button** → Spinner
- **CalendarEventButton** → Glyph, Chevron
- **CopyButton** → FieldLabel, Control, Glyph
- **Fab** → Glyph
- **LocaleSwitcher** → Glyph
- **ToggleButton** → Glyph

### charts
- **ComparisonBar** → Button, Glyph, CloseButton, Dialog, RadarChart, Avatar
- **LineChart** → Button, Glyph

### data
- **Accordion** → Glyph, Chevron
- **CodeSnippet** → Glyph
- **ColumnManager** → SearchInput, Count, Switch, Handle, Control, SectionLabel, Glyph
- **DataGrid** → SearchInput, Count, Checkbox, Control, Glyph, EmptyText, Popover, Button, ColumnManager, QueryBuilder
- **EventCalendar** → EmptyText, Dot, Calendar
- **FeatureCard** → IconTile, Glyph, Card
- **FlipCard** → Card
- **Kanban** → Badge, IconButton, Glyph, EmptyText, Dot, Count
- **List** → ListItem, EmptyText
- **QuestionCard** → Glyph, Card, Badge, Rating, IconButton
- **Scheduler** → IconButton, Button, Glyph, Weekday
- **ScoreCard** → Card, ProgressRing, Progress, Badge
- **SkillBar** → Meter
- **Stat** → Badge, Card, Sparkline
- **Table** → Checkbox, Skeleton, Button, Glyph
- **Timeline** → Badge, Button, Glyph, Marker, Rail, RailItem
- **VirtualList** → EmptyText

### display
- **BrandLogo** → R_MARK, R_WORD, Q_MARK, Q_WORD
- **Card** → Surface
- **MarkdownEditor** → EmptyText, FieldLabel, Button, Glyph, Markdown, Dialog, Segmented, SegmentedItem
- **StructuredCard** → Surface
- **Tag** → CloseButton

### feedback

- **Progress** → Meter- **Alert** → Glyph, CloseButton
- **ConfirmDialog** → IconTile, FieldLabel, Control, Button, Glyph, Dialog
- **Countdown** → Separator
- **Dialog** → CloseButton
- **EmptyState** → Button, Glyph, IconTile
- **NotificationCenter** → IconTile, ListItem, Count, Badge, Button, Glyph, EmptyText, Dot
- **Toast** → Button, Glyph, CloseButton
- **Tooltip** → Kbd
- **Tour** → Button, Glyph

### forms
- **Autocomplete** → EmptyText, Control, FieldLabel, Skeleton, Spinner, Button, Glyph, CloseButton
- **Calendar** → Glyph, Weekday
- **Cascader** → Control, Glyph, EmptyText, Separator, Chevron, Field
- **Chip** → Glyph
- **ChipGroup** → Chip
- **ColorPicker** → FieldLabel, Control, Glyph
- **DatePicker** → Control, Button, CloseButton, FieldLabel, Glyph, Calendar
- **DateTimePicker** → Control, Button, Glyph, CloseButton, Calendar, Field
- **EditableCollection** → Select, Control, Glyph, EmptyText, Handle, Rating, IconButton
- **ErrorSummary** → Glyph
- **FileUpload** → Meter, IconTile, EmptyText, Button, IconButton, Glyph
- **InlineEdit** → Control, IconButton, Glyph
- **Input** → Field, Control
- **MultiSelect** → Tag, Chevron, EmptyText, Control, FieldLabel, Checkmark, Skeleton, Spinner, Button, Glyph
- **NumberInput** → Control, FieldLabel, FieldHint, Glyph
- **OptionSwitcher** → Segmented, SegmentedItem, Glyph
- **OtpInput** → FieldLabel, Separator
- **PasswordInput** → Glyph, Field, Control, Meter
- **PhoneInput** → Control, FieldLabel, FieldHint, Glyph
- **RatingSummary** → Meter, Glyph, Rating
- **RichTextEditor** → FieldLabel, Control, Button, Glyph
- **SearchInput** → EmptyText, Control, FieldLabel, Spinner, Glyph, CloseButton
- **Select** → FieldLabel, FieldHint, Chevron, Glyph
- **Slider** → FieldLabel
- **TagInput** → Tag, Control, FieldLabel, FieldHint
- **Textarea** → Field, Control
- **TimeStepper** → Glyph
- **TransferList** → SearchInput, Checkmark, Meter, SectionLabel, Glyph, EmptyText, Handle, CloseButton
- **TreeSelect** → Tag, Control, Button, Glyph, EmptyText, Field

### layout
- **Footer** → Badge, Dot, Glyph
- **PageHeader** → IconButton, Glyph, Breadcrumb, Tabs, Badge
- **SearchTrigger** → Kbd, Glyph
- **Sidebar** → SectionLabel, Count, Chevron, Glyph

### media
- **Carousel** → Glyph
- **Lightbox** → Glyph, CloseButton
- **MediaFrame** → Glyph

### menus
- **CommandPalette** → EmptyText, Kbd, SectionLabel, Glyph
- **ContextMenu** → MenuPanel
- **DropdownButton** → Spinner, Glyph, Menu
- **Menu** → Kbd, Button, SectionLabel, Glyph
- **MenuChip** → Glyph, Chevron, Menu
- **Toolbar** → Glyph, Separator, Menu

### navigation
- **BackToTop** → Glyph
- **BottomNav** → Indicator, Glyph
- **Breadcrumb** → Glyph, Menu
- **HierarchyNavigator** → IconButton, Glyph
- **Link** → Glyph
- **Navbar** → Glyph
- **Pagination** → Glyph, Select
- **Stepper** → Glyph, Marker
- **TreeView** → Chevron, Checkmark, Button, Glyph
- **Wizard** → Button, Glyph, Stepper

### patterns
- **AiResultPanel** → Badge, Button, SectionLabel, Glyph, CopyButton, Skeleton, SkeletonText
- **AnalysisRequest** → Checkmark, Button, Glyph, IconTile, Spinner
- **AtsAnalysisPanel** → Badge, Button, SectionLabel, Glyph, ProgressRing, CopyButton, Skeleton, SkeletonText, Meter, IconTile, Tag
- **CalendarOrganizer** → EmptyText, Control, IconButton, Button, Glyph, Weekday
- **ColorLabelManager** → IconButton, ListItem, EmptyText, Control, FieldLabel, Button, Glyph, Dialog
- **ColorLabelSelectionDialog** → Spinner, Chip, SearchInput, EmptyText, Button, Glyph, Dialog, LABEL_COLORS
- **CommentThread** → Badge, Button, Glyph, EmptyText, Count, Avatar
- **DualFilterBar** → SearchInput, Chip, Control, Button, SectionLabel, Glyph
- **FilterBar** → SearchInput, Control, Dot, Count, Button, Glyph
- **FlashcardSession** → OptionSwitcher, Slider, FieldLabel, Kbd, Button, Glyph, Meter, CloseButton, FlipCard, ProgressRing
- **ImportSourcesDialog** → IconTile, ListItem, Checkbox, Button, Glyph, Dialog
- **PricingTable** → Badge, Button, Glyph, OptionSwitcher
- **SetupChecklist** → Progress, Glyph, IconButton
- **LoadMore** → Progress, Button
- **RangeInput** → Control, FieldLabel, FieldHint, Select
- **QueryBuilder** → SectionLabel, Input, Select, Button, CloseButton

### Added 2026-10 (gap analysis)
- **patterns/** — `ChatMessage` + `ChatThread` + `TypingIndicator` (→ Avatar, IconButton, Glyph), `PromptInput` (→ IconButton, Glyph)
- **forms/** — `MentionInput` (→ Field, Control, Option, Surface, Avatar), `SignaturePad` (→ Field, Button)
- **primitives/** — `VisuallyHidden`, `SkipLink`, `LiveRegion`
- **media/** — `VideoPlayer` + `PlayerButton` (→ Glyph), `AudioPlayer` (→ PlayerButton, Glyph), `ImageCropper` (→ IconButton, Slider)
- **charts/** — `Gauge`, `FunnelChart` (→ Glyph), `Gantt`
- **display/** — `QRCode` (`encodeQR`), `Watermark`
- **finance/** (added 2026-10 for QuantCore) — `PriceChange` (→ Glyph), `Money` + `MoneyPrivacy` context, `InstrumentLabel`, `EnvironmentBar` (→ Button, Dot), `DataState` (→ Dot, Glyph), `RangeBandChart` (chart.css + useSize `niceRange`), `DirectionBadge` (→ Glyph), `ContributionBar`, `ValueShift` (→ Glyph), `NewsItem` (→ Tag, Dot). Also added for QuantCore: **data/** `CellStack`, `UsageMeter` (→ Meter), `MetricGroup`; **navigation/** `NavbarChip`; **feedback/** `GateList` (→ Glyph); **forms/** `CodeEditor` (`highlightCode`, --code-* tokens). Tokens: `tokens/sys-market.css` — `--market-up-*` / `--market-down-*` / `--market-flat-*` (direction never reuses status names), `--env-{research,paper,demo,live}-*`, `--market-band*`; `data-market-colors="standard|inverted|cvd"` on any subtree. `LineChart` now supports negative values and `includeZero={false}`.
- **data/** — `DiffViewer` (`diffLines`), `LogViewer` (→ Glyph) — both on the `.vui-code` surface

Not added (already covered): HoverCard = `Popover openOn="hover"` · RangeSlider = `Slider value={[lo,hi]}` · Result page = `StatusPage` · Image = `MediaFrame` · Drawer = `Dialog placement` · SortableList = `EditableCollection` / `Kanban` · Combobox = `Autocomplete` · AreaChart = `LineChart area` / `BarChart stacked`.

## Composition rules
One need → one atom. See the **Composition rules** card (01 Overview) for the full table.
- Container → Surface / Card · input shell → Field + Control · list row → Option / ListItem
- Round step or event badge → Marker; the line between them → Rail
- Tinted glyph box → IconTile · person / series → Avatar (`color` for series) · status point → Dot · number pill → Count
- Status chip → Badge · filter / keyword / removable chip → Tag (`variant` outline · soft · dashed, `tone`, `shape="pill"`)
- One-of-N in a track → Segmented (OptionSwitcher track, Tabs segmented, ThemeToggle segmented, LocaleSwitcher and MarkdownEditor read --segment-*)
- Bar → Meter · labelled task progress → Progress (renders Meter) · ring → ProgressRing (reads --meter-*)
- Group heading → SectionLabel · weekday header → Weekday

New comp token families: `--segment-*`, `--marker-*`, `--rail-*`, `--locale-*`, `--check-tick-*`. New ref/sys: `--syntax-*` (code palette), `--leading-display/compact/code`, `--control-height-inner-sm`, `--size-track-lg`, `--size-icon-tile-xs`, `--elevation-drawer-*`, `--motion-track`.

**Token lint** card (01 Overview) scans component CSS live: ref-token reads and colour literals must stay at 0; px literals are tracked per file.

IconButton gains `shape="circle"` and floating variants `raised` (arrows over content — Carousel) and `overlay` (on media — Lightbox); ghost buttons show `aria-pressed`. Use them instead of hand-rolled nav arrows. New comp tokens: `--fab-*`, `--cal-cell`, `--sheet-*`, `--topbar-h`, `--topbar-mark`. ai-analysis.css is split into analysis-request.css + ats-analysis.css. **Tone contrast** card (03 Color) checks --tone-fg legibility live in both themes.

`ColumnResize` (primitives) is the shared column-width handle for Table + DataGrid (drag · ←/→ · double-click reset · role="separator"); both read `--table-header-*`, `--table-row-*`, `--table-pin-shadow*`, and DataGrid rows use `--grid-row-height` (density-aware). Popover and BottomSheet take paint only from the Surface registry. A11y: DataGrid announces its result count; Kanban columns are lists; Scheduler day columns are keyboard-reachable "Add event" targets.
