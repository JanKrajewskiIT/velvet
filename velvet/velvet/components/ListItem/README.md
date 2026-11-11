One row: leading (Avatar / IconTile / Checkbox / Swatch) · title · description · meta · trailing (Badge, Count, IconButton…). List renders it; NotificationCenter, ImportSourcesDialog, ColorLabelManager and other pattern rows compose it instead of hand-rolled flex rows. Interactive when it renders as button / a / label (hover, pressed, focus ring).

**Props.** The full contract is `ListItemProps` in `components/index.d.ts`.

- Also accepts the native attributes of the root element.

**CSS:** `.vui-list-item*`. **Preview:** `components/ListItem/preview.html` (group Display).
