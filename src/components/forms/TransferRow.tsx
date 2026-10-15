import { type JSX, Show } from 'solid-js';

import { cx } from '../../utils/cx';
import { Checkmark } from '../primitives/Checkmark';
import { Glyph } from '../primitives/Glyph';
import { Handle } from '../primitives/Handle';
import { highlightMatch } from '../primitives/Mark';
import { SectionLabel } from '../primitives/SectionLabel';
import { Text } from '../primitives/Text';
import type { TransferDrag } from './createTransferDrag';
import type { TransferSelection } from './createTransferSelection';
import type { TransferItem, TransferRowState } from './transferItem';
import styles from './TransferRow.module.css';

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
          <SectionLabel as="li" role="presentation" class={styles.xferPartGroup}>
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
          styles.xferPartItem,
          selected() && styles.xferPartItemVariantOn,
          props.item.disabled && styles.xferPartItemVariantDisabled,
          props.drag.dropsBefore(props.item.value) && styles.xferPartItemVariantBefore,
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
                <span
                  class={cx(styles.xferPartLead, props.item.icon && styles.xferPartLeadVariantIcon)}
                  aria-hidden="true"
                >
                  <Show when={props.item.icon} fallback={props.item.avatar}>
                    {(icon) => <Glyph name={icon()} />}
                  </Show>
                </span>
              </Show>
              <span class={styles.xferPartText}>
                <Text as="span" variant="body-sm" tone="inherit" class={styles.xferPartLabel}>
                  {typeof props.item.label === 'string'
                    ? highlightMatch(props.item.label, props.query)
                    : props.item.label}
                </Text>
                <Show when={props.item.description}>
                  {(description) => (
                    <Text as="span" variant="caption" tone="inherit" class={styles.xferPartDesc}>
                      {highlightMatch(description(), props.query)}
                    </Text>
                  )}
                </Show>
              </span>
              <Show when={props.item.meta}>
                <Text as="span" variant="kbd" tone="inherit" class={styles.xferPartMeta}>
                  {props.item.meta}
                </Text>
              </Show>
            </>
          }
        >
          {(render) => render()(props.item, { query: props.query, selected: selected() })}
        </Show>
        <Show when={props.orderable && !props.item.disabled}>
          <Handle decorative class={styles.xferPartGrip} />
        </Show>
      </li>
    </>
  );
};
