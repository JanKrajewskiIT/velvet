import React from 'react';
import { Glyph } from '../primitives/Glyph.jsx';
import { cx } from '../primitives/cx.js';
import { Avatar } from '../data/Avatar.jsx';
import { Menu } from '../menus/Menu.jsx';
function MenuBar({ items, active, go, label }) {
  const found = items.findIndex((it) => it.id === active);
  const idx = Math.max(0, found);
  return (
    <nav className="vui-navbar__menubar" aria-label={label}>
      <ul className="vui-navbar__menulist" style={{ '--nb-i': idx }}>
        {items.map((it) => (
          <li key={it.id} className={cx('vui-navbar__mitem', active === it.id && 'vui-navbar__mitem--active')}>
            <a href={it.href || '#' + it.id} className="vui-navbar__mlink" aria-label={it.label} title={it.label} aria-current={active === it.id ? 'page' : undefined} onClick={(e) => go(e, it)}>
              <Glyph name={fill(it.icon || 'circle', active === it.id)} className="vui-navbar__micon" />
            </a>
          </li>
        ))}
        {found >= 0 && <li className="vui-navbar__indicator" aria-hidden="true"><span className="vui-navbar__ring" /></li>}
      </ul>
    </nav>
  );
}
const FILLED = ['home','bell','user','folder','bookmark','heart','message-square','star'];
const fill = (n, on) => (on && FILLED.includes(n) ? n + '-filled' : n);
export function Navbar({ variant = 'links', brand, logo, items = [], active, onNavigate, actions, showActiveLabel = true, activeLabel, condensed = false, tone = 'default', sticky = false, label = 'Main', logoHref, onLogoClick, className }) {
  const [open, setOpen] = React.useState(false);
  const go = (e, it) => { if (onNavigate) { e.preventDefault(); onNavigate(it.id); } setOpen(false); };
  const link = (it) => (
    <a key={it.id} href={it.href || '#' + it.id} className="vui-navbar__link" aria-current={active === it.id ? 'page' : undefined} onClick={(e) => go(e, it)}>
      {it.icon && <Glyph name={it.icon} />}{it.label}
    </a>
  );
  const burger = <button type="button" className="vui-navbar__burger" aria-expanded={open} aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen(!open)}><Glyph name={(open ? 'x' : 'menu')} /></button>;
  if (variant === 'menubar') {
    const cur = items.find((it) => it.id === active);
    const lbl = activeLabel ?? (cur && cur.label);
    return (
      <div className={cx('vui-navbar-mb', condensed && 'vui-navbar-mb--condensed', sticky && 'vui-navbar--sticky', className)}>
        <header className="vui-navbar-mb__bar">
          <div className="vui-navbar-mb__brand">
            {logo != null && (logoHref ? <a href={logoHref} className="vui-navbar-mb__logo" onClick={onLogoClick ? (e) => { e.preventDefault(); onLogoClick(); } : undefined}>{logo}</a> : <span className="vui-navbar-mb__logo">{logo}</span>)}
            {brand}
            {showActiveLabel && lbl && <span className="vui-navbar-mb__label">{lbl}</span>}
          </div>
          <MenuBar items={items} active={active} go={go} label={label} />
          <div className="vui-navbar-mb__actions">{actions}{burger}</div>
        </header>
        {open && <nav className="vui-navbar-mb__overlay" aria-label={label + ' (mobile)'}>{items.map((it) => <a key={it.id} href={it.href || '#' + it.id} className="vui-navbar-mb__olink" aria-current={active === it.id ? 'page' : undefined} onClick={(e) => go(e, it)}>{it.icon && <Glyph name={it.icon} />}<span>{it.label}</span></a>)}</nav>}
      </div>
    );
  }
  return (
    <header className={cx('vui-navbar', tone === 'brand' && 'vui-navbar--brand', sticky && 'vui-navbar--sticky', condensed && 'vui-navbar--condensed', open && 'vui-navbar--open', className)}>
      <div className="vui-navbar__bar">
        {brand && <div className="vui-navbar__brand">{brand}</div>}
        <nav className="vui-navbar__nav" aria-label={label}>{items.map(link)}</nav>
        <div className="vui-navbar__actions">{actions}</div>
        {burger}
      </div>
      {open && <nav className="vui-navbar__panel" aria-label={label + ' (mobile)'}>{items.map(link)}</nav>}
    </header>
  );
}
export function NavbarLocale({ value = 'PL', onClick, label = 'Change language' }) {
  return <button type="button" className="vui-navbar-mb__locale" aria-label={label} onClick={onClick}>{value}</button>;
}
/** Account pill for the menubar's actions slot: avatar + name → Menu (profile, settings, sign out…). */
export function NavbarUser({ name, src, items = [], showName = true, label = 'Account menu', width = 220 }) {
  const trigger = (
    <button type="button" className="vui-navbar-mb__user" aria-label={label + (name ? ' — ' + name : '')}>
      <Avatar name={name} src={src} size="sm" tone="neutral" />
      {showName && name && <span className="vui-navbar-mb__user-name">{String(name).split(' ')[0]}</span>}
      <Glyph name="chevron-down" />
    </button>
  );
  return <Menu trigger={trigger} items={items} align="end" width={width} />;
}
