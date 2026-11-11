Data freshness / availability. Distinguishes "nothing happened" (empty) from "we could not check" (unavailable/partial). Unavailable data is never shown as zero.

**Props.** The full contract is `DataStateProps` in `components/index.d.ts`.

- `label`: `ReactNode`. Override the default title.
- `size`: `'sm' | 'md' | 'lg'`, default `'md'`. Block variant only.
- Also accepts the native attributes of the root element.

The inline variant is a one-line indicator (dot or icon + label + source · time); `variant="block"` is the same state as a panel, for a card or table that has no data to show. It is drawn by `EmptyState` — the same tile, title and spacing as "Nothing yet" in the `StatusPage` preview — with the state's tone and icon, the detail as the description, a `source · time` line under it and your `action`; `size` is the EmptyState size (`md` default, `sm` for one row inside a table or card). It has no container of its own, so it sits on whatever surface it is placed on; wrap it in a `Card` when the page needs a box. The block variant is shown in the `StatusPage` preview, not in this card. The block variant sits in the `StatusPage` preview next to the other status screens (tabs stale · partial · unavailable · no data), so you can pick between a page, a section and a panel. Not finance-specific: any data source that can go stale or fail. The block's icon follows the same rule as `StatusPage`: fresh, partial and unavailable read the shared tone map (`circle-check`, `triangle-alert`, `circle-x`); delayed and stale use a clock because they are about time, and empty keeps a plain check.

**Preview:** `components/DataState/preview.html` (group Feedback).
