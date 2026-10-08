import React from 'react';
import { Tag } from '../display/Tag.jsx';
import { Control } from '../primitives/Control.jsx';
import { FieldLabel, FieldHint } from '../primitives/Field.jsx';
import { cx } from '../primitives/cx.js';
export function TagInput({ label, hint, error, optional, value, defaultValue, onValueChange, placeholder = 'Add…', max, separators = ['Enter', ','], transform, size = 'md', disabled, id, className }) {
  const autoId = React.useId();
  const fid = id || autoId;
  const hintId = fid + '-hint';
  const [inner, setInner] = React.useState(defaultValue ?? []);
  const tags = value !== undefined ? value : inner;
  const [text, setText] = React.useState('');
  const [dupe, setDupe] = React.useState(null);
  const input = React.useRef(null);
  const set = (v) => { if (value === undefined) setInner(v); onValueChange && onValueChange(v); };
  const full = max != null && tags.length >= max;
  const add = (raw) => {
    const parts = raw.split(',').map((s) => (transform ? transform(s.trim()) : s.trim())).filter(Boolean);
    let next = [...tags];
    for (const p of parts) {
      if (max != null && next.length >= max) break;
      const hit = next.findIndex((t) => t.toLowerCase() === p.toLowerCase());
      if (hit >= 0) { setDupe(hit); setTimeout(() => setDupe(null), 600); continue; }
      next.push(p);
    }
    if (next.length !== tags.length) set(next);
    setText('');
  };
  const remove = (i) => { set(tags.filter((_, j) => j !== i)); input.current && input.current.focus(); };
  const onKey = (e) => {
    if (separators.includes(e.key) && text.trim()) { e.preventDefault(); add(text); }
    else if (e.key === 'Backspace' && !text && tags.length) { e.preventDefault(); remove(tags.length - 1); }
  };
  return (
    <div className="vui-field">
      {label && <FieldLabel htmlFor={fid} optional={optional}>{label}</FieldLabel>}
      <Control invalid={!!(error)} disabled={disabled} className={cx('vui-taginput', size === 'sm' && 'vui-taginput--sm', className)} onMouseDown={(e) => { if (e.target === e.currentTarget) { e.preventDefault(); input.current && input.current.focus(); } }}>
        {tags.map((t, i) => (
          <Tag key={t + i} size="sm" className={cx('vui-taginput__tag', dupe === i && 'vui-taginput__tag--dupe')} disabled={disabled} removeLabel={'Remove ' + t} onRemove={() => remove(i)}>{t}</Tag>
        ))}
        <input ref={input} id={fid} className="vui-taginput__input" value={text} disabled={disabled || full} placeholder={full ? '' : tags.length ? '' : placeholder}
          aria-describedby={error || hint ? hintId : undefined} aria-invalid={!!error || undefined}
          onChange={(e) => { const v = e.target.value; if (v.includes(',') && separators.includes(',')) add(v); else setText(v); }}
          onKeyDown={onKey} onBlur={() => text.trim() && add(text)} onPaste={(e) => { const t = e.clipboardData.getData('text'); if (/[,\n]/.test(t)) { e.preventDefault(); add(t.replace(/\n/g, ',')); } }} />
      </Control>
      {(error || hint || max != null) && (
        <div className="vui-field__foot">
          <FieldHint id={hintId} error={!!error}>{error || hint}</FieldHint>
          {max != null && <span className={cx('vui-hint', 'vui-field__count', full && 'vui-field__count--max')}>{tags.length}/{max}</span>}
        </div>
      )}
    </div>
  );
}
