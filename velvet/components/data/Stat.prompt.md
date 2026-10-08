Stat is a Card: one key metric. Line up 2–4 in a responsive grid. `accent="<tone>"` adds the Surface accent strip for category coding; `spark` turns it into a trend card. Do not wrap in another Card.

```jsx
<Stat label="Revenue" value="€48,290" delta="+12.4%" hint="vs. last month" />
<Stat accent="teal" label="Time to hire" value="21 d" delta="-3 d" spark={[30,28,26,24,21]} />
```
