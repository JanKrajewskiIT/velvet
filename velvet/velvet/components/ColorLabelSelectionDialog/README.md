Assign colour labels to one item (contact, task, file). Chips toggle on/off (max=1 → single choice, radio semantics); search appears for long lists or when onCreate is set, and "Create “…”" adds a new label inline (Enter). Works on a draft: Apply is disabled until the selection changes; onSubmit may return a Promise — dialog locks while pending, on reject the selection is kept and the error shows inline. Pair with ColorLabelManager via onManage for rename / recolour / delete.

**Props.** The full contract is `ColorLabelSelectionDialogProps` in `components/index.d.ts`.

- …and 1 more in `components/index.d.ts`.

**Built from:** Spinner, Chip, SearchInput, EmptyText, Button, Glyph, Dialog, ColorLabelManager. **CSS:** `.vui-cls*`. **Preview:** `components/ColorLabelSelectionDialog/preview.html` (group Overlays).
