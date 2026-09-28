# Foundation And Package

Status: Approved/Frozen. Requirement provenance is stated per section. Public implementation technology is constrained by the user's decision; internal architecture is not.

Names and structures shown in source requirements are traceability evidence, not replacement API requirements. Preserve explicitly fixed persistence keys, locale/date representations, CSS token names, dependency baseline and brand colors; redesign other public shapes as needed to provide the specified behavior.

## Package Contract

- `SOURCE-PKG-001`: Source baseline is package `@jankrajewskiit/ui` version `3.1.3`, ESM, Node `>=26`, package manager `npm@12.1.0`. Preserve package identity and root/style entrypoints; version advances for the rebuild release. If published, expose documented JS/types and a separately consumable theme stylesheet.
- `SOURCE-PKG-002`: Preserve SolidJS as a peer dependency `>=1.9`; optional peers and ranges are `@solidjs/router >=0.15`, `oidc-client-ts >=3.1.0`, `solid-icons >=1.2.0`, and `solid-markdown >=2.1.0`. Runtime dependencies are `@jankrajewskiit/auth ^2.0.7`, `@jankrajewskiit/i18n 2.0.9`, and `remark-gfm ^4.0.1`. Preserve optional peer metadata.
- `SOURCE-PKG-003`: Package scripts define `build` (`tsc -b && vite build`), `typecheck` (`tsc -b`), `lint`, `lint:css`, `format:check`, `verify` (typecheck, lint, CSS lint, build, package verification), `verify:pkg` (`publint` and `attw` ESM-only with existing internal-resolution exception), and `prepublishOnly` (`npm run verify`). Size limits are 100 kB for `dist/index.js` and 50 kB for `dist/velvet-ui.css`. Preserve equivalent publication gates and budgets; exact tooling may change only if acceptance remains equivalent.
- `SOURCE-PKG-006`: Vite uses shared `createSolidLibViteConfig`; output CSS basename is `velvet-ui`, declarations use `tsconfig.app.json`. External packages are SolidJS, Solid Router, Solid Icons/Markdown, OIDC client, GFM, shared auth and i18n. App tsconfig uses shared app config, `rootDir:src`, alias `~/* -> src/*`; node tsconfig uses shared Vite config. ESLint extends shared config and adds checks for literal i18n keys and required label/message props. Preserve equivalent Solid library build, declaration generation, peer externalization and semantic lint gates when internals are redesigned.
- `SOURCE-PKG-007`: `.npmrc` routes `@jankrajewskiit` to GitHub Packages and reads `NODE_AUTH_TOKEN` from the environment. Never embed token values in source/spec.
- `SOURCE-CI-001`: Reusable `.github/workflows/verify.yml` runs on Ubuntu with Node 26 and npm 12.1.0, installs via `npm ci`, runs `npm audit --audit-level=moderate`, then `npm run verify`. It requests repository/package read permissions and accepts optional `GHCR_TOKEN` for package auth.
- `SOURCE-CI-002`: `.github/workflows/publish.yml` runs on `v*` tags; publish depends on the reusable verify workflow passing, uses Node 26/npm 12.1.0, installs locked dependencies with package token, then runs `npm publish` using GitHub token/package-write permission.
- `SOURCE-CI-003`: Repository has no test/spec source files and no test script in package.json. Current CI gates typecheck, lint, CSS lint, package build/validation and moderate dependency audit; behavioral tests are not in the pipeline. This records the source baseline and does not require adding tests to the replacement.
- `USER-PKG-003`: Preserve the dependency and peer ranges from package version 3.1.3. Any dependency addition/update, including the HTML sanitizer, requires separate approval.
- `USER-PKG-004`: The user-approved sanitizer exception is `isomorphic-dompurify`; the replacement manifest must pin a concrete version and include its SSR-compatible runtime requirements. No other dependency additions are implied by this decision.
- `SOURCE-PKG-004`: `src/index.ts` at baseline 3.1.3 is the source inventory for functionality; [export-catalog.md](export-catalog.md) maps every legacy export to a capability. Under `USER-DEC-009`, replacement export names and API signatures may differ.
- `SOURCE-PKG-005`: Source consumers import global library CSS separately from JS through `./styles`. Preserve a separately consumable stylesheet at that subpath. The old `styles.d.ts` is empty and declares no token types. Private module selectors are not contracts.
- `USER-APP-008`: Preserve the exact light/dark primary brand colors and related primary hover/subtle/focus/brand-gradient colors in [theme-tokens.md](theme-tokens.md). Other theme token values may improve.

