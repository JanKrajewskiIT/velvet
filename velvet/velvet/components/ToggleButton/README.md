Button with an on/off state (aria-pressed) — favourite, follow, bold, mute. It is an ACTION that stays pressed, not a setting (use Switch) and not a one-of-N view choice inside a form (use OptionSwitcher). Inside a ToggleGroup the group owns the state; pass value instead of pressed.

**Props.** The full contract is `ToggleButtonProps` in `components/index.d.ts`.

- Also accepts the native attributes of the root element (`<button>`).

**Built from:** Glyph. **CSS:** `.vui-toggle*`. **Preview:** `components/ToggleButton/preview.html` (group Actions).
