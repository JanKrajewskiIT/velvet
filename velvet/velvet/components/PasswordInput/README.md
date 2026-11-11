Password field with show/hide toggle and optional live strength meter (4 segments + label).

Use `showStrength` on fields where the person chooses a new password, not on sign-in.

```jsx
<PasswordInput label="New password" showStrength hint="12+ characters recommended" />

<PasswordInput label="Current password" />
```

**Props.** The full contract is `PasswordInputProps` in `components/index.d.ts`.

- Also accepts the native attributes of the root element (`<input>`).

**Built from:** Glyph, Field, Control, Meter. **Also exports:** passwordScore. **CSS:** shared (deps). **Preview:** `components/PasswordInput/preview.html` (group Inputs).
