⌘K palette: fuzzy-filtered, grouped results with match highlight; ↑↓ Enter Esc. Pair with SearchTrigger (it owns the ⌘K hotkey). Focus stays inside the palette while open and returns to the trigger on close; the page behind does not scroll.

CommandPalette is the ⌘K search over commands and destinations. Items are grouped, and `keywords` add search terms that are not in the label.

```jsx
<CommandPalette open={open} onClose={() => setOpen(false)}
  groups={[
    { label: 'Go to', items: [
      { label: 'Dashboard', icon: 'home', shortcut: 'G D', onSelect: goDashboard },
      { label: 'Settings', icon: 'settings', keywords: ['preferences'], onSelect: goSettings },
    ] },
  ]} />
```

**Props.** The full contract is `CommandPaletteProps` in `components/index.d.ts`.

**Built from:** EmptyText, Kbd, SectionLabel, Mark, Glyph, `primitives/useDismiss.js`. **CSS:** `.vui-dialog-backdrop*`. **Preview:** `components/CommandPalette/preview.html` (group Menus).
