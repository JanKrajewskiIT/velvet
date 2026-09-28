# Black-Box Acceptance Matrix

Status: Behavioral acceptance requirements for the replacement. This document does not request a test harness or test files. Scenario IDs are stable; names and APIs used by the replacement may differ from the source package under `USER-DEC-009`.

## Execution Contract

- Implement the replacement's documented public API first; scenario setup refers to semantic controls/data, not old symbol or prop names.
- Evaluate the scenarios as observable outcomes when reviewing or manually checking the replacement; automated tests are not a deliverable requirement.
- Assert user-visible outcomes, emitted values, state transitions, and side effects. Do not assert private component names, helper structure, DOM depth, CSS-module selectors, or exact source DOM.
- Include adversarial and failure outcomes alongside successful paths. Error messages must be localized and non-sensitive.

## Package And Providers

| ID | Setup and action | Required observation |
|---|---|---|
| `ACC-PKG-001` | Consume the built package from a small SolidJS app and import the documented style entrypoint. | Components, declarations and CSS load from published entrypoints; peer integrations are externalized and package remains within agreed bundle budgets. API names may differ from 3.1.3. |
| `ACC-PKG-002` | Render provider tree without browser globals, then hydrate in evergreen browsers. | Server output is deterministic; hydration succeeds without server access to DOM, storage, media queries or layout. |
| `ACC-PKG-003` | Mount app with string root, element root, absent root, no auth config, OIDC callback that consumes navigation, and an error boundary receiving Error/plain-object failures. | Valid root mounts under provider; absent root reports a controlled setup error; handled auth callback short-circuits app render; optional auth does not break public auth-free components; error fallback is localized, retryable and never exposes raw exception data. |
| `ACC-PKG-004` | Theme preference is system/light/dark; change operating-system preference; make storage throw. | Correct resolved `data-theme`; system mode reacts, explicit mode does not; storage failure does not crash and uses documented fallback. `USER-DEC-008` primary palette stays exact. |
| `ACC-PKG-005` | Switch between supported locales, supply custom dictionaries, then make storage unavailable. | English/Polish messages preserve source meanings and interpolated data; custom dictionary composition works; persisted locale restores when available; failure falls back without crash. |

## Localization, Utilities And Hooks

| ID | Setup and action | Required observation |
|---|---|---|
| `ACC-I18N-001` | Resolve every catalogued message in English and Polish with its required interpolation values; switch locale and override nested custom dictionary entries. | Both locales cover the catalogued message meanings/placeholders; interpolation is stable; overrides/fallback follow the pinned i18n dependency; no user-facing key is missing. |
| `ACC-UTIL-001` | Exercise class joining, valid/invalid color contrast, empty/null number/string conversion, numeric parsing and input-size lookup. | Pure helpers return the source-documented valid-input results, omit falsy class names, preserve parse-float semantics, and do not mutate inputs; malformed color handling follows the policy approved in `open-decisions.md`. |
| `ACC-HOOK-001` | Use outside-click, Escape, focus-return and floating-position behavior directly; deactivate/unmount during pending listeners/observers. | Inside/floating-region events are ignored; active Escape invokes once; focus returns to a connected target; positioning updates on scroll/resize; all global resources are cleaned up and SSR is a no-op. |

## Auth And Navigation

| ID | Setup and action | Required observation |
|---|---|---|
| `ACC-AUTH-001` | Auth loading, unauthenticated, authenticated with required role, authenticated without required role. | Loading, login/access-denied, protected content and forbidden states appear respectively; role matching uses any required role; no protected data is treated as authorized by client UI alone. |
| `ACC-AUTH-002` | Trigger sign-in repeatedly, sign out, cancel/return from OIDC. | Sign-in uses explicit return URL or current location; duplicate sign-in is blocked while pending; sign-out occurs once; return navigation is handled before app mount. |
| `ACC-NAV-001` | Visit exact and nested routes, unknown route, root, open mobile menu and navigate. | Most-specific segment match is current; root only matches root; unmatched path marks none; active label follows selection; menu closes on route change/Escape and is keyboard-operable. |
| `ACC-NAV-002` | Search nested sidebar items, combine search with badge-only filter, collapse sidebar. | Matching descendants retain ancestors; query force-expands the needed branches; clear resets filters; collapsed mode still provides named keyboard-operable navigation. |
| `ACC-NAV-003` | Use breadcrumbs with many items and max values 0, 1, 2; use bottom nav and pagination at first/last/no pages. | Current breadcrumb is identified; collapse/expand is predictable; invalid max has defined fallback; current bottom item is programmatically exposed; pagination never emits an out-of-range page. |
| `ACC-NAV-004` | Resize panels using mouse/touch and keyboard; use SpeedDial by keyboard and pointer. | Split remains within both minimum bounds and emits percentage; keyboard resize is operable; SpeedDial opens/closes on action/Escape/outside, and empty action set disables it. |

