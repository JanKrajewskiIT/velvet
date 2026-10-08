import React from 'react';
import { Glyph } from '../primitives/Glyph.jsx';
import { Chevron } from '../primitives/Chevron.jsx';
import { cx } from '../primitives/cx.js';
export function Accordion({ items = [], multiple = false, value, defaultValue, onValueChange, variant = 'separated', gap, animated = variant === 'elevated', className }) {
  const [inner, setInner] = React.useState(defaultValue ?? []);
  const open = value !== undefined ? value : inner;
  const id = React.useId();
  const refs = React.useRef([]);
  const toggle = (k) => { const on = open.includes(k); const next = on ? open.filter((x) => x !== k) : multiple ? [...open, k] : [k]; if (value === undefined) setInner(next); onValueChange && onValueChange(next); };
  const onKey = (e, i) => {
    const n = items.length; let j = null;
    if (e.key === 'ArrowDown') j = (i + 1) % n; else if (e.key === 'ArrowUp') j = (i - 1 + n) % n; else if (e.key === 'Home') j = 0; else if (e.key === 'End') j = n - 1;
    if (j != null) { e.preventDefault(); refs.current[j] && refs.current[j].focus(); }
  };
  return (
    <div className={cx('vui-accordion', 'vui-accordion--' + variant, gap && 'vui-accordion--gap-' + gap, animated && 'vui-accordion--animated', className)}>
      {items.map((it, i) => {
        const k = it.value ?? String(i); const on = open.includes(k);
        return (
          <div key={k} data-tone={it.tone} className={cx('vui-accordion__item', on && 'vui-accordion__item--open', it.disabled && 'vui-accordion__item--disabled', it.tone && 'vui-accordion__item--toned')} style={animated ? { '--acc-i': i } : undefined}>
            <h3 className="vui-accordion__h">
              <button ref={(el) => (refs.current[i] = el)} type="button" id={id + '-b' + i} aria-expanded={on} aria-controls={id + '-p' + i} disabled={it.disabled} className="vui-accordion__trigger" onClick={() => toggle(k)} onKeyDown={(e) => onKey(e, i)}>
                {it.icon && <Glyph name={it.icon} />}
                <span className="vui-accordion__title">{it.title}{it.subtitle && <span className="vui-accordion__sub">{it.subtitle}</span>}</span>
                {it.meta && <span className="vui-accordion__meta">{it.meta}</span>}
                <Chevron open={on} className="vui-accordion__chev" />
              </button>
            </h3>
            <div id={id + '-p' + i} role="region" aria-labelledby={id + '-b' + i} className="vui-accordion__panel" aria-hidden={!on || undefined}>
              <div className="vui-accordion__inner">{variant === 'elevated' && <div className="vui-accordion__sep" aria-hidden="true" />}<div className="vui-accordion__content">{it.content}</div></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
