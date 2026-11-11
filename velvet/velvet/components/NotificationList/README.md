The bare list of notifications, for a full activity page; `NotificationCenter` wraps it in a bell and a popover. Each item has a tone icon (or an `avatar`), a title, an optional body, a relative time and, when unread, a brand dot. An empty list shows `emptyText` with a check icon.

Use `NotificationCenter` when notifications live behind a bell in the header, and this list when they have a page of their own. Keep the time as short text ("2m ago", "yesterday"). `emptyText` replaces the default line shown when `items` is empty.

**Props.** The full contract is `NotificationListProps` and `NotificationItem` in `components/index.d.ts`.

- `items` (required): `NotificationItem[]`; each has `id`, `title`, and optionally `body`, `time`, `unread`, `tone`, `icon`, `avatar`
- `onItemClick`: `(item) => void`
- `emptyText`: `string`

**Built from: Badge, Button, Count, Dot, EmptyText, Glyph, IconTile, ListItem, Popover, TONE.** **CSS:** `.vui-notif*`. **Preview:** `components/NotificationList/preview.html` (group Feedback). Defined in the same module as `NotificationCenter`.
