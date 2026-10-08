import React from 'react';
import { Badge } from '../display/Badge.jsx';
import { Button } from '../actions/Button.jsx';
import { Glyph } from '../primitives/Glyph.jsx';
import { EmptyText } from '../primitives/EmptyText.jsx';
import { Count } from '../primitives/Count.jsx';
import { Avatar } from '../data/Avatar.jsx';
import { cx } from '../primitives/cx.js';
const nm = (a) => (typeof a === 'string' ? a : (a && a.name) || '');
const MENTION = /(@[\p{L}][\p{L}\d._-]*)/u;
function Body({ text }) {
  const parts = String(text || '').split(MENTION);
  return <div className="vui-cmt__body">{parts.map((p, i) => (i % 2 ? <span key={i} className="vui-mark vui-mark--mention">{p}</span> : p))}</div>;
}
function Composer({ user, placeholder, initial = '', submitLabel, onSubmit, onCancel, autoFocus, small }) {
  const [v, setV] = React.useState(initial);
  const ref = React.useRef(null);
  React.useLayoutEffect(() => { const el = ref.current; if (!el) return; el.style.height = 'auto'; el.style.height = Math.min(el.scrollHeight, 240) + 'px'; }, [v]);
  React.useEffect(() => { const el = ref.current; if (autoFocus && el) { el.focus({ preventScroll: true }); el.setSelectionRange(el.value.length, el.value.length); } }, []);
  const send = () => { const t = v.trim(); if (!t) return; onSubmit(t); setV(''); };
  return (
    <div className="vui-cmt-compose">
      {user && <Avatar name={nm(user)} src={user.src} size={small ? 'xs' : 'sm'} />}
      <div className="vui-cmt-compose__box">
        <textarea ref={ref} rows={1} className="vui-cmt-compose__input" placeholder={placeholder} aria-label={placeholder} value={v} onChange={(e) => setV(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); send(); } else if (e.key === 'Escape' && onCancel) { e.preventDefault(); onCancel(); } }} />
        <div className="vui-cmt-compose__foot">
          <span className="vui-cmt-compose__hint">⌘↵ to send{onCancel ? ' · Esc to cancel' : ''}</span>
          {onCancel && <Button variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>}
          <Button size="sm" disabled={!v.trim()} onClick={send}>{submitLabel}</Button>
        </div>
      </div>
    </div>
  );
}
export function CommentThread({ comments = [], onChange: onChangeProp, onValueChange, onSubmit, onEdit, onDelete, onLike, currentUser = 'You', canEdit, collapseAfter = 2, title = 'Comments', placeholder = 'Add a comment…', emptyText = 'No comments yet. Start the discussion.', nowLabel = 'Just now', className }) {
  const onChange = onChangeProp || onValueChange;
  const [list, setList] = React.useState(comments);
  React.useEffect(() => setList(comments), [comments]);
  const [replyTo, setReplyTo] = React.useState(null);
  const [editing, setEditing] = React.useState(null);
  const [confirm, setConfirm] = React.useState(null);
  const [open, setOpen] = React.useState({});
  const me = nm(currentUser);
  const mine = (c) => (canEdit ? canEdit(c) : nm(c.author) === me);
  const walk = (arr, fn) => arr.flatMap((c) => { const r = fn(c); if (r === null) return []; const x = r || c; return [x.replies ? { ...x, replies: walk(x.replies, fn) } : x]; });
  const tidy = (arr) => arr.filter((c) => !(c.deleted && !(c.replies || []).length));
  const commit = (next) => { next = tidy(next); setList(next); onChange && onChange(next); };
  const make = (body) => ({ id: 'c' + Date.now(), author: currentUser, time: nowLabel, body });
  const add = (body, parentId) => {
    if (!parentId) commit([...list, { ...make(body), replies: [] }]);
    else { commit(walk(list, (c) => (c.id === parentId ? { ...c, replies: [...(c.replies || []), make(body)] } : undefined))); setOpen((o) => ({ ...o, [parentId]: true })); setReplyTo(null); }
    onSubmit && onSubmit(body, parentId || null);
  };
  const save = (id, body) => { commit(walk(list, (c) => (c.id === id ? { ...c, body, edited: true } : undefined))); setEditing(null); onEdit && onEdit(id, body); };
  const remove = (id) => { commit(walk(list, (c) => (c.id !== id ? undefined : (c.replies || []).some((r) => !r.deleted) ? { ...c, deleted: true, body: '' } : null))); setConfirm(null); onDelete && onDelete(id); };
  const like = (id) => { let now; commit(walk(list, (c) => { if (c.id !== id) return undefined; now = !c.liked; return { ...c, liked: now, likes: Math.max(0, (c.likes || 0) + (now ? 1 : -1)) }; })); onLike && onLike(id, now); };
  const count = list.reduce((n, c) => n + (c.deleted ? 0 : 1) + (c.replies || []).filter((r) => !r.deleted).length, 0);
  const item = (c, parent) => {
    const top = !parent;
    const author = nm(c.author);
    const replies = c.replies || [];
    const shown = open[c.id] ? replies : replies.slice(0, collapseAfter);
    const hidden = replies.length - shown.length;
    return (
      <li key={c.id} className={cx('vui-cmt', !top && 'vui-cmt--reply', c.deleted && 'vui-cmt--deleted')}>
        {c.deleted ? <Avatar initials="–" tone="neutral" size={top ? 'sm' : 'xs'} /> : <Avatar name={author} src={c.author && c.author.src} size={top ? 'sm' : 'xs'} />}
        <div className="vui-cmt__main">
          {c.deleted ? <div className="vui-cmt__body">This comment was deleted.</div> : (
            <>
              <div className="vui-cmt__meta"><span className="vui-cmt__author">{author}</span>{c.role && <Badge size="sm">{c.role}</Badge>}<time className="vui-cmt__time" dateTime={c.datetime}>{c.time}{c.edited ? ' · edited' : ''}</time></div>
              {editing === c.id
                ? <Composer initial={c.body} placeholder="Edit comment" submitLabel="Save" autoFocus onSubmit={(t) => save(c.id, t)} onCancel={() => setEditing(null)} />
                : <Body text={c.body} />}
              {editing !== c.id && (
                <div className="vui-cmt__actions">
                  <Button variant="ghost" size="xs" iconLeft={c.liked ? 'heart-filled' : 'heart'} className={cx('vui-cmt__act', c.liked && 'vui-cmt__act--on')} aria-pressed={!!c.liked} aria-label={(c.liked ? 'Unlike' : 'Like') + (c.likes ? ' · ' + c.likes : '')} onClick={() => like(c.id)}>{c.likes ? c.likes : null}</Button>
                  <Button variant="ghost" size="xs" className="vui-cmt__act" onClick={() => { setConfirm(null); setReplyTo({ parentId: top ? c.id : parent.id, prefill: top || author === me ? '' : '@' + author.split(' ')[0] + ' ', key: Date.now() }); }}>Reply</Button>
                  {mine(c) && <Button variant="ghost" size="xs" className="vui-cmt__act" onClick={() => { setConfirm(null); setEditing(c.id); }}>Edit</Button>}
                  {mine(c) && <Button variant="ghost" size="xs" className="vui-cmt__act vui-cmt__act--danger" aria-expanded={confirm === c.id} onClick={() => setConfirm(confirm === c.id ? null : c.id)}>Delete</Button>}
                </div>
              )}
              {confirm === c.id && (
                <div className="vui-cmt__confirm" role="alert">
                  <span>Delete this comment?{top && replies.length ? ' Replies stay visible.' : ''}</span>
                  <Button variant="ghost" size="sm" onClick={() =>setConfirm(null)} autoFocus>Cancel</Button>
                  <Button variant="danger" size="sm" onClick={() =>remove(c.id)}>Delete</Button>
                </div>
              )}
            </>
          )}
          {top && (shown.length > 0 || (replyTo && replyTo.parentId === c.id)) && (
            <div className="vui-cmt__thread">
              {shown.length > 0 && <ol className="vui-cmt__replies">{shown.map((r) => item(r, c))}</ol>}
              {hidden > 0 && <Button variant="link" size="xs" iconLeft="chevron-down" className="vui-cmt__more" onClick={() => setOpen((o) => ({ ...o, [c.id]: true }))}>Show {hidden} more {hidden === 1 ? 'reply' : 'replies'}</Button>}
              {open[c.id] && replies.length > collapseAfter && <Button variant="link" size="xs" iconLeft="chevron-up" className="vui-cmt__more" onClick={() => setOpen((o) => ({ ...o, [c.id]: false }))}>Hide replies</Button>}
              {replyTo && replyTo.parentId === c.id && <Composer key={replyTo.key} small user={currentUser} initial={replyTo.prefill} placeholder={'Reply to ' + author.split(' ')[0] + '…'} submitLabel="Reply" autoFocus onSubmit={(t) => add(t, c.id)} onCancel={() => setReplyTo(null)} />}
            </div>
          )}
        </div>
      </li>
    );
  };
  return (
    <section className={cx('vui-cthread', className)} aria-label={title}>
      {title && <header className="vui-cthread__head"><h3 className="vui-cthread__title">{title}</h3><Count tone="neutral" value={count} /></header>}
      {list.length ? <ol className="vui-cthread__list">{list.map((c) => item(c, null))}</ol> : <EmptyText as="p" align="start" className="vui-cthread__empty">{emptyText}</EmptyText>}
      <Composer user={currentUser} placeholder={placeholder} submitLabel="Comment" onSubmit={(t) => add(t, null)} />
    </section>
  );
}
