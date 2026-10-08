// Shared helpers for foundation cards: live WCAG contrast badges + computed-token labels. Re-run on theme change.
(() => {
  const cv = document.createElement('canvas'); cv.width = cv.height = 1;
  const cx = cv.getContext('2d', { willReadFrequently: true });
  const px = (layers) => { cx.clearRect(0, 0, 1, 1); for (const c of layers) { cx.fillStyle = c; cx.fillRect(0, 0, 1, 1); } return cx.getImageData(0, 0, 1, 1).data; };
  const lum = (d) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(d[0]) + 0.7152 * f(d[1]) + 0.0722 * f(d[2]); };
  const bgChain = (el) => { const out = []; for (let n = el; n && n.nodeType === 1; n = n.parentElement) { const b = getComputedStyle(n).backgroundColor; if (b && b !== 'rgba(0, 0, 0, 0)' && b !== 'transparent') out.unshift(b); } return out; };
  const contrast = () => document.querySelectorAll('[data-contrast]').forEach((el) => {
    const bg = bgChain(el); const fg = getComputedStyle(el).color;
    const B = lum(px(bg)), F = lum(px([...bg, fg]));
    const r = (Math.max(B, F) + 0.05) / (Math.min(B, F) + 0.05);
    const out = el.parentElement.querySelector('.ratio'); if (!out) return;
    out.textContent = r.toFixed(1); out.dataset.pass = r >= 4.5 ? 'aa' : r >= 3 ? 'large' : 'fail';
  });
  const tokens = () => document.querySelectorAll('[data-token]').forEach((el) => { el.textContent = getComputedStyle(document.documentElement).getPropertyValue(el.dataset.token).trim(); });
  const specs = () => document.querySelectorAll('[data-spec]').forEach((el) => { const s = el.closest('[data-role]').querySelector('.sample'); if (!s) return; const c = getComputedStyle(s); const lh = parseFloat(c.lineHeight); el.textContent = Math.round(parseFloat(c.fontSize) * 10) / 10 + '/' + (lh ? Math.round(lh) : '—') + ' · ' + c.fontWeight; });
  const sizes = () => document.querySelectorAll('[data-measure]').forEach((el) => { const t = el.closest('[data-role]').querySelector('.sample'); if (t) el.textContent = Math.round(t.getBoundingClientRect()[el.dataset.measure]) + 'px'; });
  const run = () => requestAnimationFrame(() => { contrast(); tokens(); specs(); sizes(); window.dispatchEvent(new Event('vui-card-refresh')); });
  addEventListener('DOMContentLoaded', run);
  new MutationObserver(run).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  document.fonts && document.fonts.ready.then(run);
})();
