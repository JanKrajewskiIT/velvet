import React from 'react';
import { Glyph } from '../primitives/Glyph.jsx';
import { Chevron } from '../primitives/Chevron.jsx';
import { Menu } from './Menu.jsx';
import { cx } from '../primitives/cx.js';
const norm = (o) => (typeof o === 'string' ? { value: o, label: o } : o);
export function MenuChip({ label, options = [], value, defaultValue = null, onValueChange, allowClear = true, clearLabel = 'Any', icon, className }) {
  const opts = options.map(norm);
  const [inner, setInner] = React.useState(defaultValue);
  const cur = value !== undefined ? value : inner;
  const set = (v) => { if (value === undefined) setInner(v); onValueChange && onValueChange(v); };
  const sel = opts.find((o) => o.value === cur);
  const items = [...(allowClear ? [{ label: clearLabel, checked: cur == null, onSelect: () => set(null) }, { divider: true }] : []), ...opts.map((o) => ({ label: o.label, icon: o.icon, checked: cur === o.value, onSelect: () => set(o.value) }))];
  return (
    <Menu items={items} className={className} trigger={
      <button type="button" className={cx('vui-chip', 'vui-chip--menu', sel && 'vui-chip--on')}>
        {icon && <Glyph name={icon} />}
        <span className="vui-chip__key">{label}{sel ? ':' : ''}</span>{sel && <span>{sel.label}</span>}
        <Chevron className="vui-chip__caret" />
      </button>} />
  );
}
