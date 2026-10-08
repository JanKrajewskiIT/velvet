Sidebar holds primary app navigation; fill it with NavItem and NavSection.

```jsx
<Sidebar brand={<Wordmark />} footer={<UserRow />}>
  <NavItem icon="layout-dashboard" label="Overview" active />
  <NavItem icon="folder" label="Projects" end={<Badge size="sm">24</Badge>} />
  <NavSection>Workspace</NavSection>
  <NavItem icon="users" label="Members" />
</Sidebar>
```
