Top app bar. variant="links" (default): brand · text links · actions; tone="brand" paints it brand-coloured. variant="menubar": brand-filled 3-column bar — full logo (+ optional current-page label) · centred ICON menu — sliding glass indicator (the active icon drops into a ring that hangs below the bar) · actions: NotificationCenter, SearchTrigger (→ CommandPalette), NavbarUser, NavbarLocale all restyle for the brand fill. Both collapse to a burger under 720px, or always with condensed. Leave ~14px of space below a menubar navbar for the indicator. NavbarUser `compact` = avatar-only circle → account panel (identity header with email/meta, links, Light/Dark/System switch via `theme`/`onThemeChange`, Sign out via `onSignOut`). On brand bars the notification Count inverts (white pill, brand text).

Use once per page, at the top. Keep to 3–6 links. Put search, notifications and the user avatar in `actions`. In `brand` tone only use IconButton variant "ghost" in actions.

```jsx
<Navbar brand={<BrandLogo size="sm" />} active="home" onNavigate={setPage} items={[{ id: 'home', label: 'Home' }, { id: 'proposals', label: 'Proposals' }]} actions={<Avatar name="Anna K." size="sm" />} />
```
