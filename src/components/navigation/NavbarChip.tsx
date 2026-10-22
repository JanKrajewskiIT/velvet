import { type JSX, mergeProps, Show, splitProps } from 'solid-js';

import { cx } from '../../utils/cx';
import { type HtmlProps, Polymorphic } from '../../utils/polymorphic';
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
}

export const NavbarChip = (props: NavbarChipProps) => {
  const merged = mergeProps({ tone: 'on-color' } satisfies Partial<NavbarChipProps>, props);
  const [local, rest] = splitProps(merged, [
    'icon',
    'onClick',
    'href',
    'tone',
    'iconOnly',
    'collapse',
    'label',
    'pressed',
    'class',
    'children',
  ]);
  return (
    <Polymorphic
      {...rest}
      tag={local.href ? 'a' : 'button'}
      href={local.href}
      type={local.href ? undefined : 'button'}
      onClick={local.onClick}
      aria-label={local.label}
      title={local.label}
      aria-pressed={local.href ? undefined : local.pressed}
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
