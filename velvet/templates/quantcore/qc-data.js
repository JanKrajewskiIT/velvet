(() => {
const days = [];
let eq = 100000, peak = 100000;
const seed = [0.4,-0.2,0.6,0.3,-0.8,0.5,0.2,-0.3,0.9,-1.4,-0.6,0.7,0.4,0.3,-0.2,1.1,0.5,-0.4,0.2,0.8,-1.9,-0.7,0.6,0.9,0.3,-0.2,0.5,0.4,-0.3,0.6];
seed.forEach((r, i) => { eq = eq * (1 + r / 100); peak = Math.max(peak, eq); const d = new Date(2026, 8, 23 + i); days.push({ label: d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }), equity: Math.round(eq), drawdown: +((eq / peak - 1) * 100).toFixed(2) }); });
const price = [];
let p = 2418;
[3,-2,4,1,-5,2,6,3,-1,-4,2,5,7,-3,1,4,-2,6,3,-1,2,5,-4,3].forEach((m, i) => { p += m; price.push({ label: String(i).padStart(2, '0') + ':00', close: p, ema: 0 }); });
price.forEach((r, i) => { const w = price.slice(Math.max(0, i - 7), i + 1); r.ema = +(w.reduce((a, b) => a + b.close, 0) / w.length).toFixed(1); });
window.QcData = {
  user: { name: 'Anna Novak', first: 'Anna', email: 'anna.novak@quantcore.local', role: 'Operator', scopes: ['read', 'research', 'trading'] },
  accounts: [{ value: 'ACC-PAPER-01', label: 'Paper · Metals' }, { value: 'ACC-PAPER-02', label: 'Paper · FX majors' }],
  account: { id: 'ACC-PAPER-01', name: 'Paper · Metals', currency: 'USD', equity: 102480.35, cash: 84120.10, margin: 3912.00, pnlDay: 612.40, pnlDayPct: 0.6, drawdown: -2.8, maxDd: -6.4, exposure: 18.2, leverage: 1.8, ledgerVersion: 418, observedAt: '14:32:07' },
  cycle: { id: 'CYC-XAU-H1', version: 7, sha: '9f3c7b21…e04a21e' },
  readiness: [
    { id: 'data', label: 'Data quality', state: 'ok', detail: 'OANDA XAU_USD · H1 · fresh 4 s ago' },
    { id: 'risk', label: 'Risk policy', state: 'ok', detail: 'RiskPolicy v12 · approved 14 Oct' },
    { id: 'recon', label: 'Reconciliation', state: 'blocked', detail: 'Lag 6 min · limit 5 min', code: 'RECON_LAG' },
    { id: 'recovery', label: 'Recovery', state: 'ok', detail: 'Completed today 08:02' },
    { id: 'kill', label: 'Kill Switch', state: 'ok', detail: 'Inactive · last reset 2 Oct' },
    { id: 'config', label: 'Configuration', state: 'warn', detail: 'CR-214 awaiting RiskOwner review', code: 'REVIEW' }
  ],
  equity: days,
  price,
  markers: [
    { at: '04:00', kind: 'Signal', label: 'LONG · 0.71', tone: 'brand' },
    { at: '05:00', kind: 'Order', label: 'BUY 2.00 oz LMT 2421.0', tone: 'info' },
    { at: '05:00', kind: 'Fill', label: '2.00 oz @ 2421.4', tone: 'success' },
    { at: '13:00', kind: 'Signal', label: 'LONG · 0.64 — blocked by risk', tone: 'warning' },
    { at: '19:00', kind: 'Signal', label: 'WAIT · 0.38', tone: 'neutral' }
  ],
  signals: [
    { id: 's1', inst: 'XAU/USD', tf: 'H1', dir: 'LONG', conf: 68, strategy: 'TrendPullback v3', regime: 'Trend · low vol', blocked: true, reason: 'RECON_LAG — reconciliation stale', at: '14:00' },
    { id: 's2', inst: 'XAG/USD', tf: 'H1', dir: 'WAIT', conf: 41, strategy: 'TrendPullback v3', regime: 'Range', blocked: false, reason: 'Confidence below threshold 55', at: '14:00' },
    { id: 's3', inst: 'EUR/USD', tf: 'H4', dir: 'NO_TRADE', conf: 0, strategy: 'MeanRevert v2', regime: 'High vol', blocked: false, reason: 'Event window: ECB decision 14:15', at: '12:00' }
  ],
  orders: [
    { id: 'ORD-7F21', inst: 'XAU/USD', side: 'BUY', qty: '2.00 oz', type: 'LMT', state: 'FILLED', expected: 2421.0, fill: 2421.4, slip: 1.7, recon: 'OK', at: '22 Oct 05:00:12' },
    { id: 'ORD-7F1C', inst: 'XAU/USD', side: 'SELL', qty: '1.00 oz', type: 'STP', state: 'WORKING', expected: 2398.0, fill: null, slip: null, recon: 'OK', at: '22 Oct 05:00:13' },
    { id: 'ORD-7E90', inst: 'XAG/USD', side: 'BUY', qty: '150 oz', type: 'MKT', state: 'PARTIALLY_FILLED', expected: 29.41, fill: 29.44, slip: 10.2, recon: 'PENDING', at: '21 Oct 16:20:41' },
    { id: 'ORD-7E4B', inst: 'XAU/USD', side: 'SELL', qty: '1.50 oz', type: 'LMT', state: 'FILLED', expected: 2412.5, fill: 2412.5, slip: 0, recon: 'OK', at: '21 Oct 11:02:03' },
    { id: 'ORD-7DF2', inst: 'EUR/USD', side: 'BUY', qty: '20,000', type: 'MKT', state: 'REJECTED', expected: 1.0842, fill: null, slip: null, recon: 'OK', at: '20 Oct 09:14:55', note: 'RISK_EXPOSURE_CURRENCY — USD limit 25%' }
  ],
  chain: [
    { t: 'Signal', d: 'LONG · confidence 71 · TrendPullback v3 · snapshot FS-H1-0422', at: '05:00:01', tone: 'brand', icon: 'zap' },
    { t: 'Decision', d: 'ENTER · SEMI_AUTO · approved by A. Novak (MFA)', at: '05:00:09', tone: 'info', icon: 'user' },
    { t: 'Risk', d: 'PASS · risk 0.48% of equity · SL 2398.0 · TP 2468.0 · R:R 2.0', at: '05:00:10', tone: 'success', icon: 'shield-check' },
    { t: 'Order', d: 'BUY 2.00 oz LMT 2421.0 · Idempotency-Key cmd_8c1…', at: '05:00:12', tone: 'neutral', icon: 'send' },
    { t: 'Fill', d: '2.00 oz @ 2421.4 · slippage 1.7 bp · commission 1.20 USD', at: '05:00:14', tone: 'success', icon: 'check' },
    { t: 'Booking', d: 'Ledger v417 · lot L-2210-01 · cash −4,844.00 USD', at: '05:00:15', tone: 'neutral', icon: 'database' }
  ],
  positions: [
    { inst: 'XAU/USD', qty: '2.00 oz', avg: 2421.4, last: 2436.8, pnl: 30.80, sl: 2398.0, tp: 2468.0, state: 'Break-even in 0.4R' },
    { inst: 'XAG/USD', qty: '90 / 150 oz', avg: 29.44, last: 29.61, pnl: 15.30, sl: 28.90, tp: 30.50, state: 'Partially filled' }
  ],
  limits: [
    { label: 'Daily risk', used: 0.9, max: 2, unit: '%' },
    { label: 'Gross exposure', used: 18.2, max: 40, unit: '%' },
    { label: 'Leverage', used: 1.8, max: 3, unit: '×' },
    { label: 'Drawdown from peak', used: 2.8, max: 8, unit: '%' },
    { label: 'USD exposure', used: 24.1, max: 25, unit: '%' }
  ],
  allocation: [{ label: 'Cash', value: 82.1 }, { label: 'Gold', value: 4.8 }, { label: 'Silver', value: 2.6 }, { label: 'Margin held', value: 10.5 }],
  blocked: [
    { id: 'b1', title: 'XAU/USD LONG · H1', code: 'RECON_LAG', at: 'Today 14:00' },
    { id: 'b2', title: 'EUR/USD BUY 20,000', code: 'RISK_EXPOSURE_CURRENCY', at: '20 Oct 09:14' },
    { id: 'b3', title: 'XAG/USD LONG · H4', code: 'DATA_QUALITY_STALE', at: '19 Oct 22:00' }
  ],
  health: [
    { id: 'md', label: 'Market data · OANDA', state: 'ok', metric: 'latency 380 ms' },
    { id: 'md2', label: 'Market data · Alpaca', state: 'off', metric: 'disabled in config' },
    { id: 'broker', label: 'Broker · Paper', state: 'ok', metric: 'heartbeat 2 s' },
    { id: 'risk', label: 'Risk engine', state: 'ok', metric: 'p95 12 ms' },
    { id: 'exec', label: 'Execution', state: 'ok', metric: 'queue 0' },
    { id: 'recon', label: 'Reconciliation', state: 'warn', metric: 'lag 6 min' },
    { id: 'clock', label: 'Clock (NTP)', state: 'ok', metric: 'drift +3 ms' },
    { id: 'ai', label: 'AI · Intelligence', state: 'ok', metric: 'next run 15:00' }
  ],
  alerts: [
    { id: 'a1', sev: 'danger', title: 'Reconciliation lag over limit', key: 'recon.lag/ACC-PAPER-01', first: '14:26', last: '14:32', count: 4, owner: 'A. Novak', state: 'Open' },
    { id: 'a2', sev: 'warning', title: 'Partial fill unfilled for 20 h', key: 'exec.partial/ORD-7E90', first: '21 Oct 16:20', last: '14:00', count: 9, owner: '—', state: 'Open' },
    { id: 'a3', sev: 'info', title: 'ECB decision 14:15 — EUR block window', key: 'event.ecb/2026-10-22', first: '08:00', last: '08:00', count: 1, owner: 'System', state: 'Acknowledged' }
  ],
  jobs: [
    { id: 'JOB-5521', kind: 'Backtest', target: 'TrendPullback v3 · XAU H1 · 2019–2026', state: 'RUNNING', progress: 64, at: '14:05' },
    { id: 'JOB-5519', kind: 'Features', target: 'FS-H1 v4 · DS-XAU-H1-c7', state: 'SUCCEEDED', progress: 100, at: '13:40' },
    { id: 'JOB-5518', kind: 'Backfill', target: 'OANDA XAG_USD M5 · 30 days', state: 'SUCCEEDED', progress: 100, at: '13:12' },
    { id: 'JOB-5512', kind: 'Walk-forward', target: 'MeanRevert v2 · EUR H4', state: 'FAILED', progress: 38, at: '11:58', note: 'Dataset DS-EUR-H4 not certified' }
  ],
  audit: [
    { t: 'Approved order ORD-7F21', d: 'A. Novak · SEMI_AUTO · MFA · correlation 4c1e…', at: '05:00' },
    { t: 'Mode ADVISORY → SEMI_AUTO', d: 'A. Novak · reason: paper session start · readiness PASS', at: '08:05' },
    { t: 'Submitted CR-214 · USD exposure 25 → 30%', d: 'M. Fox (RiskOwner) · awaiting review', at: '09:41' },
    { t: 'Acknowledged alert event.ecb', d: 'System · event window rule', at: '08:00' }
  ],
  runs: [
    { id: 'RUN-0931', variant: 'A · baseline', strategy: 'TrendPullback v3', env: 'Research', period: '2019-01 → 2026-06', ret: 41.8, dd: -12.4, sharpe: 1.21, oos: 'OOS PASS' },
    { id: 'RUN-0931', variant: 'B · ATR stop 2.5', strategy: 'TrendPullback v3', env: 'Research', period: '2019-01 → 2026-06', ret: 38.2, dd: -9.1, sharpe: 1.34, oos: 'OOS PASS' },
    { id: 'RUN-0927', variant: 'A · baseline', strategy: 'MeanRevert v2', env: 'Replay', period: '2024-01 → 2026-06', ret: 6.4, dd: -14.8, sharpe: 0.42, oos: 'OOS FAIL' },
    { id: 'RUN-0925', variant: 'A · baseline', strategy: 'Breakout v1', env: 'Research', period: '2019-01 → 2026-06', ret: null, dd: null, sharpe: null, oos: 'Incomplete' }
  ],
  manifest: [
    { term: 'Run / variant', description: 'RUN-0931 · B', mono: true },
    { term: 'Scope', description: 'Research · XAU/USD · H1' },
    { term: 'Dataset', description: 'DS-XAU-H1-c7 · certified', mono: true },
    { term: 'Feature set', description: 'FS-H1 v4', mono: true },
    { term: 'Cost model', description: 'Costs-OANDA v3 · spread + financing' },
    { term: 'Capital', description: '100,000 USD' },
    { term: 'Manifest SHA-256', description: 'b81e…77c0', mono: true },
    { term: 'Period', description: '2019-01-02 → 2026-06-30' }
  ],
  fmt: (n, d) => n == null ? '—' : n.toLocaleString('en-US', { minimumFractionDigits: d ?? 2, maximumFractionDigits: d ?? 2 }),
  signed: (n, d) => n == null ? '—' : (n > 0 ? '+' : n < 0 ? '−' : '') + Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: d ?? 2, maximumFractionDigits: d ?? 2 })
};
})();

