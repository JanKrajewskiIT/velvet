import React from 'react';
import { EmptyText } from '../primitives/EmptyText.jsx';
import { Control } from '../primitives/Control.jsx';
import { FieldLabel } from '../primitives/Field.jsx';
import { Skeleton } from '../feedback/Skeleton.jsx';
import { Spinner } from '../feedback/Spinner.jsx';
import { Button } from '../actions/Button.jsx';
import { Glyph } from '../primitives/Glyph.jsx';
import { CloseButton } from '../primitives/CloseButton.jsx';
import { highlightMatch } from '../primitives/Mark.jsx';
import { cx } from '../primitives/cx.js';
const norm = (o) => (typeof o === 'string' ? { value: o, label: o } : o);
export function useAsyncOptions(loadOptions, query, enabled) {
  const [state, setState] = React.useState({ items: [], loading: false, error: null });
  const [tick, setTick] = React.useState(0);
  React.useEffect(() => {
    if (!loadOptions || !enabled) return;
    let live = true;
    setState((s) => ({ ...s, loading: true, error: null }));
    const t = setTimeout(() => {
      Promise.resolve(loadOptions(query)).then((r) => { if (live) setState({ items: (r || []).map(norm), loading: false, error: null }); })
        .catch((e) => { if (live) setState({ items: [], loading: false, error: (e && e.message) || 'Couldn’t load options' }); });
    }, 250);
    return () => { live = false; clearTimeout(t); };
  }, [query, enabled, tick]);
  return { ...state, retry: () => setTick((t) => t + 1) };
}
export function Autocomplete({ label, hint, error, optional, options = [], value, defaultValue = null, onChange: onChangeProp, onValueChange, loadOptions, placeholder = 'Search…', emptyText = 'No matches.', allowCustom = false, iconLeft = 'search', size = 'md', disabled, id, className }) {
  const onChange = onChangeProp || onValueChange;
  const autoId = React.useId();
  const fid = id || autoId;
  const listId = fid + '-list';
  const [inner, setInner] = React.useState(defaultValue);
  const cur = value !== undefined ? value : inner;
  const cache = React.useRef({});
  const local = options.map(norm);
  local.forEach((o) => (cache.current[o.value] = o));
  const selLabel = cur == null ? '' : (cache.current[cur] && cache.current[cur].label) || String(cur);
  const [text, setText] = React.useState(selLabel);
  const [typing, setTyping] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState(0);
  const wrap = React.useRef(null);
  const q = typing ? text : '';
  const remote = useAsyncOptions(loadOptions, q, open);
  remote.items.forEach((o) => (cache.current[o.value] = o));
  const list = loadOptions ? remote.items : local.filter((o) => !q || String(o.label).toLowerCase().includes(q.toLowerCase()));
  React.useEffect(() => { if (!typing) setText(selLabel); }, [selLabel, typing]);
  React.useEffect(() => { setActive(0); }, [q]);
  React.useEffect(() => {
    if (!open) return;
    const h = (e) => { if (wrap.current && !wrap.current.contains(e.target)) { setOpen(false); commitBlur(); } };
    document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h);
  });
  const set = (v) => { if (value === undefined) setInner(v); onChange && onChange(v); };
  const pick = (o) => { cache.current[o.value] = o; set(o.value); setText(o.label); setTyping(false); setOpen(false); };
  const commitBlur = () => { if (!typing) return; if (allowCustom && text.trim()) { set(text.trim()); cache.current[text.trim()] = { value: text.trim(), label: text.trim() }; } else if (!text) set(null); setTyping(false); };
  const onKey = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); if (!open) setOpen(true); else setActive((a) => Math.min(list.length - 1, a + 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(0, a - 1)); }
    else if (e.key === 'Enter') { if (open && list[active]) { e.preventDefault(); pick(list[active]); } else if (allowCustom) { e.preventDefault(); commitBlur(); setOpen(false); } }
    else if (e.key === 'Escape') { if (open) { e.preventDefault(); setOpen(false); } setTyping(false); setText(selLabel); }
    else if (e.key === 'Tab') { setOpen(false); commitBlur(); }
  };
  const showCustom = allowCustom && typing && text.trim() && !list.some((o) => String(o.label).toLowerCase() === text.trim().toLowerCase());
  return (
    <div className="vui-field">
      {label && <FieldLabel htmlFor={fid} optional={optional}>{label}</FieldLabel>}
      <div ref={wrap} className="vui-select">
        <Control size={size} invalid={!!(error)} disabled={disabled} className={className}>
          {iconLeft && <span className="vui-control__adorn">{remote.loading ? <Spinner size="inline" tone="current" /> : <Glyph name={iconLeft} />}</span>}
          <input id={fid} role="combobox" aria-expanded={open} aria-controls={listId} aria-autocomplete="list" aria-activedescendant={open && list[active] ? listId + '-' + active : undefined} aria-invalid={!!error || undefined}
            className="vui-control__input" value={text} placeholder={placeholder} disabled={disabled} autoComplete="off"
            onChange={(e) => { setText(e.target.value); setTyping(true); setOpen(true); }} onFocus={() => setOpen(true)} onKeyDown={onKey} />
          {cur != null && !disabled && <CloseButton variant="field" aria-label="Clear" onClick={() => { set(null); setText(''); setTyping(false); }} />}
          <span className="vui-control__adorn vui-control__adorn--end" style={{ pointerEvents: 'none' }}><Glyph name="chevron-down" /></span>
        </Control>
        {open && (
          <ul id={listId} role="listbox" className="vui-select__menu">
            {list.map((o, i) => (
              <li key={o.value} id={listId + '-' + i} role="option" aria-selected={cur === o.value} className={cx('vui-select__option', i === active && 'vui-select__option--active')}
                onMouseEnter={() => setActive(i)} onMouseDown={(e) => e.preventDefault()} onClick={() => pick(o)}>
                {o.icon && <Glyph name={o.icon} />}
                <span className="vui-select__label">{highlightMatch(o.label, q)}{o.description && <span className="vui-select__desc">{o.description}</span>}</span>
                {cur === o.value && <Glyph name="check" className="vui-select__check" />}
              </li>
            ))}
            {showCustom && <li className="vui-select__option" onMouseDown={(e) => e.preventDefault()} onClick={() => { commitBlur(); setOpen(false); }}><Glyph name="plus" />Use “{text.trim()}”</li>}
            {remote.loading && !list.length && [0, 1, 2].map((i) => <li key={'s' + i} className="vui-select__option" aria-hidden="true"><Skeleton width={[70, 55, 62][i] + '%'} /></li>)}
            {remote.error && <EmptyText as="li" align="start" className="vui-select__empty vui-select__error">{remote.error} <Button variant="link" size="sm" onMouseDown={(e) =>e.preventDefault()} onClick={remote.retry}>Retry</Button></EmptyText>}
            {!list.length && !remote.loading && !remote.error && !showCustom && <EmptyText as="li" align="start" className="vui-select__empty">{emptyText}</EmptyText>}
          </ul>
        )}
      </div>
      {(error || hint) && <span className={cx('vui-hint', error && 'vui-hint--error')}>{error || hint}</span>}
    </div>
  );
}
