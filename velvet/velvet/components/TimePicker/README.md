Time field: type freely ("930", "9:30", "9.30pm") or pick from a step list. Value is always "HH:MM" 24h.

Defined in the same module as `DatePicker`; see its README for the related components.

**Props.** The full contract is `TimePickerProps` in `components/index.d.ts`.

- `label`: `string`
- `hint`: `string`
- `error`: `string`
- `optional`: `boolean`
- `value`: `string | null`. "HH:MM" 24h.
- `defaultValue`: `string | null`
- `onChange`: `(time: string | null) => void`
- `step`: `number`, default `15`. List step in minutes.
- `min`: `string`, default `'00:00'`
- `max`: `string`, default `'23:59'`
- `hour12`: `boolean`, default `false`. Display as 9:30 AM.
- `placeholder`: `string`
- `size`: `'sm' | 'md' | 'lg'`
- `disabled`: `boolean`
- …and 1 more in `components/index.d.ts`.

**Preview:** `components/TimePicker/preview.html` (group Pickers).

**Built from:** Listbox.
