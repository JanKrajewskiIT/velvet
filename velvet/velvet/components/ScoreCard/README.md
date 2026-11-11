Result card built on Card for a computed score (match, test result, health check): ring + verdict badge + per-criterion bars. Tone follows the score (≥75 success, ≥50 warning, else danger) unless set; it also drives the Card's accent strip / tonal hover. For a single KPI use Stat.

ScoreCard is a Card — do not wrap it. Use for outcomes ("Match 82%", "Test result", "Profile strength"). Single KPI + trend → Stat with `spark`.

```jsx
<ScoreCard label="Match" score={82} verdict="Strong match" criteria={[{ label: 'Skills', value: 90 }, { label: 'Experience', value: 74 }]} />
```
