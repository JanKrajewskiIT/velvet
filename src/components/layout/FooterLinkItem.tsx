import { Show } from 'solid-js';

import { cx } from '../../utils/cx';
import { Badge } from '../display/Badge';
import { Glyph } from '../primitives/Glyph';
import type { FooterLink } from './footerTypes';

export interface FooterLinkItemProps {
  link: FooterLink;
  small?: boolean;
}

export const FooterLinkItem = (props: FooterLinkItemProps) => (
  <a
    href={props.link.href || '#'}
    target={props.link.external ? '_blank' : undefined}
    rel={props.link.external ? 'noreferrer' : undefined}
    aria-current={props.link.current ? 'page' : undefined}
    class={cx('vui-footer__link', props.small && 'vui-footer__link--sm')}
  >
    {props.link.label}
    <Show when={props.link.external}>
      <Glyph name="external-link" class="vui-footer__ext" />
    </Show>
    <Show when={props.link.badge}>
      {(badge) => (
        <Badge size="sm" tone="brand" class="vui-footer__badge">
          {badge()}
        </Badge>
      )}
    </Show>
  </a>
);
