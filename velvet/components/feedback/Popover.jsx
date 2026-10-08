import React from 'react';
import { cx } from '../primitives/cx.js';
export function Popover({ trigger, title, children, side = 'bottom', align = 'start', open, defaultOpen = false, onOpenChange, openOn = 'click', openDelay = 350, closeDelay = 150, className }) {
  const [inner, setInner] = React.useState(defaultOpen);
  const isOpen = open !== undefined ? open : inner;
  const set = (v) => { if (open === undefined) setInner(v); onOpenChange && onOpenChange(v); };
  const wrap = React.useRef(null);
  const id = React.useId();
  const timer = React.useRef(null);
  const hover = openOn === 'hover';
  const later = (v, ms) => { clearTimeout(timer.current); timer.current = setTimeout(() => set(v), ms); };
  React.useEffect(() => () => clearTimeout(timer.current), []);
  const hoverProps = hover ? { onMouseEnter: () => later(true, openDelay), onMouseLeave: () => later(false, closeDelay), onFocus: () => later(true, 0), onBlur: (e) => { if (!e.currentTarget.contains(e.relatedTarget)) later(false, closeDelay); } } : {};
  React.useEffect(() => {
    if (!isOpen) return;
    const down = (e) => { if (wrap.current && !wrap.current.contains(e.target)) set(false); };
    const key = (e) => { if (e.key === 'Escape') { set(false); const b = wrap.current && wrap.current.querySelector('[aria-haspopup]'); b && b.focus(); } };
    document.addEventListener('mousedown', down); window.addEventListener('keydown', key);
    return () => { document.removeEventListener('mousedown', down); window.removeEventListener('keydown', key); };
  }, [isOpen]);
  const trig = React.isValidElement(trigger)
    ? React.cloneElement(trigger, { 'aria-haspopup': 'dialog', 'aria-expanded': isOpen, 'aria-controls': id, onClick: (e) => { trigger.props.onClick && trigger.props.onClick(e); if (!hover) set(!isOpen); } })
    : <button type="button" aria-haspopup="dialog" aria-expanded={isOpen} aria-controls={id} onClick={() => { if (!hover) set(!isOpen); }}>{trigger}</button>;
  return (
    <span ref={wrap} className={cx('vui-popover-wrap', hover && 'vui-popover-wrap--hover', className)} {...hoverProps}>
      {trig}
      {isOpen && (
        <div id={id} role="dialog" aria-label={typeof title === 'string' ? title : undefined} className={cx('vui-popover', side === 'top' && 'vui-popover--top', align === 'end' && 'vui-popover--end')}>
          {title && <div className="vui-popover__title">{title}</div>}
          <div className="vui-popover__body">{children}</div>
        </div>
      )}
    </span>
  );
}
