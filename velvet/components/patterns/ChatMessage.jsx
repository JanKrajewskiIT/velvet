import React from 'react';
import { Avatar } from '../data/Avatar.jsx';
import { IconButton } from '../actions/IconButton.jsx';
import { Glyph } from '../primitives/Glyph.jsx';
import { cx } from '../primitives/cx.js';
export function TypingIndicator({ label = 'Assistant is typing', className }) {
  return <span className={cx('vui-chat-typing', className)} role="status" aria-label={label}><i /><i /><i /></span>;
}
export function ChatMessage({ role = 'assistant', author, avatar, time, content, children, streaming = false, error, onRetry, onCopy, feedback, onFeedback, sources, actions, className }) {
  const body = children ?? content;
  const ref = React.useRef(null);
  const [copied, setCopied] = React.useState(false);
  if (role === 'system') return <div className={cx('vui-chatmsg', 'vui-chatmsg--system', className)} role="note"><span>{body}</span>{time && <time className="vui-chatmsg__time">{time}</time>}</div>;
  const isUser = role === 'user';
  const empty = body == null || body === '';
  const copy = () => {
    const t = typeof content === 'string' ? content : (ref.current && ref.current.innerText) || '';
    if (navigator.clipboard) navigator.clipboard.writeText(t).catch(() => {});
    setCopied(true); setTimeout(() => setCopied(false), 1500); onCopy && onCopy(t);
  };
  const tools = !isUser && !streaming && !error && !empty;
  return (
    <div className={cx('vui-chatmsg', 'vui-chatmsg--' + role, error && 'vui-chatmsg--error', className)}>
      {!isUser && <span className="vui-chatmsg__avatar">{avatar ?? <Avatar size="sm" color="var(--action-primary)"><Glyph name="sparkles" /></Avatar>}</span>}
      <div className="vui-chatmsg__main">
        {(author || time) && <div className="vui-chatmsg__meta">{author && <span className="vui-chatmsg__author">{author}</span>}{time && <time className="vui-chatmsg__time">{time}</time>}</div>}
        {empty && streaming ? <TypingIndicator /> : !empty && <div ref={ref} className="vui-chatmsg__body">{body}{streaming && <span className="vui-chatmsg__caret" aria-hidden="true" />}</div>}
        {error && <div className="vui-chatmsg__error" role="alert"><Glyph name="alert-circle" /><span>{error === true ? 'The response failed to generate.' : error}</span>{onRetry && <button type="button" className="vui-chatmsg__retry" onClick={onRetry}>Retry</button>}</div>}
        {sources && sources.length > 0 && !streaming && (
          <div className="vui-chatmsg__sources">{sources.map((s, i) => <a key={i} href={s.href} target="_blank" rel="noreferrer" className="vui-chatmsg__src" title={s.title}><b>{i + 1}</b><span>{s.title}</span></a>)}</div>
        )}
        {tools && (
          <div className="vui-chatmsg__tools">
            <IconButton className={cx('vui-chatmsg__tool', copied && 'vui-chatmsg__tool--on')} icon={copied ? 'check' : 'copy'} label={copied ? 'Copied' : 'Copy'} size="xs" variant="ghost" onClick={copy} />
            {onRetry && <IconButton className="vui-chatmsg__tool" icon="refresh" label="Regenerate" size="xs" variant="ghost" onClick={onRetry} />}
            {onFeedback && <IconButton className={cx('vui-chatmsg__tool', feedback === 'up' && 'vui-chatmsg__tool--on')} icon="thumbs-up" label="Good response" aria-pressed={feedback === 'up'} size="xs" variant="ghost" onClick={() => onFeedback(feedback === 'up' ? null : 'up')} />}
            {onFeedback && <IconButton className={cx('vui-chatmsg__tool', 'vui-chatmsg__tool--down', feedback === 'down' && 'vui-chatmsg__tool--on')} icon="thumbs-up" label="Bad response" aria-pressed={feedback === 'down'} size="xs" variant="ghost" onClick={() => onFeedback(feedback === 'down' ? null : 'down')} />}
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
export function ChatThread({ children, height, label = 'Conversation', className, style }) {
  const ref = React.useRef(null);
  const stick = React.useRef(true);
  React.useLayoutEffect(() => { const el = ref.current; if (el && stick.current) el.scrollTop = el.scrollHeight; });
  return (
    <div ref={ref} role="log" aria-label={label} tabIndex={0} className={cx('vui-chatthread', className)} style={{ height, ...style }}
      onScroll={(e) => { const el = e.currentTarget; stick.current = el.scrollHeight - el.scrollTop - el.clientHeight < 48; }}>
      {children}
    </div>
  );
}
