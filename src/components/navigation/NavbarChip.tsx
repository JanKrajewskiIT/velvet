import type { JSX } from '@solidjs/web';
import { Show } from 'solid-js';

import { booleanAttribute } from '../../utils/booleanAttribute';
import { cx } from '../../utils/cx';
import { type HtmlProps, Polymorphic } from '../../utils/polymorphic';
import { partitionProps, withDefaults } from '../../utils/props';
import { renderIcon } from '../primitives/Glyph';
import styles from './NavbarChip.module.css';

export interface NavbarChipProps extends HtmlProps<HTMLElement, 'onClick'> {
  icon?: JSX.Element;
  onClick?: (event: MouseEvent) => void;
  href?: string;
  tone?: 'on-color' | 'surface';
  iconOnly?: boolean;
  collapse?: boolean;
  label?: string;
  pressed?: boolean;
  /** Ignored when `href` renders the chip as a link. */
  disabled?: boolean;
}

export const NavbarChip = (props: NavbarChipProps) => {
  const merged = withDefaults({ tone: 'on-color' } satisfies Partial<NavbarChipProps>, props);
  const [local, rest] = partitionProps(merged, [
    'icon',
    'onClick',
    'href',
    'tone',
    'iconOnly',
    'collapse',
    'label',
    'pressed',
    'disabled',
    'class',
    'children',
  ]);
  return (
    <Polymorphic
      {...rest}
      tag={local.href ? 'a' : 'button'}
      href={local.href}
      type={local.href ? undefined : 'button'}
      disabled={local.href ? undefined : local.disabled}
      onClick={local.onClick}
      aria-label={local.label}
      title={local.label}
      aria-pressed={local.href ? undefined : booleanAttribute(local.pressed)}
      data-pressed={local.pressed || undefined}
      data-tone={local.tone}
      class={cx(styles.root, local.iconOnly && styles.iconOnly, local.collapse && styles.collapse, local.class)}
    >
      {renderIcon(local.icon)}
      <Show when={!local.iconOnly}>
        <span class={styles.text}>{local.children}</span>
      </Show>
    </Polymorphic>
  );
};
