Amount with currency in tabular figures — optional sign colour (trend tokens), compact notation and privacy masking. null renders an em dash, never 0.

`signed` prefixes + on positive amounts and `colored` tints by sign. `compact` prints 12.4k · 1.32 m · 3.40 bn (the suffixes stay English). `currencyDisplay="symbol"` gives `$1,299.00`. `locale` sets the digit grouping and the decimal mark (default `'en-US'`; `'pl-PL'` gives `1 234,50`).

`MoneyPrivacy` hides every `Money` below it at once (amounts show as •••••, for screen sharing); `hidden` on a single `Money` overrides it and `useMoneyHidden()` reads the current state. Hidden amounts are announced as "Amount hidden".

**Props.** The full contract is `MoneyProps` and `MoneyPrivacyProps` in `components/index.d.ts`.

**Built from:** the shared number formatter `fmtNum` (also used by `Delta` and `ContributionBar`). **CSS:** `.vui-money*`. **Preview:** `components/Money/preview.html` (group Metrics).
