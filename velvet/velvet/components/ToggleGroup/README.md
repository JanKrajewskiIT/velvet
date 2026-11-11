A set of `ToggleButton`s that share state. `type="multiple"` keeps each button independent (bold / italic / underline); `type="single"` keeps exactly one pressed, and clicking the pressed one keeps it (a view switch: grid / list / board). ← → move focus between the buttons.

Give each child a `value` instead of `pressed`; the group owns the state. Pass `label` as the accessible name of the group. `attached` (default) joins the buttons into one segmented bar with a shared border; `attached={false}` spaces them out. For a one-of-N choice inside a form use `OptionSwitcher` instead.

**Props.** The full contract is `ToggleGroupProps` in `components/index.d.ts`.

- `type`: `'single' | 'multiple'`
- `value` / `defaultValue`: `string[]` for multiple, `string` for single
- `onValueChange`: `(value) => void`
- `attached`, `size`: `'sm' | 'md' | 'lg'`, `disabled`, `label`

**Built from: nothing else.** **CSS:** `.vui-toggle*`. **Preview:** `components/ToggleGroup/preview.html` (group Actions).
