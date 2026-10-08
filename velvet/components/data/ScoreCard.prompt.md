ScoreCard is a Card — do not wrap it. Use for outcomes ("ATS match 82%", "Quiz result", "Profile strength"). Single KPI + trend → Stat with `spark`.

```jsx
<ScoreCard label="ATS match" score={82} verdict="Strong match" criteria={[{ label: 'Skills', value: 90 }, { label: 'Experience', value: 74 }]} />
```
