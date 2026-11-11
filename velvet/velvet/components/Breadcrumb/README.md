Location trail. Last item is the current page (not a link). Beyond maxItems the middle collapses into a "…" menu.

The last item is the current page and has no `href`. With `maxItems` the middle collapses into a menu.

```jsx
<Breadcrumb items={[
  { label: 'Workspace', icon: 'home', href: '/' },
  { label: 'Projects', href: '/projects' },
  { label: 'Atlas redesign' },
]} />
```

**Props.** The full contract is `BreadcrumbProps` in `components/index.d.ts`.

- `items` (required): `BreadcrumbItem[]`
- `maxItems`: `number`, default `4`

**Built from:** Glyph, Menu. **CSS:** `.vui-crumbs*`. **Preview:** `components/Breadcrumb/preview.html` (group Wayfinding).
