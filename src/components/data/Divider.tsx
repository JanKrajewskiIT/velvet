import type { JSX } from '@solidjs/web';
import { Show } from 'solid-js';

import { cx } from '../../utils/cx';
import type { HtmlProps } from '../../utils/polymorphic';
import { partitionProps, withDefaults } from '../../utils/props';
import { Text } from '../primitives/Text';
import styles from './Divider.module.css';

export interface DividerProps extends HtmlProps<HTMLDivElement, 'children'> {
  label?: JSX.Element;
  /** @default 'horizontal' */
  orientation?: 'horizontal' | 'vertical';
}

/** Hairline separator, optionally with a centered label ("or"). */
export const Divider = (props: DividerProps) => {
  const merged = withDefaults({ orientation: 'horizontal' } satisfies DividerProps, props);
  const [local, rest] = partitionProps(merged, ['label', 'orientation', 'class']);
  return (
    <div
      {...rest}
      role="separator"
      aria-orientation={local.orientation}
      class={cx(
        styles.divider,
        !local.label && local.orientation === 'horizontal' && styles.dividerVariantPlain,
        local.orientation === 'vertical' && styles.dividerVariantVertical,
        local.class,
      )}
    >
      <Show when={local.label !== undefined && local.label !== null && local.label !== false}>
        <Text as="span" variant="caption" tone="tertiary">
          {local.label}
        </Text>
      </Show>
    </div>
  );
};
