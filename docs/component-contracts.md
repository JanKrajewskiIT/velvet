# Component contracts beyond visual parity

This source revision addresses the behavioral audit. It has not been compiled, linted, formatted or exercised in a browser. No tests were added or changed.

## Numeric fields and native forms

`parseDecimal`, `decimalPlaces` and `numberRange` are shared through `/common`. Parsing requires the complete finite decimal value, supports a decimal comma and exponent notation, and rejects partial text. NumberInput and RangeInput preserve invalid text and keep the previous committed value. Their native validation proxy blocks submission until the draft is corrected. NumberInput's numeric value is non-nullable: empty text is invalid, rather than silently becoming zero. RangeInput permits empty endpoints.

TreeSelect, Cascader, NumberInput, RangeInput, Slider, TagInput and OtpInput now support `name`, `form`, `required` and native reset alongside the existing picker controls. Disabled fields neither submit nor validate. Controlled consumers must accept the reset notification to change their external value.

| Control     | Serialization                                                      |
| ----------- | ------------------------------------------------------------------ |
| TreeSelect  | Single ID or repeated leaf IDs under the same name                 |
| Cascader    | Selected ID, or an empty string                                    |
| NumberInput | Committed finite number as decimal text                            |
| RangeInput  | Two entries, lower then upper; an open endpoint is an empty string |
| Slider      | One number, or lower then upper as repeated entries                |
| TagInput    | One entry per committed tag                                        |
| OtpInput    | Complete code; an incomplete code submits an empty string          |

RangeInput's `required` means at least one endpoint is supplied. An inverted range is invalid. `unitName` and `periodName` submit the optional selectors independently. Cascader's legacy selection callback accepts only a selected ID; `onResetValue` additionally lets a controlled consumer accept an empty reset.

Numeric configuration errors are explicit: steps must be positive and finite, bounds must be ordered, and Slider bounds must be finite. Equal Slider bounds are supported. Automatically generated slider marks are limited to 1000; explicit marks are filtered to finite in-range values, deduplicated and sorted. Each range thumb has its own accessible name. OTP length is normalized to an integer from 1 to 32.

## Record identity and selection

Table supports `getRowId`, `defaultSelected`, `dataKey` and explicit `manualSorting`. Omitting `manualSorting` retains the existing controlled-sort inference; set it to false for controlled local sorting. Equal values retain input order in both sort directions.

The shared `createRowIdentity` uses an explicit ID first and otherwise assigns a key to the record object through an owner-local WeakMap. Both it and `createRecordKeys` require a Solid owner. This fallback survives local sorting and preserves identity while the same objects remain. It cannot identify replacement objects representing the same record; use stable IDs or `getRowId` for immutable replacement and server pages. `createRecordKeys` checks key types and reports duplicates without including record payloads. Duplicate fallback keys are rendering protection, not a substitute for unique domain IDs.

Table's Shift selection anchor is a record key. Table and DataGrid toggle only the current view's keys when selecting all, preserving selections on other pages. Changing `dataKey` requests clearing selection and resets interaction context; controlled consumers own accepting that request. Removed Table expansion entries are pruned. The low-level `rowId` API retains its caller-supplied fallback for compatibility.

## Asynchronous actions

PromptInput awaits synchronous or promise-returning `onSubmit(text, attachments, signal)`. A rejection or false acknowledgement preserves the draft; success clears it only if the user has not typed a replacement while waiting. Attachments are captured for the request, but their external lifecycle remains consumer-owned. Submission is single-flight; unexpected failures show a localized error and use `onError` or payload-free diagnostics. Sending without a callback and stopping without `onStop` are unavailable. Disabled/loading states also block suggestion and attachment actions.

AnalysisRequest supplies `AbortSignal` to `onRun`. Cancel invalidates the local operation and suppresses its obsolete error. Replacement analysis runs can start after local cancellation; the application must honor the signal before writing external results. A controlled `status` remains application-owned and must be updated by `onCancel`.

