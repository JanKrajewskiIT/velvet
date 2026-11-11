Practice-session setup: collection picker (due counts), card count, order and direction.

Defined in the same module as `PracticeSession` (one card at a time: flip, then "Didn’t know" or "Knew it") and `PracticeSummary` (accuracy ring, counts, restart / review missed); the preview runs the three together: setup → session (Space · 1 · 2) → summary.

**Props.** The full contract is `PracticeSetupProps` in `components/index.d.ts`.

- `collections` (required): `PracticeCollection[]`
- `onStart`: `(config: { collection: string; count: number; order: 'due' | 'random' | 'new'; direction: 'front' | 'back' }) => void`
- `maxCards`: `number`

**Preview:** `components/PracticeSetup/preview.html` (group Patterns).
