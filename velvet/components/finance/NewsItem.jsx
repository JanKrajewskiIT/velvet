import React from 'react';
import { Tag } from '../display/Tag.jsx';
import { Dot } from '../primitives/Dot.jsx';
import { cx } from '../primitives/cx.js';
const IMP = { high: 'danger', medium: 'warning', low: 'neutral' };
export function NewsItem({ title, href, source, time, region, impact, bullets = [], tickers = [], onTickerClick, aiLabel = 'AI summary', actions, className, ...rest }) {
  const imp = impact ? String(impact).toLowerCase() : null;
  return (
    <article className={cx('vui-news', className)} {...rest}>
      <header className="vui-news__head">
        <div className="vui-news__meta">{[source, time, region].filter(Boolean).join(' · ')}</div>
        {imp && <span className="vui-news__imp"><Dot tone={IMP[imp] || 'neutral'} />{impact} impact</span>}
      </header>
      <h3 className="vui-news__title">{href ? <a href={href} target="_blank" rel="noopener noreferrer">{title}</a> : title}</h3>
      {bullets.length > 0 && <div className="vui-news__sum"><span className="vui-news__ai">{aiLabel}</span><ul>{bullets.map((b, i) => <li key={i}>{b}</li>)}</ul></div>}
      {(tickers.length > 0 || actions) && (
        <footer className="vui-news__foot">
          <div className="vui-news__tickers">{tickers.map((t) => <Tag key={t} size="sm" variant="soft" onClick={onTickerClick ? () => onTickerClick(t) : undefined}>{t}</Tag>)}</div>
          {actions}
        </footer>
      )}
    </article>
  );
}
