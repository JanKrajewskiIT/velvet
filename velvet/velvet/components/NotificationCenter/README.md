Bell button with unread count → popover list with unread dots, colour-coded icons, "Mark all read" and a footer link. Put it in the app header, right side.

NotificationCenter is the bell with its panel. Items carry `unread`, a `tone` and an optional `avatar`, and the panel offers mark-all-read and view-all.

```jsx
<NotificationCenter items={items}
  onMarkAllRead={() => setItems(i => i.map(x => ({ ...x, unread: false })))}
  onItemClick={markRead}
  onViewAll={goToInbox} />
```

**Props.** The full contract is `NotificationCenterProps` in `components/index.d.ts`.

**Built from:** IconTile, ListItem, Count, Badge, Button, Glyph, EmptyText, Dot, `primitives/tone.js`, `primitives/useDismiss.js`. **Also exports:** NotificationList. **CSS:** `.vui-notif*`. **Preview:** `components/NotificationCenter/preview.html` (group Feedback).
