Loader: ring (default, inline/buttons), dots (chat/typing), bars (audio/processing), pulse (live). Use Skeleton when content shape is known; Progress when % is known.

Use Spinner when neither the shape of the content nor the percentage is known. Otherwise use `Skeleton` or `Progress`. Inside a button use `Button loading` instead.

```jsx
<Spinner />
<Spinner variant="dots" />
<Spinner variant="bars" />
```

**Props.** The full contract is `SpinnerProps` in `components/index.d.ts`.

**Also exports:** LoadingOverlay. **CSS:** `.vui-loader*`. **Preview:** `components/Spinner/preview.html` (group Atoms).
