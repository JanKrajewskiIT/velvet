import { splitProps } from 'solid-js';

import { cx } from '../../utils/cx';
import type { HtmlProps } from '../../utils/polymorphic';
import styles from './FieldHint.module.css';
import { Text } from './Text';

export interface FieldHintProps extends HtmlProps<HTMLSpanElement> {
  error?: boolean;
  /** Fixed-height lane that announces changes politely. */
  lane?: boolean;
}

export const FieldHint = (props: FieldHintProps) => {
  const [local, rest] = splitProps(props, ['error', 'lane', 'class', 'children']);
  return (
    <Text
      as="span"
      variant="caption"
      tone="inherit"
      class={cx(styles.hint, local.error && styles.hintVariantError, local.lane && styles.hintVariantLane, local.class)}
      aria-live={local.lane ? 'polite' : undefined}
      {...rest}
    >
      {local.children}
    </Text>
  );
};
