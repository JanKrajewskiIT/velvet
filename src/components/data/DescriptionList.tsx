import { For, type JSX, mergeProps, Show, splitProps } from 'solid-js';

import { cx } from '../../utils/cx';
import type { HtmlProps } from '../../utils/polymorphic';

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
    <dl {...rest} class={cx('vui-dl', `vui-dl--${local.layout}`, local.class)} style={style()}>
      <For each={local.items}>
        {(item) => (
          <div class="vui-dl__row" style={item.span ? { 'grid-column': `span ${item.span}` } : undefined}>
            <dt class="vui-dl__term">
              {item.term}
              <Show when={item.hint}>{(hint) => <span class="vui-dl__hint">{hint()}</span>}</Show>
            </dt>
            <dd class={cx('vui-dl__desc', item.mono && 'vui-dl__desc--mono')}>
              <Show when={item.description ?? undefined} fallback={<span class="vui-dl__empty">—</span>}>
                {(description) => description()}
              </Show>
            </dd>
          </div>
        )}
      </For>
    </dl>
  );
};
