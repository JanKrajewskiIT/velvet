# Velvet UI: SolidJS port, playbook and record

This library ports the read-only Velvet design-system reference in `velvet/`. The reference's `velvet/docs` describes the intended components and migration requirements; actual parity is established from source and styles, not from documentation claims. Shared workflows live in `.agents/skills`; this page records repository decisions, migration history and remaining verification limits.

On 2026-10-11, `DataGrid`, `ColumnManager`, `QueryBuilder`, `VirtualTable`, `VirtualList`, their controllers, saved-view helpers and styles moved to VelvetData. The coverage counts below describe the earlier port inventory, not the current UI export surface. The reference remains read-only. Current ownership and consumer changes are recorded in [VelvetData migration notes](../../VelvetData/docs/migration.md).

## Reference coverage

The source audit on 2026-10-10 found the following coverage before the corrections described below. These figures establish inventory and stylesheet parity, not runtime or pixel parity.

| Item                             | Evidence                                                                                                        |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Reference component entry points | 183 JSX components with declarations, in 12 component folders                                                   |
| Reference specimens              | 212; useful as the manual comparison inventory                                                                  |
| Port component coverage          | All 183 reference entry points have same-named TSX counterparts; internal parts are split into additional files |
| Reference exported names         | All 572 names occur in public root or group barrels; checked by name, not full behavioral equivalence           |
| Component CSS                    | All 174 reference files match the port verbatim                                                                 |
| Tokens and fonts                 | All 15 token files and 8 font files match verbatim                                                              |
| Entry stylesheet                 | `src/styles/styles.css` matches `velvet/styles.css`; all 188 import targets exist                               |

Corrections preserve the reference styles and component entry points. Added behavior and browser resets live in extension styles. A successful inventory audit alone does not establish that every prop, interaction or visual state matches the reference.

## Repository decisions

| Topic            | Decision                                                                                                                                                                                                                                                    |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Reference        | `velvet/` stays read-only. Runtime code imports the copied library files, not the reference.                                                                                                                                                                |
| Styles           | Reference CSS, tokens and fonts are copied verbatim into `src/styles`. Additions live in `extensions.css` and `extensions/*.css`.                                                                                                                           |
| Showcase         | The application lives separately in sibling `VelvetDemo`. Publish the library first, then update the demo to consume that published version. Local `showcase/`, `dist-showcase/`, showcase scripts and configuration references were removed on 2026-10-10. |
| Verification     | No tests are written or generated. The user runs commands and performs manual verification.                                                                                                                                                                 |
| Messages         | Typed `@jankrajewskiit/i18n` dictionaries for `en` and `pl`, exported as `velvetMessages`; explicit props override defaults.                                                                                                                                |
| Components       | One exported component per file; separate state machines and substantial render sections have their own modules.                                                                                                                                            |
| Public contracts | Root and group exports remain available after splitting modules. Shared types live below their consumers to avoid import cycles.                                                                                                                            |
| Authentication   | Applications share Velvet Auth and OIDC infrastructure. Session actions and role guards integrate directly with that architecture; a universal auth adapter is not required.                                                                                |
| Auth module      | Session components and lifecycle belong to `src/auth`, with exports owned by its index. Shared application bootstrap stays in `src/provider`. Showcase groups describe presentation, not source ownership.                                                  |
| Documentation    | This page owns the migration record and operational guidance; README covers package setup. VelvetDemo demonstrates component variants, state and composition without a separate API guide.                                                                  |
| Markdown         | An internal renderer is maintained instead of adding a parser dependency.                                                                                                                                                                                   |
| Navbar           | Two navigation levels are supported.                                                                                                                                                                                                                        |

The reference's instructions to import `velvet/styles.css` directly, create specimen tests and retain framework-specific file boundaries are adapted here: styles are copied, verification is manual, and Solid components are split where appropriate. Reference default strings are localized. Migration progress is recorded here instead of a separate `PORTING.md`.

## Migration history

The first reference drop was incomplete: primitives, navigation and patterns folders and five menu styles were missing, and the entry stylesheet referenced 58 absent files. A complete reference was subsequently supplied.

Earlier parity work compared exports and 164 Props interfaces, then restored `Input` multiline behavior and rows, change aliases on BottomNav, Anchor, Tabs and ThemeToggle, VirtualList loading markup, and LoadMore optional counts. Defaults were migrated to typed dictionaries, including shared `velvet.common` vocabulary.