## Provider And Mounting

- `SOURCE-APP-001`: `VelvetProvider` composes theme, i18n, toast viewport/lifecycle, and an error boundary. When `config.authConfig` exists, auth context wraps application content; otherwise auth provider is absent. A supplied `errorFallback` replaces the default localized retry fallback.
- `SOURCE-APP-002`: `mountVelvetApp` takes `{ root: string | HTMLElement, app: () => JSX.Element, config, errorFallback? }`. When OIDC config is present it first handles an auth redirect callback; if navigation was handled, it does not mount. Otherwise it resolves the element by ID or uses the element. Missing root throws `Error("Root element not found")`. Mounting renders the app under `VelvetProvider`.
- `SOURCE-APP-003`: `VelvetConfigInput` contains optional `authConfig`, `initialLocale`, and composed `dictionaries`.
- `SOURCE-APP-004`: Public storage keys are `velvet-theme` and `velvet-locale`, exported as `VELVET_THEME_STORAGE_KEY` and `VELVET_LOCALE_STORAGE_KEY`.
- `SOURCE-APP-005`: `ThemeProvider` supports `light | dark | system`; initial preference comes from storage, invalid/missing values resolve to `system`, system preference changes update `resolved`, and resolved theme is applied to `document.documentElement[data-theme]`. Preference is persisted. `toggleTheme` changes from current resolved light/dark to the opposite explicit choice. On server, initial resolved theme is light and browser APIs are not read.
- `SOURCE-APP-006`: `useTheme` outside its provider throws. `VelvetProvider` default error fallback displays a localized error description and retry action; if error is not an `Error` with a message, uses localized generic description.
- `SOURCE-APP-007`: Theme CSS defines tokens under `:root` and overrides a subset under `[data-theme='dark']`. Global CSS resets box sizing/margins/padding, sets body/root to `100vh` with hidden overflow, enables a `transitionsReady` color/background transition, and defines shared typography utility classes/keyframes. Component selectors and keyframe names are private; stylesheet subpath and semantic token names are styling contracts listed in [theme-tokens.md](theme-tokens.md). Global reduced-motion rule scales animations/transitions to near-zero duration and one iteration; some component styles also define reduced-motion media rules.
- `USER-APP-009`: Support current stable Chrome, Edge, Firefox and Safari. Components must be SSR-safe and hydrate without reading browser globals during server rendering.

## Authentication

- `SOURCE-AUTH-001`: Source auth context and OIDC integration are provided by `@jankrajewskiit/auth ^2.0.7`. Preserve authentication state, sign-in/out, role checking and redirect outcomes; replacement helper/hook/type names and signatures may differ.
- `SOURCE-AUTH-002`: The source guard accepts optional one/many roles and an unauthorized outcome (`access-denied` default or `redirect`). While auth loads, show a page loader. Unauthenticated users receive a localized access-denied/login affordance or are redirected to sign-in using the current return URL. Authenticated users without any requested role receive forbidden state; no role requirement permits any authenticated user. The replacement may expose this policy through a different API.
- `SOURCE-AUTH-003`: `AuthActionButton` invokes consumer `onClick` first, then sign-in/sign-out according to auth state. Sign-in uses explicit `returnUrl` or current return URL; while sign-in is pending the control is disabled and busy, repeated auth actions are ignored. Sign-out is initiated without waiting for its result.
- `SOURCE-AUTH-004`: UI visibility is not authorization. The server/application owning protected data must continue to enforce authorization independently.

## Localization

- `SOURCE-I18N-001`: Source exports provider/helper/type names through `@jankrajewskiit/i18n` 2.0.9. Replacement may redesign helper/key names; it must preserve locale selection, custom dictionary capability and fallback semantics.
- `SOURCE-I18N-002`: Component strings are localized; English and Polish cover all source messages catalogued in [i18n-keys.md](i18n-keys.md). Preserve message meaning and interpolation data; replacement translation-key spelling may differ under `USER-DEC-009`.
- `SOURCE-I18N-003`: The source provider accepts an initial locale, storage key, and dictionaries through the shared i18n package. Keep locale persistence and dictionary composition owned by pinned `@jankrajewskiit/i18n` 2.0.9; its public consumer behavior is exercised by `ACC-I18N-001`. Replacement configuration names and shapes may differ.
- `SOURCE-I18N-004`: Locale-switcher capability cycles through caller-supplied locales or supported locales in order. Empty list leaves locale unchanged; otherwise moves to next locale with wraparound. Source prop/export names are not target requirements.

