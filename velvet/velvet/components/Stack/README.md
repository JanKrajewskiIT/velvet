Flex stack with token gaps. gap is a space-scale step (4 → var(--space-4)) or any CSS length. divider adds hairlines between children.

Stack lays children out in a row or column with a `gap` on the spacing scale. For a grid of equal cells use `Grid`.

```jsx
<Stack direction="row" gap={2} align="center">
  <Badge>row</Badge>
  <Badge>stack</Badge>
</Stack>
```

**Props.** The full contract is `StackProps` in `components/index.d.ts`.

- `as`: `any`
- `direction`: `'row' | 'column' | 'row-reverse' | 'column-reverse'`
- `gap`: `number | string`, default `4`
- `align`: `React.CSSProperties['alignItems']`
- `justify`: `React.CSSProperties['justifyContent']`
- `wrap`: `boolean`
- `divider`: `boolean`
- Also accepts the native attributes of the root element.

**Also exports:** Grid. **CSS:** `.vui-stack*`. **Preview:** `components/Stack/preview.html` (group Layout).
