(() => {
if (customElements.get('qc-tv-chart')) return;
class QcTvChart extends HTMLElement {
  static get observedAttributes() { return ['symbol', 'interval', 'theme']; }
  connectedCallback() { if (!this._mo) { this._mo = new MutationObserver(() => this.schedule()); this._mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] }); } this.style.display = 'block'; this.style.position = 'relative'; this.style.minHeight = this.style.minHeight || '360px'; this.schedule(); }
  attributeChangedCallback() { if (this.isConnected) this.schedule(); }
  schedule() { clearTimeout(this._t); this._t = setTimeout(() => this.draw(), 30); }
  draw() {
    const symbol = this.getAttribute('symbol') || 'OANDA:XAUUSD';
    const theme = this.getAttribute('theme') || (document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');
    const key = symbol + '|' + (this.getAttribute('interval') || '60') + '|' + theme;
    if (this._k === key) return; this._k = key;
    this.innerHTML = '';
    const ph = document.createElement('div');
    ph.textContent = 'TradingView · ' + symbol;
    ph.style.cssText = 'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font:500 13px/1.4 var(--font-mono, monospace);color:var(--fg-tertiary, #888);background:var(--bg-subtle, #f4f4f5);border-radius:var(--radius-md, 8px)';
    this.appendChild(ph);
    const wrap = document.createElement('div');
    wrap.className = 'tradingview-widget-container';
    wrap.style.cssText = 'position:absolute;inset:0';
    const w = document.createElement('div');
    w.className = 'tradingview-widget-container__widget';
    w.style.cssText = 'height:100%;width:100%';
    wrap.appendChild(w);
    const s = document.createElement('script');
    s.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    s.async = true;
    s.textContent = JSON.stringify({ autosize: true, symbol, interval: this.getAttribute('interval') || '60', timezone: 'Europe/Warsaw', theme, style: '1', locale: 'en', hide_side_toolbar: true, allow_symbol_change: false, save_image: false, calendar: false, support_host: 'https://www.tradingview.com' });
    wrap.appendChild(s);
    this.appendChild(wrap);
  }
}
QcTvChart.prototype.disconnectedCallback = function () { if (this._mo) { this._mo.disconnect(); this._mo = null; } };
customElements.define('qc-tv-chart', QcTvChart);
})();
