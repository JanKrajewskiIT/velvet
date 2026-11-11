One row inside any listbox or menu — icon, label, description, shortcut, check, active/selected/danger/disabled. Menu items, Select, Autocomplete, MultiSelect, PhoneInput and TimePicker options (via `ListboxOption`) and CommandPalette rows all share this row (tokens: --option-*).

**Props.** The full contract is `OptionProps` in `components/index.d.ts`.

- `leading`, `trailing`: `ReactNode`. Extra content before the icon / after the label (Checkmark, country code, dial code).
- `as`: element, default `'div'` — `Listbox` renders it as `li`.
- Also accepts the native attributes of the root element (`<div>`).

**Built from:** Glyph. **CSS:** `.vui-option*`. **Preview:** `components/Option/preview.html` (group Atoms).
