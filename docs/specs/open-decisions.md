# Accepted Decisions

The following directions were explicitly selected by the user on 2026-09-27. SolidJS remains required, but public API names and signatures may change; behavioral semantics remain required.

- `USER-DEC-001` (visual fidelity): Preserve CSS token names, semantic roles, component visual-state meanings, and a separately consumable stylesheet at the existing `./styles` entrypoint. Component variant spellings may be redesigned. Visual values/layout may improve except for the exact primary palette in `USER-DEC-008`. Pixel parity is not required.
- `USER-DEC-008` (primary brand color): The primary brand palette is an exact visual compatibility requirement. Preserve the source light/dark primary, hover, subtle background, focus-ring, and brand-gradient colors/relationships listed in `theme-tokens.md`. Other non-brand visual values/layout may improve.
- `USER-DEC-002` (content safety): Preserve Markdown/GFM and useful rich-text editing, but raw Markdown HTML is disabled and rich-text HTML must be constrained and sanitized.
- `USER-DEC-003` (date model): `YYYY-MM-DD` and `YYYY-MM-DDTHH:mm` remain local calendar date/time values without timezone/offset; do not round-trip picker values through UTC. Calendar integrations that require instants convert from local date/time at the integration boundary and serialize UTC there. Scheduler date/time uses the same local model.
- `USER-DEC-011` (date/time keyboard): Calendar/date/time controls use a roving-focus grid: Left/Right move one day, Up/Down one week, Home/End start/end of week, PageUp/PageDown previous/next month, Enter/Space selects; Escape closes the popup and returns focus to its trigger. Date-range navigation keeps the active endpoint; disabled dates are skipped and focus never references a removed cell.
- `USER-DEC-004` (quality): Improve accessibility and source defects without changing the semantic meaning of user actions or emitted data. Callback/API names and payload shapes may be redesigned. Add keyboard/touch alternatives, correct focus management, prevent duplicate actions, and make async failures recoverable and visible.
- `USER-DEC-005` (dependency baseline): Keep dependencies and peer ranges from source baseline 3.1.3. Any added/updated dependency needs separate approval.
- `USER-DEC-006` (runtime): Support current stable evergreen Chrome, Edge, Firefox and Safari. Public components must be SSR-safe and hydrate without reading browser globals during server rendering.
- `USER-DEC-007` (OTP): Accept ASCII digits `0-9` only; reject other characters and filter pasted content before truncation.
- `USER-DEC-009` (API naming): Public component/type/export names, prop names/shapes, callback names/payload shapes and translation-key names need not match the source. Preserve functional capabilities, semantic input/output meaning, state transitions and integrations; the replacement may design a clearer API.

## Accepted Agent Refinements

These concrete refinements implement the user-approved behavior and quality directions above. They preserve data meaning and observable outcomes, not source API spellings.

