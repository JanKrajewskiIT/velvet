# QuantCore — feature roadmap proposals

Status: proposal · 22 Oct 2026 · owner: Anna Novak
Context: personal investing & trading platform (GPW, US, global, FX, metals, crypto), see `QuantCore.dc.html`.

Guiding principle: the most valuable additions **close the loop: decision → outcome → lesson**. More data sources come later.

---

## Priority 1 — real edge for a single owner

### 1. Decision journal with retrospective scoring · **designed** (Portfolio → Decisions)
- Every discretionary portfolio decision (buy / sell / hold / skip) records: thesis, conviction (1–5), expected horizon, invalidation condition, review date.
- On the review date the system scores the outcome vs. benchmark and asks for a short reflection.
- Pattern detection across decisions: e.g. “sells winners too early”, “high-conviction calls outperform low-conviction ones”, “earnings-driven entries underperform”.
- Data: decision is an append-only record linked to ledger transactions (if any) and the market snapshot at decision time (point-in-time).
- AI role: summarise patterns and quote the user’s own theses back. AI never judges the outcome itself; outcomes are computed.

### 2. Polish tax module (PIT-38, IKE/IKZE) · **designed** (Portfolio → Tax)
- Year-to-date estimate: realised gains/losses (FIFO, PLN at NBP rate D-1), dividends, foreign withholding tax credit, 19% tax due.
- Pre-trade tax simulation: “if I sell X now, tax changes by …”.
- Tax-loss harvesting candidates before 31 Dec (positions with unrealised loss outside IKE/IKZE) with replacement suggestions (similar exposure, not identical).
- IKE / IKZE contribution tracking vs. 2026 limits (IKE 28,260 PLN; IKZE 11,304 PLN, 16,956 PLN for sole traders) and IKZE deduction estimate.
- Export: PIT-38 / PIT-ZG worksheet (CSV/PDF). Not a filed return; the user verifies.
- Requirements touchpoints: closes D13 “separate PIT-38” and `OD-046`.

### 3. Scenario & stress testing
- Shocks applied to current ledger exposures: PLN ±10%, Nasdaq −30%, gold −15%, rates +100 bp, replay of 2008 / 2020 / 2022.
- Output: P&L per position and portfolio, drawdown vs. personal limit, which automations would be blocked by risk policy.