## Forms And Composite Widgets

| ID | Setup and action | Required observation |
|---|---|---|
| `ACC-FORM-001` | Render field label, description, required and invalid/error in a real form. | Control has associated label/help/error IDs, error is announced, native required/disabled/name/value and form submission remain correct. |
| `ACC-FORM-002` | Exercise button loading, disabled controls, numeric hold, search debounce/Escape, password reveal, OTP typing/paste/backspace/arrows, tag Enter/comma/Backspace, editable-text Enter/Escape, and disabling during edit. | Loading blocks activation; each pointer press increments once then repeats while held; debounce cancels correctly; OTP accepts only ASCII digits and focus tracks accepted slots; tags are unique/trimmed; edit commits/cancels correctly; mid-edit disabling follows the approved policy. |
| `ACC-FORM-003` | Submit decimal/range slider values outside bounds; navigate radio, segmented, rating and color controls with keyboard. | Values clamp/snap/order as specified; disabled options are skipped; focus is visible; active selection matches callback; labels/value state are announced. |
| `ACC-FORM-004` | Drop/select accepted, rejected and mixed files; switch URL/file import sources, retain drafts, submit empty/valid input, reject submission and retry. | Client filters follow accept rules without being treated as server validation; selection callbacks preserve order; source drafts survive switching; invalid/busy actions are blocked; failure retains draft and exposes a localized retry. |
| `ACC-WIDGET-001` | Use Select with disabled options and form name; MultiSelect with additions/removals; Autocomplete with filtered options and arbitrary Enter text. | Select emits/form-serializes selected string and closes; multiselect maintains order and submits repeated values; combobox filters, distinguishes active/selected values, disallows disabled selection and returns focus to input. |
| `ACC-WIDGET-002` | Open action menu via Enter/Space/ArrowUp/ArrowDown; navigate arrows/Home/End; Escape and Tab. | First/last opening target is correct; disabled items cannot activate; Escape returns focus to trigger; Tab exits non-modal menu naturally; chosen action fires once and closes. |
| `ACC-WIDGET-003` | Filter/search, toggle chips, hierarchical options and transfer lists; remove stale IDs/options while popup is open; supply duplicate transfer IDs. | Controlled callbacks receive semantic value changes; filters combine/clear as specified; moving items preserves order; selected and active state remain valid after data changes; duplicate identity handling follows the approved policy. |
| `ACC-WIDGET-004` | Command palette Ctrl/Cmd+K, query/group results, key navigation, empty results and action. | Query clears on opening, results filter labels/descriptions, active item stays visible, select callback occurs once then closes, no-results state is announced. |
| `ACC-WIDGET-005` | Expand/check/load/move tree nodes; reject lazy loader; drag node to descendant; use tabs and wizard validation. | Tree keys operate by visible order, descendants check together, load rejection is retryable, illegal reparent is rejected; tabs skip disabled and respect activation mode; invalid wizard step blocks advance and async errors recover. |
| `ACC-WIDGET-006` | Open/close accordion items in single and multiple modes; update controlled item from parent. | Single mode closes others; multiple mode allows concurrent open items; controlled state changes only after parent update; trigger/content relationships stay valid. |

## Primitives, Surfaces And Domain Workflows

