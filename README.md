# VelvetUi

SolidJS component library published as `@jankrajewskiit/ui`.

## Install

```bash
npm install @jankrajewskiit/ui @jankrajewskiit/i18n solid-js
```

`.npmrc` for GitHub Packages authentication:

```ini
@jankrajewskiit:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GHCR_TOKEN}
```

`solid-js` and `@jankrajewskiit/i18n` are peer dependencies: the library and the application must share one instance of each.

## Quick start

```tsx
import '@jankrajewskiit/ui/styles';
import { Button, mountVelvetApp } from '@jankrajewskiit/ui';

mountVelvetApp({
  root: 'root',
  app: () => <Button variant="primary">Save</Button>,
});
```

`mountVelvetApp` renders the app inside `VelvetProvider`, which syncs the theme with the OS and storage, provides the locale and translations, a toast queue and an error boundary with a retry screen.

## Translations

Library texts ship in English and Polish as `velvetMessages`. `VelvetProvider` composes them with the application's own dictionaries:

```tsx
import { defineDictionary } from '@jankrajewskiit/i18n';

const appEn = defineDictionary({ app: { title: 'Dashboard' } });
const appPl = defineDictionary({ app: { title: 'Pulpit' } });

mountVelvetApp({ root: 'root', app: App, messages: { en: [appEn], pl: [appPl] } });
```

Without a provider, components fall back to the bundled English text. Words shared by many components (Cancel, Save, Close, …) live under `velvet.common`. Components also accept explicit label props that override the dictionary.

## Authorization

`AuthGuard` renders its children only for signed-in, authorized users. It takes the session state as props, so any auth library fits:

```tsx
<AuthGuard
  loading={auth.loading()}
  authenticated={auth.signedIn()}
  authorized={auth.hasRole('admin')}
  onSignIn={auth.signIn}
>
  <AdminPanel />
</AuthGuard>
```

## Scripts

| Script                              | Purpose                                   |
| ----------------------------------- | ----------------------------------------- |
| `npm run typecheck`                 | `tsc -b` for the library and the showcase |
| `npm run lint` / `npm run lint:css` | ESLint and Stylelint                      |
| `npm run build`                     | Library build to `dist/`                  |
| `npm run showcase`                  | Component showcase dev server             |
| `npm run verify`                    | Everything required before publishing     |

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
