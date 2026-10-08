import React from 'react';
import { IconButton } from '../actions/IconButton.jsx';
import { ListItem } from '../primitives/ListItem.jsx';
import { EmptyText } from '../primitives/EmptyText.jsx';
import { Control } from '../primitives/Control.jsx';
import { FieldLabel } from '../primitives/Field.jsx';
import { Button } from '../actions/Button.jsx';
import { Glyph } from '../primitives/Glyph.jsx';
import { Dialog } from '../feedback/Dialog.jsx';
import { cx } from '../primitives/cx.js';
export const LABEL_COLORS = ['var(--dv-1)', 'var(--dv-2)', 'var(--dv-3)', 'var(--dv-4)', 'var(--dv-5)', 'var(--dv-6)', 'var(--dv-7)', 'var(--dv-8)'];
export function ColorLabelManager({ open, onClose, labels = [], onChange, colors = LABEL_COLORS, title = 'Manage labels' }) {
  const [form, setForm] = React.useState(null); // { id?, name, color }
  const [confirm, setConfirm] = React.useState(null);
  const [err, setErr] = React.useState(null);
  const [busy, setBusy] = React.useState(false);
  const [opErr, setOpErr] = React.useState(null);
  const commit = async (next) => { if (busy) return false; setBusy(true); setOpErr(null); try { await (onChange && onChange(next)); return true; } catch (e) { setOpErr((e && e.message) || 'Couldn’t save labels — try again.'); return false; } finally { setBusy(false); } };
  const nameRef = React.useRef(null);
  React.useEffect(() => { if (form && nameRef.current) nameRef.current.focus({ preventScroll: true }); }, [form && form.id, !!form]);
  React.useEffect(() => { if (!open) { setForm(null); setConfirm(null); setErr(null); setOpErr(null); } }, [open]);
  const exists = (n, id) => labels.some((l) => l.id !== id && l.name.trim().toLowerCase() === n.trim().toLowerCase());
  const startAdd = () => { setConfirm(null); setErr(null); setForm({ name: '', color: colors[labels.length % colors.length] }); };
  const startEdit = (l) => { setConfirm(null); setErr(null); setForm({ id: l.id, name: l.name, color: l.color }); };
  const save = async () => {
    const n = form.name.trim(); if (!n || busy) return;
    if (exists(n, form.id)) { setErr('“' + n + '” already exists'); return; }
    const ok = await commit(form.id ? labels.map((l) => (l.id === form.id ? { ...l, name: n, color: form.color } : l)) : [...labels, { id: 'l' + Date.now(), name: n, color: form.color }]);
    if (ok) { setForm(null); setErr(null); }
  };
  const footer = form ? (
    <>
      <Button variant="secondary" onClick={() =>{ setForm(null); setErr(null); }}>Cancel</Button>
      <Button onClick={save} disabled={!form.name.trim() || busy} aria-busy={busy || undefined}>{busy ? 'Saving…' : 'Save'}</Button>
    </>
  ) : (
    <Button variant="secondary" iconLeft="plus" className="vui-clm__add" onClick={startAdd}>Add label</Button>
  );
  return (
    <Dialog open={open} onClose={onClose} title={title} size="sm" className="vui-clm" footer={footer}>
      {opErr && <div className="vui-confirm__err" role="alert" style={{ marginBottom: 10 }}><Glyph name="alert-circle" />{opErr}</div>}
      <ul className="vui-clm__list">
        {labels.map((l) => (
          <li key={l.id} className="vui-clm__item">
            <ListItem size="sm" className={cx('vui-clm__row', form && form.id === l.id && 'vui-clm__row--editing')}
              leading={<span className="vui-clm__dot" style={{ background: l.color }} aria-hidden="true" />}
              title={l.name}
              trailing={<>
                {l.count != null && <span className="vui-clm__count">{l.count}</span>}
                <IconButton icon="pencil" label={'Edit ' + l.name} size="xs" onClick={() => startEdit(l)} />
                <IconButton icon="trash-2" label={'Delete ' + l.name} size="xs" className="vui-clm__del" aria-expanded={confirm === l.id} onClick={() => { setForm(null); setConfirm(confirm === l.id ? null : l.id); }} />
              </>} />
            {confirm === l.id && (
              <div className="vui-clm__confirm" role="alert">
                <span className="vui-clm__q">Delete “{l.name}”?{l.count ? ' Removes it from ' + l.count + ' items.' : ''}</span>
                <Button variant="ghost" size="xs" onClick={() => setConfirm(null)} autoFocus>Cancel</Button>
                <Button variant="danger" size="xs" loading={busy} onClick={async () => { if (await commit(labels.filter((x) => x.id !== l.id))) setConfirm(null); }}>Delete</Button>
              </div>
            )}
          </li>
        ))}
        {!labels.length && <EmptyText as="li" className="vui-clm__empty">No labels yet — add your first below.</EmptyText>}
      </ul>
      {form && (
        <div className="vui-clm__form">
          <div className="vui-field">
            <FieldLabel htmlFor="vui-clm-name">{form.id ? 'Rename' : 'Name'}</FieldLabel>
            <Control invalid={!!(err)}><input ref={nameRef} id="vui-clm-name" className="vui-control__input" placeholder="e.g. Urgent" value={form.name} onChange={(e) => { setForm({ ...form, name: e.target.value }); setErr(null); }} onKeyDown={(e) => { if (e.key === 'Enter') save(); }} aria-invalid={!!err || undefined} /></Control>
            {err && <span className="vui-hint vui-hint--error" role="alert">{err}</span>}
          </div>
          <div className="vui-field">
            <FieldLabel id="vui-clm-color">Color</FieldLabel>
            <div className="vui-clm__swatches" role="radiogroup" aria-labelledby="vui-clm-color">
              {colors.map((c, i) => <button key={c} type="button" role="radio" aria-checked={c === form.color} aria-label={'Colour ' + (i + 1)} className="vui-clm__sw" style={{ background: c }} onClick={() => setForm({ ...form, color: c })} />)}
            </div>
          </div>
        </div>
      )}
    </Dialog>
  );
}
