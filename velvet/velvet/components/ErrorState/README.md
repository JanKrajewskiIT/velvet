A section that failed to load or save: a danger tile, a plain statement of what happened, and a way forward. It is announced as an alert. Use it in place of the content that failed; for a failure of the whole page (404, 403, 500, offline) use `StatusPage`.

Say what failed and what the person can do, not what the server did. Pass `onRetry` when trying again can work; pass `details` (an error text or stack) to add a "Show details" toggle for support. The icon defaults to the danger tone icon.

**Props.** The full contract is `ErrorStateProps` in `components/index.d.ts`.

- `title`, `description`
- `onRetry`, `retryLabel` (default "Try again")
- `details`: error text, hidden behind "Show details"
- `icon`, `size`: `'sm' | 'md' | 'lg'`

**Built from: Button, Glyph, IconTile.** **CSS:** `.vui-empty*`. **Preview:** `components/ErrorState/preview.html` (group Feedback). Defined in the same module as `EmptyState` and `StatusPage`.
