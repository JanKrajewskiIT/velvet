import { For, type JSX, mergeProps, Show, splitProps } from 'solid-js';

import { createRecordKeys } from '../../hooks/createRecordKeys';
import { cx } from '../../utils/cx';
import { type HtmlProps, Polymorphic } from '../../utils/polymorphic';
import { Text } from '../primitives/Text';
import { typographyClass } from '../primitives/typography';
import styles from './ChartLegend.module.css';
import { ChartSwatch } from './ChartSwatch';

export interface ChartLegendItem {
  /** Defaults to a string label. Supply a key for JSX labels. */
  key?: string;
  label: JSX.Element;
  color?: string;
  swatch?: 'dot' | 'band';
  round?: boolean;
  valueLabel?: JSX.Element;
  shareLabel?: JSX.Element;
}

export interface ChartLegendProps extends HtmlProps<HTMLElement, 'onToggle'> {
  items: readonly ChartLegendItem[];
  /** @default 'inline' */
  layout?: 'inline' | 'list';
  off?: readonly string[];
  onToggle?: (item: ChartLegendItem) => void;
  /** List layout: visible item on hover / focus; null on leave. */
  onHover?: (item: ChartLegendItem | null) => void;
}

const NO_EXCLUDED: readonly string[] = Object.freeze([]);

export const ChartLegend = (props: ChartLegendProps) => {
  const merged = mergeProps({ layout: 'inline', off: NO_EXCLUDED } satisfies Partial<ChartLegendProps>, props);
  const [local, rest] = splitProps(merged, ['items', 'layout', 'off', 'onToggle', 'onHover', 'class']);
  const records = createRecordKeys(
    () => local.items,
    (item, index) => item.key ?? (typeof item.label === 'string' ? item.label : index),
    'ChartLegend',
  );
  const on = (item: ChartLegendItem) => {
    const key = item.key ?? item.label;
    return typeof key !== 'string' || !local.off.includes(key);
  };
  return (
    <Polymorphic
      {...rest}
      tag={local.layout === 'list' ? 'ul' : 'div'}
      class={cx(local.layout === 'list' ? styles.list : styles.inline, local.class)}
    >
      <For each={records.keys()}>
        {(key) => (
          <Show when={local.items[records.indexOf(key)]}>
            {(item) => (
              <Show
                when={local.layout === 'list'}
                fallback={
                  <Polymorphic
                    tag={local.onToggle ? 'button' : 'span'}
                    type={local.onToggle ? 'button' : undefined}
                    aria-pressed={local.onToggle ? on(item()) : undefined}
                    class={cx(
                      typographyClass('caption'),
                      styles.inlineItem,
                      local.onToggle && styles.toggle,
                      local.onToggle && !on(item()) && styles.off,
                    )}
                    onClick={local.onToggle ? () => local.onToggle?.(item()) : undefined}
                  >
                    <ChartSwatch color={item().color} swatch={item().swatch} round={item().round} />
                    {item().label}
                  </Polymorphic>
                }
              >
                <li>
                  <button
                    type="button"
                    aria-pressed={on(item())}
                    class={cx(typographyClass('body-sm'), styles.listItem, !on(item()) && styles.listOff)}
                    onMouseEnter={() => on(item()) && local.onHover?.(item())}
                    onMouseLeave={() => local.onHover?.(null)}
                    onFocus={() => on(item()) && local.onHover?.(item())}
                    onBlur={() => local.onHover?.(null)}
                    onClick={() => local.onToggle?.(item())}
                  >
                    <ChartSwatch color={item().color} swatch={item().swatch} round={item().round} />
                    <span class={styles.name}>{item().label}</span>
                    <Text as="span" variant="body-sm" tone="secondary" tabular>
                      {item().valueLabel}
                    </Text>
                    <Text as="span" variant="kbd" tone="inherit" class={styles.share}>
                      {item().shareLabel}
                    </Text>
                  </button>
                </li>
              </Show>
            )}
          </Show>
        )}
      </For>
    </Polymorphic>
  );
};
