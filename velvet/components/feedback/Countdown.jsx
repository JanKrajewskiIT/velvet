import React from 'react';
import { pad } from '../primitives/date.js';
import { Separator } from '../primitives/Separator.jsx';
import { cx } from '../primitives/cx.js';
export function Countdown({ to, onComplete, units = ['days', 'hours', 'minutes', 'seconds'], labels = { days: 'Days', hours: 'Hours', minutes: 'Min', seconds: 'Sec' }, variant = 'boxes', size = 'md', className }) {
  const target = +new Date(to);
  const [now, setNow] = React.useState(Date.now());
  const done = React.useRef(false);
  React.useEffect(() => { done.current = false; setNow(Date.now()); }, [target]);
  React.useEffect(() => { let t; const tick = () => { const n = Date.now(); setNow(n); if (n < target) t = setTimeout(tick, 1000 - (n % 1000) + 5); }; tick(); const vis = () => document.visibilityState === 'visible' && setNow(Date.now()); document.addEventListener('visibilitychange', vis); return () => { clearTimeout(t); document.removeEventListener('visibilitychange', vis); }; }, [target]);
  const left = Number.isFinite(target) ? Math.max(0, target - now) : 0;
  React.useEffect(() => { if (left === 0 && !done.current) { done.current = true; onComplete && onComplete(); } }, [left]);
  const s = Math.floor(left / 1000);
  const v = { days: Math.floor(s / 86400), hours: Math.floor((s % 86400) / 3600), minutes: Math.floor((s % 3600) / 60), seconds: s % 60 };
  const readable = units.map((u) => v[u] + ' ' + labels[u].toLowerCase()).join(', ');
  return (
    <div className={cx('vui-countdown', 'vui-countdown--' + variant, 'vui-countdown--' + size, className)} role="timer" aria-label={readable + ' remaining'}>
      {units.map((u, i) => (
        <React.Fragment key={u}>
          {variant === 'inline' && i > 0 && <Separator variant="text">:</Separator>}
          <span className="vui-countdown__unit" aria-hidden="true">
            <span className="vui-countdown__num" key={v[u]}>{u === 'days' ? v[u] : pad(v[u])}</span>
            {variant === 'boxes' && <span className="vui-countdown__label">{labels[u]}</span>}
          </span>
        </React.Fragment>
      ))}
    </div>
  );
}
