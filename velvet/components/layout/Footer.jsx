import React from 'react';
import { Badge } from '../display/Badge.jsx';
import { Dot } from '../primitives/Dot.jsx';
import { Glyph } from '../primitives/Glyph.jsx';
import { cx } from '../primitives/cx.js';
const Ext = () => <Glyph name="external-link" className="vui-footer__ext" />;
function FLink({ l, small }) {
  return (
    <a className={cx('vui-footer__link', small && 'vui-footer__link--sm')} href={l.href || '#'} target={l.external ? '_blank' : undefined} rel={l.external ? 'noreferrer' : undefined} aria-current={l.current ? 'page' : undefined}>
      {l.label}{l.external && <Ext />}{l.badge && <Badge size="sm" tone="brand" className="vui-footer__badge">{l.badge}</Badge>}
    </a>
  );
}
function Brand({ brand, mark, compact }) {
  if (!brand && !mark) return null;
  const m = mark ?? (typeof brand === 'string' ? brand.trim()[0] : null);
  return (
    <span className={cx('vui-footer__brand', compact && 'vui-footer__brand--sm')}>
      {m != null && <span className="vui-footer__mark" aria-hidden="true">{m}</span>}
      {brand && <span className="vui-footer__name">{brand}</span>}
    </span>
  );
}
const STATUS = { ok: ['success', 'All systems operational'], degraded: ['warning', 'Degraded performance'], down: ['danger', 'Service disruption'] };
function Status({ status }) {
  if (!status) return null;
  const s = typeof status === 'string' ? { state: status } : status;
  const [tone, text] = STATUS[s.state] || STATUS.ok;
  return <a className="vui-footer__status" href={s.href || '#'}><Dot tone={tone} />{s.label || text}</a>;
}
export function Footer({ variant = 'full', surface = 'card', brand, mark, description, columns = [], social = [], legal = [], copyright, meta, status, cta, end, className }) {
  if (variant === 'compact') return (
    <footer className={cx('vui-footer', 'vui-footer--compact', 'vui-footer--' + surface, className)}>
      <div className="vui-footer__left"><Brand brand={brand} mark={mark} compact />{copyright && <span className="vui-footer__copy">{copyright}</span>}{meta && <span className="vui-footer__meta">{meta}</span>}</div>
      <Status status={status} />
      {legal.length > 0 && <nav className="vui-footer__legal" aria-label="Footer">{legal.map((l) => <FLink key={l.label} l={l} small />)}</nav>}
      {end && <div className="vui-footer__end">{end}</div>}
    </footer>
  );
  return (
    <footer className={cx('vui-footer', 'vui-footer--' + surface, className)}>
      <div className="vui-footer__main" style={{ '--cols': columns.length }}>
        <div className="vui-footer__intro">
          <Brand brand={brand} mark={mark} />
          {description && <p className="vui-footer__desc">{description}</p>}
          {cta && <div className="vui-footer__cta">{cta}</div>}
          {social.length > 0 && (
            <ul className="vui-footer__social" aria-label="Social">
              {social.map((s) => <li key={s.label}><a href={s.href || '#'} className="vui-footer__soc" aria-label={s.label} title={s.label} target={s.href && /^https?:/.test(s.href) ? '_blank' : undefined} rel="noreferrer"><Glyph name={s.icon} /></a></li>)}
            </ul>
          )}
        </div>
        {columns.map((c) => (
          <nav key={c.title} className="vui-footer__col" aria-label={c.title}>
            <details className="vui-footer__group" open>
              <summary className="vui-footer__heading">{c.title}<Glyph name="chevron-down" /></summary>
              <ul>{c.links.map((l) => <li key={l.label}><FLink l={l} /></li>)}</ul>
            </details>
          </nav>
        ))}
      </div>
      <div className="vui-footer__bar">
        {copyright && <span className="vui-footer__copy">{copyright}</span>}
        {legal.length > 0 && <nav className="vui-footer__legal" aria-label="Legal">{legal.map((l) => <FLink key={l.label} l={l} small />)}</nav>}
        <div className="vui-footer__end"><Status status={status} />{end}</div>
      </div>
    </footer>
  );
}