The regression review retained provider-scoped toasts, numeric table collation and server sorting, consolidated loaders, and restored floating positioning, tooling configuration, Markdown features, CalendarOrganizer capabilities, AuthGuard and application bootstrap. The earlier hand-written modal inert handling was replaced by native modality in the current round.

The previous record reports passing `npm run typecheck`, `npm run lint`, `npm run lint:css`, `npm run build`, `npm run verify:pkg` and `prettier --check src showcase docs` on 2026-10-09 after an earlier refactoring round. Those historical results predate the current edits and do not validate them. The showcase path in that historical command no longer exists.

## Corrections on 2026-10-10

### Shared Velvet Auth integration

The implementation before `1beb856dbc69db7c1800ea28ef03cfbbbaa37251` coupled `AuthActionButton`, `AuthGuard`, the application provider and bootstrap to `@jankrajewskiit/auth`. The rewrite removed that coupling. The owner confirmed that this library serves applications sharing the same architecture and infrastructure, so the integration is restored against the local Velvet Auth 3.3.4 contract.

`AuthButton` now owns the session action through `useAuth`; `AuthActionButton` restores the original exported name with compact presentation defaults. Both await sign-in or sign-out, disable during session initialization or an outstanding action, preserve the current return URL by default and compose native click handlers. `createAuthAction` handles thrown failures and the dependency's resolved-promise error channel, prevents duplicate clicks, and suppresses operation callbacks after disposal or a session change. It does not cancel the underlying OIDC operation. Raw dependency error text is available to the application through its diagnostic callback, while rendered feedback is localized.

The three auth components and `createAuthAction` are colocated in `src/auth`. `src/auth/index.ts` is the owning export boundary, re-exported by the package root; action and pattern barrels no longer own auth exports. This is an accepted source-location deviation for the reference AuthButton. Reference stylesheet locations and `velvet.actions.authButton` / `velvet.patterns.authGuard` dictionary keys stay unchanged, preserving style and translation contracts. The showcase can present the button in its actions section independently of that module boundary.

`AuthGuard` resolves session state from the provider and checks any of its required roles. Automatic sign-in depends explicitly on session readiness, authentication and redirect behavior, so changing local busy/error state does not retrigger it. Failed initialization or sign-in presents a retry action; missing roles present the forbidden screen. UI guards complement server-side authorization.

`VelvetProvider.authConfig` installs the shared auth provider. Replacing the configuration object remounts its session subtree. `mountVelvetApp` handles the OIDC callback before rendering and is asynchronous again: it returns a disposer after mounting, `undefined` after starting callback navigation, and rejects on callback/bootstrap failure. Applications using `VelvetProvider` directly rely on Velvet Auth's own callback handling. Auth types and the provider/hook are re-exported from the root entry point. The temporary prop-driven auth contracts are replaced as described in README; other components do not require an auth configuration.

The authentication package must remain external and shared with the application, matching the existing package-driven Vite externalization. Package installation and lockfile regeneration are left to the owner. This source review used local auth implementation files; no auth runtime or command checks were performed.

### Reactive fields and component structure

`Field` now gives its render function one stable object with reactive getters for `id`, `invalid`, `describedBy` and `required`. Validation changes update the control attributes without rebuilding the input subtree. Consumers should read these properties in reactive JSX bindings; destructuring them once snapshots their values.

FieldLabel, FieldHint, CopyField, RailItem, SegmentedItem, SkipLink, LiveRegion, LoadingOverlay and ConfirmAction were separated into their own files. Dialog, BottomSheet, Lightbox, Tour, PhoneInput, Kanban and MediaFrame have separate internal panels, rendering parts or lifecycle hooks. Bare local-variable JSX refs were changed to explicit assignment callbacks; reactive element availability uses signals where placement and lifecycle require it.

### Modality and dismissal

Modal surfaces use native `<dialog>` and `showModal()`. The browser owns focus containment and background inertness. `createModal` owns initial focus, native cancel coordination, focus return and a counted scroll lock; nested modals release the lock only after the last modal closes. Dialog and Popover accept an optional `label` when no visible title is supplied. Visible titles, including JSX titles, are connected by `aria-labelledby`.

