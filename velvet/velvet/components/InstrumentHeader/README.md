Masthead of an instrument page: the symbol as the page heading, name and venue, the live price (`PriceCell` lg), percent and absolute change, the session state, key facts and actions. Use it instead of `PageHeader` on instrument and company pages.

**Use it** once per page. Keep `meta` to the 4–6 facts that decide whether to act (previous close, range, volume, data source and its delay). Say where the price comes from; a delayed or end-of-day price is labelled as such.

**Built from** `PriceCell`, `Delta`, `Dot`, `Badge`. Below 768px it stacks.

**Props.** The full contract is `InstrumentHeaderProps` in `components/index.d.ts`.

- `session`: `{ state: 'open' | 'pre' | 'closed', label }`; combine with `marketSession()`.
- `meta`: `[{ label, value, mono? }]`.
- `hidden`: privacy mode mask for the price.

**Preview:** `components/InstrumentHeader/preview.html`.
