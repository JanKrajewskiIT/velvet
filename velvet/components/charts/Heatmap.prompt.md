Calendar density for "how much, when". Weeks are columns, so 20 weeks ≈ a dashboard card and 52 a profile page. Pass real dates, not a flat array. Use `thresholds` when levels must mean the same thing across views.

```jsx
<Heatmap data={[{ date:'2026-09-28', value:4 }, { date:'2026-09-29', value:9 }]} weeks={20} unit="sessions" label="Last 20 weeks" />
```
