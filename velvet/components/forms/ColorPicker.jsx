import React from 'react';
import { FieldLabel } from '../primitives/Field.jsx';
import { Control } from '../primitives/Control.jsx';
import { Glyph } from '../primitives/Glyph.jsx';
import { cx } from '../primitives/cx.js';
const clamp = (n, a, b) => Math.min(b, Math.max(a, n));
export function hexToHsv(hex) {
  let h = (hex || '').replace('#', ''); if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  if (!/^[0-9a-f]{6}$/i.test(h)) return null;
  const r = parseInt(h.slice(0, 2), 16) / 255, g = parseInt(h.slice(2, 4), 16) / 255, b = parseInt(h.slice(4, 6), 16) / 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
  let hue = 0;
  if (d) hue = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return { h: (hue * 60 + 360) % 360, s: mx ? d / mx : 0, v: mx };
}
export function hsvToHex({ h, s, v }) {
  const f = (n) => { const k = (n + h / 60) % 6; return v - v * s * Math.max(0, Math.min(k, 4 - k, 1)); };
  return '#' + [f(5), f(3), f(1)].map((x) => Math.round(x * 255).toString(16).padStart(2, '0')).join('');
}
const DEFAULT_SWATCHES = ['#8b0036', '#c92d62', '#d98200', '#1f9254', '#1b8a9c', '#2f6fdc', '#7a52cc', '#3a3437'];
function Panel({ hex, onChange, swatches }) {
  const [hsv, setHsv] = React.useState(() => hexToHsv(hex) || { h: 0, s: 0, v: 0 });
  const [text, setText] = React.useState(hex);
  const area = React.useRef(null), hue = React.useRef(null);
  React.useEffect(() => { if (hexToHsv(hex) && hsvToHex(hsv) !== hex.toLowerCase()) { setHsv(hexToHsv(hex)); } setText(hex); }, [hex]);
  const push = (n) => { setHsv(n); const x = hsvToHex(n); setText(x); onChange(x); };
  const dragArea = (e) => { const r = area.current.getBoundingClientRect(); push({ ...hsv, s: clamp((e.clientX - r.left) / r.width, 0, 1), v: clamp(1 - (e.clientY - r.top) / r.height, 0, 1) }); };
  const dragHue = (e) => { const r = hue.current.getBoundingClientRect(); push({ ...hsv, h: clamp((e.clientX - r.left) / r.width, 0, 1) * 359.9 }); };
  const bind = (fn) => ({ onPointerDown: (e) => { e.currentTarget.setPointerCapture(e.pointerId); fn(e); }, onPointerMove: (e) => { if (e.buttons) fn(e); } });
  const areaKey = (e) => { const st = e.shiftKey ? 0.1 : 0.01; const m = { ArrowRight: ['s', st], ArrowLeft: ['s', -st], ArrowUp: ['v', st], ArrowDown: ['v', -st] }[e.key]; if (!m) return; e.preventDefault(); push({ ...hsv, [m[0]]: clamp(hsv[m[0]] + m[1], 0, 1) }); };
  const hueKey = (e) => { const st = e.shiftKey ? 10 : 1; const d = { ArrowRight: st, ArrowUp: st, ArrowLeft: -st, ArrowDown: -st }[e.key]; if (d == null) return; e.preventDefault(); push({ ...hsv, h: (hsv.h + d + 360) % 360 }); };
  return (
    <div className="vui-color">
      <div ref={area} className="vui-color__area" style={{ background: 'hsl(' + hsv.h + ' 100% 50%)' }} {...bind(dragArea)}>
        <span role="slider" tabIndex={0} aria-label="Saturation and brightness" aria-valuetext={'Saturation ' + Math.round(hsv.s * 100) + '%, brightness ' + Math.round(hsv.v * 100) + '%'} className="vui-color__thumb" style={{ left: hsv.s * 100 + '%', top: (1 - hsv.v) * 100 + '%', background: hsvToHex(hsv) }} onKeyDown={areaKey} />
      </div>
      <div ref={hue} className="vui-color__hue" {...bind(dragHue)}>
        <span role="slider" tabIndex={0} aria-label="Hue" aria-valuemin={0} aria-valuemax={360} aria-valuenow={Math.round(hsv.h)} className="vui-color__hthumb" style={{ left: (hsv.h / 360) * 100 + '%', background: 'hsl(' + hsv.h + ' 100% 50%)' }} onKeyDown={hueKey} />
      </div>
      <div className="vui-color__row">
        <span className="vui-color__preview" style={{ background: hex }} />
        <Control size="sm" style={{ flex: 1 }}>
          <span className="vui-control__affix">#</span>
          <input className="vui-control__input vui-color__hex" aria-label="Hex colour" value={text.replace('#', '')} maxLength={6} spellCheck={false}
            onChange={(e) => { const v = '#' + e.target.value.replace(/[^0-9a-f]/gi, ''); setText(v); if (hexToHsv(v) && v.length === 7) { setHsv(hexToHsv(v)); onChange(v.toLowerCase()); } }}
            onBlur={() => setText(hex)} />
        </Control>
      </div>
      {swatches && swatches.length > 0 && (
        <div className="vui-color__swatches" role="listbox" aria-label="Presets">
          {swatches.map((s) => <button key={s} type="button" role="option" aria-selected={s.toLowerCase() === hex.toLowerCase()} aria-label={s} className="vui-swatch vui-swatch--fill" style={{ '--swatch': s }} onClick={() => { setHsv(hexToHsv(s)); onChange(s.toLowerCase()); }} />)}
        </div>
      )}
    </div>
  );
}
export function ColorPicker({ label, value, defaultValue = '#8b0036', onChange: onChangeProp, onValueChange, swatches = DEFAULT_SWATCHES, inline = false, variant = 'full', showValue = true, disabled, className }) {
  const onChange = onChangeProp || onValueChange;
  const [inner, setInner] = React.useState(defaultValue);
  const cur = value !== undefined ? value : inner;
  const set = (v) => { if (value === undefined) setInner(v); onChange && onChange(v); };
  const [open, setOpen] = React.useState(false);
  const wrap = React.useRef(null);
  React.useEffect(() => {
    if (!open) return;
    const h = (e) => { if (wrap.current && !wrap.current.contains(e.target)) setOpen(false); };
    const k = (e) => { if (e.key === 'Escape') { setOpen(false); wrap.current.querySelector('button').focus(); } };
    document.addEventListener('mousedown', h); window.addEventListener('keydown', k);
    return () => { document.removeEventListener('mousedown', h); window.removeEventListener('keydown', k); };
  }, [open]);
  if (variant === 'swatches') return (
    <div className={cx('vui-cswatch', disabled && 'vui-cswatch--disabled', className)}>
      {label && <FieldLabel>{label}</FieldLabel>}
      <div className="vui-cswatch__row">
        <div className="vui-cswatch__grid" role="radiogroup" aria-label={label || 'Colour'}>
          {swatches.map((s) => { const on = s.toLowerCase() === cur.toLowerCase(); return (
            <button key={s} type="button" role="radio" aria-checked={on} aria-label={s} disabled={disabled} className="vui-swatch vui-swatch--lg" style={{ '--swatch': s }} onClick={() => set(s.toLowerCase())}>
              {on && <Glyph name="check" />}
            </button>
          ); })}
        </div>
        {showValue && (
          <div className="vui-cswatch__val">
            <span className="vui-swatch" style={{ '--swatch': cur }} />
            <div><div className="vui-cswatch__k">Selected</div><div className="vui-cswatch__hex">{cur.toUpperCase()}</div></div>
          </div>
        )}
      </div>
    </div>
  );
  if (inline) return <div className={className}>{label && <FieldLabel as="div" style={{ marginBottom: 8 }}>{label}</FieldLabel>}<Panel hex={cur} onChange={set} swatches={swatches} /></div>;
  return (
    <div className={cx('vui-field', className)}>
      {label && <FieldLabel>{label}</FieldLabel>}
      <span ref={wrap} className="vui-popover-wrap">
        <button type="button" className="vui-control vui-color__trigger" disabled={disabled} aria-haspopup="dialog" aria-expanded={open} aria-label={(label || 'Colour') + ': ' + cur} onClick={() => setOpen(!open)}>
          <span className="vui-swatch" style={{ '--swatch': cur }} />
          <span className="vui-color__value">{cur.toUpperCase()}</span>
          <Glyph name="chevron-down" />
        </button>
        {open && <div className="vui-popover vui-color__pop" role="dialog" aria-label="Colour picker"><Panel hex={cur} onChange={set} swatches={swatches} /></div>}
      </span>
    </div>
  );
}