(() => {
const D = window.QcData;
const sp = (seed, drift, n) => { let v = 100, out = []; for (let i = 0; i < (n || 20); i++) { seed = (seed * 9301 + 49297) % 233280; v += (seed / 233280 - 0.5) * 3 + drift; out.push(+v.toFixed(2)); } return out; };
const m = (sym, tv, name, last, chg, ccy, src, seed, extra) => Object.assign({ sym, tv, name, last, chg, ccy, src, spark: sp(seed, chg / 8) }, extra || {});
D.markets = {
  pl: [m('PKN', 'GPW:PKN', 'Orlen', 68.42, 1.84, 'PLN', 'Stooq · EOD', 11, { pe: '6.8', dy: '6.1%', cap: '79.4 bn PLN', next: 'Q3 results · 30 Oct' }), m('PKO', 'GPW:PKO', 'PKO Bank Polski', 61.10, -0.62, 'PLN', 'Stooq · EOD', 23, { pe: '8.9', dy: '7.4%', cap: '76.4 bn PLN', next: 'Q3 results · 5 Nov' }), m('CDR', 'GPW:CDR', 'CD Projekt', 241.60, 3.12, 'PLN', 'Stooq · EOD', 37, { pe: '41.2', dy: '0.4%', cap: '24.1 bn PLN', next: 'Q3 results · 26 Nov' }), m('KGH', 'GPW:KGH', 'KGHM Polska Miedź', 158.35, 2.40, 'PLN', 'Stooq · EOD', 41, { pe: '11.5', dy: '1.9%', cap: '31.7 bn PLN', next: 'ESPI: production report' }), m('DNP', 'GPW:DNP', 'Dino Polska', 418.20, -1.15, 'PLN', 'Stooq · EOD', 53, { pe: '27.3', dy: '—', cap: '41.0 bn PLN', next: 'Q3 results · 4 Nov' }), m('WIG20', 'GPW:WIG20', 'WIG20 index', 2614.8, 0.71, 'PLN', 'Stooq · EOD', 61, { pe: '10.1', dy: '4.8%', cap: '—', next: '—' })],
  us: [m('AAPL', 'NASDAQ:AAPL', 'Apple', 238.41, 0.92, 'USD', 'Alpaca · IEX', 71, { pe: '31.4', dy: '0.4%', cap: '3.6 tn USD', next: 'Q4 earnings · 29 Oct' }), m('MSFT', 'NASDAQ:MSFT', 'Microsoft', 452.18, -0.34, 'USD', 'Alpaca · IEX', 83, { pe: '35.0', dy: '0.7%', cap: '3.4 tn USD', next: 'Q1 earnings · 28 Oct' }), m('NVDA', 'NASDAQ:NVDA', 'NVIDIA', 141.26, 2.71, 'USD', 'Alpaca · IEX', 97, { pe: '48.9', dy: '0.0%', cap: '3.5 tn USD', next: 'Q3 earnings · 19 Nov' }), m('JPM', 'NYSE:JPM', 'JPMorgan Chase', 226.70, 0.18, 'USD', 'Alpaca · IEX', 101, { pe: '12.6', dy: '2.1%', cap: '640 bn USD', next: 'Ex-dividend · 6 Jan' }), m('SPY', 'AMEX:SPY', 'S&P 500 ETF', 588.12, 0.44, 'USD', 'Alpaca · IEX', 113, { pe: '24.8', dy: '1.2%', cap: '—', next: '—' })],
  global: [m('SAP', 'XETR:SAP', 'SAP', 214.30, 1.05, 'EUR', 'Stooq · EOD', 127, { pe: '42.0', dy: '1.0%', cap: '263 bn EUR', next: 'Q3 results · 21 Oct' }), m('ASML', 'EURONEXT:ASML', 'ASML', 682.40, -2.11, 'EUR', 'Stooq · EOD', 131, { pe: '33.5', dy: '0.9%', cap: '268 bn EUR', next: '—' }), m('DAX', 'XETR:DAX', 'DAX index', 19412.0, 0.32, 'EUR', 'Stooq · EOD', 149, { pe: '—', dy: '—', cap: '—', next: '—' }), m('N225', 'TVC:NI225', 'Nikkei 225', 38940.0, -0.58, 'JPY', 'Stooq · EOD', 151, { pe: '—', dy: '—', cap: '—', next: '—' })],
  fx: [m('XAU/USD', 'OANDA:XAUUSD', 'Gold spot', 2436.80, 0.64, 'USD', 'OANDA · live', 163, { pe: '—', dy: '—', cap: '—', next: 'FOMC · 28 Oct' }), m('XAG/USD', 'OANDA:XAGUSD', 'Silver spot', 29.61, 1.21, 'USD', 'OANDA · live', 173, { pe: '—', dy: '—', cap: '—', next: '—' }), m('EUR/USD', 'OANDA:EURUSD', 'Euro / US dollar', 1.0842, -0.21, 'USD', 'OANDA · live', 181, { pe: '—', dy: '—', cap: '—', next: 'ECB · 29 Oct' }), m('USD/PLN', 'OANDA:USDPLN', 'US dollar / zloty', 3.9814, 0.12, 'PLN', 'OANDA · live', 191, { pe: '—', dy: '—', cap: '—', next: 'NBP · 4 Nov' })],
  crypto: [m('BTC', 'BINANCE:BTCUSDT', 'Bitcoin', 67412, 1.92, 'USDT', 'Binance · public', 197, { pe: '—', dy: '—', cap: '1.33 tn USD', next: '—' }), m('ETH', 'BINANCE:ETHUSDT', 'Ether', 2618.4, -0.84, 'USDT', 'Binance · public', 211, { pe: '—', dy: '—', cap: '315 bn USD', next: '—' }), m('SOL', 'BINANCE:SOLUSDT', 'Solana', 166.9, 3.45, 'USDT', 'Binance · public', 223, { pe: '—', dy: '—', cap: '78 bn USD', next: '—' })]
};
D.portfolios = [{ value: 'all', label: 'All portfolios' }, { value: 'ike', label: 'IKE · mBank' }, { value: 'xtb', label: 'XTB · Global' }, { value: 'crypto', label: 'Binance · Crypto' }];
D.holdings = [
  { sym: 'PKN', name: 'Orlen', cls: 'Stocks PL', acct: 'IKE · mBank', qty: 400, avg: 58.10, last: 68.42, ccy: 'PLN', value: 27368, pnl: 17.8, weight: 13.1 },
  { sym: 'KGH', name: 'KGHM', cls: 'Stocks PL', acct: 'IKE · mBank', qty: 120, avg: 141.00, last: 158.35, ccy: 'PLN', value: 19002, pnl: 12.3, weight: 9.1 },
  { sym: 'ETFBW20TR', name: 'Beta ETF WIG20TR', cls: 'ETF', acct: 'IKE · mBank', qty: 210, avg: 118.40, last: 126.90, ccy: 'PLN', value: 26649, pnl: 7.2, weight: 12.8 },
  { sym: 'AAPL', name: 'Apple', cls: 'Stocks US', acct: 'XTB · Global', qty: 60, avg: 189.20, last: 238.41, ccy: 'USD', value: 56953, pnl: 26.0, weight: 27.3 },
  { sym: 'NVDA', name: 'NVIDIA', cls: 'Stocks US', acct: 'XTB · Global', qty: 45, avg: 112.80, last: 141.26, ccy: 'USD', value: 25307, pnl: 25.2, weight: 12.1 },
  { sym: 'CSPX', name: 'iShares Core S&P 500', cls: 'ETF', acct: 'XTB · Global', qty: 8, avg: 548.0, last: 601.2, ccy: 'USD', value: 19149, pnl: 9.7, weight: 9.2 },
  { sym: 'BTC', name: 'Bitcoin', cls: 'Crypto', acct: 'Binance · Crypto', qty: 0.12, avg: 52100, last: 67412, ccy: 'USDT', value: 32206, pnl: 29.4, weight: 15.4 },
  { sym: 'PLN', name: 'Cash', cls: 'Cash', acct: 'All', qty: null, avg: null, last: null, ccy: 'PLN', value: 2140, pnl: null, weight: 1.0 }
];
D.portfolioTotal = { value: 208774, dayPct: 0.84, day: 1742, unreal: 31408, divYtd: 2216, twrYtd: 14.6, mwrYtd: 13.1, xirr: 12.4 };
D.transactions = [
  { id: 'T-1042', date: '21 Oct 2026', acct: 'XTB · Global', type: 'BUY', sym: 'NVDA', qty: '5', price: '138.10 USD', amount: '−690.50 USD', src: 'Import · XTB v1' },
  { id: 'T-1041', date: '18 Oct 2026', acct: 'IKE · mBank', type: 'DIV', sym: 'PKN', qty: '—', price: '—', amount: '+1,680.00 PLN', src: 'Import · mBank v2' },
  { id: 'T-1040', date: '15 Oct 2026', acct: 'Binance · Crypto', type: 'BUY', sym: 'BTC', qty: '0.02', price: '64,920 USDT', amount: '−1,298.40 USDT', src: 'Manual' },
  { id: 'T-1039', date: '10 Oct 2026', acct: 'IKE · mBank', type: 'CASH', sym: 'PLN', qty: '—', price: '—', amount: '+5,000.00 PLN', src: 'Manual' },
  { id: 'T-1038', date: '02 Oct 2026', acct: 'XTB · Global', type: 'SELL', sym: 'MSFT', qty: '10', price: '448.90 USD', amount: '+4,489.00 USD', src: 'Import · XTB v1' },
  { id: 'T-1037', date: '02 Oct 2026', acct: 'XTB · Global', type: 'FEE', sym: 'MSFT', qty: '—', price: '—', amount: '−4.49 USD', src: 'Import · XTB v1' }
];
D.perf = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'].map((l, i) => ({ label: l, portfolio: +[1.2, 2.8, 4.1, 3.3, 5.9, 7.2, 6.4, 8.8, 10.9, 9.7, 12.6, 14.6][i].toFixed(1), wig: +[0.8, 1.9, 3.5, 2.1, 3.0, 4.8, 5.5, 6.1, 7.4, 6.2, 8.0, 9.1][i].toFixed(1), spx: +[1.5, 2.2, 3.9, 4.4, 5.2, 4.0, 6.6, 8.1, 9.4, 10.0, 11.2, 12.3][i].toFixed(1) }));
D.importRows = [
  { row: 1, date: '2026-10-21', kind: 'BUY', sym: 'NVDA', qty: '5', amount: '−690.50 USD', status: 'New' },
  { row: 2, date: '2026-10-21', kind: 'FEE', sym: 'NVDA', qty: '—', amount: '−0.69 USD', status: 'New' },
  { row: 3, date: '2026-10-02', kind: 'SELL', sym: 'MSFT', qty: '10', amount: '+4,489.00 USD', status: 'Duplicate' },
  { row: 4, date: '2026-09-30', kind: 'DIV', sym: 'AAPL', qty: '—', amount: '+14.40 USD', status: 'New' },
  { row: 5, date: '2026-09-28', kind: 'BUY', sym: 'ASML.NL', qty: '3', amount: '−2,031.00 EUR', status: 'Unmapped symbol' }
];
D.automations = [
  { id: 'A-01', name: 'Gold Trend Pullback', approach: 'Rules', assets: 'XAU/USD', tf: 'H1', stage: 'Paper', ret: 4.8, dd: -2.1, sharpe: 1.42, win: 54, trades: 38, days: 41, ready: 72, key: 'a1' },
  { id: 'A-02', name: 'FX Mean Revert', approach: 'Rules', assets: 'EUR/USD · GBP/USD', tf: 'H4', stage: 'Paper', ret: 1.1, dd: -3.8, sharpe: 0.48, win: 61, trades: 52, days: 41, ready: 35, key: 'a2' },
  { id: 'A-03', name: 'News-aware Breakout', approach: 'AI-assisted', assets: 'NVDA · AAPL · MSFT', tf: 'M15', stage: 'Paper', ret: 3.2, dd: -4.4, sharpe: 0.91, win: 47, trades: 112, days: 28, ready: 48, key: 'a3', model: 'Claude · digest features' },
  { id: 'A-04', name: 'Crypto Regime Switch', approach: 'ML', assets: 'BTC · ETH', tf: 'H4', stage: 'Replay', ret: 6.9, dd: -8.7, sharpe: 0.77, win: 44, trades: 64, days: 0, ready: 20, key: 'a4', model: 'Gradient boosting v2' },
  { id: 'A-05', name: 'WIG20 Gap Fade', approach: 'Hybrid', assets: 'WIG20 futures', tf: 'M5', stage: 'Research', ret: null, dd: null, sharpe: null, win: null, trades: 0, days: 0, ready: 5, key: 'a5' }
];
D.autoEquity = Array.from({ length: 28 }, (_, i) => ({ label: 'D' + (i + 1), a1: +(i * 0.17 + Math.sin(i / 3) * 0.6).toFixed(2), a2: +(i * 0.04 + Math.sin(i / 2) * 0.9).toFixed(2), a3: +(i * 0.11 + Math.cos(i / 4) * 1.1 - 0.4).toFixed(2), a4: +(i * 0.25 + Math.sin(i / 2.5) * 2.2 - 1).toFixed(2) }));
D.events = [
  { id: 'e1', date: '2026-10-22', time: '14:30', title: 'US Initial Jobless Claims', region: 'US', kind: 'Macro', imp: 'Medium', prev: '241K', cons: '238K', actual: '229K' },
  { id: 'e2', date: '2026-10-22', time: '17:40', title: 'KGHM — ESPI: monthly production report', region: 'PL', kind: 'ESPI', imp: 'Low', prev: '—', cons: '—' },
  { id: 'e3', date: '2026-10-23', time: '10:00', title: 'Poland retail sales y/y (GUS)', region: 'PL', kind: 'Macro', imp: 'Medium', prev: '1.9%', cons: '2.4%' },
  { id: 'e4', date: '2026-10-27', time: '16:00', title: 'US Consumer Confidence', region: 'US', kind: 'Macro', imp: 'Medium', prev: '98.7', cons: '99.5' },
  { id: 'e5', date: '2026-10-28', time: '19:00', title: 'FOMC rate decision', region: 'US', kind: 'Central bank', imp: 'High', prev: '4.25%', cons: '4.00%', blackout: 'No new entries 30 min before/after · XAU, FX, US equities' },
  { id: 'e6', date: '2026-10-28', time: '22:05', title: 'Microsoft — Q1 FY27 earnings', region: 'US', kind: 'Earnings', imp: 'High', prev: 'EPS 3.30', cons: 'EPS 3.41', held: true },
  { id: 'e7', date: '2026-10-29', time: '14:15', title: 'ECB rate decision', region: 'EU', kind: 'Central bank', imp: 'High', prev: '2.00%', cons: '2.00%', blackout: 'EUR pairs blocked 14:00–15:00' },
  { id: 'e8', date: '2026-10-29', time: '14:30', title: 'US GDP Q3 advance', region: 'US', kind: 'Macro', imp: 'High', prev: '3.0%', cons: '2.6%' },
  { id: 'e9', date: '2026-10-29', time: '22:30', title: 'Apple — Q4 FY26 earnings', region: 'US', kind: 'Earnings', imp: 'High', prev: 'EPS 1.64', cons: 'EPS 1.72', held: true },
  { id: 'e10', date: '2026-10-30', time: '07:30', title: 'Orlen — Q3 results', region: 'PL', kind: 'Earnings', imp: 'High', prev: '—', cons: 'EBITDA 9.1 bn PLN', held: true },
  { id: 'e11', date: '2026-11-04', time: '—', title: 'NBP rate decision', region: 'PL', kind: 'Central bank', imp: 'High', prev: '4.50%', cons: '4.25%' },
  { id: 'e12', date: '2026-11-06', time: '14:30', title: 'US Non-Farm Payrolls', region: 'US', kind: 'Macro', imp: 'High', prev: '142K', cons: '150K', blackout: 'No new entries 15 min before/after' }
];
D.digest = {
  generated: '22 Oct · 07:00', model: 'Claude Sonnet', sources: 14, failed: 2,
  headline: 'Risk-on tone ahead of FOMC; metals bid, tech earnings next week',
  sections: [
    { title: 'Macro', icon: 'globe', tone: 'info', items: ['Futures price in a 25 bp FOMC cut on 28 Oct (~85%); real yields eased 6 bp this week.', 'ECB expected on hold on 29 Oct; EUR/USD range 1.078–1.092 since Monday.', 'Poland: CPI 3.1% y/y; market prices an NBP cut in November.'] },
    { title: 'Your portfolio', icon: 'briefcase', tone: 'brand', items: ['Orlen reports Q3 on 30 Oct — consensus EBITDA 9.1 bn PLN; refining margins up q/q.', 'Apple and Microsoft report next week — 39% of portfolio is US mega-cap tech.', 'KGHM +2.4% with copper at a 3-month high; production report today 17:40.'] },
    { title: 'Watchlist & crypto', icon: 'eye', tone: 'neutral', items: ['NVDA: supplier guidance raised (TSMC); options imply ±7% on earnings.', 'BTC holds above 66k; spot ETF net inflows for a 5th straight day.'] }
  ],
  links: [{ label: 'Reuters · Fed watch', detail: '07:12' }, { label: 'Bankier.pl · Orlen preview', detail: '06:40' }, { label: 'SEC 8-K · Apple', detail: 'yesterday' }, { label: 'Alpaca News · NVDA', detail: '05:58' }]
};
D.news = [
  { id: 'n1', title: 'Fed officials signal openness to another cut as labour market cools', src: 'Reuters', at: '07:12', region: 'US', impact: 'High', tags: ['XAU/USD', 'EUR/USD', 'SPY'], bullets: ['Two voting members back a 25 bp move in October.', 'Market-implied probability rose to ~85%.'] },
  { id: 'n2', title: 'Orlen Q3 preview: refining margins lift EBITDA expectations', src: 'Bankier.pl', at: '06:40', region: 'PL', impact: 'Medium', tags: ['PKN'], bullets: ['Consensus EBITDA 9.1 bn PLN (+12% q/q).', 'Dividend policy update expected with results.'] },
  { id: 'n3', title: 'TSMC raises AI accelerator outlook for 2027', src: 'Alpaca News', at: '05:58', region: 'Global', impact: 'Medium', tags: ['NVDA', 'ASML'], bullets: ['Capex guidance up 8%; supports NVDA supply narrative.'] },
  { id: 'n4', title: 'KGHM: ESPI — September copper output +4% y/y', src: 'ESPI', at: 'yesterday', region: 'PL', impact: 'Low', tags: ['KGH'], bullets: ['Payable copper 49.2 kt; silver output flat.'] },
  { id: 'n5', title: 'Bitcoin ETFs extend inflow streak to five sessions', src: 'CoinDesk RSS', at: 'yesterday', region: 'Global', impact: 'Low', tags: ['BTC'], bullets: ['Net inflows 412 m USD over five days.'] }
];
D.health.splice(0, 2, { id: 'md', label: 'OANDA · FX & metals', state: 'ok', metric: 'latency 380 ms' }, { id: 'md2', label: 'Alpaca · US equities', state: 'ok', metric: 'IEX · 1 s' }, { id: 'stq', label: 'Stooq · GPW & global EOD', state: 'ok', metric: 'last 22 Oct 06:10' }, { id: 'bnc', label: 'Binance · crypto', state: 'ok', metric: 'public API · 2 s' }, { id: 'rss', label: 'News · RSS & Alpaca', state: 'warn', metric: '12/14 feeds OK' }, { id: 'espi', label: 'ESPI/EBI', state: 'off', metric: 'manual entry only' });
})();

