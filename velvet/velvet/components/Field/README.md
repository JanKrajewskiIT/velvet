Label + control + hint/error stack with ids and aria wired. Every form component (Input, Select, DatePicker, NumberInput, PhoneInput…) composes it so labels, hints, error lanes and counters look and behave the same. Pass a render function to receive { id, invalid, describedBy }.

**Props.** The full contract is `FieldProps` in `components/index.d.ts`.

**Also exports:** FieldLabel, FieldHint. **CSS:** `.vui-field*`. **Preview:** `components/Field/preview.html` (group Atoms).
