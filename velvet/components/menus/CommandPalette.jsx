import React from 'react';
import { EmptyText } from '../primitives/EmptyText.jsx';
import { Kbd } from '../primitives/Kbd.jsx';
import { SectionLabel } from '../primitives/SectionLabel.jsx';
import { highlightMatch } from '../primitives/Mark.jsx';
import { Glyph, renderIcon } from '../primitives/Glyph.jsx';
import { cx } from '../primitives/cx.js';
function score(item, q) {
  if (!q) return 1;
  const hay = (String(item.label) + ' ' + (item.keywords || []).join(' ')).toLowerCase();
  const s = q.toLowerCase();
  if (hay.startsWith(s)) return 3;
  if (hay.includes(' ' + s)) return 2;
  if (hay.includes(s)) return 1.5;
  let i = 0; for (const c of hay) { if (c === s[i]) i++; if (i === s.length) return 1; }
  return 0;
}
export function CommandPalette({ open, onClose, groups = [], placeholder = 'Type a command or search…', emptyText = 'No results.', className }) {
  const [q, setQ] = React.useState('');
  const [active, setActive] = React.useState(0);
  const input = React.useRef(null);
  const list = React.useRef(null);
  const id = React.useId();
  React.useEffect(() => { if (open) { setQ(''); setActive(0); const prev = document.activeElement; requestAnimationFrame(() => input.current && input.current.focus()); return () => prev && prev.focus && prev.focus(); } }, [open]);
  const filtered = groups.map((g) => ({ ...g, items: g.items.map((it) => ({ it, s: score(it, q) })).filter((x) => x.s > 0).sort((a, b) => b.s - a.s).map((x) => x.it) })).filter((g) => g.items.length);
  const flat = filtered.flatMap((g) => g.items);
  React.useEffect(() => { setActive(0); }, [q]);
  React.useEffect(() => {
    const el = document.getElementById(id + '-' + active); const ul = list.current;
    if (el && ul && (el.offsetTop < ul.scrollTop || el.offsetTop + el.offsetHeight > ul.scrollTop + ul.clientHeight)) ul.scrollTop = el.offsetTop - ul.clientHeight / 2;
  }, [active]);
  if (!open) return null;
  const run = (it) => { if (!it) return; onClose && onClose(); it.onSelect && it.onSelect(); };
  const onKey = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => (a + 1) % Math.max(1, flat.length)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => (a - 1 + flat.length) % Math.max(1, flat.length)); }
    else if (e.key === 'Enter') { e.preventDefault(); run(flat[active]); }
    else if (e.key === 'Escape') { e.preventDefault(); onClose && onClose(); }
  };
  let n = -1;
  return (
    <div className="vui-dialog-backdrop vui-dialog-backdrop--top" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose && onClose(); }}>
      <div role="dialog" aria-modal="true" aria-label="Command palette" className={cx('vui-cmdk', className)}>
        <div className="vui-cmdk__search">
          <Glyph name="search" />
          <input ref={input} role="combobox" aria-expanded="true" aria-controls={id} aria-activedescendant={flat.length ? id + '-' + active : undefined} aria-autocomplete="list"
            value={q} placeholder={placeholder} onChange={(e) => setQ(e.target.value)} onKeyDown={onKey} />
          <kbd className="vui-cmdk__key" aria-hidden="true">Esc</kbd>
        </div>
        <div ref={list} id={id} role="listbox" className="vui-cmdk__list">
          {filtered.map((g) => (
            <div key={g.label} role="group" aria-label={g.label}>
              <SectionLabel className="vui-cmdk__group">{g.label}</SectionLabel>
              {g.items.map((it) => { n++; const i = n; return (
                <div key={it.id || it.label} id={id + '-' + i} role="option" aria-selected={i === active} className={cx('vui-menu__item', 'vui-cmdk__item', i === active && 'vui-menu__item--active')}
                  onMouseMove={() => active !== i && setActive(i)} onClick={() => run(it)}>
                  {renderIcon(it.icon)}
                  <span className="vui-menu__label">{highlightMatch(it.label, q)}{it.description && <span className="vui-menu__desc">{it.description}</span>}</span>
                  {it.shortcut && <Kbd plain className="vui-menu__kbd">{it.shortcut}</Kbd>}
                  {i === active && <Glyph name="arrow-right" className="vui-cmdk__go" />}
                </div>
              ); })}
            </div>
          ))}
          {!flat.length && <EmptyText className="vui-cmdk__empty">{emptyText}</EmptyText>}
        </div>
        <div className="vui-cmdk__foot" aria-hidden="true"><span><kbd className="vui-cmdk__key">↑↓</kbd>navigate</span><span><kbd className="vui-cmdk__key">↵</kbd>open</span><span><kbd className="vui-cmdk__key">Esc</kbd>close</span><span className="vui-cmdk__count">{flat.length} {flat.length === 1 ? 'result' : 'results'}</span></div>
      </div>
    </div>
  );
}
