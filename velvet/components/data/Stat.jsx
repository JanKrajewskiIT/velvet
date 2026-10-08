import React from 'react';
import { Badge } from '../display/Badge.jsx';
import { Card } from '../display/Card.jsx';
import { Sparkline } from '../charts/Sparkline.jsx';
import { cx } from '../primitives/cx.js';
export function Stat({ label, value, delta, tone = 'success', hint, accent, spark, padding = 'sm', className, ...rest }) {
  const toneVar = { success: 'var(--status-success-fg)', danger: 'var(--status-danger-fg)', warning: 'var(--status-warning-fg)', neutral: 'var(--fg-secondary)' }[tone];
  return (
    <Card padding={padding} tone={accent} accent={!!accent} className={cx('vui-stat', className)} {...rest}>
      <div className="vui-stat__label">{label}</div>
      <div className="vui-stat__row">
        <span className="vui-stat__value">{value}</span>
        {delta && <Badge size="sm" tone={tone} style={{ color: toneVar }}>{delta}</Badge>}
      </div>
      {spark && <Sparkline data={spark} height={32} color={accent ? 'var(--tone)' : 'var(--dv-1)'} label={typeof label === 'string' ? label : 'Trend'} className="vui-stat__spark" />}
      {hint && <div className="vui-stat__hint">{hint}</div>}
    </Card>
  );
}
