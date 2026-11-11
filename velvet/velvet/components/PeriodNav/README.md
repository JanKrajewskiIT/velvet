Today and previous / next for stepping through months, weeks and days. Used by Scheduler and CalendarOrganizer so both read the same; Calendar puts one `PeriodNavButton` at each end of its title.

**Props.** The full contract is `PeriodNavProps` / `PeriodNavButtonProps` in `components/index.d.ts`.

- `onPrev`, `onNext`: `() => void`.
- `prevLabel`, `nextLabel`, `todayLabel`: `string`. Accessible names — say the unit ("Previous week").
- `PeriodNavButton`: `dir: 'prev' | 'next'`, `label`, `variant`, `size`.

**Built from:** Button, IconButton. **CSS:** `.vui-periodnav*`, `.vui-btngroup*`. **Preview:** `components/PeriodNav/preview.html` (group Wayfinding).
