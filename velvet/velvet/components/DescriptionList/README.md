Key–value details (record pages, invoices, settings summary). row = label left / value right, divided · grid = label over value in N columns. Missing values show an em dash.

**Props.** The full contract is `DescriptionListProps` in `components/index.d.ts`.

- `items` (required): `DescriptionItem[]`
- `layout`: `'row' | 'grid'`, default `'row'`
- `columns`: `number`, default `2`. grid only.

**CSS:** `.vui-dl*`. **Preview:** `components/DescriptionList/preview.html` (group Data).
