import React from 'react';
export function useWidth(initial = 600) {
  const ref = React.useRef(null);
  const [w, setW] = React.useState(initial);
  React.useLayoutEffect(() => {
    if (!ref.current) return;
    setW(ref.current.clientWidth || initial);
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(([e]) => setW(Math.max(120, e.contentRect.width)));
    ro.observe(ref.current); return () => ro.disconnect();
  }, []);
  return [ref, w];
}
export function niceTicks(max, count = 4) {
  if (max <= 0) return [0];
  const raw = max / count; const p = Math.pow(10, Math.floor(Math.log10(raw)));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * p).find((s) => s >= raw) || p * 10;
  const top = Math.ceil(max / step) * step;
  return Array.from({ length: Math.round(top / step) + 1 }, (_, i) => +(i * step).toFixed(10));
}
export function niceRange(min, max, count = 4) {
  const span = max - min || 1; const raw = span / count; const p = Math.pow(10, Math.floor(Math.log10(raw)));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * p).find((s) => s >= raw) || p * 10;
  const lo = Math.floor(min / step) * step, hi = Math.ceil(max / step) * step;
  return Array.from({ length: Math.round((hi - lo) / step) + 1 }, (_, i) => +(lo + i * step).toFixed(10));
}
export const compact = (n) => (Math.abs(n) >= 1e6 ? +(n / 1e6).toFixed(1) + 'M' : Math.abs(n) >= 1e3 ? +(n / 1e3).toFixed(1) + 'k' : String(+n.toFixed(2)));
