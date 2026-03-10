---
name: solidjs-component
description: SolidJS component patterns for VelvetUi -- Props convention, component inventory, slots, hooks, toast system. Use when creating or modifying components.
---

## Component Pattern

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

No extra props: use `Props` directly. `Props<T>` = `T & { class?: string }`.

## File Structure

One component per directory: `ComponentName/ComponentName.tsx` + `.module.css`.
`ThemeProvider`/`useTheme` uses `ParentProps`, not `Props`.
Relative imports (`../../../models/Props`), not path aliases.
Every new component exported from `src/index.ts`.

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
`ToastProvider` + `ToastViewport` in app shell. `useToast()` returns current list.

## Hooks & Utilities

- `useClickOutside(ref, isActive, onClickOutside)`
- `useEscapeKey(isActive, onEscape)`
- `color.ts` -- `getContrastTextColor(hexColor)`
- `form.ts` -- `orEmpty()`, `numberToString()`, `emptyToNull()`, `parseFloatOrNull()`

## Anti-Patterns (NEVER)

- `dangerouslySetInnerHTML` without DOMPurify
- Import app-specific stores (auth, i18n, routing) -- this is a generic library
