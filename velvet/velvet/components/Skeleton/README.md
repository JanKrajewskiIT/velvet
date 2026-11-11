Shimmering placeholder in the shape of content that's loading. Wrap the loading region in aria-busy="true". Shimmer stops under reduced motion.

Use Skeleton when the shape of the content is known, `Progress` when the percentage is known and `Spinner` otherwise.

```jsx
<div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
  <Skeleton circle height={40} />
  <div style={{ flex: 1 }}>
    <Skeleton width="45%" height={12} />
    <Skeleton width="30%" height={10} />
  </div>
</div>
```

**Props.** The full contract is `SkeletonProps` in `components/index.d.ts`.

- `width`: `number | string`
- `height`: `number | string`, default `12`
- `circle`: `boolean`
- `radius`: `number | string`

**Also exports:** SkeletonText. **CSS:** `.vui-skeleton*`. **Preview:** `components/Skeleton/preview.html` (group Atoms).
