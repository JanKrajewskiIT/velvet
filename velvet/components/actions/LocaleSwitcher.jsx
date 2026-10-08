import React from 'react';
import { Glyph } from '../primitives/Glyph.jsx';
import { cx } from '../primitives/cx.js';
export function LocaleSwitcher({ locales = [{ value: 'pl', label: 'PL', name: 'Polski' }, { value: 'en', label: 'EN', name: 'English' }], value, defaultValue, onChange, size = 'sm', className }) {
  const [inner, setInner] = React.useState(defaultValue ?? locales[0].value);
  const cur = value !== undefined ? value : inner;
  const set = (v) => { if (value === undefined) setInner(v); onChange && onChange(v); };
  const idx = Math.max(0, locales.findIndex((l) => l.value === cur));
  return (
    <div role="radiogroup" aria-label="Language" className={cx('vui-locale', size === 'md' && 'vui-locale--md', className)} style={{ '--n': locales.length, '--i': idx }}
      onKeyDown={(e) => { const d = { ArrowRight: 1, ArrowLeft: -1 }[e.key]; if (d) { e.preventDefault(); const n = locales[(idx + d + locales.length) % locales.length]; set(n.value); e.currentTarget.querySelectorAll('button')[(idx + d + locales.length) % locales.length].focus(); } }}>
      <span className="vui-locale__thumb" aria-hidden="true" />
      <Glyph name="languages" className="vui-locale__ic" />
      {locales.map((l) => <button key={l.value} type="button" role="radio" aria-checked={l.value === cur} aria-label={l.name} lang={l.value} tabIndex={l.value === cur ? 0 : -1} className={cx('vui-locale__opt', l.value === cur && 'vui-locale__opt--on')} onClick={() => set(l.value)}>{l.label}</button>)}
    </div>
  );
}
