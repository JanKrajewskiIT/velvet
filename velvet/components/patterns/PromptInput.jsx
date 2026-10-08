import React from 'react';
import { IconButton } from '../actions/IconButton.jsx';
import { Glyph } from '../primitives/Glyph.jsx';
import { cx } from '../primitives/cx.js';
export function PromptInput({ value, defaultValue = '', onValueChange, onSubmit, onStop, loading = false, placeholder = 'Ask anything…', maxRows = 8, attachments = [], onAttach, onRemoveAttachment, suggestions, onSuggestion, toolbar, hint, disabled, autoFocus, label = 'Message', className }) {
  const [inner, setInner] = React.useState(defaultValue);
  const v = value !== undefined ? value : inner;
  const set = (x) => { if (value === undefined) setInner(x); onValueChange && onValueChange(x); };
  const ref = React.useRef(null);
  React.useLayoutEffect(() => {
    const el = ref.current; if (!el) return;
    const cs = getComputedStyle(el); const lh = parseFloat(cs.lineHeight) || 22; const pad = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
    el.style.height = 'auto';
    const max = maxRows * lh + pad;
    el.style.height = Math.min(el.scrollHeight, max) + 'px';
    el.style.overflowY = el.scrollHeight > max ? 'auto' : 'hidden';
  }, [v, maxRows]);
  const canSend = !disabled && !loading && (v.trim() !== '' || attachments.length > 0);
  const send = () => { if (!canSend) return; onSubmit && onSubmit(v.trim(), attachments); set(''); };
  const onKey = (e) => { if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); send(); } else if (e.key === 'Escape' && loading && onStop) { e.preventDefault(); onStop(); } };
  return (
    <div className={cx('vui-prompt', disabled && 'vui-prompt--disabled', className)}>
      {suggestions && suggestions.length > 0 && !v && !attachments.length && (
        <div className="vui-prompt__sugs">{suggestions.map((s) => <button type="button" key={s} className="vui-prompt__sug" onClick={() => { onSuggestion ? onSuggestion(s) : set(s); ref.current && ref.current.focus(); }}>{s}</button>)}</div>
      )}
      <div className="vui-prompt__box" onMouseDown={(e) => { if (e.target === e.currentTarget) { e.preventDefault(); ref.current && ref.current.focus(); } }}>
        {attachments.length > 0 && (
          <div className="vui-prompt__files">{attachments.map((a) => (
            <span key={a.id ?? a.name} className="vui-prompt__file"><Glyph name={a.icon || 'file-text'} /><span>{a.name}</span>{a.size && <small>{a.size}</small>}
              {onRemoveAttachment && <button type="button" className="vui-prompt__fx" aria-label={'Remove ' + a.name} onClick={() => onRemoveAttachment(a)}><Glyph name="x" /></button>}
            </span>
          ))}</div>
        )}
        <textarea ref={ref} rows={1} className="vui-prompt__input" value={v} placeholder={placeholder} aria-label={label} disabled={disabled} autoFocus={autoFocus} onChange={(e) => set(e.target.value)} onKeyDown={onKey} />
        <div className="vui-prompt__bar">
          {onAttach && <IconButton icon="paperclip" label="Attach files" size="sm" variant="ghost" onClick={onAttach} disabled={disabled} />}
          {toolbar}
          <span className="vui-prompt__hint">{hint ?? (loading ? 'Esc to stop' : '↵ send · ⇧↵ new line')}</span>
          {loading
            ? <IconButton icon="stop" label="Stop generating" size="sm" variant="secondary" shape="circle" onClick={onStop} />
            : <IconButton icon="arrow-up" label="Send" size="sm" variant="primary" shape="circle" disabled={!canSend} onClick={send} />}
        </div>
      </div>
    </div>
  );
}
