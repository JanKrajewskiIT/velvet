import React from 'react';
import { cx } from '../primitives/cx.js';
import { Glyph } from '../primitives/Glyph.jsx';
const KEY = 'vui-theme';
const SUN = <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.7" />{[0, 45, 90, 135, 180, 225, 270, 315].map((r) => <rect key={r} x="11.1" y="1.3" width="1.8" height="3.4" rx="0.9" transform={'rotate(' + r + ' 12 12)'} />)}</svg>;
const MOON = <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 14.2A8.4 8.4 0 1 1 10 3.6a0.9 0.9 0 0 1 1.1 1.2 6.6 6.6 0 0 0 8.3 8.3 0.9 0.9 0 0 1 1.1 1.1z" /></svg>;
const SUN_O = <Glyph name="sun" />;
const MOON_O = <Glyph name="moon" />;
const SYS_O = <Glyph name="monitor" />;
const mq = () => (typeof matchMedia !== 'undefined' ? matchMedia('(prefers-color-scheme: dark)') : null);
const stored = () => { try { return localStorage.getItem(KEY) || 'system'; } catch (e) { return 'system'; } };
const current = () => (typeof document !== 'undefined' && document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');
export function ThemeToggle({ value, onChange: onChangeProp, onValueChange, variant = 'light', appearance = 'rings', size = 'md', lightLabel = 'Light', darkLabel = 'Dark', systemLabel = 'System', showSystem, label = 'Color theme', className }) {
  const onChange = onChangeProp || onValueChange;
  const withSys = showSystem ?? appearance === 'segmented';
  const read = () => (withSys && stored() === 'system' ? 'system' : current());
  const [own, setOwn] = React.useState(read);
  const [pop, setPop] = React.useState(null);
  const controlled = value !== undefined;
  const theme = controlled ? value : own;
  const opts = withSys ? ['light', 'system', 'dark'] : ['light', 'dark'];
  React.useEffect(() => {
    if (controlled) return;
    const mo = new MutationObserver(() => setOwn(read()));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => mo.disconnect();
  }, [controlled]);
  const pick = (t) => {
    if (t === theme) return;
    setPop(t);
    if (!controlled) {
      if (window.vuiSetTheme) window.vuiSetTheme(t);
      else { const m = mq(); document.documentElement.dataset.theme = t === 'system' ? (m && m.matches ? 'dark' : 'light') : t; try { localStorage.setItem(KEY, t); } catch (e) {} }
      setOwn(t);
    }
    onChange && onChange(t);
  };
  const keys = (e) => { if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) { e.preventDefault(); const d = e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 1; const t = opts[(opts.indexOf(theme) + d + opts.length) % opts.length]; pick(t); e.currentTarget.querySelector('[data-set="' + t + '"]').focus(); } };
  const btn = (t, icon, lbl) => (
    <button type="button" role="radio" data-set={t} className={cx('vui-tt__btn', pop === t && 'vui-tt__btn--pop')} aria-checked={theme === t} aria-label={lbl} title={lbl} tabIndex={theme === t ? 0 : -1} onClick={() => pick(t)}>{icon}</button>
  );
  return (
    <div role="radiogroup" aria-label={label} className={cx('vui-tt', 'vui-tt--' + variant, appearance === 'segmented' && 'vui-tt--seg', size === 'sm' && 'vui-tt--sm', className)} onKeyDown={keys}>
      {btn('light', appearance === 'segmented' ? SUN_O : SUN, lightLabel)}
      {withSys && btn('system', SYS_O, systemLabel)}
      {btn('dark', appearance === 'segmented' ? MOON_O : MOON, darkLabel)}
    </div>
  );
}
