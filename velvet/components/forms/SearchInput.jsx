import React from 'react';
import { EmptyText } from '../primitives/EmptyText.jsx';
import { Control } from '../primitives/Control.jsx';
import { FieldLabel } from '../primitives/Field.jsx';
import { Spinner } from '../feedback/Spinner.jsx';
import { Glyph } from '../primitives/Glyph.jsx';
import { CloseButton } from '../primitives/CloseButton.jsx';
import { highlightMatch } from '../primitives/Mark.jsx';
import { cx } from '../primitives/cx.js';
const norm = (o) => (typeof o === 'string' ? { value: o, label: o } : o);
export function SearchInput({ label, placeholder = 'Search…', value, defaultValue, onValueChange, suggestions, filter = true, onSelect, emptyText = 'No matches.', loading = false, size = 'md', disabled, id, className, inputRef, ...rest }) {
  const autoId = React.useId();
  const fid = id || autoId;
  const listId = fid + '-list';
  const [inner, setInner] = React.useState(defaultValue ?? '');
  const q = value !== undefined ? value : inner;
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState(-1);
  const wrap = React.useRef(null);
  const input = React.useRef(null);
  const set = (v) => { if (value === undefined) setInner(v); onValueChange && onValueChange(v); };
  const opts = (suggestions || []).map(norm).filter((o) => !filter || !q || String(o.label).toLowerCase().includes(q.toLowerCase()));
  const showList = open && suggestions && q.length > 0;
  const pick = (o) => { set(String(o.label)); onSelect && onSelect(o); setOpen(false); input.current && input.current.focus(); };
  const onKey = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setOpen(true); setActive((a) => Math.min(opts.length - 1, a + 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(0, a - 1)); }
    else if (e.key === 'Enter') { if (showList && opts[active]) { e.preventDefault(); pick(opts[active]); } else onSelect && onSelect({ value: q, label: q }); }
    else if (e.key === 'Escape') { if (showList) setOpen(false); else if (q) set(''); }
  };
  React.useEffect(() => {
    if (!open) return;
    const h = (e) => { if (wrap.current && !wrap.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [open]);
  React.useEffect(() => { setActive(opts.length ? 0 : -1); }, [q]);
  return (
    <div className={cx('vui-field', className)}>
      {label && <FieldLabel htmlFor={fid}>{label}</FieldLabel>}
      <div ref={wrap} className="vui-select">
        <Control size={size} disabled={disabled}>
          <span className="vui-control__adorn">{loading ? <Spinner size="inline" tone="current" /> : <Glyph name="search" />}</span>
          <input ref={(el) => { input.current = el; if (typeof inputRef === 'function') inputRef(el); else if (inputRef) inputRef.current = el; }} id={fid} type="search" role={suggestions ? 'combobox' : undefined} aria-expanded={suggestions ? !!showList : undefined} aria-controls={suggestions ? listId : undefined} aria-autocomplete={suggestions ? 'list' : undefined}
            aria-activedescendant={showList && active >= 0 ? listId + '-' + active : undefined}
            className="vui-control__input vui-control__input--search" placeholder={placeholder} value={q} disabled={disabled} autoComplete="off"
            onChange={(e) => { set(e.target.value); setOpen(true); }} onFocus={() => setOpen(true)} onKeyDown={onKey} {...rest} />
          {q && !disabled && (
            <CloseButton variant="field" aria-label="Clear search" onClick={() => { set(''); input.current && input.current.focus(); }} />
          )}
        </Control>
        {showList && (
          <ul id={listId} role="listbox" className="vui-select__menu">
            {opts.map((o, i) => (
              <li key={o.value} id={listId + '-' + i} role="option" aria-selected={i === active} className={cx('vui-select__option', i === active && 'vui-select__option--active')}
                onMouseEnter={() => setActive(i)} onMouseDown={(e) => e.preventDefault()} onClick={() => pick(o)}>
                {o.icon && <Glyph name={o.icon} />}
                <span className="vui-select__label">{highlightMatch(o.label, q)}{o.description && <span className="vui-select__desc">{o.description}</span>}</span>
              </li>
            ))}
            {!opts.length && <EmptyText as="li" align="start" className="vui-select__empty">{emptyText}</EmptyText>}
          </ul>
        )}
      </div>
    </div>
  );
}
