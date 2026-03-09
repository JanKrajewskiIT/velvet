# SolidJS Component Patterns — VelvetUi

SolidJS component patterns for the VelvetUi shared library: Props convention, CSS Modules, theming, component inventory, slots pattern, and anti-patterns.

## Component Pattern

Components use arrow functions with `Props<T>` for the `class` prop:

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

If the component has no extra props, use `Props` directly:

```tsx
const MyComponent = (props: Props) => {
  return <div class={`${styles.wrapper} ${props.class ?? ''}`} />;
};

export default MyComponent;
```

`Props<T>` is defined as `type Props<T = object> = T & { class?: string }` in `src/models/Props.ts`.

## Component Rules

- Always use **arrow functions** (`const X = (props) => { ... }; export default X;`) — never function declarations
- Always use `Props<T>` (from `../../models/Props` or `../../../models/Props`) — never manually declare `class?: string`
- Always **forward** `class` on the top-level element: ``class={`${styles.x} ${props.class ?? ''}`}``
- Use CSS Modules for styling (`Component.module.css` alongside `Component.tsx`)
- Use `solid-icons` (io, fi, fa, ai, bi icon sets) — NEVER use emoji as icons
- Each component lives in its own directory: `ComponentName/ComponentName.tsx` + `ComponentName.module.css`
- **One component per file** — never define multiple components in a single file
- **Split large components** — if a component exceeds ~150 lines, break it into smaller sub-components in the same directory
- NEVER destructure props — access as `props.name` to preserve SolidJS reactivity
- The `ThemeProvider`/`useTheme` context uses `ParentProps`, not `Props`

## Library-Specific Rules

- Components MUST be **generic and app-agnostic** — NEVER import app stores, i18n, auth, or routing logic
- All user-facing text MUST be passed via **props** — consumers resolve translations at the call site
- Layout components use **JSX slots** for composition (e.g., `navbar?: JSX.Element`, `footer?: JSX.Element`, `actions?: JSX.Element`)
- Import paths use relative imports (`../../../models/Props`), not path aliases
- Every new component MUST be exported from `src/index.ts`

## Component Directory Structure

```
src/components/
  actions-and-forms/    # Form inputs, buttons, dropdowns (19 components)
  data-display/         # Tables, charts, content renderers (9 components)
  feedback-and-states/  # Status, loading, toasts (11 components)
  layouts/              # Page layout shells (3 components)
  overlays/             # Dialogs, drawers, tooltips (6 components)
  workflows/            # Complex multi-step UI patterns (10 components)
```

## Actions & Forms Components

| Component        | Purpose                     | Key Props                                     |
| ---------------- | --------------------------- | --------------------------------------------- |
| `ActionRow`      | Flex row for buttons        | `align?` (center/start/end)                   |
| `Autocomplete`   | Text input with suggestions | `value`, `suggestions`, `onSelect`            |
| `Button`         | Primary action button       | Variants: primary, danger, ghost, dashed      |
| `Checkbox`       | Boolean checkbox input      | `checked`, `onChange`, `label`                |
| `ColorPicker`    | Hex color input + swatch    | `value`, `onChange`                           |
| `DropdownButton` | Button + dropdown combo     | `children`                                    |
| `DropdownMenu`   | Floating menu               | `children`                                    |
| `DropdownItem`   | Menu item                   | `children`, `onClick`                         |
| `FormField`      | Label + input wrapper       | `label`, `error?`, `children`                 |
| `FormGrid`       | 2-column responsive grid    | Collapses at 768px                            |
| `FormLayout`     | Full form layout            | `children`                                    |
| `IconButton`     | Icon-only button            | Icon + optional tooltip                       |
| `Input`          | Text input                  | Uses `splitProps` for native HTML attrs       |
| `Select`         | Select dropdown             | Uses `splitProps` for native HTML attrs       |
| `TextArea`       | Multi-line input            | Uses `splitProps` for native HTML attrs       |
| `LocaleSwitcher` | Language switch button      | `locale`, `label`, `switchLabel`, `onSwitch`  |
| `RadioGroup`     | Radio button group          | `options: RadioOption[]`, `value`, `onChange` |
| `Switch`         | Toggle switch               | `checked`, `onChange`, `label?`               |
| `TagInput`       | Multi-value tag input       | `value`, `onChange`                           |