`createLayer` and `createDismiss` share one layer stack per document. Escape first passes through local keyboard handlers; a consumed event does not dismiss its parent. Outside mouse presses belong to the layer that was topmost when the event began, so dismissing a popup does not also dismiss the newly exposed modal on that same press. Ancestors register below their already mounted descendants. Tooltip, editor link popup, mention suggestions and inline organizer forms participate in layer ownership as well.

ConfirmDialog invalidates pending results on close, reopen and owner disposal. Only the current open dialog can update its error or busy state or notify `onError`. ConfirmAction also guards its post-confirmation close against owner disposal. These guards do not cancel the consumer's underlying operation.

Native dialog changes the modal root element and moves modal semantics from the inner visual panel to that root. Consumer selectors tied specifically to the previous backdrop element tag or inner `role="dialog"` need adjustment; class names remain the reference names. There is no document-wide Tab trap.

### Triggers and popup placement

Menu, Popover and ConfirmAction preserve supplied native interactive triggers instead of wrapping them in another button. Their own handlers run before the wrapper delegates activation; `preventDefault()` cancels delegation. Labels and noninteractive content receive a fallback button. Render functions remain the composition option: Menu and Popover callers spread the supplied attributes and handlers, while ConfirmAction callers invoke the supplied open callback.

`createFloating` now covers the original popup components and TreeSelect, Cascader, SearchInput, PhoneInput, TimePicker, ColorPicker, FilterChip, NotificationCenter, CalendarEventButton and Fab. Date picker popups, the editor link popup and mention suggestions use it as well. It handles flip, viewport shift, scroll, resize and size observation; the mention popup uses a virtual caret anchor. Tour uses the shared placement calculation for its step card.

When supported, panels use the native manual popover top layer while retaining their DOM order and Tab relationship to the trigger. The shared layer stack owns dismissal; native automatic light dismissal is not used. Browsers without `showPopover()` use fixed coordinates with containing-block compensation. That fallback can still be clipped by transformed overflow ancestors. Component styles control maximum panel dimensions; an oversized panel is not universally constrained by the positioning hook.

