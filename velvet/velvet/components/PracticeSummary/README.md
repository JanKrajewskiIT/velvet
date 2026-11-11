End-of-session result for a practice run: an accuracy ring, the known and to-review counts, and the actions to restart, review only the missed cards, or finish. The ring is success from 70 % accuracy, warning from 40 % and danger below, and a one-line message under the headline changes with it, so the result reads at a glance.

Pass the same `{ id, known }` list that `PracticeSession` returns from `onFinish`. The "Review N missed" button appears only when `onReviewMissed` is given and something was missed; "Practice again" and "Done" appear when their callbacks are given.

**Props.** The full contract is `PracticeSummaryProps` in `components/index.d.ts`.

- `results` (required): `PracticeResult[]`
- `onRestart`, `onReviewMissed`, `onDone`: `() => void`

**Built from: Button, CloseButton, FieldLabel, FlipCard, Kbd, Meter, OptionSwitcher, ProgressRing, SearchInput, Slider.** **CSS:** `.vui-practice-summary*`. **Preview:** `components/PracticeSummary/preview.html` (group Patterns).
