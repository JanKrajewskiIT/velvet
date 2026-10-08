Min–max number entry. For salaries add `unitOptions` (currencies) and `periodOptions`; for a fixed unit use `suffix` instead.

```jsx
<RangeInput label="Salary" locale="pl" value={salary} onValueChange={setSalary}
  unitOptions={['PLN','EUR','USD']} unit={cur} onUnitChange={setCur}
  periodOptions={['Hourly','Monthly','Yearly']} defaultPeriod="Monthly" />
<RangeInput label="Area" suffix="m²" fromLabel="Min" toLabel="Max" />
```