## Shared Utilities And Types

- `SOURCE-UTIL-001`: `classNames(...classes)` joins truthy string arguments with one space; false/null/undefined are omitted. `getContrastTextColor(hex)` parses the first six hex digits after removing `#`, computes weighted RGB luminance, returns `#1a1a1a` above 0.6 and `#ffffff` otherwise. Preserve valid-color outcomes; malformed-input behavior follows `AGENT-DEC-031`.
- `SOURCE-UTIL-002`: Form helpers: `orEmpty<T extends string>(value:T|null|undefined)` returns value or empty string; `numberToString(number|null|undefined)` returns `toString()` or empty string; `emptyToNull(value:T|'')` maps falsy empty string to null; `parseFloatOrNull(string)` returns null for empty/NaN and otherwise uses JavaScript `parseFloat` semantics.
- `SOURCE-UTIL-003`: `getInputSizeClass(styles,size?)` returns `styles.sizeSm ?? ''` for sm, `sizeLg ?? ''` for lg, and `sizeMd ?? ''` for md/undefined.
- `SOURCE-UTIL-004`: `filterRows` trims and lowercases query; empty query returns a copy of rows. A custom global filter replaces per-column filtering. Otherwise columns allowed by `shouldUseColumn` search a custom filter function or lowercased substring of accessor/property string; Date values use ISO text; nullish values become empty text. `sortRows` returns a copy; absent/unknown sort key keeps original order. Custom comparator receives `(a,b,direction)`; otherwise accessor/property comparison orders nullish values last ascending and reverses value comparison for descending.
- `SOURCE-UTIL-005`: Source `Props<T>` adds optional id/class/style, aria-string attrs, and data string/number/boolean attrs. Its exact type name and shape are source evidence; replacement types may be cleaner as long as supported accessibility/data attributes and functionality remain.
- `SOURCE-UTIL-006`: Source component native prop subsets show which native behaviors are supported. Replacement components need not reproduce these type aliases, but must preserve native form semantics, keyboard operation, focus, accessible naming and relevant data attributes.

## Public Hook Behavior

Source hook names/signatures below are traceability aids; replacement hooks/helpers may use different names and signatures.

- `SOURCE-HOOK-001`: `useClickOutside(rootRef,isActive,onClickOutside,floatingRef?)` accepts accessors for root/active state, callback and optional one or many floating-element accessors. While active it listens to document `pointerdown`; events inside root or any floating element are ignored. Listener is removed on deactivate/disposal. Server render is a no-op.
- `SOURCE-HOOK-002`: `useEscapeKey(isActive,onEscape)` listens to document `keydown` only while active and invokes callback on Escape; it does not prevent default/stop propagation. Listener is removed on deactivate/disposal. Nested-layer ownership improvements are covered by overlay quality requirements.
- `SOURCE-HOOK-003`: The source focus-trap behavior stores the prior active element on activation, focuses the first visible focusable, and cycles Tab/Shift+Tab among visible buttons, anchors, inputs, selects, textareas and nonnegative-tabindex descendants, excluding aria-hidden. On deactivation it focuses an explicit restore target or the prior connected element. Rebuild must strengthen focus containment/edge cases and account for dynamic focusables; the replacement API may differ.
- `SOURCE-HOOK-004`: `UseFloatingOptions` requires reference accessor and open accessor; optional placement and middleware may each be static or accessor, optional animationFrame boolean/accessor. `UseFloatingReturn` exposes setFloating, floating/x/y/placement/middlewareData accessors, floatingStyle and update. Placement defaults bottom-start; closed/no reference/no floating means update is a no-op. When open and both nodes exist, it computes then subscribes to scroll/resize/element-resize updates; optional frame checks support transformed references.

## Acceptance

- The replacement exposes a documented package entry point and theme/style integration; its exact path/name need not match the source package.
- Provider composition, optional authentication, callback short-circuit, root failure, theme persistence/system updates, locale persistence, error recovery, and exported utility outputs match requirements above.
- No browser global is accessed during server rendering/initial render where the source contract explicitly supports SSR.
- `coverage.md` maps all foundation source exports and consumed messages to behavior before this spec can be approved.
- Replacement package build/CI/release documentation must identify its own runtime, dependency, registry, permissions and publication mechanism; preserve source security boundaries and verification outcomes if it is to be published.