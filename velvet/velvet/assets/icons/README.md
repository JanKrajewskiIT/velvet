# Velvet Icons — SVG sources

One SVG per glyph of the Velvet icon set: 140 outline icons and 16 `-filled` variants (156 files). Each file uses the set's construction: 24 × 24 grid, 1.75 stroke, round caps and joins, `currentColor` for stroke (and for fill on `-filled` variants).

- The same paths render as CSS masks (`.vui-icon.icon-<name>`) and through `<Icon name="…" />`; these files are for native apps and other platforms.
- Loaded through `<img>`, an SVG cannot read `currentColor`, so it draws black: inline the SVG, or recolour the file, when the colour has to follow the theme.
- Filled variants are for selected states only (see the Iconography section of the main README).
- Adding an icon: add the SVG here, its path to `VelvetIcons` in `components/bundle.js`, and a mask rule to the icon block in `components/bundle.css`.
- Aliases are not duplicated as files. These names resolve to a canonical icon (`IconAliases`, and the same `.icon-<alias>` mask in `components/bundle.css`), so use the canonical file: `close` → `x`, `trash` → `trash-2`, `edit` → `pencil`, `alert-triangle` and `warning` → `triangle-alert`, `check-circle` and `success` → `circle-check`, `x-circle` and `error` → `circle-x`, `help-circle` and `help` → `circle-help`, `grid` → `layout-grid`, `attach` → `paperclip`, `badge` → `id-card`, `chat` and `message` → `message-square`, `logout` → `log-out`, `expand` → `maximize`.
