# Velvet UI: SolidJS port, playbook and record

This library ports the read-only Velvet design-system reference in `velvet/`. The reference's `velvet/docs` describes the intended components and migration requirements; actual parity is established from source and styles, not from documentation claims. Shared workflows live in `.agents/skills`; this page records repository decisions, migration history and remaining verification limits.

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

| Addition                    | Port or preserve                                                                                                                                                       | Owning boundary                                                                                                                                              |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Velvet Auth integration     | AuthButton sign-in/out, AuthActionButton, role-aware AuthGuard, provider configuration and async OIDC callback bootstrap                                               | `src/auth`, `src/provider`; shared `@jankrajewskiit/auth` peer, not copied auth protocol code                                                                |
| Calendar organizer          | Multi-day event layout, drag-to-move, inline editing, delete confirmation and controlled selection                                                                     | Calendar organizer component and its localized dictionary; keep domain persistence in the consumer                                                           |
| Markdown extension          | Extended block/list/link syntax and unique heading IDs; preserve the dedicated task-row stylesheet                                                                     | Markdown component, parser and `src/styles/extensions/markdown.css`                                                                                          |
| Popup and modal lifecycle   | Shared native dialog lifecycle, layer ownership/dismissal, trigger composition, anchored placement and fallbacks                                                       | `src/hooks` and component adapters; preserve library extension CSS separately from copied reference styles                                                   |
| DataGrid saved views        | Controlled/uncontrolled view, defaults/reset, schema reconciliation, bounded versioned JSON codec and optional localStorage persistence                                | Existing DataGrid and focused `src/components/data/dataGrid*` modules; consumer owns server requests and user/data scoping                                   |
| DataGrid capabilities       | Manual server filtering/sorting, stable record/cell identity, virtualization and measured details, column pins/limits, hardened column controls and focus-safe editing | Existing DataGrid, ColumnManager, shared table model and extension styles; preserve the current package contracts rather than importing VelvetData's old API |
| Query and table composition | Per-field operator restrictions, accessible rule/group reordering and clearing; `TableAddRowAction` slot                                                               | Existing QueryBuilder and Table APIs with typed `en`/`pl` dictionaries                                                                                       |

For another port, first classify each item as (1) reference parity, (2) approved extension/integration, (3) consumer-owned application behavior, or (4) demo-only presentation. Port categories 1 and 2 into the library, keep category 3 at the consumer boundary, and present category 4 in VelvetDemo. Then check public exports, peer dependencies, i18n, extension CSS, package externalization and docs alongside component source. Update this inventory when an extension is added, removed or changes owner; do not treat it as proof that the corresponding runtime behavior has been manually verified.

### Capabilities extracted from VelvetData

The reusable table capabilities from the sibling VelvetData project extend the existing `DataGrid`, `ColumnManager`, `QueryBuilder` and `Table`. There is no second `DataGridPro` or duplicate query builder in this package. The implementation uses the current Solid component contracts, dictionaries and reference styles; it does not copy VelvetData's older component APIs or combined state hook. This work does not change VelvetData or VelvetDemo.

`DataGrid.view` and `onViewChange` control one `GridViewState`: search, query, sort, column order/visibility/pins and widths. Without `view`, the grid owns that state and takes initial settings from `defaultView`. Reset restores the initial default settings against the current schema. Changes to column definitions remove obsolete keys, append new columns, preserve allowed existing choices and constrain widths. Unsupported fields or operators are removed from saved queries when the field schema changes. Controlled owners must apply the emitted state; providing `view` without an update callback makes user changes read-only.

`manualFiltering` bypasses both local free-text search and query evaluation; `manualSorting` bypasses local ordering. The grid still edits the view and emits changes, allowing the application to fetch records from its server. The application owns fetching, loading, pagination and server enforcement. Selection, CSV export and the built-in footer operate on the supplied records; they do not infer a server-wide count or download unseen pages. `onExport` remains the record-export contract, separate from view-settings export.