## Data Display Components

| Component                                                                      | Purpose                      | Key Props                               |
| ------------------------------------------------------------------------------ | ---------------------------- | --------------------------------------- |
| `Accordion` / `AccordionItem`                                                  | Collapsible content sections | `title`, `children`, `defaultOpen?`     |
| `JsonDisplay`                                                                  | Pretty-print JSON            | `data`                                  |
| `MarkdownRenderer`                                                             | Render markdown safely       | DOMPurify + solid-markdown + remark-gfm |
| `Pagination`                                                                   | Page navigation              | `page`, `totalPages`, `onPageChange`    |
| `RadarChart`                                                                   | SVG radar/spider chart       | `data`, `labels`                        |
| `ScoreRing`                                                                    | SVG circular score           | Animated ring                           |
| `SectionCard`                                                                  | Collapsible card section     | `title`, `children`, `defaultOpen?`     |
| `Stepper`                                                                      | Step progress indicator      | `steps`, `currentStep`                  |
| `Table` / `TableBody` / `TableCell` / `TableHead` / `TableHeader` / `TableRow` | Data table primitives        | Composable table structure              |

## Feedback & States Components

| Component          | Purpose                     | Key Props                                 |
| ------------------ | --------------------------- | ----------------------------------------- |
| `AccessDenied`     | 403 page                    | `message?`                                |
| `Chip`             | Status/tag chip             | 7 color variants                          |
| `EmptyState`       | Empty/no-data placeholder   | `message`, `hint?`, `children?`           |
| `ErrorFallback`    | Error boundary fallback UI  | `error`, `reset?`                         |
| `ErrorMessage`     | Inline error display        | `message`                                 |
| `LoadingContainer` | Content loading wrapper     | Shows spinner while loading               |
| `Skeleton`         | Loading placeholder shimmer | `width?`, `height?`                       |
| `Spinner`          | Loading indicator           | Sizes: sm, md, lg                         |
| `StatCard`         | Metric card with icon       | `value`, `label`, `icon?`, `colorClass?`  |
| `TagChip`          | Interactive tag             | `label`, `color`, `selected?`, `onClick?` |
| `ThemeToggle`      | Light/dark theme switch     | `lightLabel`, `darkLabel`, `groupLabel?`  |

## Toast System

| Export          | Type      | Description                               |
| --------------- | --------- | ----------------------------------------- |
| `ToastProvider` | Component | Context provider — wrap app root          |
| `ToastViewport` | Component | Renders toast stack in DOM                |
| `addToast`      | Function  | `addToast({ message, type?, duration? })` |
| `removeToast`   | Function  | `removeToast(id)`                         |
| `useToast`      | Hook      | Returns current toast list                |
| `ToastMessage`  | Type      | Toast message shape                       |

Usage: `addToast` / `removeToast` can be called from anywhere (no hook required). `ToastProvider` + `ToastViewport` must be mounted in the app shell.

## Layout Components

| Component        | Purpose            | Key Props/Slots                                                                            |
| ---------------- | ------------------ | ------------------------------------------------------------------------------------------ |
| `Footer`         | Page footer        | `copyrightText`, `privacyLabel`, `privacyHref`, `builtWithText`                            |
| `MainLayout`     | Root layout        | `navbar?: JSX.Element`, `footer?: JSX.Element`, `children`                                 |
| `Navbar`         | Top navigation bar | `navItems`, `logo?: JSX.Element`, `actions?: JSX.Element`, `toggleMenuLabel?`, `navLabel?` |
| `NavItem` (type) | Nav item shape     | `label: string`, `href: string`, `icon: IconTypes`                                         |

