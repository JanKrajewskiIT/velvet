import React from 'react';
import { Dot } from '../primitives/Dot.jsx';
import { Glyph } from '../primitives/Glyph.jsx';
import { cx } from '../primitives/cx.js';
const META = {
  fresh: { tone: 'success', icon: 'check', title: 'Fresh' },
  delayed: { tone: 'info', icon: 'clock', title: 'Delayed' },
  stale: { tone: 'warning', icon: 'clock', title: 'Stale' },
  partial: { tone: 'warning', icon: 'triangle-alert', title: 'Partial coverage' },
  unavailable: { tone: 'danger', icon: 'triangle-alert', title: 'Unavailable' },
  empty: { tone: 'neutral', icon: 'check', title: 'Nothing found' }
};
export function DataState({ state = 'fresh', label, detail, source, asOf, variant = 'inline', action, className, ...rest }) {
  const m = META[state] || META.fresh;
  if (variant === 'block') return (
    <div role="status" className={cx('vui-dstate', 'vui-dstate--block', className)} data-tone={m.tone} {...rest}>
      <span className="vui-dstate__icon"><Glyph name={m.icon} /></span>
      <span className="vui-dstate__title">{label || m.title}</span>
      {detail && <span className="vui-dstate__detail">{detail}</span>}
      {(source || asOf) && <span className="vui-dstate__src">{[source, asOf].filter(Boolean).join(' · ')}</span>}
      {action}
    </div>
  );
  return (
    <span role="status" className={cx('vui-dstate', className)} {...rest}>
      <Dot tone={m.tone} pulse={state === 'fresh'} />
      <span>{label || m.title}</span>
      {(source || asOf) && <span className="vui-dstate__src">{[source, asOf].filter(Boolean).join(' · ')}</span>}
    </span>
  );
}
