From–to numeric field — budget, price filter, size range. Two bounds share one label and error lane; values are grouped per locale when not focused. Optional inline unit (currency) and period selects turn it into a money range ("10 000 – 15 000 PLN / month"). An inverted range flags itself. Either bound may be left empty (open range).

Min–max number entry. For salaries add `unitOptions` (currencies) and `periodOptions`; for a fixed unit use `suffix` instead.

```jsx
<RangeInput label="Budget" locale="pl" value={budget} onValueChange={setBudget}
  unitOptions={['PLN','EUR','USD']} unit={cur} onUnitChange={setCur}
  periodOptions={['Hourly','Monthly','Yearly']} defaultPeriod="Monthly" />
<RangeInput label="Area" suffix="m²" fromLabel="Min" toLabel="Max" />
```
