import React from 'react';
import { IconTile } from '../primitives/IconTile.jsx';
import { Glyph } from '../primitives/Glyph.jsx';
import { Card } from '../display/Card.jsx';
import { cx } from '../primitives/cx.js';
export function FeatureCard({ icon, title, description, action, href, tone = 'brand', tonal = true, interactive = false, look = 'card', layout = 'stack', className, ...rest }) {
  const act = action || (href && <a className="vui-feature__action" href={href}>Learn more<Glyph name="arrow-right" /></a>);
  return (
    <Card as={interactive && href ? 'a' : 'div'} href={interactive ? href : undefined} hoverable tonal={tonal} interactive={interactive} tone={tone} className={cx('vui-feature', look === 'lift' && 'vui-feature--lift', layout === 'inline' && 'vui-feature--inline', layout === 'header' && 'vui-feature--header', className)} {...rest}>
      {icon && <IconTile icon={icon} size="lg" tone={tone || 'brand'} className="vui-feature__icon" />}
      <span className="vui-feature__title">{title}</span>
      {description && <span className="vui-feature__desc">{description}</span>}
      {act && (interactive ? <span className="vui-feature__action">{action || <>Learn more<Glyph name="arrow-right" /></>}</span> : act)}
    </Card>
  );
}
