Range field → popover with presets column + two months (one under 720px). Changes are a draft until Apply; footer shows the span in days.

Defined in the same module as `DatePicker`; see its README for the related components.

**Props.** The full contract is `DateRangePickerProps` in `components/index.d.ts`.

- `label`: `string`
- `hint`: `string`
- `error`: `string`
- `optional`: `boolean`
- `value`: `DateRange`
- `defaultValue`: `DateRange`
- `onChange`: `(range: DateRange) => void`
- `presets`: `RangePreset[]`. Defaults: Today, Last 7 / 30 days, This / Last month, This year. [] hides the column.
- `placeholder`: `string`
- `min`: `Date`
- `max`: `Date`
- `isDisabled`: `(date: Date) => boolean`
- `locale`: `string`
- `weekStartsOn`: `number`
- …and 5 more in `components/index.d.ts`.

**Preview:** `components/DateRangePicker/preview.html` (group Pickers).
