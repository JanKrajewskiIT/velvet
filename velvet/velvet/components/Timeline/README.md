Vertical activity/history feed. default = connecting rail + 32px markers (history, audit trail, review schedule). compact = no rail, 24px markers, one line per event. Items can carry a badge, meta facts and actions (edit / add to calendar / delete) — destructive actions confirm inline; async handlers are awaited. onAdd appends a dashed "Add event" row.

The default Timeline is a rail of events. `variant="compact"` makes an activity feed, and `status` (`done`, `current`, `upcoming`) turns it into a pipeline.

```jsx
<Timeline items={[
  { id: 1, status: 'done', title: 'Application sent', time: 'Mon', description: 'Via the careers page' },
  { id: 2, status: 'current', title: 'Phone screen', time: 'Thu' },
  { id: 3, status: 'upcoming', title: 'On-site' },
]} />

<Timeline variant="compact" divided items={activity} />
```

**Props.** The full contract is `TimelineProps` in `components/index.d.ts`.

**Built from:** Badge, Button, Glyph, Marker, Rail. **CSS:** `.vui-timeline*`. **Preview:** `components/Timeline/preview.html` (group Data).
