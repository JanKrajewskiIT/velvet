import React from 'react';
import { renderIcon } from '../primitives/Glyph.jsx';
import { cx } from '../primitives/cx.js';
export function Tabs({ items = [], value, defaultValue, onChange: onChangeProp, onValueChange, variant = 'underline', orientation = 'horizontal', block = false, className, ...rest }) {
  const onChange = onChangeProp || onValueChange;
  const [inner, setInner] = React.useState(defaultValue ?? (items[0] && items[0].value));
  const current = value !== undefined ? value : inner;
  const vertical = orientation === 'vertical' && variant !== 'segmented';
  const listRef = React.useRef(null);
  const [ind, setInd] = React.useState(null);
  const select = (v) => { if (value === undefined) setInner(v); onChange && onChange(v); };
  const measure = React.useCallback(() => {
    const list = listRef.current; if (!list) return;
    const el = list.querySelector('[aria-selected="true"]');
    if (!el) { setInd(null); return; }
    setInd(vertical ? { transform: `translateY(${el.offsetTop}px)`, height: el.offsetHeight } : { transform: `translateX(${el.offsetLeft}px)${variant === 'segmented' ? ` translateY(${el.offsetTop}px)` : ''}`, width: el.offsetWidth });
  }, [vertical, variant]);
  React.useLayoutEffect(measure, [current, items.length, measure]);
  React.useEffect(() => {
    if (typeof ResizeObserver === 'undefined' || !listRef.current) return;
    const ro = new ResizeObserver(measure); ro.observe(listRef.current);
    document.fonts && document.fonts.ready.then(measure);
    return () => ro.disconnect();
  }, [measure]);
  const enabled = items.filter((it) => !it.disabled);
  const onKey = (e) => {
    const keys = vertical ? ['ArrowUp', 'ArrowDown'] : ['ArrowLeft', 'ArrowRight'];
    let idx = enabled.findIndex((it) => it.value === current);
    if (e.key === keys[1]) idx = (idx + 1) % enabled.length;
    else if (e.key === keys[0]) idx = (idx - 1 + enabled.length) % enabled.length;
    else if (e.key === 'Home') idx = 0;
    else if (e.key === 'End') idx = enabled.length - 1;
    else return;
    e.preventDefault();
    const v = enabled[idx].value; select(v);
    const btn = listRef.current && listRef.current.querySelector(`[data-value="${CSS.escape(String(v))}"]`);
    btn && btn.focus();
  };
  return (
    <div ref={listRef} role="tablist" aria-orientation={vertical ? 'vertical' : 'horizontal'} onKeyDown={onKey}
      className={cx('vui-tabs', ind && 'vui-tabs--js', variant === 'segmented' && 'vui-tabs--segmented', vertical && 'vui-tabs--vertical', block && 'vui-tabs--block', className)} {...rest}>
      {ind && <span className="vui-tabs__indicator" style={ind} aria-hidden="true" />}
      {items.map((it) => (
        <button key={it.value} data-value={it.value} role="tab" type="button" aria-selected={current === it.value} tabIndex={current === it.value ? 0 : -1} disabled={it.disabled} className="vui-tab" onClick={() => select(it.value)}>
          {renderIcon(it.icon)}
          {it.label}
          {it.count != null && <span className="vui-tab__count">{it.count}</span>}
        </button>
      ))}
    </div>
  );
}