### 4. Target-weight rebalancing
- Policy: target weights per asset class / region / currency with tolerance bands.
- Proposal: minimal set of trades considering costs, taxes (from #2) and IKE/IKZE placement. Execution stays manual.

## Priority 2 — automations

### 5. Automation health / degradation detection · **designed** (Strategies → Health)
- Compare live paper/demo results with the distribution expected from backtest (Monte Carlo of trade sequence, block bootstrap).
- Status per automation: Within expectations / Watch / Degraded, using the percentile of the live equity path within the expected band.
- Drift metrics: win rate, avg R, slippage, trade frequency, holding time, regime mix — expected vs. live.
- Policy actions (versioned, approved): notify → reduce size → pause new entries (never auto-close without a separate approved policy).

### 6. Automations as a portfolio
- Correlation matrix of automation returns, shared risk budget, capital allocation (equal risk / inverse vol / Kelly-capped).
- Warn when correlated automations multiply the same exposure.

### 7. Performance attribution
- Split result into: signal edge, entry/exit timing, costs, slippage, sizing. Shows what to improve.

### 8. AI hypothesis generator
- AI proposes strategy variants. Each one goes through the normal backtest with multiple-testing correction (deflated Sharpe, White’s reality check) and a log of how many variants were tried.

## Priority 3 — later

9. Fundamental screener for GPW + US with saved filters and alerts.
10. Periodic reports (monthly PDF / e-mail): portfolio, automations, decisions due for review.
11. Read-only mobile companion with alerts and Kill Switch.
12. Multi-user mode — only if publishing: data licences / redistribution, KYC, KNF/MiFID scope, per-tenant isolation.

## Deliberately not planned

- Social / copy trading.
- AI chat that gives buy/sell recommendations.
- Leverage products without explicit risk policy and broker-side protections.

## Business-logic gaps found in the backend docs · **designed**

Gaps between what the backend docs require and what the UI showed:

| Requirement (docs) | Gap | Designed in |
| --- | --- | --- |
| Configuration workflow: proposal → review → evidence → activation → rollback (`operations.md`, `OD-*`) | No UI for change requests, four-eyes review or rollback | Operations → **Changes & control** (`QcGovernance`): CR list, flow stepper, YAML diff, role-aware approve |
| Trading state `NORMAL / SUSPENDED / CLOSE_ONLY / EMERGENCY_STOP` separate from process state and mode (`17-operator-experience §3`) | Only Kill Switch was visible | Same view: explicit state selector, Kill Switch history, reset needs RiskOwner + MFA |
| Roles & scopes `read/configure/research/trading/emergency`, MFA (`product.md`) | Not shown | Same view: Roles & scopes card |
| Signals & explainability: contribution breakdown, gates, lineage (`17 §4`) | Signals listed without "why" | Strategies → **Signals** (`QcSignals`): per-feature contribution, ordered gates, snapshot lineage |
| Datasets: immutable, certified, calendars, gaps (`03-domain`, `20-temporal`) | No dataset view | Operations → **Data, providers & AI** (`QcDataOps`): datasets with quality/gaps/calendar/hash |
| Provider coverage, entitlement, redistribution rights (`11-quality §licences`, `OD-019`) | Not shown | Same view: providers & usage rights |
| AI budget, schedule, reliability monitoring (`intelligence.md`) | Not shown | Same view: AI usage, budget meter, hit rate by month |
| "Missing ≠ zero", stale vs. empty (`NEWS-003`, journal MAE/MFE) | Ad-hoc text | New DS component **DataState** used across views |

Still not designed (next candidates): alert subscription/channel policy editor, corporate-action catch-up wizard, Replay session player, experiment/walk-forward configurator, Monte Carlo study setup.

## Design-system additions (Velvet UI)

New `components/finance/` (group **29 Finance**): `PriceChange`, `Money` + `MoneyPrivacy`, `InstrumentLabel`, `EnvironmentBar`, `DataState`, `RangeBandChart`.
New tokens `tokens/sys-market.css`: `--market-up/down/flat-*` (direction ≠ status), `--env-{research,paper,demo,live}-*`, `data-market-colors="standard|inverted|cvd"`.
`LineChart` fix: negative values (drawdown, returns) and `includeZero={false}` for price/equity levels.
Template: shell uses `EnvironmentBar`; tables use `InstrumentLabel` / `PriceChange` / `DataState`; Health uses `RangeBandChart`; TradingView widget follows the app theme (light/dark).

## Design-system additions, round 2

Patterns that were hand-built in the template are now DS components: `CellStack`, `UsageMeter`, `MetricGroup` (data/), `DirectionBadge`, `ContributionBar`, `ValueShift`, `NewsItem` (finance/), `NavbarChip` (navigation/), `GateList` (feedback/), `CodeEditor` (forms/). The template uses them in orders, limits, IKE/IKZE, budgets, jobs, KPIs, signal explainability, drift, news feed, the navbar and the automation editor.

## Design changes in this iteration

| Area | Change | File |
| --- | --- | --- |
| Portfolio | New tabs **Decisions** and **Tax** | `QcDecisions.dc.html`, `QcTax.dc.html`, `QcPortfolio.dc.html` |
| Strategies | New tab **Health** (Monte Carlo band, drift table, policy actions) | `QcDrift.dc.html`, `QcStrategies.dc.html` |
| Overview | “Decisions due for review” and automation health surfaced | `QcOverview.dc.html` |
| Data | Sample data for decisions, tax, drift | `qc-data.js` |
| Operations | Tabs: Health & alerts · Changes & control · Data, providers & AI | `QcOperations`, `QcGovernance`, `QcDataOps` |
| Strategies | New tab **Signals** (explainability) | `QcSignals.dc.html` |
| Shell | `EnvironmentBar` replaces hand-built status strip | `QuantCore.dc.html` |
