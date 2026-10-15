import { Show } from 'solid-js';

import { cx } from '../../utils/cx';
import { Badge } from '../display/Badge';
import { Glyph } from '../primitives/Glyph';
import { typographyClass } from '../primitives/typography';
import styles from './FooterLinkItem.module.css';
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
    class={cx(
      typographyClass(props.small ? 'caption' : 'body-sm'),
      styles.footerPartLink,
      props.small && styles.footerPartLinkVariantSm,
    )}
  >
    {props.link.label}
    <Show when={props.link.external}>
      <Glyph name="external-link" class={styles.footerPartExt} />
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