(() => {
const D = window.QcData;
D.decisions = [
  { id: 'DEC-031', date: '14 Jan 2026', sym: 'NVDA', action: 'BUY', thesis: 'AI capex cycle continues through 2026; supply constraints ease in H2.', invalid: 'Hyperscaler capex guidance cut', conviction: 4, review: '14 Oct 2026', status: 'Right', ret: 25.2, bench: 11.0, tags: ['Thematic', 'US'] },
  { id: 'DEC-034', date: '03 Mar 2026', sym: 'CDR', action: 'SELL', thesis: 'Take profit before delay risk on next release.', invalid: 'Release date confirmed', conviction: 2, review: '03 Sep 2026', status: 'Wrong', ret: 31.0, bench: 6.1, tags: ['Take profit', 'PL'], note: 'Sold a winner early, stock +31% since.' },
  { id: 'DEC-036', date: '20 Mar 2026', sym: 'PKN', action: 'BUY', thesis: 'Refining margins recover, dividend yield > 6% supports downside.', invalid: 'Dividend policy cut', conviction: 4, review: '20 Sep 2026', status: 'Right', ret: 17.8, bench: 5.9, tags: ['Dividend', 'PL'] },
  { id: 'DEC-038', date: '02 Apr 2026', sym: 'MSFT', action: 'SELL', thesis: 'Rotate into NVDA, higher growth for similar risk.', invalid: '—', conviction: 3, review: '02 Oct 2026', status: 'Mixed', ret: 4.1, bench: 7.4, tags: ['Rotation', 'US'] },
  { id: 'DEC-041', date: '15 Oct 2026', sym: 'BTC', action: 'BUY', thesis: 'ETF inflows + halving cycle; small satellite position.', invalid: 'Weekly close < 58k', conviction: 2, review: '15 Jan 2027', status: 'Open', ret: 3.8, bench: null, tags: ['Satellite', 'Crypto'] },
  { id: 'DEC-042', date: '21 Oct 2026', sym: 'NVDA', action: 'ADD', thesis: 'Supplier guidance raised; add before earnings with defined risk.', invalid: 'Earnings guide below cons.', conviction: 3, review: '21 Nov 2026', status: 'Due', ret: 2.3, bench: 0.4, tags: ['Earnings', 'US'] }
];
D.patterns = [
  { title: 'You sell winners too early', detail: '3 of 4 “take profit” sells were followed by a further +18% median within 6 months.', tone: 'warning', icon: 'trending-up' },
  { title: 'High conviction pays', detail: 'Conviction 4–5: hit rate 78%, +9.4 pp vs benchmark. Conviction 1–2: 40%, −2.1 pp.', tone: 'success', icon: 'target' },
  { title: 'Invalidation rarely written', detail: '38% of decisions have no invalidation condition, and those underperform by 4.2 pp.', tone: 'info', icon: 'info' }
];
D.tax = { year: 2026, gains: 18420, losses: -3210, net: 15210, dividends: 2216, whtCredit: 312, due: 2890, dueDiv: 109, ike: { used: 18000, limit: 28260 }, ikze: { used: 6000, limit: 11304 } };
D.harvest = [
  { sym: 'ASML', acct: 'XTB · Global', unreal: -1840, saving: 350, replacement: 'iShares Semiconductor (SEMI)', wash: 'No PL wash-sale rule; keep economic exposure similar, not identical' },
  { sym: 'ETH', acct: 'Binance · Crypto', unreal: -920, saving: 175, replacement: '—', wash: 'Crypto is taxed separately (PIT-38 section E). Losses offset only crypto gains' },
  { sym: 'DNP', acct: 'XTB · Global', unreal: -610, saving: 116, replacement: 'Beta ETF mWIG40', wash: '—' }
];
D.drift = [
  { id: 'A-01', name: 'Gold Trend Pullback', status: 'Within', pctl: 58, win: [54, 52], avgR: [0.42, 0.39], slip: [1.5, 1.7], freq: [9.1, 9.3], action: '—' },
  { id: 'A-02', name: 'FX Mean Revert', status: 'Watch', pctl: 14, win: [63, 61], avgR: [0.21, 0.08], slip: [0.6, 1.4], freq: [12.0, 12.8], action: 'Notify · slippage 2.3× expected' },
  { id: 'A-03', name: 'News-aware Breakout', status: 'Degraded', pctl: 3, win: [52, 47], avgR: [0.35, 0.12], slip: [3.0, 5.8], freq: [24, 28], action: 'New entries paused 21 Oct · awaiting review' },
  { id: 'A-04', name: 'Crypto Regime Switch', status: 'Within', pctl: 46, win: [45, 44], avgR: [0.61, 0.58], slip: [4.0, 4.2], freq: [16, 16], action: '—' }
];
D.mc = Array.from({ length: 29 }, (_, i) => { const mu = i * 0.16, sd = Math.sqrt(i) * 0.55; const act = i <= 28 ? +(i * 0.13 - (i > 14 ? (i - 14) * 0.21 : 0) + Math.sin(i / 2) * 0.25).toFixed(2) : null; return { label: 'D' + i, p5: +(mu - 1.64 * sd).toFixed(2), p50: +mu.toFixed(2), p95: +(mu + 1.64 * sd).toFixed(2), live: act }; });
})();

