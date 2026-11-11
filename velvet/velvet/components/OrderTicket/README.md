Compact order entry. Side is a two-option radio (← → switch), then type (market / limit / stop), quantity, price, stop loss and take profit, and time in force. Under the fields it estimates notional, risk to the stop (and as % of equity), reward : risk and buying power after, and lists the problems that warn (no stop loss) or block (stop on the wrong side, risk above the per-trade limit, notional above buying power). Review opens a `ConfirmDialog`; only its confirmation calls `onSubmit`. The ticket never sends anything by itself.

**Use it** next to the chart on instrument pages and on a trading desk. Show the account and environment (`account`, `envLabel`); for live money set `envTone="danger"` and `confirmTone="danger"`. Pass `blocked` with the reason whenever new orders are not allowed, and `reduceOnly` + `position` in close-only states.

**Built from** `Card`, `Segmented`, `NumberInput`, `Select`, `Alert`, `Button`, `Badge`, `ConfirmDialog`. Buy and sell use trend tokens, not status tokens.

**Props.** The full contract is `OrderTicketProps` in `components/index.d.ts`. `labels` overrides every text for translation.

**Preview:** `components/OrderTicket/preview.html`.
