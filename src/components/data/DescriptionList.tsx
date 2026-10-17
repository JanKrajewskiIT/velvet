import { For, type JSX, mergeProps, Show, splitProps } from 'solid-js';

import { variantClass } from '../../utils/cssModule';
import { cx } from '../../utils/cx';
import type { HtmlProps } from '../../utils/polymorphic';
import { Text } from '../primitives/Text';
import styles from './DescriptionList.module.css';

const DL_CLASSES = {
  row: styles.dlVariantRow,
  grid: styles.dlVariantGrid,
} as const;

export interface DescriptionItem {
  term: JSX.Element;
  description?: JSX.Element;
  hint?: JSX.Element;
  /** Monospace value (IDs, keys). */
  mono?: boolean;
  /** grid layout: columns to span. */
  span?: number;
}

export interface DescriptionListProps extends HtmlProps<HTMLDListElement, 'children'> {
  items: DescriptionItem[];
  /** row = label left / value right, divided · grid = label over value in N columns. @default 'row' */
  layout?: 'row' | 'grid';
  /** grid only. @default 2 */
  columns?: number;
}

/** Key–value details (record pages, invoices, settings summary). Missing values show an em dash. */
export const DescriptionList = (props: DescriptionListProps) => {
  const merged = mergeProps({ layout: 'row', columns: 2 } satisfies Partial<DescriptionListProps>, props);
  const [local, rest] = splitProps(merged, ['items', 'layout', 'columns', 'class', 'style']);
  const style = (): JSX.CSSProperties | undefined =>
    local.layout === 'grid' ? { '--dl-cols': local.columns, ...local.style } : local.style;
  return (
    <dl {...rest} class={cx(styles.dl, variantClass(DL_CLASSES, local.layout), local.class)} style={style()}>
      <For each={local.items}>
        {(item) => (
          <div class={styles.dlPartRow} style={item.span ? { 'grid-column': `span ${item.span}` } : undefined}>
            <Text
              as="dt"
              variant={local.layout === 'grid' ? 'section' : 'body-sm'}
              tone="secondary"
              class={styles.dlPartTerm}
            >
              {item.term}
              <Show when={item.hint}>
                {(hint) => (
                  <Text as="span" variant="caption" tone="tertiary" class={styles.dlPartHint}>
                    {hint()}
                  </Text>
                )}
              </Show>
            </Text>
            <Text
              as="dd"
              variant={item.mono ? 'caption' : 'body-sm'}
              tone="primary"
              mono={item.mono}
              class={styles.dlPartDesc}
            >
              <Show
                when={item.description != null}
                fallback={
                  <Text as="span" variant="body-sm" tone="inherit" class={styles.dlPartEmpty}>
                    —
                  </Text>
                }
              >
                {item.description}
              </Show>
            </Text>
          </div>
        )}
      </For>
    </dl>
  );
};
