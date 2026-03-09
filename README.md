# Velvet UI

SolidJS UI component library published as `@jankrajewskiit/ui`.

## Installation

```bash
npm install @jankrajewskiit/ui solid-js @solidjs/router
```

## Quick Start

```tsx
import '@jankrajewskiit/ui/styles';
import { Button, ThemeProvider } from '@jankrajewskiit/ui';

const App = () => {
  return (
    <ThemeProvider>
      <Button variant="primary">Save</Button>
    </ThemeProvider>
  );
};
```

## Design Rules

- Components are framework-consistent and optimized for apps using the same stack.
- Text labels are passed through props.
- Styling is based on CSS variables and CSS Modules.
- The package styles include design tokens, global baseline layout, and component styles.

## Main Exports

### Common Components

`AccessDenied`, `Accordion`, `AccordionItem`, `ActionRow`, `AiResultPanel`, `Autocomplete`, `Button`, `Checkbox`, `Chip`, `ColorPicker`, `ConfirmDialog`, `Dialog`, `DialogActions`, `DialogBody`, `DialogTitle`, `Drawer`, `DropdownButton`, `DropdownItem`, `DropdownMenu`, `EmptyState`, `ErrorFallback`, `ErrorMessage`, `FileDropZone`, `FlipCard`, `FormField`, `FormGrid`, `FormLayout`, `IconButton`, `Input`, `Select`, `TextArea`, `JsonDisplay`, `LoadingContainer`, `LocaleSwitcher`, `MarkdownEditDialog`, `MarkdownRenderer`, `Pagination`, `RadarChart`, `RadioGroup`, `ScoreRing`, `SectionCard`, `Skeleton`, `Spinner`, `StatCard`, `Stepper`, `Switch`, `Table`, `TableHead`, `TableBody`, `TableRow`, `TableHeader`, `TableCell`, `Tabs`, `TagChip`, `TagInput`, `ThemeToggle`, `Timeline`, `Tooltip`, `Wizard`.

### Layout Components

`Footer`, `MainLayout`, `Navbar`.

### Theme, Hooks, Utils, Types

- Theme: `ThemeProvider`, `useTheme`, `ThemeChoice`
- Toast: `ToastProvider`, `ToastViewport`, `useToast`, `addToast`, `removeToast`, `ToastMessage`
- Hooks: `useClickOutside`, `useEscapeKey`
- Utils: `getContrastTextColor`, `orEmpty`, `numberToString`, `emptyToNull`, `parseFloatOrNull`
- Types: `Props`, `NavItem`, `RadioOption`, `WizardStep`

## Scripts

```bash
npm run typecheck
npm run lint
npm run build
npm run test
npm run verify
```

`npm run verify` executes the full quality gate: typecheck, lint, build, and tests.

## Testing

Tests are stored in `tests/` and run with Node test runner after TypeScript compilation via `tsconfig.test.json`.

## Publishing

Publishing is done by GitHub Actions on tags matching `v*`.

- Workflow: `.github/workflows/publish.yml`
- Demo deployment workflow: `.github/workflows/deploy-demo.yml`
