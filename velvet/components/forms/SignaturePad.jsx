import React from 'react';
import { Field } from '../primitives/Field.jsx';
import { Button } from '../actions/Button.jsx';
import { cx } from '../primitives/cx.js';
const mid = (a, b) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
export function SignaturePad({ label, hint, error, optional, required, height = 180, penWidth = 2.5, placeholder = 'Sign here', onValueChange, disabled, id, className }) {
  const cv = React.useRef(null);
  const strokes = React.useRef([]);
  const cur = React.useRef(null);
  const [count, setCount] = React.useState(0);
  const draw = React.useCallback(() => {
    const c = cv.current; if (!c) return;
    const r = c.getBoundingClientRect(); const dpr = window.devicePixelRatio || 1;
    const W = Math.round(r.width * dpr), H = Math.round(r.height * dpr);
    if (c.width !== W || c.height !== H) { c.width = W; c.height = H; }
    const ctx = c.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, r.width, r.height);
    ctx.strokeStyle = ctx.fillStyle = getComputedStyle(c).color; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    strokes.current.concat(cur.current ? [cur.current] : []).forEach((s) => {
      if (s.length === 1) { ctx.beginPath(); ctx.arc(s[0].x, s[0].y, s[0].w / 2, 0, Math.PI * 2); ctx.fill(); return; }
      for (let i = 1; i < s.length; i++) {
        const p0 = s[i - 1], p1 = s[i];
        const m0 = i === 1 ? p0 : mid(s[i - 2], p0), m1 = i === s.length - 1 ? p1 : mid(p0, p1);
        ctx.beginPath(); ctx.moveTo(m0.x, m0.y); ctx.quadraticCurveTo(p0.x, p0.y, m1.x, m1.y); ctx.lineWidth = (p0.w + p1.w) / 2; ctx.stroke();
      }
    });
  }, []);
  React.useEffect(() => {
    const c = cv.current; if (!c) return;
    const ro = new ResizeObserver(draw); ro.observe(c);
    const mo = new MutationObserver(draw); mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'class'] });
    const mq = matchMedia('(prefers-color-scheme: dark)'); mq.addEventListener('change', draw);
    return () => { ro.disconnect(); mo.disconnect(); mq.removeEventListener('change', draw); };
  }, [draw]);
  const emit = () => { setCount(strokes.current.length); onValueChange && onValueChange(strokes.current.length ? cv.current.toDataURL('image/png') : null, strokes.current); };
  const pt = (e, last) => {
    const r = cv.current.getBoundingClientRect(); const x = e.clientX - r.left, y = e.clientY - r.top;
    let w = penWidth;
    if (e.pointerType === 'pen' && e.pressure) w = penWidth * (0.45 + e.pressure * 1.1);
    else if (last) { const d = Math.hypot(x - last.x, y - last.y); w = penWidth * Math.max(0.55, Math.min(1.35, 1.4 - d * 0.045)); }
    if (last) w = last.w * 0.6 + w * 0.4;
    return { x, y, w };
  };
  const down = (e) => { if (disabled || e.button > 0) return; e.preventDefault(); e.currentTarget.setPointerCapture(e.pointerId); cur.current = [pt(e)]; draw(); };
  const move = (e) => {
    if (!cur.current) return;
    const evs = e.nativeEvent.getCoalescedEvents ? e.nativeEvent.getCoalescedEvents() : [e];
    (evs.length ? evs : [e]).forEach((ev) => { const s = cur.current; const p = pt(ev, s[s.length - 1]); if (Math.hypot(p.x - s[s.length - 1].x, p.y - s[s.length - 1].y) > 0.8) s.push(p); });
    draw();
  };
  const up = () => { if (!cur.current) return; strokes.current.push(cur.current); cur.current = null; draw(); emit(); };
  const undo = () => { strokes.current.pop(); draw(); emit(); };
  const clear = () => { strokes.current = []; draw(); emit(); };
  return (
    <Field label={label} hint={hint} error={error} optional={optional} required={required} id={id} className={cx('vui-sig', className)}>
      <div className={cx('vui-sig__pad', error && 'vui-sig__pad--invalid', disabled && 'vui-sig__pad--disabled')} style={{ height }}>
        <canvas ref={cv} className="vui-sig__canvas" role="img" aria-label={(typeof label === 'string' ? label : 'Signature') + (count ? ' — signed' : ' — empty')} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} />
        {!count && <span className="vui-sig__ph" aria-hidden="true">{placeholder}</span>}
        <span className="vui-sig__line" aria-hidden="true" />
        {count > 0 && !disabled && (
          <div className="vui-sig__tools">
            <Button variant="ghost" size="xs" iconLeft="rotate-ccw" onClick={undo}>Undo</Button>
            <Button variant="ghost" size="xs" onClick={clear}>Clear</Button>
          </div>
        )}
      </div>
    </Field>
  );
}
