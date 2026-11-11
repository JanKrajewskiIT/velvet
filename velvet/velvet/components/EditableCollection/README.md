Repeatable editable rows — skills with a level, job requirements, checklist, agenda. Each row: drag grip (or ↑↓ on the focused grip) · always-visible text input · optional level select · optional importance stars · delete. Empty rows show "can't be empty" after blur. Dashed full-width Add focuses the new row. Header with title + live count.

Use for repeatable rows the user edits in place (skills + level, requirements, checklist). Add `levels` for a per-row select, `weighted` only if order alone doesn't convey priority.

```jsx
<EditableCollection title="Skills" levels={['Basic','Intermediate','Advanced','Expert']} items={skills} onItemsChange={setSkills} placeholder="Skill name" addLabel="Add skill" />
```
