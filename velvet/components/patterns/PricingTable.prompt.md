Plan comparison. Feature one tier only — the flag and the solid button are the whole hierarchy; no gradients, no coloured card backgrounds. Give prices per period to get the Monthly / Yearly switch.

```jsx
<PricingTable yearlyNote="2 months free" current="starter" tiers={[
  { id:'starter', name:'Starter', price:'0 zł', period:'/ month', blurb:'One workspace.', features:['3 projects','Community support'] },
  { id:'studio', name:'Studio', price:{ monthly:'89 zł', yearly:'890 zł' }, featured:true, includes:'Everything in Starter, plus', features:['Unlimited projects','SSO','Priority support'] },
  { id:'atlas', name:'Atlas', price:'Talk to us', cta:'Contact sales', features:['Dedicated instance','Audit log'] }
]} onSelect={(t, b) => checkout(t.id, b)} />
```
