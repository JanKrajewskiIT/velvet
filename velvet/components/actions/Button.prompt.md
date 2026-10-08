Button triggers an action; use `primary` for the single main action in a view, `secondary`/`ghost` for everything else.

```jsx
<Button iconLeft="plus">New project</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="danger" loading>Deleting…</Button>
```

- Variants: primary · secondary · soft (tinted velvet) · ghost · danger · link
- Sizes: sm 32 · md 40 · lg 48 (auto +4px on coarse pointers)
- `iconLeft`/`iconRight` accept Velvet icon names; `block` for full-width (mobile forms)
- Plain HTML: `<button class="vui-btn vui-btn--primary">`
