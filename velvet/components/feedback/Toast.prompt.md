Toast confirms an action without interrupting; auto-dismiss after ~5s and offer Undo where possible.

```jsx
<ToastRegion>
  <Toast tone="success" title="Invite sent" description="anna@velvet.io will get an email." onClose={dismiss} />
</ToastRegion>
```
