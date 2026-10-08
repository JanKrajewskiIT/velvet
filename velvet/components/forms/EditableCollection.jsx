import React from 'react';
import { Select } from './Select.jsx';
import { Control } from '../primitives/Control.jsx';
import { Glyph } from '../primitives/Glyph.jsx';
import { EmptyText } from '../primitives/EmptyText.jsx';
import { Handle } from '../primitives/Handle.jsx';
import { Rating } from './Rating.jsx';
import { IconButton } from '../actions/IconButton.jsx';
import { cx } from '../primitives/cx.js';
const plural = (n, f) => (f ? f(n) : n + (n === 1 ? ' item' : ' items'));
export function EditableCollection({ items, defaultItems = [], onItemsChange, title, showCount = !!title, countLabel, levels, levelLabel = 'Level', weighted = false, maxWeight = 5, reorder = 'drag', required = true, requiredText = 'This field can\u2019t be empty', placeholder = 'Name', addLabel = 'Add item', newItemText = '', emptyText = 'Nothing here yet.', maxItems, label = 'Items', className }) {
  const [inner, setInner] = React.useState(defaultItems);
  const list = items !== undefined ? items : inner;
  const commit = (n) => { if (items === undefined) setInner(n); onItemsChange && onItemsChange(n); };
  const patch = (id, p) => commit(list.map((x) => (x.id === id ? { ...x, ...p } : x)));
  const moveTo = (from, to) => { if (to < 0 || to >= list.length || from === to) return; const n = list.slice(); const [it] = n.splice(from, 1); n.splice(to, 0, it); commit(n); };
  const root = React.useRef(null);
  const [touched, setTouched] = React.useState(() => new Set());
  const [drag, setDrag] = React.useState(null);
  const [over, setOver] = React.useState(null);
  const add = () => {
    const id = 'n' + Date.now();
    commit([...list, { id, text: newItemText, ...(levels ? { level: levels[Math.min(1, levels.length - 1)] } : {}), ...(weighted ? { weight: 3 } : {}) }]);
    requestAnimationFrame(() => { const el = root.current && root.current.querySelector('[data-ec="' + id + '"]'); el && el.focus(); });
  };
  const focusGrip = (i) => requestAnimationFrame(() => { const g = root.current && root.current.querySelectorAll('.vui-editcol__grip')[i]; g && g.focus(); });
  const gripKey = (e, i) => { if (e.key === 'ArrowUp' && i > 0) { e.preventDefault(); moveTo(i, i - 1); focusGrip(i - 1); } else if (e.key === 'ArrowDown' && i < list.length - 1) { e.preventDefault(); moveTo(i, i + 1); focusGrip(i + 1); } };
  return (
    <div ref={root} className={cx('vui-editcol', className)}>
      {(title || showCount) && (
        <div className="vui-editcol__head">
          {title && <span className="vui-editcol__title">{title}</span>}
          {showCount && <span className="vui-editcol__count" aria-live="polite">{plural(list.length, countLabel)}</span>}
        </div>
      )}
      {list.length === 0 ? <EmptyText dashed className="vui-editcol__empty">{emptyText}</EmptyText> : (
        <ol className="vui-editcol__list" aria-label={label}>
          {list.map((it, i) => {
            const invalid = required && touched.has(it.id) && !String(it.text || '').trim();
            return (
              <li key={it.id} className={cx('vui-editcol__row', drag === i && 'vui-editcol__row--drag', over === i && drag !== null && drag !== i && 'vui-editcol__row--over', invalid && 'vui-editcol__row--invalid')}
                onDragOver={reorder === 'drag' ? (e) => { if (drag === null) return; e.preventDefault(); if (over !== i) setOver(i); } : undefined}
                onDrop={reorder === 'drag' ? (e) => { e.preventDefault(); if (drag !== null) moveTo(drag, i); setDrag(null); setOver(null); } : undefined}>
                {reorder === 'drag' ? (
                  <Handle className="vui-editcol__grip" draggable label={'Reorder item ' + (i + 1) + ' (↑↓)'} title="Drag or use ↑ ↓"
                    onDragStart={(e) => { setDrag(i); e.dataTransfer.effectAllowed = 'move'; try { e.dataTransfer.setData('text/plain', String(i)); e.dataTransfer.setDragImage(e.currentTarget.parentNode, 16, 18); } catch (x) {} }}
                    onDragEnd={() => { setDrag(null); setOver(null); }} onKeyDown={(e) => gripKey(e, i)} />
                ) : <span className="vui-editcol__idx" aria-hidden="true">{i + 1}</span>}
                <input data-ec={it.id} className="vui-editcol__input" value={it.text} placeholder={placeholder} aria-label={'Item ' + (i + 1)} aria-invalid={invalid || undefined}
                  onChange={(e) => patch(it.id, { text: e.target.value })} onBlur={() => setTouched((t) => new Set(t).add(it.id))} />
                {levels && (
                  <div className="vui-editcol__level"><Select size="sm" aria-label={levelLabel + ' for item ' + (i + 1)} options={levels} value={it.level ?? ''} onValueChange={(v) => patch(it.id, { level: v })} /></div>
                )}
                {weighted && <Rating size="sm" max={maxWeight} value={it.weight || 0} label={'Importance of item ' + (i + 1)} onValueChange={(w) => patch(it.id, { weight: w })} />}
                <span className="vui-editcol__tools">
                  {reorder === 'buttons' && <><IconButton icon="arrow-up" label="Move up" size="sm" disabled={i === 0} onClick={() => moveTo(i, i - 1)} /><IconButton icon="arrow-down" label="Move down" size="sm" disabled={i === list.length - 1} onClick={() => moveTo(i, i + 1)} /></>}
                  <IconButton className="vui-editcol__del" icon="trash-2" label={'Remove item ' + (i + 1)} size="sm" onClick={() => commit(list.filter((x) => x.id !== it.id))} />
                </span>
                {invalid && <div className="vui-editcol__err" role="alert">{requiredText}</div>}
              </li>
            );
          })}
        </ol>
      )}
      {(maxItems == null || list.length < maxItems) && <button type="button" className="vui-editcol__add" onClick={add}><Glyph name="plus" />{addLabel}</button>}
    </div>
  );
}
