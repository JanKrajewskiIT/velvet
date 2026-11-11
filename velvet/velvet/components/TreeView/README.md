Hierarchical list (files, categories, org). WAI-ARIA tree keyboard: ↑↓ move · → expand / into child · ← collapse / to parent · Home/End · Enter select · * expand siblings. Indent guides per level. With checkable: tri-state checkboxes (parent = all / some / none of its leaves), Space or click toggles; value is the list of checked LEAF ids. With onMove: drag rows (top/bottom edge = before/after, middle of a folder = inside) or Alt+↑/↓ reorder among siblings · Alt+→ into the previous sibling · Alt+← out of the parent; moves into itself or its own descendants are rejected; result is announced.

**Props.** The full contract is `TreeViewProps` in `components/index.d.ts`.

- …and 1 more in `components/index.d.ts`.

**Built from:** Chevron, Checkmark, Button, Glyph. **Also exports:** moveTreeNode. **CSS:** `.vui-tree*`. **Preview:** `components/TreeView/preview.html` (group Wayfinding).
