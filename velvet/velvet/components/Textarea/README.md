Multi-line text field. Grows with content between `rows` and `maxRows` (autoResize), then scrolls. Same label/hint/error/validate/counter API as Input.

Textarea grows with its content up to `maxRows`; turn that off with `autoResize={false}`. Pass `error` to show the message and mark the field invalid.

```jsx
<Textarea label="Description" rows={3} maxRows={6} showCount maxLength={280}
          hint="Shown on your public profile." />

<Textarea label="Feedback" rows={3} defaultValue="Too short" error="Write at least 20 characters" />
```

**Props.** The full contract is `TextareaProps` in `components/index.d.ts`.

- Also accepts the native attributes of the root element (`<textarea>`).

**Built from:** Field, Control. **CSS:** shared (deps). **Preview:** `components/Textarea/preview.html` (group Inputs).
