import React from 'react';
import { FieldLabel } from '../primitives/Field.jsx';
import { Control } from '../primitives/Control.jsx';
import { Glyph } from '../primitives/Glyph.jsx';
import { cx } from '../primitives/cx.js';
export function CopyButton({ value, label = 'Copy', copiedLabel = 'Copied', iconOnly = false, variant = 'secondary', size = 'sm', onCopy, className }) {
  const [done, setDone] = React.useState(false);
  const t = React.useRef(null);
  const copy = async () => {
    const v = typeof value === 'function' ? value() : value;
    try { await navigator.clipboard.writeText(String(v ?? '')); } catch (e) { const ta = document.createElement('textarea'); ta.value = v; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); } catch (_) {} ta.remove(); }
    setDone(true); onCopy && onCopy(v); clearTimeout(t.current); t.current = setTimeout(() => setDone(false), 1600);
  };
  React.useEffect(() => () => clearTimeout(t.current), []);
  return (
    <button type="button" className={cx('vui-btn', 'vui-btn--' + variant, size !== 'md' && 'vui-btn--' + size, iconOnly && 'vui-btn--icon', 'vui-copy', done && 'vui-copy--done', className)} onClick={copy} aria-label={iconOnly ? (done ? copiedLabel : label) : undefined} title={iconOnly ? label : undefined}>
      <span className="vui-copy__icons" aria-hidden="true"><Glyph name="copy" className="vui-copy__a" /><Glyph name="check" className="vui-copy__b" /></span>
      {!iconOnly && <span>{done ? copiedLabel : label}</span>}
      <span className="vui-sr-only" aria-live="polite">{done ? copiedLabel : ''}</span>
    </button>
  );
}
export function CopyField({ value, label, mono = true, className }) {
  return (
    <div className={cx('vui-field', className)}>
      {label && <FieldLabel>{label}</FieldLabel>}
      <Control readOnly className="vui-copyfield">
        <input className={cx('vui-control__input', mono && 'vui-copyfield__mono')} value={value} readOnly aria-label={label} onFocus={(e) => e.target.select()} />
        <CopyButton value={value} iconOnly variant="ghost" />
      </Control>
    </div>
  );
}
