# VelvetUi

SolidJS component library published as `@jankrajewskiit/ui`.

Advanced data components (`DataGrid`, `ColumnManager`, `QueryBuilder`, `VirtualTable`, `VirtualList`) and their saved-view/query helpers now live in the sibling VelvetData package, `@jankrajewskiit/data`. Import them and their styles from that package and compose `velvetDataMessages` into the existing provider. Simple `Table` and `TableAddRowAction` remain here. See [migration notes](../VelvetData/docs/migration.md) for import changes and consumer coordination before release.

The live showcase is maintained separately in the sibling `VelvetDemo` project. This repository contains the library and its read-only Velvet reference. The [porting record](docs/design-system-port.md) describes parity, implementation decisions and remaining verification.

## Install

```bash
npm install @jankrajewskiit/ui @jankrajewskiit/auth @jankrajewskiit/i18n oidc-client-ts solid-js
```

`.npmrc` for GitHub Packages authentication:

```ini
@jankrajewskiit:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GHCR_TOKEN}
```

VelvetUi targets applications sharing the Velvet infrastructure, including `@jankrajewskiit/auth` for OIDC. The library and application must share one instance of `solid-js`, `@jankrajewskiit/i18n` and `@jankrajewskiit/auth`; separate auth instances would create separate session contexts. `oidc-client-ts` is the authentication package's peer dependency.

## Quick start

```tsx
import '@jankrajewskiit/ui/styles';
import { Button, mountVelvetApp } from '@jankrajewskiit/ui';

await mountVelvetApp({
  root: 'root',
  app: () => <Button variant="primary">Save</Button>,
});
```

`mountVelvetApp` renders the app inside `VelvetProvider`, which syncs the theme with the OS and storage, provides the locale and translations, a toast queue and an error boundary with a retry screen. With `authConfig`, it processes the OIDC callback before rendering and enables the shared auth session. The asynchronous bootstrap returns a disposer, or `undefined` when a callback starts navigation; bootstrap failures reject its Promise and must be handled by the application entry point.

## Shared component primitives

Published version 3.4.6 provides `@jankrajewskiit/ui/common`, a public entry point for building components on the same primitives as Velvet UI. It does not import the UI stylesheet, visual components or bootstrap provider.

```ts
import { createControllable, createFrameFocus, cx, rowId } from '@jankrajewskiit/ui/common';
```

The API includes class composition (`cx`, `ClassValue`), controlled/uncontrolled state (`createControllable`, `ControllableOptions`), scheduled focus (`createFrameFocus`, `FrameFocus`), client-generated ids (`createId`), numeric clamping (`clamp`), column names/widths (`columnName`, `columnWidthBounds`, `constrainColumnWidth`, `ColumnWidthBounds`, `DEFAULT_COLUMN_MIN_WIDTH`) and record values/sorting (`rowValue`, `rowId`, `cellText`, `compareValues`, `nextSort`, `RowKey`, `RowSort`). Implementations stay in their owning UI modules and are shared by the UI components and VelvetData. UI-only helpers remain private.

Create `createFrameFocus` under a Solid owner; disposal cancels its pending animation frame. The returned function accepts an optional descendant selector. `createId` generates client-side record ids; use consumer-owned stable keys for persisted records and Solid's own id primitive for hydration-sensitive DOM relationships.

`createLibraryMessages(dictionary)` provides `staticTranslate`, `useTranslate` and `useTranslateRich` from one flattened fallback dictionary. The hook functions read the existing i18n provider during component setup and preserve its locale/overrides. UI formats missing messages through the public template formatters available since I18n 3.4.2, passing the active locale, interpolation/plural parameters and rich-text handlers directly. It does not look up fallback text as another dictionary key. Outside a provider the fallback uses English. A key absent from both the provider and supplied defaults remains the key itself.