The platform contracts are described in the [HTML dialog specification](https://html.spec.whatwg.org/multipage/interactive-elements.html#the-dialog-element), [HTML popover specification](https://html.spec.whatwg.org/multipage/popover.html#the-popover-attribute) and [WAI-ARIA modal dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/).

### Keyboard interaction and virtualization

Native-button action menus have roving focus, ArrowUp/Down, Home/End and typeahead. MenuPanel, Select, PhoneInput and FilterChip have scoped typeahead appropriate to their existing interaction models. Active indices are kept within the current option set when data changes. Deferred focus work is cancelled on disposal. Escape handling in editable controls consumes the event when it reverts or clears local input state.

VirtualList and VirtualTable reconcile visible outer rows by record key rather than window position. Selection and focus follow keys across changes. Selection or focus changes alone do not rebuild the custom renderer. Default sizes and overscan values are normalized, empty collections are handled, and nested inputs or buttons retain their own keyboard and activation behavior.

Consumers must supply unique stable keys for reorderable collections (`getKey` in VirtualList, `rowKey` in VirtualTable). An index fallback cannot preserve record identity after reordering; duplicate keys warn and receive collision-safe fallback keys. The existing render callbacks take a record and numeric index, so their content is recreated when that record object or index changes. Rows leaving the rendered window are disposed. Persistent editing state belongs to the consumer's record state, not to an offscreen row subtree.

Exported shared configuration arrays and their plain record entries are readonly and frozen at runtime, including calendar providers, locale options, date presets, phone countries, analysis depths and score bands. The label color palette and public lists of tones, themes, aspects, loader variants, flashcard modes and billing periods are frozen too. Configuration props accept readonly arrays; consumers provide their own configuration rather than modifying library defaults.

## Git-scoped resync on 2026-10-11

This resync uses only the staged changes under `velvet/` relative to HEAD. It covers the changed component implementations, declarations, styles and tokens. Recron templates belong to a product application; generated reference bundles, specimens and manifests do not become library runtime code.

- NavbarUser adds the compact account panel with identity details, optional theme radios and sign-out. The panel uses shared floating placement and dismissal, returns focus on Escape, and closes when focus leaves. Navbar indicator and icon motion follow the updated reference tokens.
- Menu and MenuPanel add `iconPosition="end"`; checkbox indicators remain at the start. Table adds `layout="fixed"`. The existing JSX `addRow` slot and TableAddRowAction keep their loading, native button props and composition while adopting the reference sticky add-row styling.
- DataGrid adds `rowCount`, an automatic Reset view action, resets filters and columns to `defaultView`, and stores only resized width overrides. `defaultGridView` and `reconcileGridView` are public; the latter uses the existing bounded JSON codec and rejects malformed settings before schema reconciliation. The library keeps the name `GridViewState`, optional queries, versioned imports, persistence, right pins and virtualization.
- ColumnManager adds `resetValue`. Both it and GridColumn accept `hideable`, `pinnable` and `movable`; the existing `canHide`, `canPin` and `canMove` names take precedence. The standalone manager keeps `minVisible=0`; DataGrid keeps at least one visible column.
- TreeView adds positional pointer moves, Alt+arrow shortcuts, `canDrop`, drop indicators and the pure `moveTreeNode` helper. Its existing two-argument `onMove(id, targetId)` and Space/Enter move mode remain supported. Positional moves use `onMovePosition(move)` to avoid changing the existing callback contract. Empty `children` arrays identify folders; self and descendant moves are rejected, and focus returns to the moved item after rendering.
- CalendarOrganizer adds the reference `selected`, `defaultSelected` and `onSelectedChange` aliases, with the existing selectedDate API taking precedence. Controlled day changes follow the selected month. `confirmDelete=true` now uses inline Cancel/Delete actions with focus on Cancel, Escape cancellation and focus recovery after deletion; false deletes immediately. Multi-day events, inline editing and drag-to-move remain available.
- QueryBuilder adds optional `clearable`, `onClear`, `clearQuery`, an empty-state message and an All records summary. It keeps its existing reorderable default, typed operator restrictions and disabled controls. DataGrid enables clearing explicitly.
- AuthButton presents session initialization separately and uses the new error styling and glyph while retaining the shared Auth context and localized feedback.
- Markdown adds bare `www.` links, angle-bracket email links and reference images. Heading IDs remain unique even when a generated suffix is another heading's base; empty slugs use `section`. The existing escape-first renderer and URL allow-list remain in place.
- Four filled icons are added to the SVG registry and existing icon category. Changed CSS and motion/icon tokens are copied verbatim. The reference changes the CSS mask for `moon` without changing its SVG registry path; that upstream inconsistency is retained.

The 11 changed declaration files are mapped to the existing library components and public barrels. All 10 changed component/token CSS files have identical SHA-256 hashes to their reference counterparts. Authorized command results are recorded below; browser and VelvetDemo comparison remain unrun.

## Architecture map

- `src/components/<group>` contains actions, charts, data, display, feedback, forms, layout, media, menus, navigation, patterns and primitives, each with a public barrel.
- `src/hooks` contains shared controllable state, layer ownership, dismissal, native modality, floating placement, trigger composition, deferred focus and native-button menu navigation.
- `src/utils` contains class composition, date and math helpers, floating geometry, typeahead, motion preferences, IDs and polymorphic helpers.
- `src/i18n` contains typed group dictionaries, shared vocabulary, augmentation and translation access.
- `src/provider` contains VelvetProvider and mountVelvetApp; `src/theme` owns theme preference, persistence and OS synchronization.
- `src/styles` contains copied reference styles and library-owned extensions.
- Complex components use controllers, hooks and internal parts. Public component files re-export their public types when those types move to a shared lower module.

Shared render parts include ModalBackdrop, ComboboxOption / ComboboxOptionText and MenuItemContent. Composite-specific keyboard behavior remains with its owning component; positioning does not impose a universal keyboard model.

## Extensions beyond the reference

- CalendarOrganizer supports multi-day events, inline edit, delete confirmation, drag to move and controlled selection.
- Markdown supports nested and task lists, reference links, autolinks, setext headings, hard breaks, underscore emphasis and unique heading IDs. The task-row layout override lives in `src/styles/extensions/markdown.css`.
- AuthButton, AuthActionButton and AuthGuard integrate with the shared Velvet Auth context. VelvetProvider and mountVelvetApp provide provider and callback bootstrap. `@jankrajewskiit/auth` is a peer dependency and is externalized from the UI bundle.
- Popup placement and native layer handling described above supplement the reference behavior.

### Porting inventory beyond the design system

Use this inventory after mapping the reference components. These are library-owned additions or explicit integrations; they will not appear in a new design-system drop and must be reviewed separately. Source directory and demo navigation group are independent taxonomies: preserve the owning module and public export without moving files to mirror showcase sections. The sibling VelvetDemo project owns specimens and variant presentation.

| Addition                  | Port or preserve                                                                                                                                      | Owning boundary                                                                                              |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Velvet Auth integration   | AuthButton sign-in/out, AuthActionButton, role-aware AuthGuard, provider configuration and async OIDC callback bootstrap                              | `src/auth`, `src/provider`; shared `@jankrajewskiit/auth` peer, not copied auth protocol code                |
| Calendar organizer        | Multi-day event layout, drag-to-move, inline editing, delete confirmation and controlled selection                                                    | Calendar organizer component and its localized dictionary; keep domain persistence in the consumer           |
| Markdown extension        | Extended block/list/link syntax and unique heading IDs; preserve the dedicated task-row stylesheet                                                    | Markdown component, parser and `src/styles/extensions/markdown.css`                                          |
| Popup and modal lifecycle | Shared native dialog lifecycle, layer ownership/dismissal, trigger composition, anchored placement and fallbacks                                      | `src/hooks` and component adapters; preserve library extension CSS separately from copied reference styles   |
| Advanced collections      | Saved views, schema reconciliation, measured virtualization, stable identity, editing and constrained column settings                                 | VelvetData: DataGrid, ColumnManager, VirtualTable, VirtualList and their controllers/styles                  |
| Query builder             | Per-field operator restrictions, nested groups, accessible reordering and clearing                                                                    | VelvetData: QueryBuilder and its query model/dictionaries                                                    |
| Table composition         | `TableAddRowAction` slot and simple table display                                                                                                     | VelvetUi: Table and TableAddRowAction                                                                        |
| TreeView reparenting      | Drag-and-drop and keyboard reparenting; reject self/descendant targets and let the consumer update the controlled tree data                           | `TreeView` with `draggable` and `onMove`; localized instructions and status in the navigation dictionary     |
| URL/file import           | Select a configured URL or local-file source, validate URL schemes and file types, report async failures, and leave retrieval/parsing to the consumer | Separate `FileUrlImportDialog`; retain `ImportSourcesDialog` for connected-provider selection and connection |

For another port, first classify each item as (1) reference parity, (2) approved extension/integration, (3) consumer-owned application behavior, or (4) demo-only presentation. Port categories 1 and 2 into the library, keep category 3 at the consumer boundary, and present category 4 in VelvetDemo. Then check public exports, peer dependencies, i18n, extension CSS, package externalization and docs alongside component source. Update this inventory when an extension is added, removed or changes owner; do not treat it as proof that the corresponding runtime behavior has been manually verified.

### Data capability migration history

The earlier port integrated reusable table capabilities from VelvetData into the current Solid `DataGrid`, `ColumnManager`, `QueryBuilder` and `Table` contracts. The advanced components have now moved back to VelvetData with those current contracts, rather than restoring the old `DataGridPro` API. The grid/query descriptions below record behavior now owned by VelvetData; `TableAddRowAction` still belongs to VelvetUi. VelvetDemo's published dependency/import migration is a separate consumer step.

`DataGrid.view` and `onViewChange` control one `GridViewState`: search, query, sort, column order/visibility/pins and widths. Without `view`, the grid owns that state and takes initial settings from `defaultView`. Reset restores the initial default settings against the current schema. Changes to column definitions remove obsolete keys, append new columns, preserve allowed existing choices and constrain widths. Unsupported fields or operators are removed from saved queries when the field schema changes. Controlled owners must apply the emitted state; providing `view` without an update callback makes user changes read-only.

`manualFiltering` bypasses both local free-text search and query evaluation; `manualSorting` bypasses local ordering. The grid still edits the view and emits changes, allowing the application to fetch records from its server. The application owns fetching, loading, pagination and server enforcement. Selection, CSV export and the built-in footer operate on the supplied records; they do not infer a server-wide count or download unseen pages. `onExport` remains the record-export contract, separate from view-settings export.

`persistenceKey` opts into localStorage. Mount restores saved settings; writes are debounced and pending settings are flushed during disposal or a key change. `viewSettings` adds reset and JSON import/export actions. `parseGridView` and `serializeGridView` expose the same version-1 codec to consumers. The codec validates the envelope, sorting, pins, visibility, positive finite widths and query nodes before use. It rejects duplicate column keys and query IDs, unknown operators, malformed values, files above 1 MB, more than 500 columns or query nodes and query nesting deeper than 16. The current field schema then determines which validated rules remain applicable. Records, selected rows and executable accessors are excluded from the payload. Search and query operands are saved, so applications should scope storage keys to the appropriate user and dataset and avoid persisting sensitive operands.

Storage and file failures produce localized feedback and reach `onViewError` as diagnostics. Invalid stored settings are retained until the view changes rather than overwritten during mount. File reads are invalidated by disposal, a newer import or a changed view. Consumer callback exceptions propagate instead of being classified as malformed JSON. `persistenceKey` provides browser persistence, not cross-tab synchronization or server persistence.

Grid columns support left/right pins, `sortable`, `sortAccessor`, ascending `sortFn`, `filterAccessor`, free-text `filterFn` and width limits. Text predicates receive the trimmed, lower-case search string. `ColumnResize.max` bounds both pointer and keyboard resizing. `ColumnManager` adds independent `canHide`, `canPin`, `canMove` and `minVisible` constraints; `locked` takes precedence. The grid protects at least one visible column. These constraints apply in the model as well as the controls and saved-view reconciliation. The standalone manager retains its existing default of allowing every column to be hidden.

`DataGrid.virtual` enables a row window with `overscan` and an optional `rowHeight` estimate. Normal and expanded row heights are measured together; pinned columns, selection, editing and detail controls share the same window. Focused and edited records remain mounted when scrolled away. Record keys and column keys keep existing cells mounted across search, sorting, resizing and layout changes. Keyboard movement materializes and scrolls to its destination before deferred focus. Editing follows record identity and commits to one matching source record, rather than every record with a missing ID. If the edited record or editable column leaves the view, editing is cancelled. Unique stable `rowKey` values or `getRowId` are required when the application replaces, inserts or reorders records; index fallbacks cannot preserve identity through those operations. Heights of expanded records outside the window remain estimates until they are rendered and measured, and their content is unmounted when no longer retained by focus or editing.

`QueryField.operators` restricts the field's built-in operator set. Text fields add `ends`; `QueryOperatorValue` exposes the supported operator union. `QueryBuilder.disabled` blocks all edits; `reorderable` supplies move-up/down buttons for rules and nested groups. Clearing produces an empty root group while retaining its ID and combinator. Date, boolean and nested-group support remains available.

`TableAddRowAction` renders a native row and cell containing a ghost `Button` with the reference add-row styling. Place it in `Table.addRow` or a native tbody and supply `colSpan` including selection/expansion columns. The action is keyboard accessible, forwards native button attributes and leaves record creation to the application. The `addRow` slot is hidden while Table is loading.

TradingView's `lightweight-charts` engine and VelvetData's application adapter remain outside VelvetUi. The adapter includes trading-specific series, overlays and live-data coordination; they are not generic UI responsibilities. VelvetDemo can demonstrate that integration after consuming the published library. No dependency on VelvetData or lightweight-charts was added to VelvetUi. Demo specimens and their variants remain in VelvetDemo rather than a second variants guide here.

## Source audit and corrections on 2026-10-13

The combined UI/Data source inventory maps all 183 reference entry points: 178 in UI (including the relocated AuthButton) and five in Data. The reference declares 578 exported names; GridView is intentionally represented by GridViewState and ApplyColumns by applyColumns. The showcase manifest contains 212 component specimens and 39 foundation specimens. Name coverage is not a complete comparison of every prop or interaction.

All 174 copied component styles and 15 token files match the reference after line-ending normalization; all eight font files match byte-for-byte. The two former edits inside table.css and stepper.css now live in extension styles and their corresponding optional stylesheet groups. The reference remains read-only.

The correction scope is:

- Wizard owns one pending validation/finish run. Cancel, step replacement and disposal invalidate it. InlineEdit invalidates a save when Escape ends its edit session; a late result cannot close a new session or create a feedback timer after disposal. ConfirmDialog and both import dialogs share the same private createOperation primitive. Busy import dialogs block user dismissal and edits; externally closing/reopening them invalidates their local completion and error callbacks. Tree loading ignores completions after disposal. None of these guards cancel consumer-owned work or undo its external side effects.
- Select, Autocomplete and MultiSelect retain the active option by value, derive a valid available fallback after option changes, and close their panels when disabled. Mutation handlers also check disabled state. Select's hidden form input is disabled with the trigger. Tabs chooses an available initial item and preserves a keyboard entry point after removal or disabling; controlled selection remains consumer-owned.
- DateTimePicker's time list uses one roving tab stop, ArrowUp/Down, Home/End and typeahead, skipping unavailable slots. Enter/Space selects through its native option button. Date/time text and file sizes use the active locale. Calendar's today marker refreshes at local midnight and when the page becomes visible or focused.
- Carousel ignores consumed keyboard events and keys belonging to nested controls. Keyboard focus stops rotation until the user explicitly resumes it; the rotation control remains available with showDots=false. Marquee mounts its Solid children once and mirrors their rendered DOM into an inert, aria-hidden lane without duplicate ids. The presentation copy follows DOM mutations and input/change events, has no independent component state or handlers, and does not autoplay cloned media or participate in form submission/validation. Canvas content is a snapshot; property-only or canvas updates without DOM mutations/events are not independently observed. The original remains the interactive lane; keyboard focus pauses motion.
- CopyButton distinguishes a clipboard failure from an exception in onCopy. Callback exceptions reach the existing reportAsyncError channel. Pending copies are serialized and their local results are ignored after disposal.
- cssLength has one implementation in src/utils, with existing private import paths forwarding to it. callHandler is also owned by src/utils and composes native handlers in Tabs and ScrollArea. activeItemKey shares key reconciliation across option lists, tabs and time slots without merging their keyboard patterns.

VelvetData owns the CSV escaping policy and calendar-day query normalization described in its migration notes. TradingView's intentionally narrower feature scope is unchanged.

This round uses source and diff inspection only. No tests, builds, linters, formatters, package verification, or browser sessions were run. Run npm run verify separately in VelvetUi and VelvetData when authorized. Manual checks must cover delayed success/failure after cancel, close, reopen and disposal; changing and disabled option sets; native form submission; time-slot keyboard access; nested carousel controls and rotation; reactive marquee content; midnight rollover; English/Polish formatting; and Data's exported text/date semantics.

## Verification status and remaining limits

The follow-up implementation on 2026-10-13 adds the behavior and API described in [component behavior](component-behavior.md). InlineEdit now retains its pending-write lock after Escape; TreeView loading is tied to node identity/dataKey and supplies an abort signal. createOperation is public through /common and supports latest-result and single-flight ownership. Autocomplete includes its custom row in keyboard navigation; popup status/Retry lives outside listboxes. Tabs gains TabPanel relationships and manual activation. Shared form integration covers selectors and date/time pickers. ScrollArea refreshes dynamic content measurements; upload disabling covers callbacks/actions; carousel swiping respects nested controls. Marquee synchronizes copies incrementally, rewrites local IDs/references and supports copyVersion/renderCopy. This supersedes the narrower limitations of the first correction scope above. No execution checks have been run for either correction round.

The 2026-10-10 correction round was reviewed from source and configuration only. The Git-scoped resync on 2026-10-11 includes the following user-authorized checks. No tests were added or changed, and no application or development server was started. Browser behavior and pixel parity remain unverified. Later package verification is recorded after the historical command table.

All commands below use the VelvetUi repository root:

| Command                                                       | Result on 2026-10-11                                                   |
| ------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `npm run typecheck`                                           | Passed                                                                 |
| `npm run lint`                                                | Passed after correcting five lint findings                             |
| `npm run lint:css`                                            | Passed                                                                 |
| `npm run format:check`                                        | Passed after authorized formatting                                     |
| `npm exec -- prettier --write src docs/design-system-port.md` | Completed; reference styles and `velvet/` are ignored                  |
| `npm run build`                                               | Unrun; separate execution authorization required                       |
| `npm run verify:pkg`                                          | Unrun; requires the built package and separate execution authorization |

After adding `/common`, an authorized `npm run verify` passed formatting, linting, stylesheet linting, the build and packed-package verification for the root and `/common` ESM entry points. The package was labelled 3.4.5 during that check and subsequently published as 3.4.6. UI 3.4.8 with I18n 3.4.3 was subsequently published and installed. These are historical results; the current UI/Data manifests are version 3.6.1 and this correction round has no executed aggregate verification.

There is no test script or generated test suite. The initial showcase cleanup did not require dependency resolution, and the VelvetData extraction added no new dependency to UI. Velvet Auth is declared as a `^3.3.4` peer with a `^3.5.5` development dependency; I18n's peer range is `>=3.4.4 <4`. Refresh resolved lockfile entries through the package manager when dependencies change, following the [release order](../../VelvetData/docs/migration.md#release-order), before using clean-install workflows or publishing.

Manual verification in VelvetDemo remains unrun, particularly:

| Area                      | Cases to compare with the reference                                                                                                                                                                                                                         |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Modal layers              | Initial focus, Tab and Shift+Tab containment, nested dialogs and popups, successive Escape presses, outside presses, focus return, busy confirmation, repeated open/close and delayed success or rejection after close, reopen or disposal                  |
| Popup geometry            | All viewport edges, scroll and resize, zoom, transformed or clipping ancestors, popups inside a dialog, oversized panels and unsupported-popover fallback                                                                                                   |
| Trigger composition       | Label fallback, supplied button or link, JSX title, render function, original click/keyboard handlers and `preventDefault()`                                                                                                                                |
| Composite widgets         | Arrow keys, Home/End, typeahead, empty and changing option sets, Tab exit and controlled state                                                                                                                                                              |
| Virtualized records       | Insert/delete/reorder, replacement objects, stable keys, focus/selection, nested controls, rows leaving and re-entering the window                                                                                                                          |
| Visuals and localization  | All 212 reference specimens, extensions, theme states, `en` and `pl`; Polish wording needs native review                                                                                                                                                    |
| Velvet Auth               | Initial session lookup, sign-in/out success and failure, rapid clicks, callback navigation and callback rejection, current return URL, any-role checks, forbidden screen, retry after redirect failure, session changes and unmount during a pending action |
| Grid view state           | Controlled/uncontrolled changes, server filtering/sorting, schema changes, default/reset behavior, blocked storage, malformed and oversized imports, saved-view round trips, disposal or view changes during import, key changes and pending writes         |
| DataGrid window           | Long datasets, keyboard movement beyond the rendered window, left/right pins, width limits, stable-key selection/edits through filtering and sorting, replacement records, variable-height details and focused nested controls                              |
| Table and query additions | Add-row keyboard activation and loading, last-visible-column protection, independent column capabilities, rule/group reordering, clearing, operator restrictions, disabled controls and both locales                                                        |

Native modal focus containment requires browsers supporting `HTMLDialogElement.showModal()`. Older-popover fallback and rendering limits above remain explicit compatibility boundaries. Manual verification is necessary before claiming complete runtime parity or release readiness.

Tooling ignores only read-only reference areas where appropriate. Prettier, Stylelint and lint-staged include library extension styles. Targeted JSX accessibility suppressions explain owner-driven composite keyboard behavior and backdrop pointer shortcuts. `solid/no-react-specific-props` remains disabled for the reference `htmlFor` API.

## Resync with a new reference drop

1. Update `velvet/` separately from library changes and compare the new source with the previous reference.
2. Copy changed CSS, tokens and fonts verbatim and compare their contents. Review extension rules against the changed reference styles.
3. Apply changed component contracts and behavior to the matching Solid entry points and their split internal modules (`design-system-parity-audit`).
4. Port new components in dependency order (`design-system-solid-port`), then localize defaults (`component-library-i18n-migration`).
5. Remove obsolete component files, public exports and dictionary keys when components are removed.
6. Update specimen entries in the separate VelvetDemo application against `velvet/templates/showcase/cards.json`.
7. Repeat the source audit for affected groups, perform authorized command/manual checks, and record their date and scope here.

## Breaking changes versus 3.x

- Removed: ThemeProvider, useFocusTrap, useClickOutside, useEscapeKey, useFloating (replaced by createFloating), default label constants and messages props.
- Component names follow the reference after renaming or merging.
- VelvetProvider accepts `authConfig` directly rather than the old nested `config`; `mountVelvetApp` returns a Promise resolving to a disposer or `undefined` after callback navigation.
- AuthButton and AuthGuard now use Velvet Auth context instead of the temporary session-state props. AuthActionButton is restored with current Velvet styles; required-role and redirect behavior are restored on AuthGuard.
- Popover, Tooltip and Menu `side` values are preferences and can flip.
- Message keys are under `velvet.*`, with shared words in `velvet.common`.
- Modal roots now use native dialog elements as described above.
