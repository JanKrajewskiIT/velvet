No-data placeholder: a tinted icon circle, a title, one line of explanation and, when there is a next step, an action (use `sm` buttons). Use it inside the place that is empty (a table body, a list, a panel); for a whole page that failed or ended use `StatusPage`, and for a one-line "no data" inside a cell use `EmptyText`.

Always offer the next action when there is one ("New project"), and say what is missing rather than that the screen is empty. `size` is `sm` (one left-aligned row, inline in a card, table or list), `md` (centred, a section, default) or `lg` (a whole page). `tone` colours the tile; `neutral` is for "no results", `brand` for a first-use invitation.

**Props.** The full contract is `EmptyStateProps` in `components/index.d.ts`.

- `title`, `description`, `actions` and `children` (extra content under the actions), all optional
- `icon`: icon name (default `inbox`), or `null` for none
- `size`: `'sm' | 'md' | 'lg'`
- `tone`: `'neutral' | 'brand' | 'info' | 'success' | 'warning' | 'danger'`

**Built from: Button, Glyph, IconTile.** **CSS:** `.vui-empty*`. **Preview:** `components/EmptyState/preview.html` (group Feedback). Defined in the same module as `ErrorState` and `StatusPage`.
