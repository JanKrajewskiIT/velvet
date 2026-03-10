---
paths:
  - 'src/**/*.tsx'
---

# SolidJS TSX

- Arrow functions only, never `function` declarations
- `import type Props from '~/models/Props'` -- path alias, never relative
- Inline `Props<T>` in signature: `(props: Props<MyProps>) =>` -- no intermediate type alias
- Forward `class` with `??`: `` `${styles.x} ${props.class ?? ''}` `` -- never `||`
- `splitProps` + `{...rest}` only for HTML wrapper components extending `JSX.*HTMLAttributes`
- Without HTML spreading: access `props.name` directly
- Never JS-destructure props -- breaks reactivity
- Never React patterns (`useState`, `useEffect`, `className`)
- Icons: `solid-icons` only
- One component per file, ~150 lines max
- `export default` (exception: generic components use named export)
