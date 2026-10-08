import React from 'react';
import { toggleCtx } from './ToggleButton.jsx';
import { cx } from '../primitives/cx.js';
export function ToggleGroup({ type = 'multiple', value, defaultValue, onValueChange, attached = true, size, disabled, label, className, children }) {
  const multi = type === 'multiple';
  const [inner, setInner] = React.useState(defaultValue ?? (multi ? [] : null));
  const cur = value !== undefined ? value : inner;
  const set = (v) => { if (value === undefined) setInner(v); onValueChange && onValueChange(v); };
  const isOn = (v) => (multi ? (cur || []).includes(v) : cur === v);
  const toggle = (v) => { if (multi) set(isOn(v) ? cur.filter((x) => x !== v) : [...(cur || []), v]); else if (!isOn(v)) set(v); };
  const ref = React.useRef(null);
  const onKey = (e) => {
    const k = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key]; if (!k) return;
    const btns = [...ref.current.querySelectorAll('.vui-toggle:not(:disabled)')]; const i = btns.indexOf(document.activeElement); if (i < 0) return;
    e.preventDefault(); btns[(i + k + btns.length) % btns.length].focus();
  };
  return (
    <toggleCtx.Provider value={{ isOn, toggle, size, disabled }}>
      <div ref={ref} role="group" aria-label={label} onKeyDown={onKey} className={cx('vui-togglegroup', attached && 'vui-togglegroup--attached', !multi && 'vui-togglegroup--single', className)}>{children}</div>
    </toggleCtx.Provider>
  );
}
