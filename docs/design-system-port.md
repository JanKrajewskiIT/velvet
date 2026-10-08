# Velvet UI: SolidJS port, playbook and record

How the library was built from the Velvet design-system reference (`velvet/`), which decisions apply, what was verified, and how to repeat or resync the work. Procedures live in shared skills (`.agents/skills`); this page records the project-specific decisions and results. Figures marked "checked" were measured on 2026-10-08 with read-only commands.

## Reference and port at a glance

| Item                                                     | Value                                                                                |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Reference components                                     | 183 (`.jsx` and `.d.ts`), 212 specimens, 12 component folders                        |
| Reference entry stylesheet                               | `velvet/styles.css`, 188 imports                                                     |
| Port components                                          | 256 `.tsx` files in `src/components` (granular: sub-components have their own files) |
| Reference exported names found in `src`                  | 572 of 572 (checked, by name only)                                                   |
| Component CSS identical to the reference                 | 174 of 174 (checked)                                                                 |
| Tokens and fonts identical                               | 15 of 15 and 8 of 8 (checked)                                                        |
| `src/styles/styles.css` identical to `velvet/styles.css` | yes (checked)                                                                        |
| Import targets missing in `src/styles/styles.css`        | 0 (checked)                                                                          |

## Decisions that apply to this repository

| Topic             | Decision                                                                                                                                                       |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Reference         | `velvet/` is a read-only pattern. Nothing in `src/` imports or links it. Replacing the folder is how the reference is updated.                                 |
| CSS and tokens    | Copied verbatim into `src/styles`. Library additions live only in `src/styles/extensions.css` and `src/styles/extensions/*.css`, imported from `src/index.ts`. |
| Tests             | None are written or generated. Verification is static plus manual.                                                                                             |
| Messages          | `@jankrajewskiit/i18n`, locales `en` and `pl`. Library messages ship as `velvetMessages`.                                                                      |
| Files             | One exported component per file. Sub-parts with their own state or reuse live in separate files.                                                               |
| Documentation     | The previous `docs/` tree was outdated and removed. This page is the only project document.                                                                    |
| API compatibility | Breaking changes versus 3.x are accepted.                                                                                                                      |
| Dependencies      | None added. Peers: `solid-js`, `@jankrajewskiit/i18n`.                                                                                                         |
| Markdown          | Own renderer, extended instead of adopting a parser dependency.                                                                                                |
| Navbar            | Two levels are enough; no deeper nesting.                                                                                                                      |

### Where the reference's own guidance was not followed

| Reference guidance (`velvet/docs/AGENTS.md`)            | Decision here                                                                |
| ------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Import `velvet/styles.css` directly                     | Copy it, compare hashes                                                      |
| Specimen pages and Playwright visual and behavior tests | No tests; static audit and manual checks                                     |
| One `.tsx` per `.jsx`                                   | Granular files; the union of split files is compared with the reference file |
| Keep reference default strings                          | Typed i18n; props still override defaults                                    |
| Track progress in `PORTING.md`                          | Status lives on this page                                                    |

## Reproduction order

| Phase                        | Skill                              | Result in this project                                                                                                                                                                                                                                                                                                                                                                                                      |
| ---------------------------- | ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1. Assess reference and port | `design-system-solid-port`         | The first reference drop was partial: component folders for primitives, navigation and patterns were missing, five menu CSS files were missing, the entry stylesheet imported 58 files that did not exist, and sources existed for 126 of the 183 documented components. The user supplied a complete drop. CSS was identical to `src/styles`. The port was mostly faithful.                                                |
| 2. Settle constraints        | `design-system-solid-port`         | Tables above.                                                                                                                                                                                                                                                                                                                                                                                                               |
| 3. Localize defaults         | `component-library-i18n-migration` | Foundation (`src/i18n`), pilot components, then twelve groups in parallel batches: actions, primitives, display, feedback, forms (A to M, N to Z), navigation and menus, data and charts, media and layout, patterns (A to F, G to Z). Empty agent results were detected by checking key usage; charts, patterns, TransferList, TransferPanel and TreeSelect were completed again or by hand. ConfirmDialog uses rich text. |
| 4. Parity audit              | `design-system-parity-audit`       | First audit: exports mapped, 164 Props interfaces compared, `aria`, roles, data attributes, keys, listeners, timers and classes checked. Fixed: `Input` multiline and rows, `onChange` aliases on BottomNav, Anchor, Tabs and ThemeToggle, VirtualList loading markup, LoadMore optional counts. Left: `VirtualTable.rowKey`. Name-level recheck on 2026-10-08: 572 of 572.                                                 |
| 5. Typecheck                 | none                               | `npm run typecheck` passed. Lint and stylelint were blocked until their configs were restored.                                                                                                                                                                                                                                                                                                                              |
| 6. Regression review         | `implementation-regression-review` | Previous implementation compared with the staged replacement; verdicts below.                                                                                                                                                                                                                                                                                                                                               |
| 7. Restorations              | skills named below                 | See the extensions list.                                                                                                                                                                                                                                                                                                                                                                                                    |

## Regression review verdicts

