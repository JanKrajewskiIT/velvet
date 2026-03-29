import { createMemo, Show, splitProps } from 'solid-js';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import Text from '../../typography/Text/Text';
import styles from './Divider.module.css';

interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  label?: string;
  variant?: 'solid' | 'dashed';
}

const Divider = (props: Props<DividerProps>) => {
  const [local, rest] = splitProps(props, ['class', 'orientation', 'label', 'variant']);
  const orientation = createMemo(() => local.orientation ?? 'horizontal');
  const variant = createMemo(() => local.variant ?? 'solid');
  const hasLabel = createMemo(() => orientation() === 'horizontal' && Boolean(local.label));
  const dashedClass = createMemo(() => variant() === 'dashed' && styles.dashed);

  return (
    <Show
      when={hasLabel()}
      fallback={
        <Show
          when={orientation() === 'horizontal'}
          fallback={
            <div
              {...rest}
              role="separator"
              aria-orientation="vertical"
              class={classNames(styles.vertical, dashedClass(), local.class)}
            />
          }
        >
          <hr {...rest} class={classNames(styles.horizontalPlain, dashedClass(), local.class)} />
        </Show>
      }
    >
      <div {...rest} role="separator" class={classNames(styles.divider, styles.horizontal, dashedClass(), local.class)}>
        <Text as="span" variant="bodySm" tone="muted" class={styles.label}>
          {local.label}
        </Text>
      </div>
    </Show>
  );
};

export default Divider;
