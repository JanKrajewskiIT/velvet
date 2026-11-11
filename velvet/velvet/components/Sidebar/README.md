App navigation spine. variant="floating" (default): raised card with border, radius and shadow; "docked": full-height panel with a right border. Header = brand + ⇇ collapse toggle (separated by a divider). Expanded (--sidebar-width) ⇄ 64px icon rail on the same element: labels/counts/caret hide, section labels become short dividers, counts become a dot, hover shows a tooltip. Single active item = soft brand fill. NavItem with subItems = animated accordion.

Sidebar holds primary app navigation; fill it with NavItem and NavSection.

```jsx
<Sidebar brand={<Wordmark />} footer={<UserRow />}>
  <NavItem icon="layout-dashboard" label="Overview" active />
  <NavItem icon="folder" label="Projects" end={<Badge size="sm">24</Badge>} />
  <NavSection>Workspace</NavSection>
  <NavItem icon="users" label="Members" />
</Sidebar>
```