## Overlay Components

| Component       | Purpose                   | Key Props                                   |
| --------------- | ------------------------- | ------------------------------------------- |
| `ConfirmAction` | Generic confirm wrapper   | `onConfirm`, `render` (render prop pattern) |
| `ConfirmDialog` | Yes/No confirmation modal | `title`, `message`, `onConfirm`             |
| `Dialog`        | Modal dialog              | Uses `<Portal>` + native `<dialog>`         |
| `DialogTitle`   | Dialog header             | `children`                                  |
| `DialogBody`    | Dialog content area       | `children`                                  |
| `DialogActions` | Dialog footer buttons     | `children`                                  |
| `Drawer`        | Side panel overlay        | `open`, `onClose`, `children`               |
| `Tooltip`       | Hover tooltip             | `content`, `children`                       |

## Workflow Components

| Component            | Purpose                    | Key Props                                             |
| -------------------- | -------------------------- | ----------------------------------------------------- |
| `AiResultPanel`      | AI result display          | Loading/error/result/idle states, with `ScoreRing`    |
| `AuthRedirect`       | Auth-gated redirect        | `isAuthenticated`, `redirectTo`                       |
| `EditableCollection` | CRUD list with inline edit | `items`, `renderItem`, `onAdd`, `onRemove`            |
| `FileDropZone`       | Drag-and-drop file upload  | `onDrop`, `accept?`                                   |
| `FlipCard`           | 3D flip card (front/back)  | `front`, `back`                                       |
| `MarkdownEditDialog` | Edit markdown in dialog    | `value`, `onChange`                                   |
| `RequireAuth`        | Auth guard wrapper         | `isAuthenticated`, `fallback?`                        |
| `Tabs`               | Tab navigation             | Generic `<T extends string>`, underline/pill variants |
| `Timeline`           | Vertical timeline          | `items`                                               |
| `Wizard`             | Multi-step wizard          | `steps: WizardStep[]`, `onComplete`                   |

## CSS Modules

- One `.module.css` file per component, co-located in the same directory
- Import as `import styles from './Component.module.css'`
- Use **camelCase** for class names: `.menuItem`, `.addButton`
- Use CSS custom properties for theming: `var(--color-primary)`, `var(--spacing-md)`
- Load `/design-tokens` skill for the full token reference

## Theming System

Design tokens defined in `src/theme/globals.css`. Use CSS custom properties: `var(--color-*)`, `var(--spacing-*)`, `var(--font-size-*)`, `var(--radius-*)`, `var(--shadow-*)`, `var(--z-*)`, `var(--transition-*)`. Dark theme via `[data-theme='dark']` selector. `globals.css` is imported in `index.ts` and bundled into the output CSS.

## Hooks

- `useClickOutside(ref, isActive, onClickOutside)` — conditional click-outside detection
- `useEscapeKey(isActive, onEscape)` — conditional Escape key listener

## Utilities

- `src/utils/color.ts` — `getContrastTextColor(hexColor)` returns black or white for contrast
- `src/utils/form.ts` — `orEmpty()`, `numberToString()`, `emptyToNull()`, `parseFloatOrNull()`

## Frontend Anti-Patterns (NEVER)

- NEVER destructure props — breaks SolidJS reactivity
- NEVER use `dangerouslySetInnerHTML` without DOMPurify
- NEVER skip `class` prop on components
- NEVER use React patterns (`useState`, `useEffect`, `useMemo`)
- NEVER use `className` — SolidJS uses `class`
- NEVER use function declarations for components — use arrow functions
- NEVER declare `class?: string` manually — use `Props<T>`
- NEVER import CSS modules from another component's directory
- NEVER add comments to frontend code
- NEVER add `eslint-disable` directives
- NEVER import app-specific stores (auth, i18n, routing) — this is a generic library
