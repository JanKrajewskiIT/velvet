---
name: solidjs-component
description: SolidJS component patterns for the VelvetUi shared library — Props convention, CSS Modules, theming, component inventory, slots pattern, and anti-patterns
---

## Component Pattern

Components use arrow functions with `Props<T>` for the `class` prop:

```tsx
import type Props from '../../../models/Props';

interface MyComponentProps {
  title: string;
}

const MyComponent = (props: Props<MyComponentProps>) => {
  return (
    <div class={`${styles.wrapper} ${props.class ?? ''}`}>
      {props.title}
    </div>
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
- Always **forward** `class` on the top-level element: `` class={`${styles.x} ${props.class ?? ''}`} ``
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
  common/           # Reusable UI primitives (29 components)
  layout/           # Layout components (Footer, MainLayout, Navbar)
```

## Common Components Inventory

| Component | Purpose | Key Props |
|---|---|---|
| `AccessDenied` | 403 page | `message?` |
| `ActionRow` | Flex row for buttons | `align?` (center/start/end) |
| `AiResultPanel` | AI result display | Loading/error/result/idle states, with `ScoreRing` |
| `Button` | Primary action button | Variants: primary, danger, ghost, dashed |
| `Chip` | Status/tag chip | 7 color variants |
| `ConfirmDialog` | Yes/No confirmation | `title`, `message`, `onConfirm` |
| `Dialog` | Modal dialog | Uses `<Portal>` + native `<dialog>` |
| `DialogTitle` | Dialog header | `children` |
| `DialogBody` | Dialog content area | `children` |
| `DialogActions` | Dialog footer buttons | `children` |
| `DropdownButton` | Button + dropdown combo | `children` |
| `DropdownMenu` | Floating menu | `children` |
| `DropdownItem` | Menu item | `children`, `onClick` |
| `EmptyState` | Empty/no-data placeholder | `message`, `hint?`, `children?` |
| `ErrorMessage` | Error display | `message` |
| `FormField` | Label + input wrapper | `label`, `error?`, `children` |
| `FormGrid` | 2-column responsive grid | Collapses at 768px |
| `FormLayout` | Full form layout | `children` |
| `IconButton` | Icon-only button | Icon + optional tooltip |
| `Input` | Text input | Uses `splitProps` for native HTML attrs |
| `Select` | Select dropdown | Uses `splitProps` for native HTML attrs |
| `TextArea` | Multi-line input | Uses `splitProps` for native HTML attrs |
| `JsonDisplay` | Pretty-print JSON | `data` |
| `LoadingContainer` | Content loading wrapper | Shows spinner while loading |
| `LocaleSwitcher` | Language switch button | `locale`, `label`, `switchLabel`, `onSwitch` |
| `MarkdownEditDialog` | Edit markdown in dialog | `children` |
| `MarkdownRenderer` | Render markdown safely | DOMPurify + solid-markdown + remark-gfm |
| `ScoreRing` | SVG circular score | Animated ring |
| `SectionCard` | Collapsible card section | `title`, `children`, `defaultOpen?` |
| `Spinner` | Loading indicator | Sizes: sm, md, lg |
| `StatCard` | Metric card with icon | `value`, `label`, `icon?`, `colorClass?` |
| `Tabs` | Tab navigation | Generic `<T extends string>`, underline/pill variants |
| `TagChip` | Interactive tag | `label`, `color`, `selected?`, `onClick?` |
| `ThemeToggle` | Light/dark theme switch | `lightLabel`, `darkLabel`, `groupLabel?` |

## Layout Components

| Component | Purpose | Key Props/Slots |
|---|---|---|
| `Footer` | Page footer | `copyrightText`, `privacyLabel`, `privacyHref`, `builtWithText` |
| `MainLayout` | Root layout | `navbar?: JSX.Element`, `footer?: JSX.Element`, `children` |
| `Navbar` | Top navigation bar | `navItems`, `logo?: JSX.Element`, `actions?: JSX.Element`, `toggleMenuLabel?`, `navLabel?` |
| `NavItem` (type) | Nav item shape | `label: string`, `href: string`, `icon: IconTypes` |

## CSS Modules

- One `.module.css` file per component, co-located in the same directory
- Import as `import styles from './Component.module.css'`
- Use **camelCase** for class names: `.menuItem`, `.addButton`
- Use CSS custom properties for theming: `var(--color-primary)`, `var(--spacing-md)`

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
