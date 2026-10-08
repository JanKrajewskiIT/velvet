import React from 'react';
import { cx } from '../primitives/cx.js';
const Star = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.2l2.6 5.5 6 .8-4.4 4.1 1.1 5.9L12 16.6l-5.3 2.9 1.1-5.9-4.4-4.1 6-.8z" strokeWidth="1.75" strokeLinejoin="round" /></svg>
);
export function Rating({ value, defaultValue = 0, onValueChange, max = 5, readOnly = false, size = 'md', showValue = false, label = 'Rating', className }) {
  const [inner, setInner] = React.useState(defaultValue);
  const cur = value !== undefined ? value : inner;
  const [hover, setHover] = React.useState(0);
  const refs = React.useRef([]);
  const shown = hover || cur;
  const set = (v) => { if (readOnly) return; if (value === undefined) setInner(v); onValueChange && onValueChange(v); };
  const onKey = (e) => {
    let v = cur;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') v = Math.min(max, cur + 1);
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') v = Math.max(1, cur - 1);
    else if (e.key === 'Home') v = 1; else if (e.key === 'End') v = max; else return;
    e.preventDefault(); set(v); refs.current[v - 1] && refs.current[v - 1].focus();
  };
  if (readOnly) {
    return (
      <span className={cx('vui-rating', 'vui-rating--' + size, 'vui-rating--readonly', className)} role="img" aria-label={label + ': ' + cur + ' of ' + max}>
        {Array.from({ length: max }).map((_, i) => <span key={i} className={cx('vui-rating__star', i < Math.round(cur) && 'vui-rating__star--on')}><Star /></span>)}
        {showValue && <span className="vui-rating__value">{Number(cur).toFixed(1)}</span>}
      </span>
    );
  }
  return (
    <span className={cx('vui-rating', 'vui-rating--' + size, className)} role="radiogroup" aria-label={label} onMouseLeave={() => setHover(0)} onKeyDown={onKey}>
      {Array.from({ length: max }).map((_, i) => (
        <button key={i} ref={(el) => (refs.current[i] = el)} type="button" role="radio" aria-checked={cur === i + 1} aria-label={i + 1 + ' of ' + max} tabIndex={(cur || 1) === i + 1 ? 0 : -1}
          className={cx('vui-rating__star', i < shown && 'vui-rating__star--on', hover && i < hover && 'vui-rating__star--preview')}
          onMouseEnter={() => setHover(i + 1)} onClick={() => set(cur === i + 1 ? 0 : i + 1)}>
          <Star />
        </button>
      ))}
      {showValue && <span className="vui-rating__value">{Number(shown).toFixed(1)} <span>/ {max}</span></span>}
    </span>
  );
}
