Windowed list for thousands of rows — only the visible window (+ overscan) is in the DOM. Fixed itemHeight, or known variable heights via getItemHeight (prefix-sum offsets, binary search). Invalid sizes fall back to safe defaults; duplicate keys warn and fall back to key+index so rows never collide. Keyboard: ↑↓ PgUp PgDn Home End, Enter activates, Space/Enter selects. Infinite loading: onEndReached fires once per growth when within endThreshold px of the bottom; loading shows a footer row. For tabular data with columns use VirtualTable.

**Props.** The full contract is `VirtualListProps` in `components/index.d.ts`.

- …and 5 more in `components/index.d.ts`.

**Built from:** EmptyText. **CSS:** `.vui-vlist*`. **Preview:** `components/VirtualList/preview.html` (group Data).
