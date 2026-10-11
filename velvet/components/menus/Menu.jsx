import React from 'react';
import { Kbd } from '../primitives/Kbd.jsx';
import { Button } from '../actions/Button.jsx';
import { SectionLabel } from '../primitives/SectionLabel.jsx';
import { Glyph, renderIcon } from '../primitives/Glyph.jsx';
import { cx } from '../primitives/cx.js';
export function MenuPanel({ items = [], onClose, style, className, autoFocus = true, iconPosition = 'start' }) {
  const ref = React.useRef(null);
  const id = React.useId();
  const [active, setActive] = React.useState(-1);
  const typed = React.useRef({ s: '', t: 0 });
  const nav = items.map((it, i) => ({ it, i })).filter(({ it }) => !it.divider && !it.section && !it.disabled);
  React.useEffect(() => { if (autoFocus && ref.current) { ref.current.focus({ preventScroll: true }); setActive(nav[0] ? nav[0].i : -1); } }, []);
  React.useEffect(() => {
    const el = active >= 0 && document.getElementById(id + '-' + active);
    const ul = ref.current;
    if (el && ul && (el.offsetTop < ul.scrollTop || el.offsetTop + el.offsetHeight > ul.scrollTop + ul.clientHeight)) ul.scrollTop = el.offsetTop - 8;
  }, [active]);
  const move = (d) => { if (!nav.length) return; const p = nav.findIndex((n) => n.i === active); const n = p < 0 ? (d > 0 ? nav[0] : nav[nav.length - 1]) : nav[(p + d + nav.length) % nav.length]; setActive(n.i); };
  const choose = (it) => { if (!it || it.disabled || it.divider || it.section) return; it.onSelect && it.onSelect(); if (!it.keepOpen) onClose && onClose(true); };
  const onKey = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); move(1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
    else if (e.key === 'Home') { e.preventDefault(); nav[0] && setActive(nav[0].i); }
    else if (e.key === 'End') { e.preventDefault(); nav.length && setActive(nav[nav.length - 1].i); }
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choose(items[active]); }
    else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); onClose && onClose(true); }
    else if (e.key === 'Tab') onClose && onClose(false);
    else if (e.key.length === 1 && !e.metaKey && !e.ctrlKey) {
      const now = Date.now(); const t = typed.current; t.s = (now - t.t > 600 ? '' : t.s) + e.key.toLowerCase(); t.t = now;
      const hit = nav.find(({ it }) => String(it.label).toLowerCase().startsWith(t.s)); hit && setActive(hit.i);
    }
  };
  return (
    <div ref={ref} role="menu" tabIndex={-1} aria-activedescendant={active >= 0 ? id + '-' + active : undefined} className={cx('vui-menu', className)} style={style} onKeyDown={onKey}>
      {items.map((it, i) => {
        if (it.divider) return <div key={i} role="separator" className="vui-menu__sep" />;
        if (it.section) return <SectionLabel key={i} role="presentation" className="vui-menu__section">{it.section}</SectionLabel>;
        const check = it.checked !== undefined;
        return (
          <div key={i} id={id + '-' + i} role={check ? 'menuitemcheckbox' : 'menuitem'} aria-checked={check ? !!it.checked : undefined} aria-disabled={it.disabled || undefined}
            className={cx('vui-menu__item', i === active && 'vui-menu__item--active', it.danger && 'vui-menu__item--danger')}
            onMouseEnter={() => !it.disabled && setActive(i)} onMouseDown={(e) => e.preventDefault()} onClick={() => choose(it)}>
            {check ? <span className="vui-menu__check">{it.checked && <Glyph name="check" />}</span> : iconPosition === 'start' && renderIcon(it.icon)}
            <span className="vui-menu__label">{it.label}{it.description && <span className="vui-menu__desc">{it.description}</span>}</span>
            {it.shortcut && <Kbd plain className="vui-menu__kbd">{it.shortcut}</Kbd>}
            {!check && iconPosition === 'end' && renderIcon(it.icon)}
          </div>
        );
      })}
    </div>
  );
}
export function Menu({ trigger, items = [], align = 'start', side = 'bottom', open, defaultOpen = false, onOpenChange, width, className, iconPosition = 'start' }) {
  const [inner, setInner] = React.useState(defaultOpen);
  const isOpen = open !== undefined ? open : inner;
  const wrap = React.useRef(null);
  const set = (v) => { if (open === undefined) setInner(v); onOpenChange && onOpenChange(v); };
  const close = (refocus) => { set(false); if (refocus) { const b = wrap.current && wrap.current.querySelector('[aria-haspopup="menu"]'); b && b.focus({ preventScroll: true }); } };
  React.useEffect(() => {
    if (!isOpen) return;
    const h = (e) => { if (wrap.current && !wrap.current.contains(e.target)) set(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [isOpen]);
  const tp = { 'aria-haspopup': 'menu', 'aria-expanded': isOpen,
    onClick: (e) => { trigger.props && trigger.props.onClick && trigger.props.onClick(e); set(!isOpen); },
    onKeyDown: (e) => { if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && !isOpen) { e.preventDefault(); set(true); } } };
  const trig = React.isValidElement(trigger) ? React.cloneElement(trigger, tp) : <Button variant="secondary" {...tp}>{trigger}</Button>;
  return (
    <span ref={wrap} className={cx('vui-menu-wrap', className)}>
      {trig}
      {isOpen && <MenuPanel items={items} iconPosition={iconPosition} onClose={close} className={cx('vui-menu--pop', align === 'end' && 'vui-menu--end', side === 'top' && 'vui-menu--top')} style={width ? { minWidth: width } : undefined} />}
    </span>
  );
}
