import React from 'react';
import { Button } from '../actions/Button.jsx';
import { Dot } from '../primitives/Dot.jsx';
import { cx } from '../primitives/cx.js';
const LABEL = { research: 'RESEARCH', replay: 'REPLAY', paper: 'PAPER', demo: 'DEMO', shadow: 'SHADOW', live: 'LIVE · REAL FUNDS' };
export function EnvironmentBar({ environment = 'paper', label, items = [], connection, onKill, killLabel = 'Kill Switch', killDisabled = false, sticky = false, top = 0, maxWidth = 1360, actions, className, ...rest }) {
  const conn = connection || null;
  const tone = conn ? ({ live: 'success', stale: 'warning', offline: 'danger' })[conn.state] || 'neutral' : null;
  return (
    <div role="region" aria-label={'Environment: ' + (label || LABEL[environment])} data-env={environment} className={cx('vui-envbar', sticky && 'vui-envbar--sticky', className)} style={sticky ? { top } : undefined} {...rest}>
      <div className="vui-envbar__in" style={{ maxWidth }}>
        <span className="vui-envbar__chip">{label || LABEL[environment]}</span>
        <div className="vui-envbar__items">
          {items.map((it, i) => <div key={i} className="vui-envbar__it"><span className="vui-envbar__k">{it.label}</span><span className="vui-envbar__v">{it.value}</span></div>)}
        </div>
        <div className="vui-envbar__end">
          {conn && <span className="vui-envbar__conn" role="status"><Dot tone={tone} pulse={conn.state === 'live'} />{conn.label}</span>}
          {actions}
          {onKill && <Button variant="danger" size="sm" iconLeft="stop" onClick={onKill} disabled={killDisabled}>{killLabel}</Button>}
        </div>
      </div>
    </div>
  );
}
