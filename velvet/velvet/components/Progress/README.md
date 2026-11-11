Linear progress for determinate tasks (upload, onboarding, quota) or indeterminate loading.

Use Progress when the percentage is known, `Skeleton` when the shape of the content is known and `Spinner` otherwise. Use the `warning` or `danger` tone for a quota near its limit.

```jsx
<Progress label="Uploading 12 files" value={64} showValue />

<Progress label="Storage" value={18.4} max={20} showValue tone="warning" format={(v, max) => v + ' of ' + max + ' GB'} />

<Progress label="Syncing" indeterminate size="sm" />
```

**Props.** The full contract is `ProgressProps` in `components/index.d.ts`.

**Built from:** Meter. **Also exports:** ProgressRing. **CSS:** `.vui-progress*`. **Preview:** `components/Progress/preview.html` (group Progress).
