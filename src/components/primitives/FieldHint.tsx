import { cx } from '../../utils/cx';
import type { HtmlProps } from '../../utils/polymorphic';
import { partitionProps } from '../../utils/props';
import styles from './FieldHint.module.css';
import { Text } from './Text';

export interface FieldHintProps extends HtmlProps<HTMLSpanElement> {
  error?: boolean;
  /** Fixed-height lane; hint text is not announced automatically. */
  lane?: boolean;
}

export const FieldHint = (props: FieldHintProps) => {
  const [local, rest] = partitionProps(props, ['error', 'lane', 'class', 'children']);
  return (
    <Text
      as="span"
      variant="caption"
      tone="inherit"
      class={cx(styles.hint, local.error && styles.hintVariantError, local.lane && styles.hintVariantLane, local.class)}
      {...rest}
    >
      {local.children}
    </Text>
  );
};
