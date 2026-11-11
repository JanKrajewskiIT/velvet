The end of a page or flow — errors (404 / 403 / 500 / offline) and outcomes (success / warning / info, e.g. "Payment received"). Same layout as EmptyState. size lg = full page with a code watermark; md / sm = inside a section, card or dialog, error code as an "Error 404" overline. Default copy + tone per status — override title/description. children = details under the actions (receipt, error id). Use EmptyState for "nothing here yet", ErrorState for a section that failed to load.

Defined in the same module as `EmptyState` (nothing here yet) and `ErrorState` (a section failed to load); the preview shows all three as tabs, together with `DataState variant="block"` for a panel whose data is stale, partial, unavailable or empty.

**Icons.** A status whose icon only says its tone — success, warning, info, 500 and `ErrorState` — reads the shared tone map (`TONE_ICON`, the one `Alert` and `Toast` use: danger `circle-x`, warning `triangle-alert`, success `circle-check`, info `info`). 404 (search), 403 (lock) and offline (globe) keep an icon that says what happened. Pass `icon` to override either.

**Props.** The full contract is `StatusPageProps` in `components/index.d.ts`.

- `code`: `404 | 403 | 500 | 'offline' | 'success' | 'warning' | 'info'`, default `404`. Error code or outcome.
- `status`: `404 | 403 | 500 | 'offline' | 'success' | 'warning' | 'info'`. Alias of code — reads better for outcomes: status="success".
- `title`: `ReactNode`
- `description`: `ReactNode`
- `actions`: `ReactNode`
- `icon`: `string`
- `tone`: `StateTone`
- `size`: `'sm' | 'md' | 'lg'`, default `'lg'`
- `children`: `ReactNode`. Details under the actions.

**Preview:** `components/StatusPage/preview.html` (group Feedback).
