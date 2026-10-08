Dialog interrupts the flow for a focused decision or short form; keep it to one task.

```jsx
<Dialog open={open} onClose={() => setOpen(false)} title="Delete project?" description="This can’t be undone."
  footer={<><Button variant="secondary" onClick={close}>Cancel</Button><Button variant="danger">Delete</Button></>} />
```

- Becomes a bottom sheet on small screens; footer buttons stack full-width.
