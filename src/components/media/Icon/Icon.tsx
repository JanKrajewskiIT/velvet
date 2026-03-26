import type { IconTypes } from 'solid-icons';
import { splitProps } from 'solid-js';
import { Dynamic } from 'solid-js/web';

import type Props from '~/models/Props';
import type { ComponentSize, SpanCoreNativeProps } from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './Icon.module.css';

type IconVariant = 'inherit' | 'muted' | 'primary' | 'info' | 'success' | 'warning' | 'error' | 'inverse';

interface IconOwnProps extends Omit<SpanCoreNativeProps, 'children'> {
  icon: IconTypes;
  size?: ComponentSize;
  variant?: IconVariant;
  label?: string;
  children?: never;
}

const Icon = (props: Props<IconOwnProps>) => {
  const [local, rest] = splitProps(props, [
    'icon',
    'size',
    'variant',
    'label',
    'class',
    'role',
    'aria-label',
    'aria-hidden',
  ]);

  const resolvedLabel = () => local['aria-label'] ?? local.label;
  const resolvedAriaHidden = (): boolean | 'true' | 'false' | undefined => {
    const ariaHidden = local['aria-hidden'];

    if (ariaHidden === 'true' || ariaHidden === 'false' || typeof ariaHidden === 'boolean') {
      return ariaHidden;
    }

    return resolvedLabel() ? undefined : true;
  };

  return (
    <span
      {...rest}
      class={classNames(
        styles.icon,
        styles[`size${(local.size ?? 'md').charAt(0).toUpperCase()}${(local.size ?? 'md').slice(1)}`],
        styles[
          `variant${(local.variant ?? 'inherit').charAt(0).toUpperCase()}${(local.variant ?? 'inherit').slice(1)}`
        ],
        local.class
      )}
      role={local.role ?? (resolvedLabel() ? 'img' : undefined)}
      aria-label={resolvedLabel()}
      aria-hidden={resolvedAriaHidden()}
    >
      <Dynamic component={local.icon} class={styles.glyph} />
    </span>
  );
};

export type { IconOwnProps, IconVariant };
export default Icon;
