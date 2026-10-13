# Changelog

## 3.4.9

- Add shared source/image security gates, CycloneDX SBOMs, pinned CI tooling, periodic security scans and Knip reports without changing the package version.

- Enforce the shared toolchain/editor/lint gates, validate published NodeNext declarations, and publish verified archives.

- Use shared staged-file and Velvet CSS presets; remove the direct Vite declaration plugin and enforce the size of every published JavaScript module.

## 3.4.7

### Fixed

- Shared `createLibraryMessages` fallback formats templates directly through I18n, including interpolation, plural rules and rich-text handlers when a provider lacks a library dictionary.
- Rich translation fallback no longer performs a second plain-text translation or casts a template to a dictionary key.

### Changed

- Require `@jankrajewskiit/i18n` `^3.4.2` for the public template formatters.

## Earlier refactoring notes

These entries describe the port before the advanced data components moved to VelvetData; `VirtualTable` and query nodes below now belong to that package.

### Breaking

- None.

### Added

- `VirtualTable` accepts `rowKey` and exposes the record key as `data-row-key` on each row.

### Changed

- Large components are split into smaller internal modules; public exports, props, DOM and behavior are unchanged.
- Generated ids of new comments, labels, calendar events and query nodes use one shared format.
- `package.json` no longer lists the `css-modules` keyword, and `verify` runs `format:check` first.

### Fixed

- None.

## 3.3.0

### Breaking

- The peer range of `@jankrajewskiit/i18n` is `^3.3.0` instead of `^2.0.9`.
- The peer range of `solid-js` is bounded to `>=1.9.0 <2`.
- Package tooling requires Node.js 26 or newer.

### Added

- None.

### Changed

- Shared tooling comes from `@jankrajewskiit/configs` 3.3.0.
- `verify:pkg` runs `publint --strict`.
- CI and release run through the shared package workflows.

### Fixed

- None.
