import React from 'react';
import { EmptyText } from '../primitives/EmptyText.jsx';
import { FieldLabel } from '../primitives/Field.jsx';
import { Button } from '../actions/Button.jsx';
import { Glyph } from '../primitives/Glyph.jsx';
import { Markdown } from './Markdown.jsx';
import { Dialog } from '../feedback/Dialog.jsx';
import { cx } from '../primitives/cx.js';
import { Segmented, SegmentedItem } from '../primitives/Segmented.jsx';
const MOD = typeof navigator !== 'undefined' && /Mac|iP/.test(navigator.platform) ? '⌘' : 'Ctrl+';
// wrap = inline marker around selection · line = prefix every selected line · block = fenced
const TOOLS = [
  { id: 'h', label: 'Heading', glyph: 'H', line: '## ' },
  { id: 'b', label: 'Bold', icon: 'bold', wrap: '**', key: 'b' },
  { id: 'i', label: 'Italic', icon: 'italic', wrap: '*', key: 'i' },
  { id: 's', label: 'Strikethrough', icon: 'strikethrough', wrap: '~~' },
  '|',
  { id: 'ul', label: 'Bulleted list', icon: 'list', line: '- ' },
  { id: 'ol', label: 'Numbered list', icon: 'list-ordered', line: '1. ' },
  { id: 'task', label: 'Checklist', icon: 'check-circle', line: '- [ ] ' },
  { id: 'q', label: 'Quote', glyph: '“', line: '> ' },
  '|',
  { id: 'code', label: 'Inline code', icon: 'code', wrap: '`', key: 'e' },
  { id: 'link', label: 'Link', icon: 'link', key: 'k' },
  { id: 'pre', label: 'Code block', glyph: '{ }', block: true },
];
function apply(t, v, s, e) {
  const sel = v.slice(s, e);
  if (t.wrap) {
    const w = t.wrap, on = v.slice(s - w.length, s) === w && v.slice(e, e + w.length) === w;
    if (on) return [v.slice(0, s - w.length) + sel + v.slice(e + w.length), s - w.length, e - w.length];
    const txt = sel || t.label.toLowerCase();
    return [v.slice(0, s) + w + txt + w + v.slice(e), s + w.length, s + w.length + txt.length];
  }
  if (t.id === 'link') { const txt = sel || 'link text'; const out = '[' + txt + '](https://)'; return [v.slice(0, s) + out + v.slice(e), s + txt.length + 3, s + txt.length + 11]; }
  if (t.block) { const txt = sel || 'code'; const pre = (s > 0 && v[s - 1] !== '\n' ? '\n' : '') + '```\n'; return [v.slice(0, s) + pre + txt + '\n```\n' + v.slice(e), s + pre.length, s + pre.length + txt.length]; }
  const ls = v.lastIndexOf('\n', s - 1) + 1, le = e + (v.slice(e).indexOf('\n') + 1 || v.length - e + 1) - 1;
  const lines = v.slice(ls, le).split('\n');
  const all = lines.every((l) => l.startsWith(t.line));
  const out = lines.map((l, i) => (all ? l.slice(t.line.length) : (t.id === 'ol' ? i + 1 + '. ' : t.line) + l.replace(/^(#{1,6} |> |- \[[ x]\] |[-*+] |\d+[.)] )/, ''))).join('\n');
  return [v.slice(0, ls) + out + v.slice(le), ls, ls + out.length];
}
export function MarkdownEditor({ value, defaultValue = '', onChange: onChangeProp, onValueChange, label, hint, error, placeholder = 'Write in Markdown…', mode, defaultMode = 'split', onModeChange, height = 280, maxLength, disabled, readOnly, autoFocus, toolbar = true, previewEmpty = 'Nothing to preview yet.', className, id, onKeyDown }) {
  const onChange = onChangeProp || onValueChange;
  const auto = React.useId(); const fid = id || auto;
  const [inner, setInner] = React.useState(defaultValue);
  const v = value !== undefined ? value : inner;
  const [mInner, setMInner] = React.useState(defaultMode);
  const m = mode ?? mInner;
  const setMode = (x) => { if (mode === undefined) setMInner(x); onModeChange && onModeChange(x); };
  const deferred = React.useDeferredValue(v);
  const ta = React.useRef(null);
  const pending = React.useRef(null);
  const set = (next, sel) => { if (maxLength && next.length > maxLength) next = next.slice(0, maxLength); if (value === undefined) setInner(next); onChange && onChange(next); if (sel) pending.current = sel; };
  React.useLayoutEffect(() => { const el = ta.current; if (pending.current && el) { el.focus({ preventScroll: true }); el.setSelectionRange(pending.current[0], pending.current[1]); pending.current = null; } });
  const run = (t) => { const el = ta.current; if (!el || disabled || readOnly) return; const [n, a, b] = apply(t, v, el.selectionStart, el.selectionEnd); set(n, [a, b]); };
  const keys = (e) => {
    onKeyDown && onKeyDown(e); if (e.defaultPrevented) return;
    const el = e.currentTarget;
    if ((e.metaKey || e.ctrlKey) && !e.shiftKey && !e.altKey) { const t = TOOLS.find((x) => x.key === e.key.toLowerCase()); if (t) { e.preventDefault(); run(t); return; } }
    if (e.key === 'Enter' && !e.shiftKey && !e.metaKey && !e.ctrlKey && el.selectionStart === el.selectionEnd) {
      const s = el.selectionStart, ls = v.lastIndexOf('\n', s - 1) + 1, line = v.slice(ls, s);
      const mm = line.match(/^(\s*)(- \[[ x]\] |[-*+] |(\d+)([.)]) |> )/);
      if (mm) {
        e.preventDefault();
        if (line.trim() === mm[2].trim()) { set(v.slice(0, ls) + v.slice(s), [ls, ls]); return; }
        const nx = mm[3] ? mm[1] + (+mm[3] + 1) + mm[4] + ' ' : mm[1] + mm[2].replace('[x]', '[ ]');
        set(v.slice(0, s) + '\n' + nx + v.slice(s), [s + 1 + nx.length, s + 1 + nx.length]);
      }
    }
    if (e.key === 'Tab' && !e.metaKey && !e.ctrlKey) {
      const s = el.selectionStart, ls = v.lastIndexOf('\n', s - 1) + 1;
      if (/^\s*([-*+]|\d+[.)])\s/.test(v.slice(ls))) { e.preventDefault(); if (e.shiftKey) { if (v.startsWith('  ', ls)) set(v.slice(0, ls) + v.slice(ls + 2), [s - 2, s - 2]); } else set(v.slice(0, ls) + '  ' + v.slice(ls), [s + 2, s + 2]); }
    }
  };
  const words = (v.trim().match(/\S+/g) || []).length;
  const showWrite = m !== 'preview', showPrev = m !== 'write';
  return (
    <div className={cx('vui-field', 'vui-mde-field', className)}>
      {label && <FieldLabel htmlFor={fid}>{label}</FieldLabel>}
      <div className={cx('vui-mde', 'vui-mde--' + m, error && 'vui-mde--invalid', disabled && 'vui-mde--disabled')} style={{ '--mde-h': typeof height === 'number' ? height + 'px' : height }}>
        <div className="vui-mde__bar">
          <Segmented size="sm" className="vui-mde__tabs" role="tablist" aria-label="Editor view">
            {[['write', 'Write'], ['split', 'Split'], ['preview', 'Preview']].map(([k, l]) => <SegmentedItem key={k} role="tab" selected={m === k} onClick={() => setMode(k)}>{l}</SegmentedItem>)}
          </Segmented>
          {toolbar && showWrite && !readOnly && (
            <div className="vui-mde__tools" role="toolbar" aria-label="Formatting" aria-controls={fid}>
              {TOOLS.map((t, i) => (t === '|' ? <span key={i} className="vui-mde__sep" aria-hidden="true" /> : (
                <button key={t.id} type="button" className="vui-mde__tool" disabled={disabled} title={t.label + (t.key ? ' (' + MOD + t.key.toUpperCase() + ')' : '')} aria-label={t.label} onMouseDown={(e) => e.preventDefault()} onClick={() => run(t)}>
                  {t.icon ? <Glyph name={t.icon} /> : <span className="vui-mde__glyph" aria-hidden="true">{t.glyph}</span>}
                </button>
              )))}
            </div>
          )}
        </div>
        <div className="vui-mde__panes">
          {showWrite && <textarea ref={ta} id={fid} className="vui-mde__input" value={v} placeholder={placeholder} disabled={disabled} readOnly={readOnly} autoFocus={autoFocus} spellCheck aria-invalid={!!error || undefined} aria-describedby={fid + '-foot'} onChange={(e) => set(e.target.value)} onKeyDown={keys} />}
          {showPrev && <div className="vui-mde__preview" aria-label="Preview" tabIndex={m === 'preview' ? 0 : -1}>{deferred.trim() ? <Markdown source={deferred} size="sm" /> : <EmptyText as="p" align="start" className="vui-mde__empty">{previewEmpty}</EmptyText>}</div>}
        </div>
        <div className="vui-mde__foot" id={fid + '-foot'}>
          <span className="vui-mde__md"><span className="vui-mde__mdmark" aria-hidden="true">M↓</span>Markdown supported</span>
          <span className="vui-mde__count">{words} {words === 1 ? 'word' : 'words'}{maxLength ? ' · ' + v.length + '/' + maxLength : ''}</span>
        </div>
      </div>
      {(error || hint) && <span className={cx('vui-hint', error && 'vui-hint--error')} role={error ? 'alert' : undefined}>{error || hint}</span>}
    </div>
  );
}
export function MarkdownEditDialog({ open, onClose, title = 'Edit', description, value = '', onSave, saveLabel = 'Save', cancelLabel = 'Cancel', defaultMode = 'split', height = 340, maxLength, placeholder, size = 'lg', confirmDiscard = true }) {
  const [draft, setDraft] = React.useState(value);
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState(null);
  const [ask, setAsk] = React.useState(false);
  React.useEffect(() => { if (open) { setDraft(value); setErr(null); setAsk(false); setBusy(false); } }, [open]);
  const dirty = draft !== value;
  const close = () => { if (busy) return; if (dirty && confirmDiscard && !ask) { setAsk(true); return; } onClose && onClose(); };
  const save = async () => {
    if (busy || !dirty) return; setBusy(true); setErr(null);
    try { await (onSave && onSave(draft)); setBusy(false); onClose && onClose(); }
    catch (e) { setBusy(false); setErr((e && e.message) || 'Couldn’t save. Your changes are kept — try again.'); }
  };
  const footer = ask ? (
    <div className="vui-mde-dlg__ask" role="alert">
      <span>Discard unsaved changes?</span>
      <Button variant="ghost" size="sm" onClick={() =>setAsk(false)} autoFocus>Keep editing</Button>
      <Button variant="danger" size="sm" onClick={() =>onClose && onClose()}>Discard</Button>
    </div>
  ) : (
    <>
      {err && <span className="vui-mde-dlg__err" role="alert"><Glyph name="alert-circle" />{err}</span>}
      <span className="vui-mde-dlg__kbd">{MOD}↵ to save</span>
      <Button variant="secondary" onClick={close} disabled={busy}>{cancelLabel}</Button>
      <button type="button" className="vui-btn vui-btn--primary" onClick={save} disabled={!dirty || busy} aria-busy={busy || undefined}>{busy && <span className="vui-loader vui-loader--ring vui-loader--sm vui-loader--current" aria-hidden="true" />}{busy ? 'Saving…' : saveLabel}</button>
    </>
  );
  return (
    <Dialog open={open} onClose={close} title={title} description={description} size={size} className="vui-mde-dlg" footer={footer}>
      <MarkdownEditor value={draft} onChange={(x) => { setDraft(x); setAsk(false); }} defaultMode={defaultMode} height={height} maxLength={maxLength} placeholder={placeholder} disabled={busy} autoFocus onKeyDown={(e) => { if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') { e.preventDefault(); save(); } }} />
    </Dialog>
  );
}
