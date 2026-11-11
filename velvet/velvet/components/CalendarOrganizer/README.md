Month planner: day grid with event chips (+N more) beside a detail panel for the selected day, with quick add and delete (inline Cancel / Delete confirm by default). Arrow keys move between days; Today / prev / next. Stacks under 820px.

**Props.** The full contract is `CalendarOrganizerProps` in `components/index.d.ts`.

- `events` (required): `OrganizerEvent[]`
- `onEventsChange`: `(events: OrganizerEvent[]) => void`. Enables add + delete.
- `onEventClick`: `(e: OrganizerEvent) => void`
- `defaultMonth`: `Date`
- `selected`: `Date | string`. Selected day (controlled).
- `defaultSelected`: `Date`
- `onSelectedChange`: `(day: Date) => void`
- `confirmDelete`: `boolean`, default `true`. Ask before deleting.
- `weekStartsOn`: `number`
- `locale`: `string`
- `maxChips`: `number`, default `2`. Chips per cell.

**Built from:** EmptyText, Control, IconButton, Button, Glyph, Calendar, Weekday, `primitives/date.js`, PeriodNav. **CSS:** `.vui-organizer*`. **Preview:** `components/CalendarOrganizer/preview.html` (group Planning).
