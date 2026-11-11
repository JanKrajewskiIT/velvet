One-card-at-a-time practice: flip the card (Space), then answer "Didn’t know" (1 / ←) or "Knew it" (2 / →). The card slides out, and the progress bar and tally update. The answer buttons unlock only after the flip. `reverse` shows the back first.

Defined in the same module as `PracticeSetup` and `PracticeSummary`; the `PracticeSetup` preview runs the three together. Give every card a stable `id` so the results can be matched back; `onFinish` receives `{ id, known }` for each card. Renders nothing when `cards` is empty.

**Props.** The full contract is `PracticeSessionProps` in `components/index.d.ts`.

- `cards` (required): `PracticeCard[]`
- `onFinish`: `(results: PracticeResult[]) => void`
- `onExit`: `() => void`
- `reverse`: `boolean`

**Built from: Button, CloseButton, FieldLabel, FlipCard, Kbd, Meter, OptionSwitcher, ProgressRing, SearchInput, Slider.** **CSS:** `.vui-practice-session*`. **Preview:** `components/PracticeSession/preview.html` (group Patterns).
