Transient status message. With `duration` it auto-dismisses via a countdown bar that pauses on hover/focus. With `onUndo` it becomes the undo pattern — prefer this over a confirm dialog for reversible destructive actions.

Toast confirms an action without interrupting; auto-dismiss after ~5s and offer Undo where possible.

```jsx
<ToastRegion>
  <Toast tone="success" title="Invite sent" description="anna@velvet.io will get an email." onClose={dismiss} />
</ToastRegion>
```
