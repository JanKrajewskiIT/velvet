# Velvet UI

SolidJS UI component library and shared frontend standards published as `@jankrajewskiit/ui`.

## Install

```bash
npm install @jankrajewskiit/ui solid-js @solidjs/router
```

For GitHub Packages authentication, use `NODE_AUTH_TOKEN` in your environment.

Example `.npmrc`:

```ini
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
@jankrajewskiit:registry=https://npm.pkg.github.com/
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

## Shared Tooling Presets

VelvetUi can be used as a shared standards package across SolidJS projects.

### ESLint

`eslint.config.mjs`

```js
import { createEslintConfig } from '@jankrajewskiit/ui/eslint-config';

export default createEslintConfig({
  tsconfigRootDir: import.meta.dirname,
});
```

### Prettier

`.prettierrc`

```json
"@jankrajewskiit/ui/prettier-config"
```

### TypeScript (Vite App)

`tsconfig.app.json`

```json
{
  "extends": "@jankrajewskiit/ui/tsconfig/app-vite",
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "baseUrl": ".",
    "paths": {
      "~/*": ["src/*"]
    }
  },
  "include": ["src"]
}
```

`tsconfig.node.json`

```json
{
  "extends": "@jankrajewskiit/ui/tsconfig/node-vite",
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo"
  },
  "include": ["vite.config.ts"]
}
```

### Vite

`vite.config.ts`

```ts
import { defineConfig } from 'vite';
import { createSolidAppViteConfig } from '@jankrajewskiit/ui/vite-config';

export default defineConfig(
  createSolidAppViteConfig({
    server: { port: 5173 },
    preview: { port: 5173 },
  })
);
```

`createSolidAppViteConfig` applies defaults for:

- `vite-plugin-solid`
- alias `~ -> <project>/src`
- `solid-markdown` optimizeDeps preset

### lint-staged

`.lintstagedrc.mjs`

```js
import { createLintStagedConfig } from '@jankrajewskiit/ui/lint-staged-config';

export default createLintStagedConfig();
```

### Husky pre-commit

`.husky/pre-commit`

```sh
. "$(dirname -- "$0")/../node_modules/@jankrajewskiit/ui/config/husky-pre-commit.sh"
```

## Main Exports

### Common Components

`AccessDenied`, `Accordion`, `AccordionItem`, `ActionRow`, `AiResultPanel`, `AuthRedirect`, `Autocomplete`, `Button`, `Checkbox`, `Chip`, `ColorPicker`, `ConfirmAction`, `ConfirmDialog`, `Dialog`, `DialogActions`, `DialogBody`, `DialogTitle`, `Drawer`, `DropdownButton`, `DropdownItem`, `DropdownMenu`, `EditableCollection`, `EmptyState`, `ErrorFallback`, `ErrorMessage`, `FileDropZone`, `FlipCard`, `FormField`, `FormGrid`, `FormLayout`, `IconButton`, `Input`, `Select`, `TextArea`, `JsonDisplay`, `LoadingContainer`, `LocaleSwitcher`, `MarkdownEditDialog`, `MarkdownRenderer`, `Pagination`, `RadarChart`, `RadioGroup`, `RequireAuth`, `ScoreRing`, `SectionCard`, `Skeleton`, `Spinner`, `StatCard`, `Stepper`, `Switch`, `Table`, `TableHead`, `TableBody`, `TableRow`, `TableHeader`, `TableCell`, `Tabs`, `TagChip`, `TagInput`, `ThemeToggle`, `Timeline`, `Tooltip`, `Wizard`.

### Layout Components

`Footer`, `MainLayout`, `Navbar`.

### Theme, Toast, Hooks, Utils, Types

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

`npm run verify` executes typecheck, lint, build, and tests.

## Publishing

Publishing runs from GitHub Actions on tags matching `v*`.

- Workflow: `.github/workflows/publish.yml`
- Demo deployment workflow: `.github/workflows/deploy-demo.yml`
