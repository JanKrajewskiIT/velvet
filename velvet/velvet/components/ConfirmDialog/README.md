Second-thought dialog. primary for routine confirmations, danger for destructive (warning icon, red button, focus starts on Cancel). requireText gates irreversible actions behind typing a name. onConfirm may be async — spinner, dialog locked meanwhile, double submit blocked; if it rejects the dialog stays open with the error message inline. Prefer Toast undo for reversible actions.

Use ConfirmDialog for decisions, such as destructive actions. `requireText` makes the person type a word before the confirm button works, and an async `onConfirm` shows a loading state until it settles.

```jsx
<ConfirmDialog open={open} tone="danger" title="Delete workspace?"
  description="This permanently removes all projects, members and data. This action can’t be undone."
  requireText="velvet-studio" confirmLabel="Delete workspace"
  onCancel={() => setOpen(false)}
  onConfirm={async () => { await deleteWorkspace(); setOpen(false); }} />
```

**Props.** The full contract is `ConfirmDialogProps` in `components/index.d.ts`.

**Built from:** IconTile, Field, Control, Button, Glyph, Dialog. **Also exports:** ConfirmAction. **CSS:** `.vui-confirm*`. **Preview:** `components/ConfirmDialog/preview.html` (group Overlays).
