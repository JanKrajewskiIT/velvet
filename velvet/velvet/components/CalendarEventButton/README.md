"Add to calendar" for reviews, deadlines, meetings. One provider = plain button; several = menu (Google · Outlook.com · .ics download for Apple Calendar / anything else). After adding it flips to a ✓ "In calendar" state (or pass added). Disabled when start is missing/invalid.

**Props.** The full contract is `CalendarEventButtonProps` in `components/index.d.ts`.

**Built from:** Glyph, Chevron, `primitives/date.js`, `primitives/useDismiss.js`. **Also exports:** buildGoogleCalendarUrl, buildOutlookCalendarUrl, buildIcs. **CSS:** `.vui-calbtn*`. **Preview:** `components/CalendarEventButton/preview.html` (group Actions).
