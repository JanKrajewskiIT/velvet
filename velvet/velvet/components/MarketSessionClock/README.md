Open / opening-in / closed state of trading venues, computed from each venue's own time zone, weekdays, holidays and early closes, and refreshed every 30 seconds. `marketSession(market, date)` is the same logic as a pure helper.

**Use it** in a `StatusBar` (`variant="inline"`) or in a card (`variant="list"`). It only knows the holidays you pass: when the calendar is incomplete, say so in the item's `title` or next to the list.

**Built from** `StatusBarItem` / `Dot`.

**Props.** The full contract is `MarketSessionClockProps` and `MarketHours` in `components/index.d.ts`.

- `markets`: `{ code, name, timeZone, open, close, days, holidays, earlyClose, alwaysOpen }`.
- `labels`: text templates with `{t}` (time) and `{d}` (duration), for translation.
- `now`: a fixed moment for tests and specimens; omit it for the live clock.

**Preview:** `components/MarketSessionClock/preview.html`.
