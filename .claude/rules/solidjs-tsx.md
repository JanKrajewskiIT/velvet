---
paths:
  - 'src/**/*.tsx'
---

# SolidJS TSX

- Arrow functions only, never function declarations
- `Props<T>` from `../../models/Props` -- never manual `class?: string`
- Forward `class`: ``class={`${styles.x} ${props.class ?? ''}`}``
- NEVER destructure props -- `props.name` for reactivity
- NEVER React patterns (`useState`, `useEffect`, `className`)
- Icons: `solid-icons` only
- One component per file, split ~150 lines
