Search + faceted filter chips above a list or table. Each chip opens a checklist; a chip with one pick reads "Status: Active", with several shows a count. "Clear all" appears once anything is active; the live result count sits on the right. Value is { [filterKey]: string[] }. Use DualFilterBar for the two-axis segmented variant.

**Props.** The full contract is `FilterBarProps` in `components/index.d.ts`.

**Built from:** SearchInput, Control, Dot, Count, Button, Glyph, `primitives/useDismiss.js`. **CSS:** `.vui-filterbar*`. **Preview:** `components/FilterBar/preview.html` (group Data).
