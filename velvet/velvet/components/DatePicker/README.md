Date field → calendar popover. Today / Clear in the footer, Esc closes and refocuses. Compact: the field is a button, no free typing.

DatePicker picks one date. For a from–to range use `DateRangePicker`, for a date with a time use `DateTimePicker`. TimePicker commits typed text when you press Enter or Tab, or click away.

```jsx
<DatePicker label="Due date" defaultValue={new Date()} hint="Weekends allowed" />

<DatePicker label="Birthday" placeholder="Pick a date" max={new Date()} />
```

**Props.** The full contract is `DatePickerProps` in `components/index.d.ts`.

- …and 7 more in `components/index.d.ts`.

**Built from:** Control, Button, CloseButton, Field, Glyph, Calendar, `primitives/date.js`, `primitives/useDismiss.js`, Listbox. **Also exports:** DateRangePicker, DEFAULT_RANGE_PRESETS, TimePicker, parseTime. **CSS:** `.vui-datepicker*` `.vui-rangepop*` `.vui-time*`. **Preview:** `components/DatePicker/preview.html` (group Pickers).
