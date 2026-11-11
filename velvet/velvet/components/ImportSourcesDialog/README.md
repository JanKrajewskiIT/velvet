Dialog checklist of import sources grouped Connected / Available. Connected rows are selectable; available/errored rows show Connect / Reconnect (async). Footer sums the selection.

**Props.** The full contract is `ImportSourcesDialogProps` in `components/index.d.ts`.

- `open` (required): `boolean`
- `onClose`: `() => void`
- `sources` (required): `ImportSource[]`
- `onImport`: `(ids: string[]) => void | Promise<void>`. On reject: selection kept, error inline, dialog stays open.
- `onConnect`: `(id: string) => void | Promise<void>`
- `title`: `string`

**Built from:** SectionLabel, IconTile, ListItem, Checkbox, Button, Glyph, Dialog. **CSS:** `.vui-imports*`. **Preview:** `components/ImportSourcesDialog/preview.html` (group Overlays).
