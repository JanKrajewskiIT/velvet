Icon renders a glyph from Velvet Icons — the system's own outline set (24px grid, 1.75 stroke, round caps). Decorative by default.

```jsx
<Icon name="sparkles" size={20} color="var(--fg-brand)" />
<Icon name="triangle-alert" label="Warning" />
```

- Every `icon` / `iconLeft` / `iconRight` prop across components takes these names.
- Plain HTML (any tech): `<i class="vui-icon icon-arrow-right"></i>` — sized by font-size, coloured by currentColor.
- Raw SVGs for other platforms: `assets/icons/<name>.svg`.
- Stroke: 1.75 default; 1.5 for ≥32px, 2 for ≤14px.
- Filled twins (`home-filled`, `bell-filled`, `user-filled`, `folder-filled`, `briefcase-filled`, `person-filled`, `desktop-filled`, `graduation-cap-filled`, `bookmark-filled`, `heart-filled`, `message-square-filled`, `star-filled`) mark the **selected** state (and solid section headers, e.g. CV templates). `filledIcon('home', isActive)` picks the right one; BottomNav, Navbar rail and ToggleButton already do this.
