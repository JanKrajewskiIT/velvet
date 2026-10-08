First-run setup on a dashboard. 3–5 steps, each pointing to the screen where it gets done; compute `done` from real data so the card disappears on its own.

```jsx
<SetupChecklist layout="grid" title="Set up your workspace" steps={[
  { id:'profile', label:'Complete your profile', description:'Role and skills', icon:'settings', href:'/settings', done:true },
  { id:'cv', label:'Build your CV', icon:'file-text', href:'/portfolio' },
  { id:'offer', label:'Add your first offer', icon:'briefcase', href:'/organizer' }
]} onDismiss={hide} />
```
