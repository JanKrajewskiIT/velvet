Use for repeatable rows the user edits in place (skills + level, requirements, checklist). Add `levels` for a per-row select, `weighted` only if order alone doesn't convey priority.

```jsx
<EditableCollection title="Portfolio skills" levels={['Basic','Intermediate','Advanced','Expert']} items={skills} onItemsChange={setSkills} placeholder="Skill name" addLabel="Add skill" />
```
