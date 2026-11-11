# VelvetUi

SolidJS component library and design system.

Documentation: [Recron project docs](https://docs.bluebraces.online/projects/velvet-ui/).

## Field error announcements

`Field` keeps a separate error status mounted before errors change. Controls composed with `Field`, plus `OtpInput`, `RangeInput` and `MarkdownEditor`, announce subsequent error changes politely by default. Hints remain ordinary descriptions. Empty error regions do not reserve layout space; `reserveHint` controls only space reservation. Initial errors remain visible and associated with the control.

Pass `data-field-error-announcement="none"` to the control when an application-owned summary or announcer presents that error. This disables automatic error speech while retaining the visible message, invalid state and `aria-describedby` association. Omit the attribute, or use `"polite"`, for independent field announcements. The shared options and type are exported as `FIELD_ERROR_ANNOUNCEMENTS` and `FieldErrorAnnouncement`.

Custom controls can compose `FieldFeedback` with distinct `hintId` and `errorId` values. Point `aria-describedby` to the error only while it has content, otherwise to the hint while present. Character counts have their own description id. `FieldHint` itself does not announce changes automatically, including when its `lane` option is enabled.

## Tabs and code regions

Give `Tabs` an `aria-label` or `aria-labelledby`, especially when a view contains multiple tablists. `activation="manual"` keeps Arrow, Home and End navigation separate from activation by Enter, Space or click. Leaving the tablist resets its entry tab stop to the selected tab without moving focus. Automatic activation remains the default.

`PageHeader` forwards `tabActivation` and `tabsLabel` to its section tabs. Both are optional for compatibility; applications should supply a localized name and choose manual activation for panels that load data.

`CodeSnippet` accepts a localized `label`, falling back to `title` and then the library's localized code label. Without variants, its focusable code block is a named `region`. With nonempty `tabs`, the named tablist controls a focusable `tabpanel` labelled by the selected variant. Empty variant lists use the plain code region.

## Neutral component APIs

- Use `Delta` for signed changes and `unit=" bp"` for basis points. `Delta` formats numbers using the active locale unless you pass `locale`. Use `CodeLabel` with `code` and `tag`. `PriceChange` and `InstrumentLabel` still accept their original props.
- Use `DirectionBadge` with `up`, `down`, `flat` or `muted`. Pass children for a domain-specific label. Set `data-trend-colors="standard|inverted|cvd"` on the theme root or a subtree. When both colour-mode attributes are set on the same element, `data-trend-colors` takes precedence over `data-market-colors`.
- Use `EnvironmentBar` with `tone`, `label` and `onStop`. Pass `tone="info"` for the neutral info label. Existing calls with no tone or stop props retain the paper default. Use `NewsItem` with `tags` and `onTagClick`.
- Use `AnalysisReport` and the `Report*` types for analysis results. `AnalysisRequest` accepts the source kinds `document`, `organization` and `link` alongside its existing kinds.
- Use `PracticeSetup` with `collections`. Its `onStart` payload has a `collection` id. `PracticeSession` and `PracticeSummary` use the same card and result shapes as the existing flashcard components.

## Updated design-system primitives

`Checkbox`, `Radio` and `Switch` accept `defaultChecked` for the initial uncontrolled state and the native form reset value. Use `checked` when the application owns the state.

`OptionSwitcher variant="list"` renders radio buttons with descriptions. Options may supply `disabledReason`, shown while disabled. `Option` accepts `as`, including `as="button"` with native button type and disabled behavior. `ListboxPanel`, `Listbox`, `ListboxOption`, `ListboxEmpty` and `ListboxSkeleton` provide the shared surfaces and rows; the owning control still handles selection and keyboard navigation. `Select`, `Autocomplete`, `MultiSelect`, `SearchInput`, the phone and time pickers, `Cascader` and `FilterChip` use these surfaces or rows with their existing focus and positioning. `TreeSelect` uses the panel around its tree. Put actionable failure content outside a listbox, as the existing combobox status components do.

`Columns` wraps weighted `Column` children using `grow` and `basis`. `Grid` accepts `fit` together with `min` to use auto-fit tracks. `PeriodNav` provides Today and previous/next controls; supply `prevLabel` and `nextLabel` with the relevant period unit. `PeriodNavButton` provides an individual arrow.

`Money` and `ContributionBar` accept `locale`, defaulting to the active locale. `DataState variant="block"` composes `EmptyState` and accepts its `size`. `RobotProcessingIndicator` has a localized default label. `Icon` resolves the exported legacy aliases to canonical glyphs.

`Popover` accepts `bare` for direct panel content and `panelClassName` for panel styling. Native attributes, refs and handlers target its outer span; the library composes its owned handlers. `NotificationCenter` uses this shared panel.

`AuthControl` takes session status and sign-in/sign-out callbacks. `AuthButton` uses the Velvet Auth provider and keeps its existing redirect and error options.

`TreeView` takes the reference’s positional move callback through `onMovePosition({ id, targetId, position })`. When both callbacks are set, it takes precedence over the legacy `onMove(id, targetId)`.

`Table.addRow` accepts `{ onAdd, label?, disabled? }` and renders a button spanning all columns, including selection and expansion. Existing native row slots and `TableAddRowAction` remain supported.

`DataGrid`, `ColumnManager`, `QueryBuilder`, `VirtualList` and `VirtualTable` belong to `@jankrajewskiit/data`, together with their types, query helpers, `applyColumns`, `defaultGridView` and `reconcileGridView`. Import them from VelvetData and compose `velvetDataMessages` with the UI messages. Their translations use the `velvetData` namespace. `Table`, `ColumnResize`, the base controls and shared `/common` helpers remain in VelvetUi. The design-system reference includes both packages' components; it does not define the public boundary of VelvetUi. See the [VelvetData documentation](https://docs.bluebraces.online/projects/velvet-data/).

`StatusBar` and `StatusBarItem` start the `trading` group. The bar accepts `start`, `children` and `end`; `fixed` pins it to the viewport bottom, so reserve its default 32px height in the page layout. Set `--statusbar-height` on its root to override that height. Items accept a semantic `tone` with an optional pulsing dot, or an `icon`, plus `mono`, `strong`, `title` and responsive `hide` (`md` below 1024px, `sm` below 640px). Convey the status in the text as well as the tone. The bar has a localized landmark name; live announcements remain the consumer's choice. Styles are included by the root entry or available through `@jankrajewskiit/ui/styles/trading` for selective imports.

`MarketSessionClock` renders inline `StatusBarItem` segments or `variant="list"`. Supply unique market `code` values, an IANA `timeZone` (default UTC), local `open`/`close` times (default 09:00–17:00), and optionally `days`, `holidays`, `earlyClose` or `alwaysOpen`. Trading days default to Monday–Friday; the application owns the holiday calendar. The clock refreshes every 30000ms, while `refresh={0}` takes an initial reading without an interval and `now` provides a fixed moment. Timers are replaced on relevant prop changes and cleared on disposal. Live clocks render a placeholder until client mount; a fixed `now` renders immediately. Text, numbers and 24-hour clock digits follow the active locale, with optional label templates using `{t}` and `{d}`. No periodic live announcements are added. `class` applies to the list or each inline item; `hide` applies to inline items.

`marketSession(market, date?)` returns a discriminated `MarketSessionState`: `pre`, `open` or `closed`, including the opening/closing time and remaining minutes for regular sessions, or `alwaysOpen` for 24/7 venues. Returned times use locale-neutral HH:MM. Narrow the state before reading its fields. The model describes one session within a local calendar day; overnight sessions and split sessions are outside this contract. Regular schedules validate dates, weekdays and times (00:00–23:59), reject closing before opening, and let invalid time zones fail through `Intl`. These validation rules, the typed state, localized output, stable row keys and mount-safe live initialization are library adaptations of the reference.

`ContextSwitcher` composes `NavbarChip`, `Menu` and `ConfirmDialog`. Supply unique context IDs and control the current context through `value` and `onValueChange`; an absent or unmatched value displays the first item. `confirmWhen(next, current)` decides whether a selection needs confirmation. Titles, descriptions and action labels can be values or functions of that pair. Section headings, extra menu actions, chip content and the reference's danger-context styling remain supported. Rich item labels use Solid factories, for example `label: () => <strong>Production</strong>`, so the chip and menu receive separate nodes; strings work directly. An open confirmation is discarded if either context's metadata or the change callback changes. The menu closes and focuses its trigger before opening the shared modal.

`KillSwitchButton` opens a typed confirmation before calling `onActivate`. The default token and active caption are `STOP`; an empty `requireText` explicitly removes the typing gate. `variant="chip"` uses a collapsing danger chip; `variant="button"` uses the small danger button. `active` remains application-owned, and an active click calls only `onActiveClick`. `scope` is included in the accessible name. Dialog visibility can be controlled with `open` and `onOpenChange`; changing the scope, required token or activation callback, or becoming active, invalidates the pending confirmation and requests close. A confirmed request is consumed before dispatch, including when the parent has not yet applied the close request. Both components close before notifying application code; callback failures use the existing `velvet:async-error` reporting channel rather than reopening a completed confirmation. Localized labels, rich-label factories and stale-confirmation guards are library adaptations of the reference.

`createQuoteStore` stores finite prices and notifies subscribers by symbol. Pass the store and symbol to `PriceCell`, or a static `value`. `useQuote` returns a Solid accessor. Pass accessors for the store, symbol or fallback when they can change. `InstrumentHeader` displays the price, session, facts and actions. A `reference` price derives the change from the current quote.

`OrderTicket` emits the reviewed order through `onSubmit`. Limit and stop orders require a valid price. Buying power, the risk limit, order blocking and reduce-only position constraints are applied before review and checked again before submission. `hidden` masks the quote, estimates and review figures. Editable fields still show their input values.

`WidgetGrid` takes widgets with unique non-empty IDs. Set `editing` to allow reordering, resizing, hiding and restoring widgets. To persist a controlled arrangement, pass `layout` and store the value emitted by `onLayoutChange`.

`ChartLegend` accepts `items`, `off`, `onToggle`, `onHover` and inline/list layouts. Supply stable `key` values for JSX labels. `ChartTooltip` accepts plot coordinates, optional width/edge clamping and value rows. Use `live={false}` when a chart already exposes values through an accessible name or a persistent status region. `RangeBandChart` now uses `--chart-band`, `--chart-band-edge`, `--chart-median` and `--trend-down-solid`; migrate chart-specific overrides of the corresponding older `--market-*` variables to these names.