| ID | Setup and action | Required observation |
|---|---|---|
| `ACC-PRIM-001` | Render headings at several semantic levels with visual variants, text as links, labeled and decorative icons, labels with/without descriptions, and keyboard shortcuts. | Heading hierarchy follows semantic level independent of visual style; link semantics remain native; icon naming/decorative state is correct; absent optional content does not leave empty output. |
| `ACC-SURFACE-001` | Combine Surface/Card/DataCard/FeatureCard, Stack/Grid/MainLayout and Divider in a responsive layout; render with and without auth/loading; resize a split panel by pointer, touch and keyboard. | Native layout and content slots remain usable at narrow widths; auth/loading gates only the documented layout regions; split stays bounded, emits the same percentage by all input modes, and uses only its first two panels. |
| `ACC-COMP-001` | Render Markdown/GFM, edit and cancel/save a draft, use code-block copy, and enter disallowed HTML, attributes and link schemes into rich text. | GFM content and preview reflect the current draft; cancel discards edits and save emits the committed content; copy reports success/failure; only the approved safe subset is rendered/emitted. |
| `ACC-COMP-002` | Request add/remove in an editable collection; move Kanban items between known/unknown columns, attempt same-column and keyboard moves. | Removal requires confirmation and targets the requested item; unknown columns remain represented; move preserves item data/order; invalid/same-column actions do nothing; keyboard alternative is available. |
| `ACC-COMP-003` | Exercise AI/ATS panels in idle, pending, error, result and retry states; test scores at every threshold and empty recommendation/section lists. | State precedence matches specification; score thresholds and severity mapping are exact; empty sections do not render; input is retained after failure; successful reset/submit outcomes are distinct. |
| `ACC-COMP-004` | Set up a flashcard session with empty/single/multiple items; flip, record known/unknown, quit, finish, restart and change setup defaults. | Answers are recorded in order against the corresponding item; answer controls appear only after reveal; completion returns the full result set; empty summary percentage is zero; setup emits selected category/count. |
| `ACC-COMP-005` | Change comparison selection, clear it, submit compare, then inspect pending, empty-result, chart/table and rejected states. | Selection count/disabled state stay synchronized; compare submits once; chart/table appear only with sufficient data; missing cells are empty; failure keeps dialog data and permits retry. |

## Overlays, Feedback And Async Work

| ID | Setup and action | Required observation |
|---|---|---|
| `ACC-OVERLAY-001` | Open modal dialog/sheet/lightbox from keyboard; tab through; press Escape/backdrop; close nested overlay. | Initial focus, containment, topmost dismissal, focus restoration, scroll unlock and aria-modal match each interaction; no focus returns to detached elements. |
| `ACC-OVERLAY-002` | Open popover/tooltip/floating/dropdown near viewport edges; scroll/resize anchor and floating content. | Placement flips/shifts/updates, accessible relationship is valid, tooltip delay works, outside/Escape closes transient layer, Tab is not trapped. |
| `ACC-OVERLAY-003` | Tour target exists, disappears or selector is invalid; skip, back, finish. | Spotlight follows target and layout; missing target gives recoverable status; final onComplete precedes close; focus/background state never becomes stranded. |
| `ACC-ASYNC-001` | Reject async confirm, compare, import, analysis, label CRUD, timeline save/delete, and tree load; retry. | No duplicate concurrent submit; pending clears; user data/draft is retained; localized non-sensitive error appears inline in the active workflow near its action and is announced; retry succeeds; success closes/resets according to workflow. |
| `ACC-FEEDBACK-001` | Add toasts with default/zero/positive duration; remove toast, mark/remove notification, unmount provider. | Toast and notification lifetimes are independent; timer behavior follows duration; announcements use role by severity; provider cleanup clears timers/store. |
| `ACC-FEEDBACK-002` | Render empty/error/loading/progress/skeleton and countdown boundaries including zero, negative, fractional and stopped values. | Status is accessible and not color-only; determinate values clamp; indeterminate state is represented; countdown validates duration per the approved policy, completes once, and cleans up its timer. |
| `ACC-FEEDBACK-003` | Exercise alerts, banners, badges, selectable/closable chips, dual filters, empty/error/access-denied/not-found actions and loader label overrides. | Variants expose correct status/alert semantics; dismiss/select/navigation actions are distinct and fire once; badge truncation/dot rules hold; filters report semantic values; loader label precedence/hidden state are correct; fallback actions remain localized and recoverable. |

## Data, Dates, Media And Safety

