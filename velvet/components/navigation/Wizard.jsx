import React from 'react';
import { Button } from '../actions/Button.jsx';
import { Glyph } from '../primitives/Glyph.jsx';
import { Stepper } from './Stepper.jsx';
import { cx } from '../primitives/cx.js';
export function Wizard({ steps = [], onFinish, onCancel, finishLabel = 'Finish', defaultStep = 0, className }) {
  const [i, setI] = React.useState(defaultStep);
  const [err, setErr] = React.useState(null);
  const [busy, setBusy] = React.useState(false);
  const panel = React.useRef(null);
  const last = i === steps.length - 1;
  const s = steps[i] || {};
  React.useEffect(() => { panel.current && panel.current.focus({ preventScroll: true }); }, [i]);
  const next = async () => {
    setErr(null);
    if (s.validate) { const e = await s.validate(); if (e) { setErr(e); return; } }
    if (last) { setBusy(true); try { await (onFinish && onFinish()); } finally { setBusy(false); } }
    else setI(i + 1);
  };
  return (
    <div className={cx('vui-wizard', className)}>
      <Stepper steps={steps} current={i} errorAt={err ? i : undefined} onStepClick={(k) => { setErr(null); setI(k); }} />
      <div ref={panel} tabIndex={-1} className="vui-wizard__panel" role="group" aria-label={typeof s.label === 'string' ? s.label : undefined} key={i}>
        {s.title !== false && <div className="vui-wizard__title">{s.label}</div>}
        {s.content}
        {err && <div className="vui-hint vui-hint--error" role="alert" style={{ marginTop: 12 }}>{err}</div>}
      </div>
      <div className="vui-wizard__foot">
        {onCancel && i === 0 ? <Button variant="ghost" onClick={onCancel}>Cancel</Button>
          : <Button variant="secondary" iconLeft="arrow-left" disabled={i === 0} onClick={() => { setErr(null); setI(i - 1); }}>Back</Button>}
        <span className="vui-wizard__count">Step {i + 1} of {steps.length}</span>
        <Button loading={busy} iconRight={last ? null : 'arrow-right'} onClick={next}>{last ? finishLabel : 'Next'}</Button>
      </div>
    </div>
  );
}
