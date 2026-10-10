import { createUniqueId, For, type JSX, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { EmptyText } from '../primitives/EmptyText';
import { createTransferDrag } from './createTransferDrag';
import { createTransferSelection } from './createTransferSelection';
import { createTransferView } from './createTransferView';
import { SearchInput } from './SearchInput';
import { type TransferItem, type TransferRowState, type TransferSide } from './transferItem';
import { TransferPanelFooter } from './TransferPanelFooter';
import { TransferPanelHeader } from './TransferPanelHeader';
import { TransferRow } from './TransferRow';

export interface TransferPanelLabels {
  title: string;
  moveLabel: string;
  searchPlaceholder: string;
  empty: JSX.Element;
}

export interface TransferPanelProps {
  side: TransferSide;
  items: readonly TransferItem[];
  labels: TransferPanelLabels;
  query: string;
  onQueryChange: (query: string) => void;
  marked: ReadonlySet<string>;
  onMarkedChange: (marked: ReadonlySet<string>) => void;
  /** Moves the given values to the other panel. */
  onMove: (values: string[]) => void;
  /** An item set dropped onto this panel, optionally before one of its rows. */
  onDropIn: (from: TransferSide, values: string[], before?: string) => void;
  /** Present when rows can be reordered (drag, or Alt+↑/↓). */
  onReorder?: (value: string, direction: 1 | -1) => void;
  searchable: boolean;
  groupBy: boolean;
  /** List height in px. */
  height: number;
  /** The right list reached its maximum size. */
  limitHit: boolean;
  renderItem?: (item: TransferItem, state: TransferRowState) => JSX.Element;
}

/** One side of the TransferList: header with select-all, search, grouped listbox and the move footer. */
export const TransferPanel = (props: TransferPanelProps) => {
  const translate = useTranslate();
  const titleId = createUniqueId();
  let list: HTMLUListElement | undefined;

  const view = createTransferView({ items: () => props.items, query: () => props.query, marked: () => props.marked });
  const selection = createTransferSelection({ view, props, list: () => list });
  const drag = createTransferDrag({ view, props });
  const orderable = () => !!props.onReorder;

  const groupHeading = (item: TransferItem, index: number): string | undefined => {
    if (!props.groupBy || !item.group) return undefined;
    return item.group === view.visible()[index - 1]?.group ? undefined : item.group;
  };

  return (
    <section
      class={cx(
        'vui-xfer__panel',
        drag.drop() && 'vui-xfer__panel--drop',
        props.limitHit && props.side === 'right' && 'vui-xfer__panel--full',
      )}
      aria-labelledby={titleId}
      onDragOver={(e) => drag.onDragOver(e, 'end')}
      onDragLeave={drag.onDragLeave}
      onDrop={(e) => drag.onDrop(e)}
    >
      <TransferPanelHeader
        titleId={titleId}
        title={props.labels.title}
        total={props.items.length}
        view={view}
        onToggleAll={selection.toggleAll}
      />
      <Show when={props.searchable}>
        <div class="vui-xfer__search">
          <SearchInput
            size="sm"
            value={props.query}
            onValueChange={props.onQueryChange}
            placeholder={props.labels.searchPlaceholder}
            aria-label={translate('velvet.forms.transferPanel.searchLabel', { title: props.labels.title })}
            onKeyDown={(e: KeyboardEvent) => {
              if (e.key === 'ArrowDown') {
                e.preventDefault();
                selection.focusRow(0);
              }
              if (e.key === 'Escape' && props.query) {
                e.stopPropagation();
                props.onQueryChange('');
              }
            }}
          />
        </div>
      </Show>
      <ul
        ref={(element) => {
          list = element;
        }}
        class="vui-xfer__list"
        role="listbox"
        aria-multiselectable="true"
        aria-labelledby={titleId}
        style={{ height: `${props.height}px` }}
        onKeyDown={selection.onKeyDown}
      >
        <For each={view.visible()}>
          {(item, index) => (
            <TransferRow
              item={item}
              index={index()}
              heading={groupHeading(item, index())}
              marked={props.marked}
              query={props.query}
              orderable={orderable()}
              renderItem={props.renderItem}
              onMove={props.onMove}
              selection={selection}
              drag={drag}
            />
          )}
        </For>
        <Show when={view.visible().length === 0}>
          <EmptyText as="li" role="presentation" class="vui-xfer__empty">
            <Show when={props.query} fallback={props.labels.empty}>
              {translate('velvet.forms.transferPanel.noMatchesFor', { query: props.query })}
              <button type="button" class="vui-xfer__link" onClick={() => props.onQueryChange('')}>
                {translate('velvet.forms.transferPanel.clearSearch')}
              </button>
            </Show>
          </EmptyText>
        </Show>
        <Show when={drag.drop() === 'end' && view.visible().length > 0}>
          <li role="presentation" class="vui-xfer__dropline" />
        </Show>
      </ul>
      <TransferPanelFooter
        side={props.side}
        moveLabel={props.labels.moveLabel}
        checkedCount={view.checked().length}
        limitHit={props.limitHit}
        onMove={() => props.onMove(view.checked().map((item) => item.value))}
        onDeselect={() =>
          selection.mark([...props.marked].filter((value) => !view.checked().some((item) => item.value === value)))
        }
      />
    </section>
  );
};
