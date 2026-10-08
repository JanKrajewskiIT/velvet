Tabs switch between peer views of the same object; `underline` for page sections, `segmented` for compact view toggles.

```jsx
<Tabs items={[{value:'all',label:'All',count:24},{value:'active',label:'Active'}]} value={tab} onChange={setTab} />
<Tabs variant="segmented" items={[{value:'grid',label:'Grid',icon:'layout-grid'},{value:'list',label:'List',icon:'list'}]} />
```
