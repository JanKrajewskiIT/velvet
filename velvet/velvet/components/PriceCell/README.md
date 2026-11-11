A live price in tabular figures. When `value` changes it flashes on a trend-up or trend-down wash for `--dur-slower`; under reduced motion durations collapse to 0 and there is no flash. `null` renders an em dash, never 0.

**Use it** in watchlists, positions and quotes. Pair it with `change` (a `Delta`) when the change is not shown elsewhere in the row. Do not use it for amounts of money the viewer owns; that is `Money`.

**Built from** `Delta`; colours are trend tokens, not status tokens.

**Props.** The full contract is `PriceCellProps` in `components/index.d.ts`.

- `quotes` + `symbol`: a live source from `createQuoteStore()`. The cell subscribes to its symbol and re-renders on its own, so a page full of prices does not re-render when one ticks. `value` is the fallback until the store has the symbol. `InstrumentHeader` (`quotes`, `quoteKey`, `reference`) and `OrderTicket` (`quotes`) take the same store.
- `digits`, `locale`, `currency`: formatting.
- `size`: `sm` for tables, `md`, `lg` for page headers.
- `hidden`: privacy mode mask.
- The flash is not announced to screen readers; announce only meaningful thresholds elsewhere.

**Preview:** `components/PriceCell/preview.html`.