- `AGENT-DEC-005`: For async UI operations, prevent concurrent duplicate submits. On rejection preserve current consumer data, keep the relevant workflow open, clear pending state, show a localized non-sensitive inline error and allow retry. Do not expose raw exception messages. Apply to confirm actions, comparison/analyze/import, color-label operations, and timeline save/delete workflows. A successful action follows its existing close/reset behavior. Failure state may use a redesigned API.
- `AGENT-DEC-006`: `Button.loading` always disables activation, even if `disabled=false` is also supplied.
- `AGENT-DEC-007`: NumberInput increment/decrement causes exactly one immediate step per pointer press; continued hold repeats, release stops. Keyboard arrow operation remains one step per key action.
- `AGENT-DEC-008`: Preserve root `:root` CSS custom-property names and semantic meaning; except for the exact brand-primary palette required by `USER-DEC-008`, values, spacing, typography and layout may improve. CSS module selectors and keyframes remain private.
- `AGENT-DEC-009`: Date-only pickers, date-time pickers and time pickers are controlled inputs; optional value represents an empty value, not uncontrolled state. Scheduler view initially follows defaultSelectedDate when supplied.
- `AGENT-DEC-010`: Date-time parsing accepts the documented single-`T` format. Reject or return a validation error for extra separators; never silently discard suffix data.
- `AGENT-DEC-011`: Calendar/date/time widgets support keyboard navigation, visible focus and correct focus return while preserving local date/time meaning and selection outcomes. Callback/property names may differ.
- `AGENT-DEC-012`: Active navigation matches the most-specific route segment boundary; when no item matches, no item is marked current. No implicit first-item selection.
- `AGENT-DEC-013`: Persisted theme/locale read/write failures degrade to documented defaults/current in-memory selection without crashing provider rendering.
- `AGENT-DEC-014`: User-facing error fallback never renders raw exception messages. Diagnostics stay behind a sanitized logging boundary.
- `AGENT-DEC-015`: Tour with missing target reports an accessible recoverable state, does not leave an invisible modal/focus state, and continues to support skip/close.
- `AGENT-DEC-016`: Data-table capability includes striped/hoverable presentation and bounded pagination. Nonpositive/noninteger page-size input falls back to 10; target prop/API names may differ.
- `AGENT-DEC-017`: Breadcrumb `maxItems` is clamped to a meaningful collapsed range; `maxItems < 2` displays all items rather than malformed slices.
- `AGENT-DEC-018`: Bottom navigation exposes a localized navigation name and programmatically identifies the current item; selection outcome is the active item's semantic identity.
- `AGENT-DEC-020`: Async tree loading failures clear loading state, retain node structure and expose a retryable accessible error instead of producing an unhandled rejected promise.
- `AGENT-DEC-021`: Rich-text allowlist is `p`, `br`, `strong`, `b`, `em`, `i`, `u`, `ul`, `ol`, `li`, `a`, `blockquote`, `code`, and `pre`. Strip event handlers, style attributes and embedded content. Link protocols are relative, `http:`, `https:`, and `mailto:` only. Sanitize incoming HTML before render and generated output before onChange.
- `AGENT-DEC-022`: Respect `prefers-reduced-motion` across overlays, carousels, marquees, loaders and decorative transitions; essential state changes remain immediate and understandable.
- `AGENT-DEC-023`: Virtualized-list metrics must be finite; `itemHeight > 0`, `height >= 0`, and `overscan` a nonnegative integer. Reject invalid configuration before producing layout values. Stable item identity must be used so reordering does not transfer row state to another item.
- `AGENT-DEC-024`: Radar-chart missing and non-finite values map to zero; finite values clamp to 0..100; surplus values are ignored. Comparison rows pad missing cells with empty strings and ignore values beyond the declared columns. Empty axes yield no plotted polygon and still expose the textual data summary.
- `AGENT-DEC-025`: Invalid calendar-event start or non-finite/negative duration yields no external URL/action. A valid local start is converted to an instant in the runtime local timezone at the Google Calendar boundary; default duration remains 60 minutes.
- `AGENT-DEC-026`: A changed avatar source clears the prior image-error state and retries loading; an unchanged failed source keeps the fallback.
- `AGENT-DEC-027`: Avatar-group maximum is floored and clamped to zero or greater; overflow count is the number of hidden avatars. A carousel with fewer than two slides has no active navigation/autoplay; zero-width scroll does not change active index; autoplay also pauses for keyboard focus, hidden documents, hover and reduced motion.
- `AGENT-DEC-028`: Countdown duration is a finite nonnegative integer. Invalid values are rejected. Derive displayed remaining seconds from a monotonic deadline so timer throttling does not accumulate drift; catch up when a hidden document becomes visible. Completion fires once when an auto-started run reaches zero, including a zero-duration run, and does not fire while stopped.
- `AGENT-DEC-029`: Transfer-list IDs are unique across both sides. Duplicate IDs produce a localized input error and no transfer callback until corrected.
- `AGENT-DEC-030`: If an inline-edit control becomes disabled mid-edit, retain the draft, disable commit, and keep cancel available; initially disabled controls cannot enter edit mode.
- `AGENT-DEC-031`: Contrast-color input accepts optional `#` plus exactly six hexadecimal digits. Invalid input returns deterministic fallback `#1a1a1a` rather than calculating contrast from NaN channels.
- `AGENT-DEC-032`: Editable scheduler events expose keyboard-operable actions to move one day earlier/later and extend/shorten the end by one day. Move shifts start/end dates together; resize keeps start fixed and cannot end before it. Each activation commits one change through the same semantic outcome as pointer interaction.

## Resolved Decisions

- `USER-DEC-012` (HTML sanitizer): Use the maintained `isomorphic-dompurify` package for browser and SSR sanitization. Pin a concrete approved version in the replacement manifest, keep sanitization at the rich-text boundary, and do not implement an ad hoc sanitizer. The allowlist and URL protocol rules remain those in `AGENT-DEC-021`.

The specification is frozen for implementation. Legacy declaration parity is not required. Adding the approved sanitizer to the replacement manifest and running release validation are implementation tasks, not reasons to reopen this behavior brief.