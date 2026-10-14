# Component behavior and integration

These source changes extend the reference port. They have been reviewed from source; builds, formatting, linting, package checks and browser interactions have not been executed for this revision.

See [component contracts](component-contracts.md) for the subsequent behavioral fixes, additional form fields, record identity, asynchronous acknowledgements, scheduling, chart data and compatibility decisions.

## Forms

`Select`, `Autocomplete`, `MultiSelect`, `DatePicker`, `DateRangePicker`, `DateTimePicker` and `TimePicker` share `FormControlProps`: `name`, `form`, `required`, `aria-label` and `aria-labelledby`. Supply a visible label or an accessible name. `form` supports a form outside the component's ancestors.

| Control               | Submitted value                                                                          |
| --------------------- | ---------------------------------------------------------------------------------------- |
| Select / Autocomplete | Committed string; empty selection submits an empty string                                |
| MultiSelect           | One entry per selected value under the same name; use `FormData.getAll(name)`            |
| DatePicker            | Local calendar date, `YYYY-MM-DD`                                                        |
| DateRangePicker       | Start and end as two entries under the same name; an incomplete range submits no entries |
| DateTimePicker        | UTC ISO timestamp                                                                        |
| TimePicker            | Committed `HH:MM` string                                                                 |

Date pickers accept `serializeValue` for application-specific wire formats. Submitted values are independent of localized display text. Disabled controls do not submit values or participate in required validation. A nameless validation proxy participates in native form validity, focuses the visible control on failure and displays a localized required message. Call `requestSubmit()` or use a submit button to invoke native validation; direct `form.submit()` bypasses it.

The required message has a stable ID. The visible control receives `aria-invalid` and includes that ID in `aria-describedby` while invalid; consumer errors and hint associations are preserved. Selecting a value, disabling the field, removing `required`, or resetting the form clears the required state.

Calendar, DatePicker and DateRangePicker share calendar-day constraints. DatePicker's Today action and range presets follow `min`, `max` and `isDisabled`; unavailable presets are disabled. Applying a range checks both endpoints and their order again, including after constraints change while the popup is open. As with Calendar, `isDisabled` restricts selectable endpoints; disabled days inside a range do not invalidate it. Presets are native buttons in a labelled group, with `aria-pressed` identifying the chosen preset; Tab, Enter and Space retain native behavior.

TimePicker applies the same inclusive `min`/`max` bounds to typed commits and option selection. Out-of-range text remains a draft and shows a localized range error without changing the committed value. Malformed/reversed bounds produce no selectable options. `step` controls the suggestions, rather than restricting typed times to multiples of that step. Consumers own validation of externally supplied controlled/default values.

Form reset restores `defaultValue` and closes transient popups/drafts. In controlled mode it notifies the value callback; the consumer remains responsible for accepting the reset. A prevented reset does nothing. Native reset does not erase committed hidden values when a controlled consumer keeps its value.

```tsx
<form id="filters">
  <Autocomplete name="owner" label="Owner" options={owners()} required />
  <MultiSelect name="tags" label="Tags" options={tags()} />
  <DateRangePicker name="period" label="Period" />
  <button type="submit">Apply</button>
  <button type="reset">Reset</button>
</form>
```

The labels above belong to the consuming application and should use its translations.

## Options and asynchronous loading

Autocomplete's custom-value row is a normal keyboard option. Arrow keys navigate all available options, Home/End reach the endpoints, and Enter commits the active choice. MultiSelect skips unavailable options, including unselected options blocked by its maximum selection count. Active options remain visible in scrollable lists.

Loading, empty and error content appears beside the listbox. Retry is a separate button: when loading fails, Tab from the input can reach it; leaving the popup closes it. A new remote query removes stale selectable results while loading. Only the latest query's result is applied. Picked-label storage retains the current selection rather than an unbounded history of choices.

## Tabs and panels

Give the Tabs instance a stable `id` and use the same `tabsId` on its panels. Generated tab/panel IDs derive from the value. `TabItem.id` and `panelId` override them; matching panels can use `tabId` and `id`. `tabIds` is available for applications composing their own panel elements.

```tsx
<Tabs id="settings" aria-label="Settings" items={items} value={section()} onValueChange={setSection} />
<TabPanel tabsId="settings" value="profile" activeValue={section()}>
  <ProfileSettings />
</TabPanel>
<TabPanel tabsId="settings" value="security" activeValue={section()}>
  <SecuritySettings />
</TabPanel>
```

