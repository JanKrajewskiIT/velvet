import { For, type JSX, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { reportAsyncError } from '../../utils/reportAsyncError';
import { Spinner } from '../feedback/Spinner';
import { Chip } from '../forms/Chip';
import { EmptyText } from '../primitives/EmptyText';
import styles from './ColorLabelChips.module.css';
import type { ColorLabelSelection } from './createColorLabelSelection';

export interface ColorLabelChipsProps {
  selection: ColorLabelSelection;
  /** Accessible name of the chip group. */
  label: string;
  emptyText: JSX.Element;
}

/** Toggle chips for the visible labels, the inline create chip and the empty state. */
export const ColorLabelChips = (props: ColorLabelChipsProps) => {
  const translate = useTranslate();
  const createChipIcon = (): JSX.Element => {
    if (props.selection.creating()) return <Spinner size="inline" tone="current" />;
    return 'plus';
  };

  return (
    <div class={styles.clsPartChips} role="group" aria-label={props.label}>
      <For each={props.selection.visible()}>
        {(label) => {
          const on = () => props.selection.selection().includes(label.id);
          const atLimit = () => !on() && props.selection.full() && !props.selection.single();
          return (
            <Chip
              role={props.selection.single() ? 'radio' : 'checkbox'}
              selected={on()}
              color={label.color}
              count={label.count}
              disabled={props.selection.busy() || atLimit()}
              title={
                atLimit()
                  ? translate('velvet.patterns.colorLabelSelectionDialog.limitReached', { max: props.selection.max() })
                  : undefined
              }
              onClick={() => props.selection.toggle(label.id)}
            >
              {label.name}
            </Chip>
          );
        }}
      </For>
      <Show when={props.selection.canCreate()}>
        <Chip
          dashed
          check={false}
          icon={createChipIcon()}
          disabled={props.selection.creating() || props.selection.busy()}
          onClick={() => void props.selection.create().catch(reportAsyncError)}
        >
          {translate('velvet.patterns.colorLabelSelectionDialog.create', { name: props.selection.trimmedQuery() })}
        </Chip>
      </Show>
      <Show when={props.selection.visible().length === 0 && !props.selection.canCreate()}>
        <EmptyText as="p" align="start" class={styles.clsPartEmpty}>
          {props.selection.query()
            ? translate('velvet.patterns.colorLabelSelectionDialog.noMatch', { query: props.selection.query() })
            : props.emptyText}
        </EmptyText>
      </Show>
    </div>
  );
};
