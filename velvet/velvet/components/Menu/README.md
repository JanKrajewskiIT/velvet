Dropdown menu of actions attached to a trigger. ↑↓ / Home / End move, type to jump, Enter selects, Esc closes and refocuses the trigger. Panel sits on material-4. `iconPosition="end"` puts the label first and the icon trailing (row action menus).

Menu is for actions. Use `Tooltip` for hover text and `Popover` for rich content opened by a click.

```jsx
<Menu trigger={<Button variant="secondary" iconRight="chevron-down">Project</Button>}
      items={[
        { section: 'Project' },
        { label: 'Rename', icon: 'pencil', shortcut: 'F2', onSelect: rename },
        { label: 'Share link', icon: 'link', description: 'Anyone with the link can view', onSelect: share },
        { divider: true },
        { label: 'Remove', icon: 'trash-2', danger: true, onSelect: remove },
      ]} />

<Menu align="end" trigger={<IconButton icon="more-horizontal" label="Row actions" variant="ghost" />} items={rowActions} />
```

**Props.** The full contract is `MenuProps` in `components/index.d.ts`.

**Built from:** Kbd, Button, SectionLabel, Glyph, `primitives/useDismiss.js`. **Also exports:** MenuPanel. **CSS:** `.vui-menu-wrap*`. **Preview:** `components/Menu/preview.html` (group Menus).
