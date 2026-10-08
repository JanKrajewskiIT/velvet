import React from 'react';
import { Progress } from '../feedback/Progress.jsx';
import { Button } from '../actions/Button.jsx';
import { cx } from '../primitives/cx.js';
export function LoadMore({ shown = 0, total = 0, step, onLoadMore, loading = false, label, doneLabel, format = (s, t) => 'Showing ' + s + ' of ' + t, className }) {
  const left = Math.max(0, total - shown);
  const n = step ? Math.min(step, left) : null;
  if (total <= 0) return null;
  return (
    <div className={cx('vui-loadmore', className)}>
      <Progress value={Math.min(shown, total)} max={total} size="sm" tone="neutral" label={<span className="vui-loadmore__count">{format(Math.min(shown, total), total)}</span>} className="vui-loadmore__bar" />
      {left > 0
        ? <Button variant="dashed" size="sm" iconRight="chevron-down" loading={loading} onClick={onLoadMore}>{label || (n ? 'Show ' + n + ' more' : 'Show more')}</Button>
        : <span className="vui-loadmore__done" role="status">{doneLabel || 'All ' + total + ' shown'}</span>}
    </div>
  );
}
