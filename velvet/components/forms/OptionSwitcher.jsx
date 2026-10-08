import React from 'react';
import { Glyph } from '../primitives/Glyph.jsx';
import { cx } from '../primitives/cx.js';
import { Segmented, SegmentedItem } from '../primitives/Segmented.jsx';
const norm = (o) => (typeof o === 'string' ? { value: o, label: o } : o);
export function OptionSwitcher({ options = [], value, defaultValue, onValueChange, variant = 'track', size = 'md', iconOnly = false, label, className }) {
  const opts = options.map(norm);
  const [inner, setInner] = React.useState(defaultValue ?? (opts[0] && opts[0].value));
  const cur = value !== undefined ? value : inner;
  const refs = React.useRef({});
  const set = (v) => { if (value === undefined) setInner(v); onValueChange && onValueChange(v); };
  const onKey = (e) => {
    const en = opts.filter((o) => !o.disabled); let i = en.findIndex((o) => o.value === cur);
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') i = (i + 1) % en.length;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') i = (i - 1 + en.length) % en.length;
    else return;
    e.preventDefault(); set(en[i].value); refs.current[en[i].value] && refs.current[en[i].value].focus();
  };
  if (variant === 'track') return (
    <Segmented role="radiogroup" aria-label={label} onKeyDown={onKey} size={size} iconOnly={iconOnly} className={cx('vui-switcher', className)}>
      {opts.map((o) => {
        const on = cur === o.value;
        const text = typeof o.label === 'string' ? o.label : undefined;
        return (
          <SegmentedItem key={o.value} ref={(el) => (refs.current[o.value] = el)} role="radio" selected={on} tabIndex={on ? 0 : -1} disabled={o.disabled} icon={o.icon}
            aria-label={iconOnly ? text : undefined} title={iconOnly ? text : undefined} onClick={() => set(o.value)}>
            {!iconOnly && o.label}
          </SegmentedItem>
        );
      })}
    </Segmented>
  );
  return (
    <div role="radiogroup" aria-label={label} onKeyDown={onKey} className={cx('vui-switcher', 'vui-switcher--' + variant, size === 'sm' && 'vui-switcher--sm', iconOnly && 'vui-switcher--icons', className)}>
      {opts.map((o) => {
        const on = cur === o.value;
        const text = typeof o.label === 'string' ? o.label : undefined;
        return (
          <button key={o.value} ref={(el) => (refs.current[o.value] = el)} type="button" role="radio" aria-checked={on} tabIndex={on ? 0 : -1} disabled={o.disabled}
            aria-label={iconOnly ? text : undefined} title={iconOnly ? text : undefined}
            className={cx('vui-switcher__opt', on && 'vui-switcher__opt--on')} onClick={() => set(o.value)}>
            {o.icon && <Glyph name={o.icon} />}
            {!iconOnly && (variant === 'tiles' ? <span className="vui-switcher__tlabel">{o.label}</span> : o.label)}
          </button>
        );
      })}
    </div>
  );
}
