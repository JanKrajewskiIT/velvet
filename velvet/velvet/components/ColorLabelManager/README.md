Compact dialog (sm) listing labels as dot + name with edit / delete icon buttons. Edit and "Add label" open a Name + Color form at the bottom (footer switches to Cancel / Save). Delete confirms inline under the row. Duplicate names are rejected. Colours default to the data-viz palette.

**Props.** The full contract is `ColorLabelManagerProps` in `components/index.d.ts`.

- `open` (required): `boolean`
- `onClose`: `() => void`
- `labels` (required): `ColorLabel[]`
- `onChange`: `(labels: ColorLabel[]) => void | Promise<void>`. May return a Promise — Save / Delete lock while pending; on reject the form stays open and the error shows inline.
- `colors`: `string[]`
- `title`: `string`

**Built from:** IconButton, ListItem, EmptyText, Control, Field, Button, Glyph, Dialog. **Also exports:** LABEL_COLORS. **CSS:** `.vui-clm*`. **Preview:** `components/ColorLabelManager/preview.html` (group Overlays).
