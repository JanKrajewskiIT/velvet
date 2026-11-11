Column task board. Drag & drop with a drop-position ghost, or keyboard: ↑↓ focus cards, Ctrl/⌘/Alt + ←→ move between columns, + ↑↓ reorder. Moves are announced. Controlled: you own cards.

**Props.** The full contract is `KanbanProps` in `components/index.d.ts`.

- `renderCard`: `(card: KanbanCard) => ReactNode`. Replace the default card body.

**Built from:** Badge, IconButton, Glyph, EmptyText, Dot, Count. **CSS:** `.vui-kanban*`. **Preview:** `components/Kanban/preview.html` (group Planning).
