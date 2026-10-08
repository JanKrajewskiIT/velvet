import React from 'react';
import { Button } from '../actions/Button.jsx';
import { Glyph } from '../primitives/Glyph.jsx';
import { cx } from '../primitives/cx.js';
export function Tour({ steps = [], open, onClose, onFinish, defaultStep = 0, padding = 6 }) {
  const [i, setI] = React.useState(defaultStep);
  const [rect, setRect] = React.useState(null);
  const card = React.useRef(null);
  const [pos, setPos] = React.useState({ left: 0, top: 0, side: 'bottom' });
  const s = steps[i];
  React.useEffect(() => { if (open) setI(defaultStep); }, [open]);
  const measure = React.useCallback(() => {
    if (!open || !s) return;
    const el = typeof s.target === 'string' ? document.querySelector(s.target) : s.target && s.target.current;
    setRect(el ? el.getBoundingClientRect() : null);
  }, [open, i]);
  React.useLayoutEffect(measure, [measure]);
  React.useEffect(() => { if (!open) return; window.addEventListener('resize', measure); window.addEventListener('scroll', measure, true); return () => { window.removeEventListener('resize', measure); window.removeEventListener('scroll', measure, true); }; }, [measure, open]);
  React.useLayoutEffect(() => {
    if (!card.current) return;
    const c = card.current.getBoundingClientRect(); const vw = window.innerWidth, vh = window.innerHeight; const g = 12;
    if (!rect) { setPos({ left: (vw - c.width) / 2, top: (vh - c.height) / 2, side: 'center' }); return; }
    let side = s.placement || 'bottom';
    if (side === 'bottom' && rect.bottom + g + c.height > vh) side = 'top';
    if (side === 'top' && rect.top - g - c.height < 0) side = 'bottom';
    let left = side === 'right' ? rect.right + g + padding : side === 'left' ? rect.left - g - c.width - padding : rect.left + rect.width / 2 - c.width / 2;
    let top = side === 'bottom' ? rect.bottom + g + padding : side === 'top' ? rect.top - g - c.height - padding : rect.top + rect.height / 2 - c.height / 2;
    setPos({ left: Math.max(8, Math.min(vw - c.width - 8, left)), top: Math.max(8, Math.min(vh - c.height - 8, top)), side });
  }, [rect, i]);
  React.useEffect(() => { if (open && card.current) card.current.focus(); }, [open, i]);
  React.useEffect(() => {
    if (!open) return;
    const k = (e) => { if (e.key === 'Escape') onClose && onClose(); else if (e.key === 'ArrowRight') next(); else if (e.key === 'ArrowLeft' && i > 0) setI(i - 1); };
    window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k);
  });
  if (!open || !s) return null;
  const last = i === steps.length - 1;
  function next() { if (last) { onFinish ? onFinish() : onClose && onClose(); } else setI(i + 1); }
  const hole = rect && { left: rect.left - padding, top: rect.top - padding, width: rect.width + padding * 2, height: rect.height + padding * 2 };
  return (
    <div className="vui-tour" role="presentation">
      {hole ? <div className="vui-tour__hole" style={hole} /> : <div className="vui-tour__veil" />}
      <div className="vui-tour__block" onMouseDown={(e) => e.preventDefault()} />
      <div ref={card} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="vui-tour-t" aria-describedby="vui-tour-d" className={cx('vui-tour__card', 'vui-tour__card--' + pos.side)} style={{ left: pos.left, top: pos.top }} key={i}>
        <div className="vui-tour__top"><span className="vui-tour__step">{i + 1} / {steps.length}</span><Button variant="ghost" size="sm" onClick={onClose}>Skip</Button></div>
        <div id="vui-tour-t" className="vui-tour__title">{s.title}</div>
        <div id="vui-tour-d" className="vui-tour__body">{s.body}</div>
        {s.target && !rect && <div className="vui-tour__missing"><Glyph name="info" />This part of the page isn’t visible right now.</div>}
        <div className="vui-tour__foot">
          <span className="vui-tour__dots" aria-hidden="true">{steps.map((_, k) => <i key={k} className={k === i ? 'on' : ''} />)}</span>
          {i > 0 && <Button variant="secondary" size="sm" onClick={() =>setI(i - 1)}>Back</Button>}
          <Button size="sm" onClick={next}>{last ? 'Done' : 'Next'}</Button>
        </div>
      </div>
    </div>
  );
}
