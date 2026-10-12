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

Version 3.4.5 adds `@jankrajewskiit/ui/common`, a public entry point for building components on the same primitives as Velvet UI. It does not import the UI stylesheet, visual components or bootstrap provider.

```ts
import { createControllable, createFrameFocus, cx, rowId } from '@jankrajewskiit/ui/common';
```

The API includes class composition (`cx`, `ClassValue`), controlled/uncontrolled state (`createControllable`, `ControllableOptions`), scheduled focus (`createFrameFocus`, `FrameFocus`), client-generated ids (`createId`), numeric clamping (`clamp`), column names/widths (`columnName`, `columnWidthBounds`, `constrainColumnWidth`, `ColumnWidthBounds`, `DEFAULT_COLUMN_MIN_WIDTH`) and record values/sorting (`rowValue`, `rowId`, `cellText`, `compareValues`, `nextSort`, `RowKey`, `RowSort`). Implementations stay in their owning UI modules and are shared by the UI components and VelvetData. UI-only helpers remain private.

Create `createFrameFocus` under a Solid owner; disposal cancels its pending animation frame. The returned function accepts an optional descendant selector. `createId` generates client-side record ids; use consumer-owned stable keys for persisted records and Solid's own id primitive for hydration-sensitive DOM relationships.

`createLibraryMessages(dictionary)` provides `staticTranslate`, `useTranslate` and `useTranslateRich` from one flattened fallback dictionary. The hook functions read the existing i18n provider during component setup, preserve its locale/overrides and use the supplied dictionary for missing messages. `staticTranslate` is available outside an owner for labels in exported constants without interpolation. `LibraryMessages` and `StaticTranslate` describe this contract. The factory contains no package-specific vocabulary: UI supplies `velvetEn`, while Data supplies its English dictionary composed with UI defaults. `RowKey` and `RowSort` remain available through the existing UI root export for compatibility.

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

Releases are published with npm provenance. Verify an installed version with:

```sh
npm audit signatures @jankrajewskiit/ui
```

A passing audit attests that the registry signature and the sigstore provenance attestation match the tarball, which ties it to the source commit and the publish workflow run.

## Release workflow

1. Confirm the default branch is green and `CHANGELOG.md` has a section for the new version.
2. `npm version patch|minor|major` and commit the changelog edit with the bump.
3. `git push --follow-tags`.

The `v<semver>` tag starts `publish.yml`: verify, version check, then `npm publish --provenance --access public`. A failed provenance step fails the run; re-run it against the same tag once sigstore is reachable.

Recover from a broken release by publishing a superseding patch and running `npm deprecate @jankrajewskiit/ui@<broken-version> "<reason>"`. Never unpublish a version consumers may have installed.

## Branch protection

Protect the default branch with:

- a required, passing `verify` status check that includes the `npm audit` step;
- at least one approving CODEOWNERS review;
- a branch that is up to date before merging;
- force pushes and non-administrative direct pushes disabled.
