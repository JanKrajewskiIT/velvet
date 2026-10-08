import React from 'react';
import { Indicator } from '../primitives/Indicator.jsx';
import { Glyph } from '../primitives/Glyph.jsx';
import { cx } from '../primitives/cx.js';
const FILLED = ['home','bell','user','folder','bookmark','heart','message-square','star'];
const fill = (n, on) => (on && FILLED.includes(n) ? n + '-filled' : n);
export function BottomNav({ items = [], value, defaultValue, onChange: onChangeProp, onValueChange, action, fixed = true, label = 'Primary', className }) {
  const onChange = onChangeProp || onValueChange;
  const [inner, setInner] = React.useState(defaultValue ?? (items[0] && items[0].value));
  const cur = value !== undefined ? value : inner;
  const mid = action ? Math.ceil(items.length / 2) : -1;
  const item = (it) => {
    const on = cur === it.value;
    const El = it.href ? 'a' : 'button';
    return (
      <El key={it.value} href={it.href} type={it.href ? undefined : 'button'} aria-current={on ? 'page' : undefined} className={cx('vui-bottomnav__item', on && 'vui-bottomnav__item--on')}
        onClick={(e) => { if (value === undefined) setInner(it.value); onChange && onChange(it.value, e); }}>
        <Indicator className="vui-bottomnav__icon" count={typeof it.badge === 'number' || (typeof it.badge === 'string' && it.badge !== '') ? it.badge : null} dot={it.badge != null && it.badge !== false && !(typeof it.badge === 'number' || (typeof it.badge === 'string' && it.badge !== ''))}><Glyph name={fill(it.icon, on)} /></Indicator>
        <span className="vui-bottomnav__label">{it.label}</span>
      </El>
    );
  };
  return (
    <nav aria-label={label} className={cx('vui-bottomnav', fixed && 'vui-bottomnav--fixed', className)}>
      {items.slice(0, mid < 0 ? items.length : mid).map(item)}
      {action && <button type="button" className="vui-bottomnav__action" aria-label={action.label} onClick={action.onClick}><Glyph name={(action.icon || 'plus')} /></button>}
      {mid >= 0 && items.slice(mid).map(item)}
    </nav>
  );
}