Kanban accepts synchronous or promise-returning `onCardsChange(cards, move, signal)` and announces an acknowledged move. False declines it; rejection shows `moveErrorText` and reports through `onMoveError`. No handler, disabled state and pending saves disable movement. Nested controls retain their click and keyboard behavior. `canMove` supplies application policy; WIP limits remain warnings unless `enforceLimits` is enabled. `dataKey`, disabling and disposal invalidate local completion. Signals cannot undo external writes by a callback that ignores cancellation.

Existing callbacks accepting fewer arguments remain usable. Return values other than false are accepted acknowledgements; the library does not prescribe a transport response shape.

## Scheduling and chart data

Scheduler clips half-open event intervals to every visible day and hour range, then lays out their overlapping segments. Event callbacks receive the original event. Invalid/reversed intervals are omitted. Hours are ordered integers in 0–24, slot length must fit the visible range, hour height is positive and finite, and week start is in 0–6.

Each day has a native keyboard slot button. Up/Down changes the slot, PageUp/PageDown moves approximately an hour, Home/End reaches the endpoints, and Enter/Space creates that slot. Pointer creation follows the same available-slot list. Times use the browser's local timezone; nonexistent local start times are skipped, and slot duration is elapsed minutes. The grid is a wall-clock presentation and does not distinguish the two occurrences of a repeated daylight-saving hour. Applications needing that distinction must map explicit instants in their own workflow.

BarChart and LineChart share a finite numeric scale including zero and negative values. Stacked bars accumulate positive and negative values separately. Missing, malformed and non-finite measurements are gaps, never synthetic zeros; tooltip/table text says no measurement. Line segments and area fills stop at gaps. Percentage change is unavailable for absent/zero bases and uses the absolute base for negative values. Numeric strings must satisfy the shared decimal parser.

DonutChart accepts finite non-negative values and validates its dimensions and total. Supply `id` or `getKey` for stable identity across replacements/reordering; unique labels remain a compatibility fallback. Duplicate labels get separate rendering keys. Removed exclusions are pruned, and a replacement dataset always retains an enabled entry when it is nonempty.

## Feedback, uploads and conversation

CloseButton span activation, Slider gestures/keys and hierarchical picker actions enforce disabled state. TreeSelect tags are siblings of the trigger so removal is independently operable; disabling a hierarchical picker closes its popup.

Toast lifetime uses a timer independent of CSS animation, paused on pointer hover and focus within. Reduced motion does not shorten the lifetime. Non-positive/invalid durations disable automatic dismissal; positive durations are capped to the browser timer range. ToastProvider normalizes its maximum to 0–100 with fallback 5; zero suppresses the queue. Capacity eviction and an explicit dismissal invoke `onClose`, while replacement of the same ID restarts its component lifecycle.

Countdown completes only after a valid target timestamp is reached. Invalid dates do not invoke `onComplete`. VelvetProvider's default error report never logs the raw exception; applications using `onError` own safe reporting.

FileUpload applies extension/MIME/wildcard acceptance to both picker and drop input. `maxSize` includes zero-byte limits; `maxFiles` counts supplied existing rows and newly accepted files. `onReject` receives each File and its type/size/count reason. With multiple disabled, one valid file is accepted per interaction. Client file metadata is a UX constraint; applications still validate uploaded content at their server boundary.

ChatThread batches follow-scroll work per animation frame, observes direct child resizing, and offers a localized jump-to-latest button while the user reads older content. Mutation, resize and frame ownership is disposed with the component.

## Public modules and pending checks

`@jankrajewskiit/ui/patterns` is an additional CSS-free entry for the existing composed patterns. Root and bare exports remain available. Import UI base and the style families used by each pattern. Authentication/bootstrap remain in their existing infrastructure modules.

`npm run verify` remains unrun in VelvetUi. Browser acceptance should cover disabled transitions during focus/drag, reduced-motion toasts and pauses, required/reset/submission in controlled and external forms, malformed numbers and scientific steps, paged/shift selection, delayed action acknowledgement/cancellation, cross-midnight events and keyboard slots, chart gaps/negatives/duplicate labels, upload rejection reasons and image-driven chat resizing. The new patterns entry requires packed declaration/import verification. UI's updated `/common` artifact must be built and installed before checking VelvetData; no package installation, lockfile refresh or publication was performed.
