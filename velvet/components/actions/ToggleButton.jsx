import React from 'react';
import { Glyph } from '../primitives/Glyph.jsx';
import { cx } from '../primitives/cx.js';
const FILLED = ['home','bell','user','folder','bookmark','heart','message-square','star'];
const fill = (n, on) => (on && FILLED.includes(n) ? n + '-filled' : n);
export const toggleCtx = React.createContext(null);
export function ToggleButton({ pressed, defaultPressed = false, onPressedChange, value, icon, size = 'md', tone = 'brand', iconOnly, label, disabled, className, children, ...rest }) {
  const g = React.useContext(toggleCtx);
  const [inner, setInner] = React.useState(defaultPressed);
  const on = g ? g.isOn(value) : pressed !== undefined ? pressed : inner;
  const sz = g && g.size ? g.size : size;
  const flip = () => { if (g) return g.toggle(value); const n = !on; if (pressed === undefined) setInner(n); onPressedChange && onPressedChange(n); };
  const only = iconOnly ?? (!children && !!icon);
  return (
    <button type="button" aria-pressed={on} aria-label={only ? label : undefined} title={only ? label : undefined} disabled={disabled || (g && g.disabled)}
      className={cx('vui-toggle', sz !== 'md' && 'vui-toggle--' + sz, only && 'vui-toggle--icon', tone !== 'brand' && 'vui-toggle--' + tone, className)} onClick={flip} {...rest}>
      {typeof icon === 'string' ? <Glyph name={fill(icon, on)} /> : icon || null}
      {children}
    </button>
  );
}