`staticTranslate` is available outside an owner for labels in exported constants without interpolation. `LibraryMessages` and `StaticTranslate` describe this contract. The factory contains no package-specific vocabulary: UI supplies `velvetEn`, while Data supplies its English dictionary composed with UI defaults. `RowKey` and `RowSort` remain available through the existing UI root export for compatibility. This API requires I18n `^3.4.2`; see the [release order](../VelvetData/docs/migration.md#release-order) before refreshing dependencies.

## Translations

Library texts ship in English and Polish as `velvetMessages`. `VelvetProvider` composes them with the application's own dictionaries:

```tsx
import { defineDictionary } from '@jankrajewskiit/i18n';

const appEn = defineDictionary({ app: { title: 'Dashboard' } });
const appPl = defineDictionary({ app: { title: 'Pulpit' } });

await mountVelvetApp({ root: 'root', app: App, messages: { en: [appEn], pl: [appPl] } });
```

Without a provider, components fall back to the bundled English text. Words shared by many components (Cancel, Save, Close, …) live under `velvet.common`. Components also accept explicit label props that override the dictionary.

## Authorization

The authentication module lives in `src/auth`: `AuthButton`, `AuthActionButton`, `AuthGuard` and their shared operation lifecycle. `src/auth/index.ts` owns their exports, which remain available from `@jankrajewskiit/ui`. Authentication is a separate infrastructure boundary even though its button appears in the showcase's actions section. Reference styles and existing translation keys retain their original groups. `VelvetProvider` and `mountVelvetApp` stay in `src/provider` as application bootstrap owners.

Pass the application's OIDC configuration to the bootstrap:

```tsx
await mountVelvetApp({ root: 'root', app: App, authConfig });
```

For an existing application root, `<VelvetProvider authConfig={authConfig}>` also owns the session; Velvet Auth handles callbacks on mount in that composition. Treat `authConfig` as stable configuration: replacing its object remounts the session and application subtree.

`AuthButton` reads the session and signs in or out automatically. `AuthActionButton` provides the same behavior with compact icon-only, ghost defaults. Both accept `returnUrl`; otherwise sign-in preserves the current path, query and hash. Their native click handler runs first and can cancel the action with `preventDefault()`. Initial session loading and pending operations disable the button. Failures are announced with localized text and reflected in the title; `onError` can integrate additional application feedback without exposing raw dependency errors in the UI.

`AuthGuard` reads the same session and requires any one of the supplied roles. No roles means any signed-in user. Its default behavior shows a sign-in prompt; `unauthorizedBehavior="redirect"` starts sign-in automatically. A failed session initialization or sign-in shows a retry screen instead of repeatedly redirecting. An authenticated user without the required role sees the forbidden screen.

```tsx
<AuthButton />
<AuthGuard roles="admin" unauthorizedBehavior="redirect">
  <AdminPanel />
</AuthGuard>
```

`useAuth`, `AuthProvider`, `AuthContextValue` and `OidcAuthConfig` are re-exported for application composition. Auth components require an auth provider. Server APIs must still enforce permissions and resource ownership.

Migration from the temporary prop-driven API: remove `signedIn`, `onSignIn` and `onSignOut` from `AuthButton`; remove `loading`, `authenticated`, `authorized` and `onSignIn` from `AuthGuard`, replacing authorization predicates with `roles` and `unauthenticated` with `unauthorizedBehavior`. Provide `authConfig` and await `mountVelvetApp` when consuming its result. Other components can still run without an auth configuration.

## Scripts

| Script                              | Purpose                               |
| ----------------------------------- | ------------------------------------- |
| `npm run typecheck`                 | `tsc -b` for the library              |
| `npm run lint` / `npm run lint:css` | ESLint and Stylelint                  |
| `npm run build`                     | Library build to `dist/`              |
| `npm run verify`                    | Everything required before publishing |

## Upgrading

Changes for every published version are recorded in [CHANGELOG.md](CHANGELOG.md).

## Provenance verification

The release workflow signs the verified archive and its dependency SBOM with Cosign. Download the `package-signatures` artifact and verify the bundle against the expected release workflow identity. npm registry signatures are a separate mechanism; where supported, inspect the dependency tree with:

```sh
npm audit signatures
```

Registry signature and provenance support must be confirmed during publication; the workflow configuration does not itself establish those guarantees.

## Release workflow

1. Confirm the default branch is green and `CHANGELOG.md` has a section for the new version.
2. `npm version patch|minor|major` and commit the changelog edit with the bump.
3. `git push --follow-tags`.

The `v<semver>` tag verifies and packs once, checks the archive against the release version, then publishes the verified archive. Provenance is requested by default; failures do not automatically fall back to an unsigned publication.

Recover from a broken release by publishing a superseding patch and running `npm deprecate @jankrajewskiit/ui@<broken-version> "<reason>"`. Never unpublish a version consumers may have installed.

## Branch protection

Protect the default branch with:

- a required, passing `verify` status check that includes the `npm audit` step;
- at least one approving CODEOWNERS review;
- a branch that is up to date before merging;
- force pushes and non-administrative direct pushes disabled.

## Tooling gates

Configs 3.5 owns Vite plugins, staged-file chunking and the Velvet Stylelint naming preset. The consumer keeps its runtimes and stylesheet exclusions. The root ESLint override selects ESLint 10 for accessibility-plugin peers; the preset also adapts legacy rule APIs. `verify` runs formatting, ESLint, Stylelint, the build, package validation and size limits. The JavaScript budget covers all published `dist/**/*.mjs` modules compressed individually with Brotli (450 kB); it measures package output, not a tree-shaken application bundle or external peer dependencies.

The full-module baseline is 436.07 kB Brotli and the stylesheet baseline is 253.36 kB, including embedded font assets. The budgets are 450 kB for JavaScript and 275 kB for CSS; the old entry-only 100 kB and CSS 50 kB limits did not describe the current published package.

## Shared configuration

Use Node 26 and the exact npm version from `packageManager`. Open `frontend.code-workspace` for TypeScript 7 and the shared formatter/linter setup. `verify` checks editor drift and enforces zero lint warnings. `audit:deps` is a separate networked dependency audit used by CI.

Published declarations are checked with `NodeNext` and `skipLibCheck: false`; package checks no longer ignore internal resolution errors. Vite libraries publish `.mjs` and `.d.mts`, while Reactive retains its valid TypeScript `NodeNext` `.js`/`.d.ts` output. Public package import paths stay the same.

See the [Configs release migration](https://github.com/JanKrajewskiIT/velvetconfigs/blob/v3.5.0/README.md#release-migration) for publication order, artifact-based workflows, the audit exception deadline and registry secrets. Refresh lockfiles and run `npm run verify` against the refreshed installation before publication.

## Security pipeline

Source verification includes Gitleaks, Semgrep, actionlint, zizmor and Trivy configuration scanning. npm audit blocks high/critical advisories under the shared expiring-exception policy. Verification produces a CycloneDX dependency SBOM. Weekly/manual security workflows re-check dependency databases and source history without building the application.

Semgrep excludes the read-only design-system reference in `velvet/` through `.semgrepignore`; the library source remains in scope. Rich-text initialization, paste and history restoration insert allow-listed DOM fragments instead of assigning HTML strings to live elements. HTML parsing stays in an inert template inside the sanitizer, with a local exception for the two generic `innerHTML` rules. Server-side sanitization is still required for stored or rendered editor output.

Knip is available through `npm run deps:check` (JSON report) and `npm run deps:strict` (blocking unused-code check). CI records the report while the initial findings are reviewed; security scans remain blocking. Public library entry exports are preserved.

Configure `CONFIGS_READ_TOKEN` for private Configs source access alongside the existing npm read token. See [shared security controls](https://github.com/JanKrajewskiIT/velvetconfigs/blob/v3.5.0/security/README.md) for required GitHub settings, reports, image signing, staging variables, WAF activation and manual acceptance checks.
