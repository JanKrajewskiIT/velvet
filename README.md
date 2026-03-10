# Velvet UI

SolidJS UI component library and shared frontend standards published as `@jankrajewskiit/ui`.

## Install

```bash
npm install @jankrajewskiit/ui solid-js @solidjs/router
```

For GitHub Packages authentication, use `GHCR_TOKEN` in your environment.

Example `.npmrc`:

```ini
//npm.pkg.github.com/:_authToken=${GHCR_TOKEN}
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

### Component Sections (Same as Demo)

#### Actions and Forms

`ActionRow`, `Autocomplete`, `Button`, `Checkbox`, `ColorPicker`, `DropdownButton`, `DropdownItem`, `DropdownMenu`, `FormField`, `FormGrid`, `FormLayout`, `IconButton`, `Input`, `Select`, `TextArea`, `LocaleSwitcher`, `RadioGroup`, `Switch`, `TagInput`.

#### Layouts

`Footer`, `MainLayout`, `Navbar`.

#### Feedback and States

`AccessDenied`, `Chip`, `EmptyState`, `ErrorFallback`, `ErrorMessage`, `LoadingContainer`, `Skeleton`, `Spinner`, `StatCard`, `TagChip`, `ThemeToggle`.

#### Overlays

`ConfirmAction`, `ConfirmDialog`, `Dialog`, `DialogActions`, `DialogBody`, `DialogTitle`, `Drawer`, `Tooltip`.

#### Data Display

`Accordion`, `AccordionItem`, `JsonDisplay`, `MarkdownRenderer`, `Pagination`, `RadarChart`, `ScoreRing`, `SectionCard`, `Stepper`, `Table`, `TableHead`, `TableBody`, `TableRow`, `TableHeader`, `TableCell`.

#### Workflows

`AiResultPanel`, `AuthRedirect`, `EditableCollection`, `FileDropZone`, `FlipCard`, `MarkdownEditDialog`, `RequireAuth`, `Tabs`, `Timeline`, `Wizard`.

### Source Structure

```text
src/components/
  actions-and-forms/
  layouts/
  feedback-and-states/
  overlays/
  data-display/
  workflows/
```

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

## CI/CD

### Publishing

Publishing runs from GitHub Actions on tags matching `v*`.

- Workflow: `.github/workflows/publish.yml`

### Demo Deployment

The demo app is deployed as a Docker container to a Hostinger VPS on every push to `main`.

- Workflow: `.github/workflows/deploy-demo.yml`
- Pipeline: verify library → build Docker image → push to GHCR → deploy via SSH

#### Required GitHub Secrets

Create a GitHub Environment named `production` (Settings → Environments → New environment) and add the following secrets:

| Secret        | Description                                                 |
| ------------- | ----------------------------------------------------------- |
| `VPS_HOST`    | Hostinger VPS IP address                                    |
| `VPS_USER`    | SSH username (typically `root`)                             |
| `VPS_SSH_KEY` | Ed25519 private SSH key (see below)                         |
| `GHCR_TOKEN`  | GitHub PAT with `read:packages` and `write:packages` scopes |

#### Generating GHCR_TOKEN

1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token (classic)
3. Set expiration (recommended: 90 days)
4. Select scopes: `read:packages`, `write:packages`
5. Generate token, copy it immediately
6. Add as `GHCR_TOKEN` in the `production` environment secrets

#### Generating VPS_SSH_KEY

**Windows (PowerShell):**

```powershell
# Create .ssh directory if it doesn't exist
mkdir ~/.ssh -ErrorAction SilentlyContinue

# Generate Ed25519 key (press Enter twice for empty passphrase)
ssh-keygen -t ed25519 -C "github-actions-deploy" -f $env:USERPROFILE\.ssh\velvet_deploy

# Copy public key to VPS (enter VPS password when prompted)
Get-Content $env:USERPROFILE\.ssh\velvet_deploy.pub | ssh root@YOUR_VPS_IP "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys"

# Test connection (should connect without password)
ssh -i $env:USERPROFILE\.ssh\velvet_deploy root@YOUR_VPS_IP

# Display private key to copy to GitHub Secrets
Get-Content $env:USERPROFILE\.ssh\velvet_deploy
```

**Linux/macOS:**

```bash
# Generate Ed25519 key with empty passphrase
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/velvet_deploy -N ""

# Copy public key to VPS
ssh-copy-id -i ~/.ssh/velvet_deploy.pub root@YOUR_VPS_IP

# Test connection (should connect without password)
ssh -i ~/.ssh/velvet_deploy root@YOUR_VPS_IP

# Display private key to copy to GitHub Secrets
cat ~/.ssh/velvet_deploy
```

> **Important:** Copy the **entire** private key content, including the header and footer lines:
>
> ```
> -----BEGIN OPENSSH PRIVATE KEY-----
> ...
> -----END OPENSSH PRIVATE KEY-----
> ```
>
> If the VPS is already configured for another project (e.g. Recron), the SSH key is already in `authorized_keys` on the server. You can reuse the same private key — just copy its value into the `VPS_SSH_KEY` secret in this repository.

#### DNS Configuration

Add an A record in Hostinger hPanel (DNS Zone Editor) pointing the demo subdomain to the VPS:

| Type | Name   | Target         |
| ---- | ------ | -------------- |
| A    | `demo` | VPS IP address |

#### SSL Certificate

The demo runs behind the Recron Nginx reverse proxy and shares its wildcard SSL certificate. If the certificate was issued before `demo.bluebraces.online` was added, it must be re-issued to include the new subdomain.

On the VPS:

```bash
# Expand the existing certificate to include demo.bluebraces.online
docker run --rm \
  -v /opt/recron/certbot/conf:/etc/letsencrypt \
  -v /opt/recron/certbot/www:/var/www/certbot \
  certbot/certbot certonly \
  --webroot --webroot-path=/var/www/certbot \
  --email YOUR_EMAIL \
  --agree-tos --no-eff-email --non-interactive --expand \
  -d bluebraces.online \
  -d auth.bluebraces.online \
  -d api.bluebraces.online \
  -d app.bluebraces.online \
  -d docs.bluebraces.online \
  -d demo.bluebraces.online

# Reload Nginx to pick up the new certificate
docker exec recron-nginx nginx -s reload
```

#### Nginx Reverse Proxy

The Velvet demo container joins the Recron Docker network (`aspire`) on deployment. Nginx routes `demo.bluebraces.online` to the `velvet-demo` container. The Nginx config is maintained in the Recron repository at `deploy/nginx/nginx.conf`.