Tabs uses automatic activation by default. For content that loads on activation, set `activation="manual"`: arrows/Home/End move focus, Enter/Space activates. TabPanel hides inactive content and has a default tab stop; set `tabIndex={-1}` when its first meaningful content already provides the appropriate keyboard entry point. Existing applications must connect their panels to the generated IDs or provide matching overrides. Tabs forwards its ref and composes its keyboard handler with the consumer's handler, honoring `preventDefault()`.

VelvetDemo now composes controlled Tabs with matching TabPanel instances for underline, segmented and vertical variants, plus a separate manual-activation example. These relationships follow the [WAI-ARIA tabs pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/).

## Operation ownership

`createOperation` is available through `@jankrajewskiit/ui/common`. Its default `latest` policy invalidates local completions and permits a replacement run. `single-flight` retains the busy lock after invalidation until the original run calls `finish()`. Always finish a started run in every completion path. The primitive requires a Solid owner and cannot cancel or undo consumer-owned writes.

InlineEdit uses single-flight behavior. Escape closes the edit session, suppresses its local completion and returns focus, but a second save cannot start while the underlying callback remains pending. The lock is scoped to one component instance; applications still own server concurrency across instances and clients.

TreeView supplies `AbortSignal` to `onLoadChildren(node, signal)`. Replacing/removing a node, changing `dataKey`, or disposing the tree invalidates its loading state and aborts the signal. Change `dataKey` when switching logical trees while retaining node IDs. Existing callbacks accepting only `node` remain assignable. Consumers must honor the signal before updating external data; the library cannot roll back updates performed by an obsolete callback.

## Scroll, gestures and moving content

ScrollArea observes child replacement, text/attribute changes and element resizing. It forwards its ref and respects a supplied `tabIndex`. Its internal scroll measurement runs before the consumer's scroll handler.

Carousel does not initiate swiping on nested controls or nested carousel viewports. Pointer cancellation and lost capture end the gesture. Nested controls retain their own keyboard interactions; focus pauses rotation until explicitly resumed.

Carousel normalizes `perView` to an integer of at least one (default 1), invalid/negative gaps to 16 px, and invalid/negative autoplay to off. Autoplay is a whole number of milliseconds capped at the browser timer limit; sub-millisecond values resolve to off. Slide widths remain non-negative when gaps exceed the available width. Announcements follow whether rotation is actually running, including reduced-motion pauses.

Marquee mounts its original children once. The default copy incrementally synchronizes existing DOM nodes, assigns independent IDs and rewrites local references, including SVG paint references. Native controls in the presentation lane are disabled and unnamed so they cannot affect form submission or validity. The copy is inert and hidden from assistive technologies. Media autoplay is suppressed.

For property-only or canvas updates, change `copyVersion` after the original has updated. For independent reactive rendering, use `renderCopy={() => <Presentation />}`. It must create fresh nodes; never return the original children or resolved DOM nodes. The rendering function should produce presentation without independent network work or other application side effects. Its DOM is also normalized as an inert presentation lane. Copying does not reproduce arbitrary third-party canvas/media runtime state automatically.

Marquee requires a positive finite speed; invalid values fall back to 40 px/s. Invalid/negative gaps fall back to 48 px. Extremely small speeds cannot produce an infinite CSS duration: the duration falls back to 20 seconds. Non-negative gaps are capped at `Number.MAX_SAFE_INTEGER` in both moving-content components.

## Package contract

The source version 3.6.1 includes `createOperation` and `reportAsyncError` in `/common`, plus TabPanel in the root/bare component API. VelvetData's `>=3.6.1 <4` peer range and VelvetDemo's `^3.6.1` requirement identify this source revision. The installed UI artifact inspected during this revision is 3.5.4 and does not establish compatibility. Build, verify and publish the complete UI 3.6.1 revision before updating Data/Demo installations. No release or lockfile refresh was performed.

## Pending verification

`npm run verify` remains unrun in the VelvetUi root. No test files were changed. Browser checks should cover form submission/required/reset (including controlled values and external forms), required-error associations, typed time bounds, disabled/reversed range presets, constraints changing before Apply, Today outside allowed bounds, custom option selection, long option lists, Retry focus, tab/panel relationships and manual activation, delayed saves after Escape, replaced tree nodes, invalid moving-content numbers, nested gestures, changing scroll content, SVG/canvas copies and both locales.
