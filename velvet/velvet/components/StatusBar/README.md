App status strip at the bottom of the window: connection, current context, operating state, market sessions, versions and the clock. It takes the always-visible state out of the top of the page, so banners there can be kept for states that are not normal.

**Use it** in data-heavy apps (trading, consoles, admin) where the viewer needs to see at a glance whether what they read is live and where an action would land. Put at most 6–8 items in it; anything a viewer must act on belongs in a `Banner` or `Alert`, not here.

**Built from** `Dot` and `Glyph` inside `StatusBarItem`; type is the caption size, figures are tabular.

**Props.** The full contract is `StatusBarProps` and `StatusBarItemProps` in `components/index.d.ts`.

- `start` / `end`: the two groups; `end` is pushed to the right.
- `fixed`: pins it to the bottom of the viewport. Give the page about 32px of bottom padding.
- `StatusBarItem` `tone` draws a status dot (`pulse` for live), `icon` replaces it, `mono` for IDs and clocks, `strong` for the value that matters; `hide="md"` / `"sm"` drops less important items below 1024px / 640px.
- Never colour alone: every toned item also says its state in words.

**Preview:** `components/StatusBar/preview.html`.