(() => {
const D = window.QcData;
D.changes = [
  { id: 'CR-214', title: 'USD exposure limit 25% → 30%', cls: 'RiskPolicy', author: 'M. Fox', role: 'RiskOwner', state: 'In review', created: '22 Oct 09:41', reviewers: 'Needs 1 RiskOwner other than author', evidence: 2,
    before: 'currencyExposure:\n  USD:\n    maxPctOfEquity: 25\n    action: block_new\n', after: 'currencyExposure:\n  USD:\n    maxPctOfEquity: 30\n    action: block_new\n  review: 2026-12-31\n' },
  { id: 'CR-213', title: 'EventPolicy v3: FOMC blackout ±30 min', cls: 'EventPolicy', author: 'A. Novak', role: 'Operator', state: 'Active', created: '18 Oct 11:02', reviewers: 'Approved by M. Fox', evidence: 3 },
  { id: 'CR-212', title: 'Costs-OANDA v3: financing table Oct', cls: 'CostModel', author: 'A. Novak', role: 'Operator', state: 'Active', created: '15 Oct 08:30', reviewers: 'Approved by M. Fox', evidence: 1 },
  { id: 'CR-209', title: 'Promote Gold Trend Pullback → Demo', cls: 'Promotion', author: 'A. Novak', role: 'Operator', state: 'Draft', created: '12 Oct 17:20', reviewers: 'Blocked: readiness 72% < 80%', evidence: 4 },
  { id: 'CR-205', title: 'DegradationPolicy v2', cls: 'Monitoring', author: 'M. Fox', role: 'RiskOwner', state: 'Rolled back', created: '02 Oct 10:00', reviewers: 'Rollback by M. Fox · too many false pauses', evidence: 2 }
];
D.datasets = [
  { id: 'DS-XAU-H1-c7', inst: 'XAU/USD', tf: 'H1', src: 'OANDA', range: '2019-01 → 2026-10', rows: '48,912', gaps: 0, quality: 'Certified', used: 4 },
  { id: 'DS-EUR-H4-c2', inst: 'EUR/USD', tf: 'H4', src: 'OANDA', range: '2018-01 → 2026-10', rows: '13,870', gaps: 3, quality: 'Uncertified', used: 1, note: '3 gaps > 1 session in 2020-03' },
  { id: 'DS-US-D1-c4', inst: 'US large caps (78)', tf: 'D1', src: 'Alpaca IEX', range: '2016-01 → 2026-10', rows: '210,440', gaps: 0, quality: 'Certified', used: 2 },
  { id: 'DS-GPW-D1-c1', inst: 'WIG20 members', tf: 'D1', src: 'Stooq', range: '2015-01 → 2026-10', rows: '57,300', gaps: 12, quality: 'Review', used: 0, note: 'Corporate actions not fully reconciled' },
  { id: 'DS-BTC-H4-c1', inst: 'BTC, ETH', tf: 'H4', src: 'Binance', range: '2020-01 → 2026-10', rows: '30,540', gaps: 0, quality: 'Certified', used: 1 }
];
D.providers = [
  { name: 'OANDA', scope: 'FX, metals · live + history', cost: 'Free (practice acct)', rights: 'Personal use · no redistribution', state: 'ok' },
  { name: 'Alpaca', scope: 'US equities · IEX + news', cost: 'Free tier', rights: 'Personal use · IEX ≈ 2–3% of volume', state: 'ok' },
  { name: 'Stooq', scope: 'GPW, global EOD', cost: 'Free', rights: 'Unclear for automated use · verify (OD-019)', state: 'warn' },
  { name: 'Binance', scope: 'Crypto · public market data', cost: 'Free', rights: 'Public API terms', state: 'ok' },
  { name: 'SEC EDGAR', scope: 'Company facts, filings', cost: 'Free', rights: 'Public domain · rate limit 10 req/s', state: 'ok' },
  { name: 'GPW / ESPI', scope: 'Official GPW data, ESPI/EBI', cost: 'Paid licence', rights: 'Not connected · manual entry', state: 'off' }
];
D.ai = { month: 'October', spent: 18.4, budget: 40, runs: 412, digests: 22, analyses: 31, features: 359, reliability: [{ label: 'Jul', hit: 54 }, { label: 'Aug', hit: 57 }, { label: 'Sep', hit: 52 }, { label: 'Oct', hit: 58 }] };
D.explain = {
  signal: 'XAU/USD · H1 · 22 Oct 14:00', dir: 'LONG', conf: 68, strategy: 'TrendPullback v3', snapshot: 'FS-H1-0422 · cutoff 13:59:59',
  contrib: [{ label: 'Trend (EMA 50/200)', v: 24 }, { label: 'Pullback depth', v: 18 }, { label: 'RSI(14) turn', v: 12 }, { label: 'H4 confirmation', v: 9 }, { label: 'Real yields Δ', v: 7 }, { label: 'News sentiment (AI)', v: 4 }, { label: 'Event proximity', v: -6 }],
  gates: [{ g: 'Data quality', ok: true, d: 'Fresh 4 s · no gaps' }, { g: 'Regime', ok: true, d: 'Trend · low vol (allowed)' }, { g: 'Event blackout', ok: true, d: 'Next high-impact: FOMC in 6 d' }, { g: 'Confidence ≥ 55', ok: true, d: '68' }, { g: 'Risk', ok: true, d: '0.48% of equity' }, { g: 'Reconciliation', ok: false, d: 'RECON_LAG · 6 min > 5 min' }]
};
})();
