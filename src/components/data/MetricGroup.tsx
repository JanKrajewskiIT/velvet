import { For, type JSX, mergeProps, splitProps } from 'solid-js';

import { cx } from '../../utils/cx';
import type { HtmlProps } from '../../utils/polymorphic';
import styles from './MetricGroup.module.css';

export interface MetricItem {
  label: JSX.Element;
  value: JSX.Element;
  dir?: 'up' | 'down' | 'flat';
}

export interface MetricGroupProps extends HtmlProps<HTMLDListElement> {
  items: MetricItem[];
  columns?: number;
  /** @default 120 */
  minWidth?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'plain' | 'subtle';
}

export const MetricGroup = (props: MetricGroupProps) => {
  const merged = mergeProps({ minWidth: 120, size: 'md', variant: 'plain' } satisfies Partial<MetricGroupProps>, props);
  const [local, rest] = splitProps(merged, ['items', 'columns', 'minWidth', 'size', 'variant', 'class', 'style']);
  return (
    <dl
      {...rest}
      class={cx(styles.root, local.class)}
      data-size={local.size}
      data-variant={local.variant}
      style={{
        'grid-template-columns': local.columns
          ? `repeat(${local.columns}, minmax(0, 1fr))`
          : `repeat(auto-fit, minmax(min(100%, ${local.minWidth}px), 1fr))`,
        ...local.style,
      }}
    >
      <For each={local.items}>
        {(item) => (
          <div class={styles.item}>
            <dt class={styles.label}>{item.label}</dt>
            <dd class={styles.value} data-dir={item.dir}>
              {item.value}
            </dd>
          </div>
        )}
      </For>
    </dl>
  );
};