`persistenceKey` opts into localStorage. Mount restores saved settings; writes are debounced and pending settings are flushed during disposal or a key change. `viewSettings` adds reset and JSON import/export actions. `parseGridView` and `serializeGridView` expose the same version-1 codec to consumers. The codec validates the envelope, sorting, pins, visibility, positive finite widths and query nodes before use. It rejects duplicate column keys and query IDs, unknown operators, malformed values, files above 1 MB, more than 500 columns or query nodes and query nesting deeper than 16. The current field schema then determines which validated rules remain applicable. Records, selected rows and executable accessors are excluded from the payload. Search and query operands are saved, so applications should scope storage keys to the appropriate user and dataset and avoid persisting sensitive operands.

Storage and file failures produce localized feedback and reach `onViewError` as diagnostics. Invalid stored settings are retained until the view changes rather than overwritten during mount. File reads are invalidated by disposal, a newer import or a changed view. Consumer callback exceptions propagate instead of being classified as malformed JSON. `persistenceKey` provides browser persistence, not cross-tab synchronization or server persistence.

Grid columns support left/right pins, `sortable`, `sortAccessor`, ascending `sortFn`, `filterAccessor`, free-text `filterFn` and width limits. Text predicates receive the trimmed, lower-case search string. `ColumnResize.max` bounds both pointer and keyboard resizing. `ColumnManager` adds independent `canHide`, `canPin`, `canMove` and `minVisible` constraints; `locked` takes precedence. The grid protects at least one visible column. These constraints apply in the model as well as the controls and saved-view reconciliation. The standalone manager retains its existing default of allowing every column to be hidden.

`DataGrid.virtual` enables a row window with `overscan` and an optional `rowHeight` estimate. Normal and expanded row heights are measured together; pinned columns, selection, editing and detail controls share the same window. Focused and edited records remain mounted when scrolled away. Record keys and column keys keep existing cells mounted across search, sorting, resizing and layout changes. Keyboard movement materializes and scrolls to its destination before deferred focus. Editing follows record identity and commits to one matching source record, rather than every record with a missing ID. If the edited record or editable column leaves the view, editing is cancelled. Unique stable `rowKey` values or `getRowId` are required when the application replaces, inserts or reorders records; index fallbacks cannot preserve identity through those operations. Heights of expanded records outside the window remain estimates until they are rendered and measured, and their content is unmounted when no longer retained by focus or editing.

`QueryField.operators` restricts the field's built-in operator set. Text fields add `ends`; `QueryOperatorValue` exposes the supported operator union. `QueryBuilder.disabled` blocks all edits; `reorderable` supplies move-up/down buttons for rules and nested groups. Clearing produces an empty root group while retaining its ID and combinator. Date, boolean and nested-group support remains available.

`TableAddRowAction` renders a native row and cell containing a dashed `Button`. Place it in `Table.addRow` or a native tbody and supply `colSpan` including selection/expansion columns. The action is keyboard accessible, forwards native button attributes and leaves record creation to the application. The `addRow` slot is hidden while Table is loading.

TradingView's `lightweight-charts` engine and VelvetData's application adapter remain outside VelvetUi. The adapter includes trading-specific series, overlays and live-data coordination; they are not generic UI responsibilities. VelvetDemo can demonstrate that integration after consuming the published library. No dependency on VelvetData or lightweight-charts was added to VelvetUi. Demo specimens and their variants remain in VelvetDemo rather than a second variants guide here.

## Verification status and remaining limits

This correction round was reviewed from source and configuration only. No tests were added or changed. No build, typecheck, test, verification script, lint, formatter, development server or runtime/manual verification was run. Current compile status and full behavioral or pixel parity therefore remain unconfirmed.

The user owns the following checks. These commands are listed for reproducibility and have not been executed for the current changes:

- `npm run typecheck`
- `npm run lint`
- `npm run lint:css`
- `npm run format:check`
- `npm run build`
- `npm run verify:pkg`
- `npm run verify` combines formatting, linting, stylesheet linting, build and package verification; individual checks above need not be repeated if this is used.

There is no test script or generated test suite. The initial showcase cleanup did not require dependency resolution, and the VelvetData extraction adds no dependency. Velvet Auth is now declared as a `^3.3.4` peer and development dependency. The existing `package-lock.json` has not been regenerated; the owner must run the package manager's lockfile update before using clean-install workflows or publishing.

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
