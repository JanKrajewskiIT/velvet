import React from 'react';
import { SectionLabel } from '../primitives/SectionLabel.jsx';
import { Count } from '../primitives/Count.jsx';
import { Chevron } from '../primitives/Chevron.jsx';
import { Glyph, renderIcon } from '../primitives/Glyph.jsx';
import { cx } from '../primitives/cx.js';
const Ctx = React.createContext({ collapsed: false });
export function Sidebar({ brand, brandCollapsed, footer, collapsed = false, onCollapsedChange, variant = 'floating', className, children }) {
  const showHead = brand || brandCollapsed || onCollapsedChange;
  return (
    <Ctx.Provider value={{ collapsed, expand: onCollapsedChange ? () => onCollapsedChange(false) : null }}>
      <aside className={cx('vui-sidebar', 'vui-sidebar--' + variant, collapsed && 'vui-sidebar--collapsed', className)}>
        {showHead && (
          <div className="vui-sidebar__head">
            {collapsed ? (brandCollapsed && !onCollapsedChange ? <div className="vui-sidebar__brand vui-sidebar__brand--mark">{brandCollapsed}</div> : null) : brand && <div className="vui-sidebar__brand">{brand}</div>}
            {onCollapsedChange && (
              <button type="button" className="vui-sidebar__toggle" aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} title={collapsed ? 'Expand' : 'Collapse'} aria-expanded={!collapsed} onClick={() => onCollapsedChange(!collapsed)}>
                <Glyph name="chevrons-left" />
              </button>
            )}
          </div>
        )}
        <nav className="vui-sidebar__nav">{children}</nav>
        {footer && <div className="vui-sidebar__footer">{footer}</div>}
      </aside>
    </Ctx.Provider>
  );
}
export function NavItem({ icon, label, active, end, count, href, subItems, open, defaultOpen, onOpenChange, className, children, onClick, ...rest }) {
  const { collapsed, expand } = React.useContext(Ctx);
  const has = subItems && subItems.length > 0;
  const childActive = has && subItems.some((s) => s.active);
  const [inner, setInner] = React.useState(defaultOpen ?? childActive);
  const isOpen = has && !collapsed && (open !== undefined ? open : inner);
  const setOpen = (v) => { if (open === undefined) setInner(v); onOpenChange && onOpenChange(v); };
  const El = href && !has ? 'a' : 'button';
  const text = label || children;
  const tip = collapsed && typeof text === 'string' ? text : undefined;
  const click = (e) => { if (has) { if (collapsed && expand) { expand(); setOpen(true); } else setOpen(!isOpen); } onClick && onClick(e); };
  return (
    <>
      <El href={El === 'a' ? href : undefined} type={El === 'a' ? undefined : 'button'} aria-current={active && !has ? 'page' : undefined} aria-expanded={has ? isOpen : undefined} aria-label={tip} data-tip={tip}
        className={cx('vui-nav-item', (active || (collapsed && childActive)) && 'vui-nav-item--active', count != null && 'vui-nav-item--has-count', isOpen && 'vui-nav-item--open', className)} onClick={click} {...rest}>
        {renderIcon(icon)}
        <span className="vui-nav-item__label">{text}</span>
        {count != null && <Count value={count} tone="neutral" showZero className="vui-nav-item__count" />}
        {end && <span className="vui-nav-item__end">{end}</span>}
        {has && <Chevron direction="right" className="vui-nav-item__caret" />}
      </El>
      {has && (
        <div className={cx('vui-nav-sub', isOpen && 'vui-nav-sub--open')} aria-hidden={!isOpen || undefined}>
          <div className="vui-nav-sub__inner">
            {subItems.map((s, i) => {
              const SEl = s.href ? 'a' : 'button';
              return <SEl key={s.id ?? i} href={s.href} type={s.href ? undefined : 'button'} tabIndex={isOpen ? undefined : -1} aria-current={s.active ? 'page' : undefined} className="vui-nav-sub__link" onClick={s.onClick}>{s.label}</SEl>;
            })}
          </div>
        </div>
      )}
    </>
  );
}
export function NavSection({ children }) {
  return <SectionLabel className="vui-nav-section" role="presentation">{children}</SectionLabel>;
}
