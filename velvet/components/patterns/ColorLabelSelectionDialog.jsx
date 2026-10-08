import React from 'react';
import { Spinner } from '../feedback/Spinner.jsx';
import { Chip } from '../forms/Chip.jsx';
import { SearchInput } from '../forms/SearchInput.jsx';
import { EmptyText } from '../primitives/EmptyText.jsx';
import { Button } from '../actions/Button.jsx';
import { Glyph } from '../primitives/Glyph.jsx';
import { Dialog } from '../feedback/Dialog.jsx';
import { LABEL_COLORS } from './ColorLabelManager.jsx';
import { cx } from '../primitives/cx.js';
const norm = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
export function ColorLabelSelectionDialog({ open, onClose, labels = [], value = [], onSubmit, onCreate, onManage, max, title = 'Labels', description, submitLabel = 'Apply', cancelLabel = 'Cancel', searchable, colors = LABEL_COLORS, emptyText = 'No labels yet.' }) {
  const [sel, setSel] = React.useState(value);
  const [q, setQ] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState(null);
  const [creating, setCreating] = React.useState(false);
  const input = React.useRef(null);
  React.useEffect(() => { if (open) { setSel(value); setQ(''); setErr(null); setBusy(false); } }, [open]);
  const showSearch = searchable ?? (labels.length > 7 || !!onCreate);
  const list = q ? labels.filter((l) => norm(l.name).includes(norm(q))) : labels;
  const exact = labels.some((l) => norm(l.name) === norm(q.trim()));
  const full = max != null && sel.length >= max;
  const dirty = sel.length !== value.length || sel.some((x) => !value.includes(x));
  const toggle = (id) => { if (busy) return; setErr(null); setSel((s) => (s.includes(id) ? s.filter((x) => x !== id) : max === 1 ? [id] : full ? s : [...s, id])); };
  const create = async () => {
    const name = q.trim(); if (!name || exact || !onCreate || creating) return;
    setCreating(true); setErr(null);
    try { const l = await onCreate({ name, color: colors[labels.length % colors.length] }); if (l && l.id && !(max != null && sel.length >= max && max !== 1)) setSel((s) => (max === 1 ? [l.id] : [...s, l.id])); setQ(''); input.current && input.current.focus(); }
    catch (e) { setErr((e && e.message) || 'Couldn’t create “' + name + '”.'); }
    finally { setCreating(false); }
  };
  const submit = async () => {
    if (busy || !dirty) return; setBusy(true); setErr(null);
    try { await (onSubmit && onSubmit(sel)); setBusy(false); onClose && onClose(); }
    catch (e) { setBusy(false); setErr((e && e.message) || 'Couldn’t apply labels — your selection is kept.'); }
  };
  const footer = (
    <>
      {onManage && <Button variant="ghost" size="sm" iconLeft="settings" className="vui-cls__manage" disabled={busy} onClick={onManage}>Manage labels</Button>}
      <Button variant="secondary" disabled={busy} onClick={onClose}>{cancelLabel}</Button>
      <Button loading={busy} disabled={!dirty} onClick={submit}>{busy ? 'Applying…' : submitLabel}</Button>
    </>
  );
  return (
    <Dialog open={open} onClose={busy ? undefined : onClose} dismissible={!busy} title={title} description={description} size="sm" className="vui-cls" footer={footer}>
      {showSearch && (
        <div className="vui-cls__search"><SearchInput size="sm" inputRef={input} value={q} onValueChange={setQ} placeholder={onCreate ? 'Search or create…' : 'Search labels…'} aria-label="Search labels" disabled={busy}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); if (list.length === 1 && !onCreate) toggle(list[0].id); else if (!exact && q.trim()) create(); else if (list.length === 1) toggle(list[0].id); } }} /></div>
      )}
      <div className="vui-cls__meta"><span>{sel.length ? sel.length + ' selected' : 'None selected'}{max != null && max > 1 ? ' · max ' + max : ''}</span>{sel.length > 0 && max !== 1 && <Button variant="link" size="xs" disabled={busy} onClick={() => setSel([])}>Clear</Button>}</div>
      <div className="vui-cls__chips" role="group" aria-label={typeof title === 'string' ? title : 'Labels'}>
        {list.map((l) => {
          const on = sel.includes(l.id); const off = !on && full && max !== 1;
          return (
            <Chip key={l.id} role={max === 1 ? 'radio' : 'checkbox'} selected={on} color={l.color} count={l.count} disabled={busy || off} title={off ? 'Limit of ' + max + ' reached' : undefined} onClick={() => toggle(l.id)}>{l.name}</Chip>
          );
        })}
        {onCreate && q.trim() && !exact && (
          <Chip dashed check={false} icon={creating ? <Spinner size="inline" tone="current" /> : 'plus'} disabled={creating || busy} onClick={create}>Create “{q.trim()}”</Chip>
        )}
        {!list.length && !(onCreate && q.trim()) && <EmptyText as="p" align="start" className="vui-cls__empty">{q ? 'No labels match “' + q + '”.' : emptyText}</EmptyText>}
      </div>
      {err && <div className="vui-confirm__err" role="alert"><Glyph name="alert-circle" />{err}</div>}
    </Dialog>
  );
}
