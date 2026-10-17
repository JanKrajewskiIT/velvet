import React from 'react';
import { Tag } from '../display/Tag.jsx';
import { Chevron } from '../primitives/Chevron.jsx';
import { EmptyText } from '../primitives/EmptyText.jsx';
import { Control } from '../primitives/Control.jsx';
import { FieldLabel } from '../primitives/Field.jsx';
import { Checkmark } from '../primitives/Checkmark.jsx';
import { Skeleton } from '../feedback/Skeleton.jsx';
import { Spinner } from '../feedback/Spinner.jsx';
import { Button } from '../actions/Button.jsx';
import { Glyph } from '../primitives/Glyph.jsx';
import { useAsyncOptions } from './Autocomplete.jsx';
import { cx } from '../primitives/cx.js';
const norm = (o) => (typeof o === 'string' ? { value: o, label: o } : o);
export function MultiSelect({ label, hint, error, optional, options = [], value, defaultValue = [], onChange: onChangeProp, onValueChange, loadOptions, placeholder = 'Select…', emptyText = 'No matches.', max, creatable, createLabel = 'Add', size = 'md', disabled, id, className }) {
  const onChange = onChangeProp || onValueChange;
  const autoId = React.useId();
  const fid = id || autoId;
  const listId = fid + '-list';
  const [inner, setInner] = React.useState(defaultValue);
  const cur = value !== undefined ? value : inner;
  const [q, setQ] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState(0);
  const wrap = React.useRef(null);
  const input = React.useRef(null);
  const cache = React.useRef({});
  const local = options.map(norm); local.forEach((o) => (cache.current[o.value] = o));
  const remote = useAsyncOptions(loadOptions, q, open);
  remote.items.forEach((o) => (cache.current[o.value] = o));
  const list = loadOptions ? remote.items : local.filter((o) => !q || String(o.label).toLowerCase().includes(q.toLowerCase()));
  const full = max != null && cur.length >= max;
  const qt = q.trim();
  const lblOf = (v) => String((cache.current[v] && cache.current[v].label) || v).toLowerCase();
  const shown = creatable && qt && !full && ![...list.map((o) => String(o.label).toLowerCase()), ...cur.map(lblOf)].includes(qt.toLowerCase()) ? [...list, { value: qt, label: qt, create: true }] : list;
  const set = (v) => { if (value === undefined) setInner(v); onChange && onChange(v); };
  const toggle = (o) => { if (!o) return; if (o.create) { cache.current[o.value] = { value: o.value, label: o.label }; set([...cur, o.value]); setQ(''); return; } if (cur.includes(o.value)) set(cur.filter((x) => x !== o.value)); else if (!full) set([...cur, o.value]); };
  React.useEffect(() => { setActive(0); }, [q]);
  React.useEffect(() => {
    if (!open) return;
    const h = (e) => { if (wrap.current && !wrap.current.contains(e.target)) { setOpen(false); setQ(''); } };
    document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h);
  }, [open]);
  const onKey = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); if (!open) setOpen(true); else setActive((a) => Math.min(shown.length - 1, a + 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(0, a - 1)); }
    else if (e.key === 'Enter') { e.preventDefault(); if (open) toggle(shown[active]); else setOpen(true); }
    else if (e.key === 'Backspace' && !q && cur.length) set(cur.slice(0, -1));
    else if (e.key === 'Escape') { setOpen(false); setQ(''); }
    else if (e.key === 'Tab') { setOpen(false); setQ(''); }
  };
  const lbl = (v) => (cache.current[v] && cache.current[v].label) || v;
  return (
    <div className="vui-field">
      {label && <FieldLabel htmlFor={fid} optional={optional}>{label}</FieldLabel>}
      <div ref={wrap} className="vui-select">
        <Control invalid={!!(error)} disabled={disabled} className={cx('vui-taginput', size === 'sm' && 'vui-taginput--sm', className)} onMouseDown={(e) => { if (e.target === e.currentTarget || e.target.classList.contains('vui-multi__caret')) { e.preventDefault(); input.current && input.current.focus(); setOpen(true); } }}>
          {cur.map((v) => (
            <Tag key={v} size="sm" className="vui-taginput__tag" disabled={disabled} removeLabel={'Remove ' + lbl(v)} onRemove={() => set(cur.filter((x) => x !== v))}>{lbl(v)}</Tag>
          ))}
          <input ref={input} id={fid} role="combobox" aria-expanded={open} aria-controls={listId} aria-autocomplete="list" aria-activedescendant={open && shown[active] ? listId + '-' + active : undefined}
            className="vui-taginput__input" value={q} placeholder={cur.length ? '' : placeholder} disabled={disabled} autoComplete="off"
            onChange={(e) => { setQ(e.target.value); setOpen(true); }} onFocus={() => setOpen(true)} onKeyDown={onKey} />
          <span className="vui-multi__caret" aria-hidden="true">{remote.loading ? <Spinner size="inline" tone="current" /> : <Chevron open={open} />}</span>
        </Control>
        {open && (
          <div className="vui-select__menu vui-multi__menu">
            <ul id={listId} role="listbox" aria-multiselectable="true" className="vui-multi__list">
              {shown.map((o, i) => { const on = cur.includes(o.value); const dis = !on && full; return (
                <li key={o.value} id={listId + '-' + i} role="option" aria-selected={on} aria-disabled={dis || undefined} className={cx('vui-select__option', 'vui-multi__option', i === active && 'vui-select__option--active')}
                  onMouseEnter={() => setActive(i)} onMouseDown={(e) => e.preventDefault()} onClick={() => !dis && toggle(o)}>
                  {o.create ? <Glyph name="plus" /> : <Checkmark size="sm" checked={on} aria-hidden="true" />}
                  {o.icon && <Glyph name={o.icon} />}
                  <span className="vui-select__label">{o.create ? createLabel + ' “' + o.label + '”' : o.label}{o.description && <span className="vui-select__desc">{o.description}</span>}</span>
                </li>
              ); })}
              {remote.loading && !shown.length && [0, 1, 2].map((i) => <li key={'s' + i} className="vui-select__option" aria-hidden="true"><Skeleton width={[70, 55, 62][i] + '%'} /></li>)}
              {remote.error && <EmptyText as="li" align="start" className="vui-select__empty vui-select__error">{remote.error} <Button variant="link" size="sm" onMouseDown={(e) =>e.preventDefault()} onClick={remote.retry}>Retry</Button></EmptyText>}
              {!shown.length && !remote.loading && !remote.error && <EmptyText as="li" align="start" className="vui-select__empty">{q ? emptyText : 'Type to search.'}</EmptyText>}
            </ul>
            <div className="vui-multi__foot"><span>{cur.length} selected{max != null ? ' of ' + max : ''}</span>{cur.length > 0 && <Button variant="link" size="sm" onMouseDown={(e) =>e.preventDefault()} onClick={() => set([])}>Clear</Button>}</div>
          </div>
        )}
      </div>
      {(error || hint) && <span className={cx('vui-hint', error && 'vui-hint--error')}>{error || hint}</span>}
    </div>
  );
}
