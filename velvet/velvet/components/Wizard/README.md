Multi-step flow that owns its index: Stepper on top, one step's content, Back / Next → Finish. Validation errors mark the step red and block. Focus moves to the new panel.

Wizard holds the steps, their content and Back / Next together. A step's `validate` returns an error string (sync or async) to block Next, and `onFinish` can return a promise.

```jsx
<Wizard finishLabel="Create workspace" onFinish={createWorkspace}
  steps={[
    { label: 'Account details',
      content: <Input label="Workspace name" value={name} onChange={e => setName(e.target.value)} />,
      validate: () => !name.trim() && 'Give your workspace a name to continue.' },
    { label: 'Invite team', content: <TagInput label="Emails" /> },
  ]} />
```

**Props.** The full contract is `WizardProps` in `components/index.d.ts`.

**Built from:** Button, Glyph, Stepper. **CSS:** `.vui-wizard*`. **Preview:** `components/Wizard/preview.html` (group Forms).
