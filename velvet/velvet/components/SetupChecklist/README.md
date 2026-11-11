"Get started" card for first-run setup — profile, import, first record. Progress bar + steps that link to where each task is done; done steps show a check, the first open step is highlighted. Hides itself once every step is done. Not a Tour (guided overlay) or Stepper (linear form flow) — steps here are independent and done in any order.

First-run setup on a dashboard. 3–5 steps, each pointing to the screen where it gets done; compute `done` from real data so the card disappears on its own.

```jsx
<SetupChecklist layout="grid" title="Set up your workspace" steps={[
  { id:'profile', label:'Complete your profile', description:'Role and skills', icon:'settings', href:'/settings', done:true },
  { id:'profile', label:'Build your profile', icon:'file-text', href:'/profile' },
  { id:'proposal', label:'Add your first proposal', icon:'briefcase', href:'/organizer' }
]} onDismiss={hide} />
```
