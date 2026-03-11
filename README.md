# VelvetUi

SolidJS UI component library published as `@jankrajewskiit/ui`.

Full documentation: [Recron Docs → External → VelvetUi](https://docs.bluebraces.online/external/velvet-ui/)

## Install

```bash
npm install @jankrajewskiit/ui solid-js @solidjs/router
```

`.npmrc` for GitHub Packages authentication:

```ini
//npm.pkg.github.com/:_authToken=${GHCR_TOKEN}
@jankrajewskiit:registry=https://npm.pkg.github.com/
```

## Quick Start

```tsx
import '@jankrajewskiit/ui/styles';
import { Button, ThemeProvider } from '@jankrajewskiit/ui';

const App = () => (
  <ThemeProvider>
    <Button variant="primary">Save</Button>
  </ThemeProvider>
);
```
