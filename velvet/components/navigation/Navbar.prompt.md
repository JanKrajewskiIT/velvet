Use once per page, at the top. Keep to 3–6 links. Put search, notifications and the user avatar in `actions`. In `brand` tone only use IconButton variant "ghost" in actions.

```jsx
<Navbar brand={<BrandLogo size="sm" />} active="home" onNavigate={setPage} items={[{ id: 'home', label: 'Home' }, { id: 'offers', label: 'Offers' }]} actions={<Avatar name="Anna K." size="sm" />} />
```
