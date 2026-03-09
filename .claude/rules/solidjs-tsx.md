---
paths:
  - 'src/**/*.tsx'
---

# SolidJS TSX Rules

- Arrow function components, never function declarations
- `Props<T>` from `../../models/Props` or `../../../models/Props` -- never manual `class?: string`
- Forward `class` on top-level element: ``class={`${styles.x} ${props.class ?? ''}`}``
- NEVER destructure props -- access as `props.name` for SolidJS reactivity
- NEVER use React patterns: `useState`, `useEffect`, `useMemo`, `className`
- Icons from `solid-icons` only -- never emoji
- One component per file, split at ~150 lines
- No comments, no `eslint-disable`
- No app-specific imports (auth, i18n, routing) -- this is a generic library