| ID | Setup and action | Required observation |
|---|---|---|
| `ACC-DATA-001` | Filter/sort/paginate empty, null, Date, case/whitespace and custom-accessor data; vary pageSize and striped/hoverable options. | Query normalization and comparator rules hold; sort/filter do not mutate input; paging is bounded; invalid pageSize follows fallback; declared table presentation flags work; table remains semantic. |
| `ACC-DATA-002` | Render virtual list at start/middle/end, change items/scroll quickly; supply empty list. | Only visible range plus overscan is rendered; spacer/offset align; no blank gaps or layout jumps; empty state appears. |
| `ACC-DATA-003` | Render tree/timeline/chart with empty, long, malformed/mismatched datasets; keyboard navigate. | State and callback data remain consistent; charts provide textual/table value access, no color-only encoding; events appear on inclusive dates. |
| `ACC-DATA-004` | Compare chart axes/datasets and table columns/rows with mismatched lengths, non-finite/out-of-range values, empty axes or columns, and long labels. | Each component follows the edge-case policy approved in `open-decisions.md`; absent sections remain absent; mismatched data cannot mislabel a value; all meaningful values are inspectable without color/geometry alone. |
| `ACC-DATE-001` | Select date/time/range at boundaries, leap day, DST transition, min/max, empty value and reversed range in multiple local time zones. | Date-only values remain local `YYYY-MM-DD`; date-time values remain local without UTC conversion; disabled dates cannot commit; ranges complete/order correctly; keyboard grid behavior and focus are correct; only external calendar integration converts to an instant. |
| `ACC-DATE-002` | Create/edit/delete, move and resize scheduler events spanning days by pointer and keyboard; set `defaultSelectedDate`; reject async mutation. | Inclusive event spans and date offsets are correct; calendar initially displays default selected month; pointer/keyboard move and resize have equivalent outcomes; move preserves span, resize clamps; rejection keeps data/draft and presents retryable error. |
| `ACC-DATE-003` | Create an external calendar event with valid local date-only and timed values, special characters in text, and a multi-day event. | The fixed Google Calendar URL encodes text/location/details; start and duration convert from local event meaning at the integration boundary into compact UTC dates; omitted duration defaults to 60 minutes. Invalid input follows only the resolution approved in `open-decisions.md`. |
| `ACC-MEDIA-001` | Image load/error, missing alt/caption, avatar source changes, carousel autoplay/hover/focus, marquee hover and reduced motion. | Accessible alternatives are appropriate; avatar source-change behavior follows the approved edge policy; motion pauses/reduces as specified; duplicate content is hidden from assistive tech. |
| `ACC-MEDIA-002` | Render avatar groups with positive/zero/negative maximums and image grids at overflow/empty boundaries; open lightbox, change image list/start index, navigate and dismiss. | Visible avatar order/overflow count follows the policy approved in `open-decisions.md`; image controls have meaningful names; lightbox index stays in range, wraps navigation, restores focus and releases body scroll lock. |
| `ACC-SEC-001` | Feed script/event-handler/unsafe-URI HTML to Markdown and rich-text input; include iframes/images/styles and malformed nesting. | Raw Markdown HTML does not render; only allowlisted rich-text elements/attributes/protocols survive sanitization; no code executes during initial render, updates or hydration. |
| `ACC-THEME-001` | Render light/dark themes and primary controls in evergreen browsers, including reduced-motion preference across overlays, loaders, carousels, marquees and decorative transitions. | Exact source primary palette values remain; semantic tokens resolve consistently; other visual values may change; reduced motion removes nonessential animation/transition without hiding state changes. |
| `ACC-QUALITY-001` | Repeat approved defect cases: loading plus explicit enabled, number hold/release, malformed date-time, missing tour/tree targets, bad page size/breadcrumb limit, changed image source, and async rejection/unmount. | Loading still blocks activation; number repeats only while held; malformed values are rejected; missing targets/errors recover without stranded focus; invalid paging/breadcrumb inputs use documented fallbacks; source-change behavior follows the approved edge policy; resources and global state are cleaned up. |

## Residual Verification

- No tests or test harness are required for this specification task; the scenarios state behavioral acceptance criteria and have not been executed.
- Public symbol and prop names are not asserted; scenario harnesses bind to the replacement's documented API and verify semantic behavior.
- Package integration, declaration generation and size budgets require an explicitly approved build/release validation step.