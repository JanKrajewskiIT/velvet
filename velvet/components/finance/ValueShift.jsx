import React from 'react';
import { Glyph } from '../primitives/Glyph.jsx';
import { cx } from '../primitives/cx.js';
export function ValueShift({ from, to, format, worse, better, label, className, ...rest }) {
  const f = format || ((v) => (v == null ? '—' : String(v)));
  const bad = worse ? !!worse(from, to) : false;
  const good = !bad && better ? !!better(from, to) : false;
  return (
    <span className={cx('vui-shift', className)} data-state={bad ? 'worse' : good ? 'better' : 'same'} aria-label={(label ? label + ': ' : '') + 'expected ' + f(from) + ', actual ' + f(to) + (bad ? ', worse' : good ? ', better' : '')} {...rest}>
      <span className="vui-shift__from" aria-hidden="true">{f(from)}</span>
      <Glyph name="arrow-right" className="vui-shift__arrow" />
      <span className="vui-shift__to" aria-hidden="true">{f(to)}</span>
    </span>
  );
}
