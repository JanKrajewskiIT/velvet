import React from 'react';
import { Control } from '../primitives/Control.jsx';
import { IconButton } from '../actions/IconButton.jsx';
import { Glyph } from '../primitives/Glyph.jsx';
import { cx } from '../primitives/cx.js';
export function InlineEdit({ value, defaultValue = '', onSave, placeholder = 'Click to add…', label, size = 'md', validate, disabled, className }) {
  const [inner, setInner] = React.useState(defaultValue);
  const cur = value !== undefined ? value : inner;
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(cur);
  const [err, setErr] = React.useState();
  const [saved, setSaved] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const input = React.useRef(null);
  const btn = React.useRef(null);
  React.useEffect(() => { if (editing && input.current) { input.current.focus(); input.current.select(); } }, [editing]);
  const start = () => { if (disabled) return; setDraft(cur); setErr(); setEditing(true); };
  const cancel = () => { setEditing(false); setErr(); requestAnimationFrame(() => btn.current && btn.current.focus()); };
  const save = async () => {
    if (busy || disabled) return;
    const v = draft.trim();
    const e = validate && validate(v);
    if (e) { setErr(e); return; }
    if (v !== cur) {
      setBusy(true);
      try { await (onSave && onSave(v)); } catch (x) { setBusy(false); setErr((x && x.message) || 'Couldn’t save — try again.'); return; }
      setBusy(false); if (value === undefined) setInner(v); setSaved(true); setTimeout(() => setSaved(false), 1200);
    }
    setEditing(false);
    requestAnimationFrame(() => btn.current && btn.current.focus());
  };
  if (!editing) {
    return (
      <button ref={btn} type="button" className={cx('vui-inline-edit', 'vui-inline-edit--' + size, !cur && 'vui-inline-edit--empty', saved && 'vui-inline-edit--saved', className)} onClick={start} disabled={disabled} aria-label={label ? label + ': ' + (cur || 'empty') + '. Click to edit' : undefined}>
        <span className="vui-inline-edit__text">{cur || placeholder}</span>
        <Glyph name={(saved ? 'check' : 'pencil')} className="vui-inline-edit__icon" />
      </button>
    );
  }
  return (
    <div className={cx('vui-inline-edit__form', 'vui-inline-edit--' + size, className)}>
      <Control size={size === 'sm' ? 'sm' : 'md'} invalid={!!(err)} style={{ flex: 1 }}>
        <input ref={input} className="vui-control__input" value={draft} aria-label={label} aria-invalid={!!err || undefined} readOnly={disabled || busy} aria-busy={busy || undefined}
          onChange={(e) => { setDraft(e.target.value); err && setErr(); }}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); save(); } else if (e.key === 'Escape') { e.preventDefault(); cancel(); } }}
          onBlur={() => { if (!disabled) save(); }} />
      </Control>
      {!disabled && <IconButton icon="check" label="Save" variant="primary" size="sm" disabled={busy} aria-busy={busy || undefined} onMouseDown={(e) => e.preventDefault()} onClick={save} />}
      <IconButton icon="x" label="Cancel" variant="secondary" size="sm" disabled={busy} onMouseDown={(e) => e.preventDefault()} onClick={cancel} />
      {err && <span className="vui-hint vui-hint--error vui-inline-edit__err" role="alert">{err}</span>}
    </div>
  );
}