| Area                       | Verdict                                                                                                       |
| -------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Modal handling             | New is better: inert background and one layer stack instead of Tab trapping.                                  |
| Table sorting              | New is better: numeric collation and server sort.                                                             |
| Toasts                     | New is better: provider-scoped state instead of module globals.                                               |
| Loaders                    | Equal: variants consolidated into `Loader`.                                                                   |
| Positioning                | Old was better: flip, shift and resize handling. Restored as `createFloating` (`anchored-popup-positioning`). |
| Tooling configs and README | Old was needed: package scripts reference them. Restored.                                                     |
| Markdown                   | Old library was more complete. The own renderer was extended instead (`safe-markdown-renderer`).              |
| Scheduler                  | Old edit, delete, multi-day and drag support was restored in `CalendarOrganizer`.                             |
| Messages                   | Old shared `common` vocabulary was restored as `velvet.common`.                                               |
| Auth and bootstrap         | Old guard and provider restored without an auth library dependency.                                           |

## Architecture map

- `src/components/<group>`: actions, charts, data, display, feedback, forms, layout, media, menus, navigation, patterns, primitives. Each group has an `index.ts`.
- `src/hooks`: `createControllable`, `createLayer`, `createDismiss`, `createModal`, `createFloating`.
- `src/utils`: `cx`, `date`, `polymorphic`, `tone`, `floating`.
- `src/i18n`: `en` and `pl` dictionaries per group plus `common`, `augment.ts`, `useTranslate.ts`.
- `src/provider`: `VelvetProvider`, `mountVelvetApp`.
- `src/theme`: theme preference, persistence and OS sync.
- `src/styles`: verbatim reference CSS and tokens, plus `extensions`.
- `showcase`: demo app for manual checks.

## Extensions beyond the reference

- `createFloating` placement for Popover, Tooltip, Select, MultiSelect, Autocomplete and Menu.
- `CalendarOrganizer` (`organizerEvents.ts`, `OrganizerEventRow`, `OrganizerEventForm`, `OrganizerQuickAdd`): multi-day events, inline edit, delete confirmation, drag to move, controlled selection.
- Markdown: nested and task lists, reference links, autolinks, setext headings, hard breaks, underscore emphasis, unique heading ids. Task items render a `vui-prose__row` wrapper, so `extensions/markdown.css` overrides the reference task layout.
- `AuthGuard`, `VelvetProvider`, `mountVelvetApp`.

## Known gaps and unverified areas

- Not yet using `createFloating`: TreeSelect, Cascader, SearchInput, PhoneInput, TimePicker, ColorPicker, FilterChip, NotificationCenter, CalendarEventButton, Fab.
- `VirtualTable.rowKey` is not implemented.
- Files above the 250-line guideline (checked, excluding i18n and styles): DataGrid 543, Table 409, ColumnManager 320, RichTextEditor 320, TreeView 317, TransferPanel 304, Cascader 299, MarkdownEditor 271, VideoPlayer 266, Autocomplete 264, TreeSelect 264, Scheduler 261, ImageCropper 256, VirtualList 255, MultiSelect 253, ColorLabelSelectionDialog 252, Calendar 252, EditableCollection 251. `renderMarkdown.ts` (323) and `encodeQR.ts` (327) are single-purpose modules. Review with `solidjs-library-audit`.
- Not verified at runtime: pixel parity with the reference specimens, behavior of the restored features, showcase in `en` and `pl`.
- Polish translations need a native review.
- Verified on 2026-10-08: `npm run typecheck`, `npm run lint` and `npm run lint:css` pass with no findings. Unrun: `npm run build`, `npm run verify:pkg`.
- Lint exceptions are targeted `eslint-disable-next-line` directives with a reason. They cover WAI-ARIA composite patterns whose keyboard handling lives on the owning element (listbox options, menu items, tree rows, radiogroups with roving focus, modal backdrops closed by Escape) and media elements with user-supplied sources. `solid/no-react-specific-props` is off because `FieldLabel` keeps the reference prop `htmlFor`.
- Stylelint skips the verbatim reference CSS (`src/styles/components`, `tokens`, `fonts`, `styles.css`) and checks only `src/styles/extensions*`.
- `package-lock.json` must be regenerated after the manifest changes.
- Staged `dist-showcase/` and `velvet/` should be unstaged if they are not meant for history.

## Resync with a new reference drop

1. Replace `velvet/` in its own commit.
2. Diff the folder against the previous commit.
3. For CSS, tokens and fonts: copy the changed files and compare hashes. Extension files stay untouched; recheck that they still apply.
4. For changed component sources or declarations: apply the same change to the matching Solid files (`design-system-parity-audit`).
5. For new components: port in dependency order (`design-system-solid-port`), then localize (`component-library-i18n-migration`).
6. For removed components: remove files, exports, demo entries and dictionary keys.
7. Rerun the audit for touched groups and record the date and affected components here.

## Breaking changes versus 3.x

- Removed: `ThemeProvider`, `useFocusTrap`, `useClickOutside`, `useEscapeKey`, `useFloating` (replaced by `createFloating`), default label constants and `messages` props.
- Renamed or merged components follow the reference names.
- `VelvetProvider` no longer takes an auth configuration; `mountVelvetApp` is synchronous and returns a disposer.
- `side` on Popover, Tooltip and Menu is a preference and can flip.
- Message keys moved under `velvet.*`, with shared words in `velvet.common`.
