Masthead of a view, top to bottom: breadcrumb · back button + title + status · description · meta row (owner, due date, members…) · actions on the right · optional section tabs on the bottom edge. Every region is optional — the minimum is just a title. Always sits on its own raised card surface. Wraps on small screens.

PageHeader opens every app page. Minimum is a title; add regions only when the page has them.

```jsx
<PageHeader
  breadcrumb={[{ label: 'Projects', href: '#' }, { label: 'Q3 migration' }]}
  onBack={() => history.back()}
  title="Q3 migration"
  status={{ label: 'Active', tone: 'success' }}
  meta={[{ icon: 'user', label: 'Anna Kowalska' }, { icon: 'calendar', label: 'Due 30 Jun' }]}
  actions={<><Button variant="secondary" iconLeft="settings">Settings</Button><Button iconLeft="plus">New task</Button></>}
  tabs={[{ value: 'overview', label: 'Overview' }, { value: 'tasks', label: 'Tasks', count: 24 }]}
/>
```

- One primary action at most; extra actions go secondary or into a `DropdownButton`.
- `breadcrumb` replaces `eyebrow` — never both.
- `meta` is 2–4 short facts; anything longer belongs in the page body.
