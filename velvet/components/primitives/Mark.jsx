import React from 'react';
import { cx } from './cx.js';
export function Mark({ variant = 'highlight', className, ...rest }) {
  return <mark className={cx('vui-mark', variant !== 'highlight' && 'vui-mark--' + variant, className)} {...rest} />;
}
const fold = (c) => c.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
export function highlightMatch(text, query, variant) {
  if (text == null || (typeof text !== 'string' && typeof text !== 'number')) return text ?? null;
  const s = String(text); if (!query) return s;
  const chars = [...s]; const map = []; let hay = '';
  chars.forEach((c, i) => { const f = fold(c); for (let k = 0; k < f.length; k++) map.push(i); hay += f; });
  const q = [...String(query)].map(fold).join(''); const at = hay.indexOf(q); if (at < 0 || !q) return s;
  const a = map[at], b = map[at + q.length - 1] + 1;
  return <>{chars.slice(0, a).join('')}<Mark variant={variant}>{chars.slice(a, b).join('')}</Mark>{chars.slice(b).join('')}</>;
}
