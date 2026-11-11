Modal dialog or side drawer. Traps focus, restores it on close, locks page scroll while open, Esc + backdrop click dismiss. Becomes a bottom sheet under 640px (center placement).

Dialog interrupts the flow for a focused decision or short form; keep it to one task.

```jsx
<Dialog open={open} onClose={() => setOpen(false)} title="Delete project?" description="This can’t be undone."
  footer={<><Button variant="secondary" onClick={close}>Cancel</Button><Button variant="danger">Delete</Button></>} />
```

- Becomes a bottom sheet on small screens; footer buttons stack full-width.
