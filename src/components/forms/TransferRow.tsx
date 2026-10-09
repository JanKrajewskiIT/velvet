import { type JSX, Show } from 'solid-js';

import { cx } from '../../utils/cx';
import { Checkmark } from '../primitives/Checkmark';
import { Glyph } from '../primitives/Glyph';
import { Handle } from '../primitives/Handle';
import { highlightMatch } from '../primitives/Mark';
import { SectionLabel } from '../primitives/SectionLabel';
import type { TransferDrag } from './createTransferDrag';
import type { TransferSelection } from './createTransferSelection';
import type { TransferItem, TransferRowState } from './transferItem';

export interface TransferRowProps {
  item: TransferItem;
  index: number;
  /** Group heading rendered above this row. */
  heading?: string;
  marked: ReadonlySet<string>;
  query: string;
  orderable: boolean;
  renderItem?: (item: TransferItem, state: TransferRowState) => JSX.Element;
  onMove: (values: string[]) => void;
  selection: TransferSelection;
  drag: TransferDrag;
}

/** One option of the panel listbox, preceded by its group heading when it starts a group. */
export const TransferRow = (props: TransferRowProps) => {
  const selected = () => props.marked.has(props.item.value);

  return (
    <>
      <Show when={props.heading}>
        {(heading) => (
          <SectionLabel as="li" role="presentation" class="vui-xfer__group">
            {heading()}
          </SectionLabel>
        )}
      </Show>
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events -- keyboard handled by the listbox via roving tabindex */}
      <li
        data-k={props.index}
        role="option"
        aria-selected={selected()}
        aria-disabled={props.item.disabled || undefined}
        tabIndex={props.index === props.selection.focus() ? 0 : -1}
        class={cx(
          'vui-xfer__item',
          selected() && 'vui-xfer__item--on',
          props.item.disabled && 'vui-xfer__item--disabled',
          props.drag.dropsBefore(props.item.value) && 'vui-xfer__item--before',
        )}
        draggable={!props.item.disabled}
        onDragStart={(e) => props.drag.onDragStart(e, props.item)}
        onDragOver={(e) => props.orderable && props.drag.onDragOver(e, { before: props.item.value })}
        onDrop={(e) => props.orderable && props.drag.onDrop(e, props.item.value)}
        onClick={(e) => props.selection.toggle(props.item, props.index, e.shiftKey)}
        onDblClick={() => !props.item.disabled && props.onMove([props.item.value])}
        onFocus={() => props.selection.setFocus(props.index)}
      >
        <Checkmark checked={selected()} />
        <Show
          when={props.renderItem}
          fallback={
            <>
              <Show when={props.item.avatar || props.item.icon}>
                <span class={cx('vui-xfer__lead', props.item.icon && 'vui-xfer__lead--icon')} aria-hidden="true">
                  <Show when={props.item.icon} fallback={props.item.avatar}>
                    {(icon) => <Glyph name={icon()} />}
                  </Show>
                </span>
              </Show>
              <span class="vui-xfer__text">
                <span class="vui-xfer__label">
                  {typeof props.item.label === 'string'
                    ? highlightMatch(props.item.label, props.query)
                    : props.item.label}
                </span>
                <Show when={props.item.description}>
                  {(description) => <span class="vui-xfer__desc">{highlightMatch(description(), props.query)}</span>}
                </Show>
              </span>
              <Show when={props.item.meta}>
                <span class="vui-xfer__meta">{props.item.meta}</span>
              </Show>
            </>
          }
        >
          {(render) => render()(props.item, { query: props.query, selected: selected() })}
        </Show>
        <Show when={props.orderable && !props.item.disabled}>
          <Handle decorative class="vui-xfer__grip" />
        </Show>
      </li>
    </>
  );
};
