Inline message inside content — form errors, plan limits, contextual tips. danger/warning announce as role=alert.

Use an Alert for a message that belongs to one part of the screen. For a page-wide strip (system status, trial ending, maintenance) use `Banner`.

```jsx
<Alert tone="info" title="New export format">CSV exports now include custom fields.</Alert>

<Alert tone="warning" title="You’re at 92% of storage"
       action={<Button size="sm" variant="secondary">Upgrade plan</Button>}>
  Uploads pause at 100%.
</Alert>

<Alert tone="success" title="Domain verified" onClose={dismiss}>velvet.design is ready to use.</Alert>
```

**Props.** The full contract is `AlertProps` in `components/index.d.ts`.

**Built from:** Glyph, CloseButton, `primitives/tone.js`. **Also exports:** Banner. **CSS:** `.vui-alert*` `.vui-banner*`. **Preview:** `components/Alert/preview.html` (group Feedback).
