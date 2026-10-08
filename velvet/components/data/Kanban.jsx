import React from 'react';
import { Badge } from '../display/Badge.jsx';
import { IconButton } from '../actions/IconButton.jsx';
import { Glyph } from '../primitives/Glyph.jsx';
import { EmptyText } from '../primitives/EmptyText.jsx';
import { Dot } from '../primitives/Dot.jsx';
import { Count } from '../primitives/Count.jsx';
import { cx } from '../primitives/cx.js';
export function Kanban({ columns = [], cards = [], onCardsChange, onCardClick, renderCard, onAddCard, className }) {
  const [drag, setDrag] = React.useState(null);
  const [over, setOver] = React.useState(null);
  const [live, setLive] = React.useState('');
  const board = React.useRef(null);
  const move = (id, col, index) => {
    const c = cards.find((x) => x.id === id); if (!c) return;
    const rest = cards.filter((x) => x.id !== id);
    const inCol = rest.filter((x) => x.column === col);
    const at = index == null ? inCol.length : Math.max(0, Math.min(inCol.length, index));
    const before = inCol[at];
    const moved = { ...c, column: col };
    const next = before ? (() => { const k = rest.indexOf(before); return [...rest.slice(0, k), moved, ...rest.slice(k)]; })() : [...rest, moved];
    onCardsChange && onCardsChange(next);
    const cn = columns.find((x) => x.id === col);
    setLive((c.title || 'Card') + ' moved to ' + (cn ? cn.title : col) + ', position ' + (at + 1));
    requestAnimationFrame(() => { const el = board.current && board.current.querySelector('[data-card="' + CSS.escape(String(id)) + '"]'); el && el.focus(); });
  };
  const onKey = (e, c) => {
    if (!(e.ctrlKey || e.metaKey || e.altKey)) {
      if (e.key === 'Enter') onCardClick && onCardClick(c);
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); const list = [...e.currentTarget.parentElement.querySelectorAll('[data-card]')]; const i = list.indexOf(e.currentTarget); const n = list[i + (e.key === 'ArrowDown' ? 1 : -1)]; n && n.focus(); }
      return;
    }
    const ci = columns.findIndex((x) => x.id === c.column);
    const inCol = cards.filter((x) => x.column === c.column); const pos = inCol.findIndex((x) => x.id === c.id);
    if (e.key === 'ArrowRight' && ci < columns.length - 1) { e.preventDefault(); move(c.id, columns[ci + 1].id, pos); }
    else if (e.key === 'ArrowLeft' && ci > 0) { e.preventDefault(); move(c.id, columns[ci - 1].id, pos); }
    else if (e.key === 'ArrowUp' && pos > 0) { e.preventDefault(); move(c.id, c.column, pos - 1); }
    else if (e.key === 'ArrowDown' && pos < inCol.length - 1) { e.preventDefault(); move(c.id, c.column, pos + 1); }
  };
  const dropIndex = (e, colEl) => { const els = [...colEl.querySelectorAll('[data-card]')].filter((el) => el.dataset.card !== String(drag)); const y = e.clientY; const i = els.findIndex((el) => { const r = el.getBoundingClientRect(); return y < r.top + r.height / 2; }); return i < 0 ? els.length : i; };
  return (
    <div ref={board} className={cx('vui-kanban', className)}>
      <span className="vui-sr-only" aria-live="assertive">{live}</span>
      {columns.map((col) => {
        const list = cards.filter((c) => c.column === col.id);
        const isOver = over && over.col === col.id;
        const overLimit = col.limit != null && list.length > col.limit;
        return (
          <section key={col.id} className={cx('vui-kanban__col', isOver && 'vui-kanban__col--over')} aria-label={col.title}
            onDragOver={(e) => { if (drag == null) return; e.preventDefault(); const i = dropIndex(e, e.currentTarget); if (!over || over.col !== col.id || over.i !== i) setOver({ col: col.id, i }); }}
            onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setOver(null); }}
            onDrop={(e) => { e.preventDefault(); if (drag != null) move(drag, col.id, dropIndex(e, e.currentTarget)); setDrag(null); setOver(null); }}>
            <header className="vui-kanban__head">
              <Dot size="lg" className="vui-kanban__dot" style={{ '--tone': col.color || 'var(--dv-8)' }} />
              <span className="vui-kanban__title">{col.title}</span>
              <Count tone="neutral" showZero value={list.length + (col.limit != null ? '/' + col.limit : '')} className={cx('vui-kanban__count', overLimit && 'vui-kanban__count--over')} />
              {onAddCard && <IconButton icon="plus" label={'Add card to ' + col.title} size="sm" onClick={() => onAddCard(col.id)} style={{ marginLeft: 'auto' }} />}
            </header>
            <div className="vui-kanban__list" role="list" aria-label={col.title + ', ' + list.length + ' cards'}>
              {list.map((c, i) => (
                <React.Fragment key={c.id}>
                  {isOver && over.i === i && <div className="vui-kanban__ghost" />}
                  <article role="listitem" data-card={c.id} tabIndex={0} draggable className={cx('vui-kanban__card', drag === c.id && 'vui-kanban__card--drag')} aria-roledescription="Draggable card" aria-describedby="vui-kanban-help"
                    onDragStart={(e) => { setDrag(c.id); e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', String(c.id)); }} onDragEnd={() => { setDrag(null); setOver(null); }}
                    onKeyDown={(e) => onKey(e, c)} onClick={() => onCardClick && onCardClick(c)}>
                    {renderCard ? renderCard(c) : (
                      <>
                        {c.tag && <Badge size="sm" tone={c.tagTone || 'neutral'}>{c.tag}</Badge>}
                        <div className="vui-kanban__ctitle">{c.title}</div>
                        {(c.meta || c.assignee) && <div className="vui-kanban__cfoot"><span className="vui-kanban__meta">{c.meta}</span>{c.assignee}</div>}
                      </>
                    )}
                  </article>
                </React.Fragment>
              ))}
              {isOver && over.i >= list.filter((c) => c.id !== drag).length && <div className="vui-kanban__ghost" />}
              {!list.length && !isOver && <EmptyText dashed className="vui-kanban__empty">Drop cards here</EmptyText>}
            </div>
          </section>
        );
      })}
      <span id="vui-kanban-help" className="vui-sr-only">Ctrl plus arrow keys move the card between columns and positions.</span>
    </div>
  );
}
