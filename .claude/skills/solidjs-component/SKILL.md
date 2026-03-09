---
name: solidjs-component
description: SolidJS component patterns for VelvetUi -- Props convention, CSS Modules, theming, component inventory, slots, hooks, and anti-patterns. Use when creating or modifying SolidJS components.
---

## Component Pattern

Arrow functions with `Props<T>` for the `class` prop:

```tsx
import type Props from '../../../models/Props';

interface MyComponentProps {
  title: string;
}

const MyComponent = (props: Props<MyComponentProps>) => {
  return (
    <div class={`${styles.wrapper} ${props.class ?? ''}`}>{props.title}</div>
  );
};

export default MyComponent;
```

No extra props: use `Props` directly. `Props<T>` = `T & { class?: string }` in `src/models/Props.ts`.

## Rules

- Arrow functions only -- never function declarations
- Always `Props<T>` -- never manual `class?: string`
- Forward `class` on top-level element: ``class={`${styles.x} ${props.class ?? ''}`}``
- CSS Modules: `Component.module.css` alongside `Component.tsx`
- Icons: `solid-icons` (io, fi, fa, ai, bi) -- never emoji
- One component per directory: `ComponentName/ComponentName.tsx` + `.module.css`
- One component per file -- split at ~150 lines
- NEVER destructure props -- access as `props.name` (SolidJS reactivity)
- `ThemeProvider`/`useTheme` uses `ParentProps`, not `Props`

## Library-Specific

- Components MUST be generic and app-agnostic -- no app stores, i18n, auth, routing
- All user-facing text via props
- Layout components: JSX slots (`navbar?`, `footer?`, `actions?`, `logo?`)
- Relative imports (`../../../models/Props`), not path aliases
- Every new component must be exported from `src/index.ts`

## Component Categories

| Category               | Count | Examples                                                                                      |
| ---------------------- | ----- | --------------------------------------------------------------------------------------------- |
| `actions-and-forms/`   | 19    | ActionRow, Button, Checkbox, Input, Select, FormField, FormGrid, TagInput, Switch, RadioGroup |
| `data-display/`        | 9     | Accordion, Table, ScoreRing, RadarChart, MarkdownRenderer, Pagination, Stepper                |
| `feedback-and-states/` | 11    | Chip, Spinner, Toast, Skeleton, StatCard, EmptyState, ErrorFallback, LoadingContainer         |
| `layouts/`             | 3     | Footer, MainLayout, Navbar                                                                    |
| `overlays/`            | 6     | Dialog, Drawer, Tooltip, ConfirmDialog, ConfirmAction                                         |
| `workflows/`           | 10    | AiResultPanel, Wizard, Tabs, FileDropZone, FlipCard, EditableCollection, Timeline             |

## Toast System

`addToast({ message, type?, duration? })` / `removeToast(id)` -- callable from anywhere.
`ToastProvider` + `ToastViewport` must be mounted in app shell. `useToast()` returns current list.

## CSS Modules

- One `.module.css` per component, co-located
- `import styles from './Component.module.css'`
- camelCase class names: `.menuItem`, `.addButton`
- CSS custom properties for theming: `var(--color-primary)`, `var(--spacing-md)`

## Theming

Tokens in `src/theme/globals.css`. Use `var(--color-*)`, `var(--spacing-*)`, `var(--font-size-*)`, `var(--radius-*)`, `var(--shadow-*)`, `var(--z-*)`, `var(--transition-*)`. Dark theme via `[data-theme='dark']`. Load `/design-tokens` for full reference.

## Hooks & Utilities

- `useClickOutside(ref, isActive, onClickOutside)` -- click-outside detection
- `useEscapeKey(isActive, onEscape)` -- Escape key listener
- `color.ts` -- `getContrastTextColor(hexColor)`
- `form.ts` -- `orEmpty()`, `numberToString()`, `emptyToNull()`, `parseFloatOrNull()`

## Anti-Patterns (NEVER)

- Destructure props / use React patterns (`useState`, `useEffect`) / use `className`
- Use function declarations / declare `class?: string` manually / skip `class` prop
- `dangerouslySetInnerHTML` without DOMPurify / import CSS from another component
- Comments in code / `eslint-disable` / import app-specific stores
