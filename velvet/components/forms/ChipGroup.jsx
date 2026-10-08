import React from 'react';
import { Chip } from './Chip.jsx';
import { cx } from '../primitives/cx.js';
const norm = (o) => (typeof o === 'string' ? { value: o, label: o } : o);
export function ChipGroup({ options = [], value, defaultValue, onValueChange, multiple = true, size = 'md', label, className }) {
  const opts = options.map(norm);
  const [inner, setInner] = React.useState(defaultValue ?? (multiple ? [] : null));
  const cur = value !== undefined ? value : inner;
  const isOn = (v) => (multiple ? (cur || []).includes(v) : cur === v);
  const toggle = (v) => {
    const next = multiple ? (isOn(v) ? cur.filter((x) => x !== v) : [...(cur || []), v]) : isOn(v) ? null : v;
    if (value === undefined) setInner(next);
    onValueChange && onValueChange(next);
  };
  return (
    <div role="group" aria-label={label} className={cx('vui-chips', className)}>
      {opts.map((o) => {
        const on = isOn(o.value);
        return (
          <Chip key={o.value} selected={on} disabled={o.disabled} size={size} icon={o.icon} count={o.count} onClick={() => toggle(o.value)}>{o.label}</Chip>
        );
      })}
    </div>
  );
}
