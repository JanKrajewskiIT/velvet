import { createMemo, For, Show } from 'solid-js';

import Chip from '~/components/feedback/Chip/Chip';
import EmptyState from '~/components/feedback/EmptyState/EmptyState';
import Stack from '~/components/surfaces/Stack/Stack';
import LabelText from '~/components/typography/LabelText/LabelText';
import type Props from '~/models/Props';
import type { DivCoreNativeProps } from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './StatusFilterChips.module.css';

type StatusFilterChipVariant = 'info' | 'warning' | 'success' | 'error' | 'primary' | 'primaryOutline' | 'subtle';

export interface StatusFilterChipItem {
  value: string;
  label: string;
  count?: number;
  variant?: StatusFilterChipVariant;
  color?: string;
  disabled?: boolean;
}

interface StatusFilterChipsProps extends Omit<DivCoreNativeProps, 'onChange'> {
  items: readonly StatusFilterChipItem[];
  value?: readonly string[];
  label?: string;
  description?: string;
  emptyMessage?: string;
  emptyHint?: string;
  size?: 'sm' | 'md';
  showCounts?: boolean;
  hideZeroCount?: boolean;
  disabled?: boolean;
  onChange?: (next: string[]) => void;
  children?: never;
}

const StatusFilterChips = (props: Props<StatusFilterChipsProps>) => {
  const selection = createMemo(() => new Set(props.value ?? []));
  const visibleItems = createMemo(() =>
    props.items.filter((item) => !props.hideZeroCount || typeof item.count !== 'number' || item.count > 0)
  );
  const hasItems = createMemo(() => visibleItems().length > 0);

  const handleToggle = (value: string) => {
    if (!props.onChange) return;

    const next = new Set(selection());
    if (next.has(value)) {
      next.delete(value);
    } else {
      next.add(value);
    }

    props.onChange([...next]);
  };

  const getLabel = (item: StatusFilterChipItem) =>
    props.showCounts !== false && typeof item.count === 'number' ? `${item.label} (${item.count})` : item.label;

  return (
    <Show
      when={hasItems()}
      fallback={
        <Show when={props.emptyMessage}>
          <Stack gap="sm" class={props.class}>
            <LabelText label={props.label} description={props.description} />
            <EmptyState message={props.emptyMessage ?? ''} hint={props.emptyHint} />
          </Stack>
        </Show>
      }
    >
      <Stack gap="sm" class={classNames(props.disabled && styles.disabled, props.class)}>
        <LabelText label={props.label} description={props.description} />
        <Stack direction="horizontal" gap="xs" wrap>
          <For each={visibleItems()}>
            {(item) => (
              <Chip
                label={getLabel(item)}
                color={item.color}
                variant={item.variant}
                size={props.size}
                selected={selection().has(item.value)}
                onClick={
                  props.onChange && !props.disabled && !item.disabled ? () => handleToggle(item.value) : undefined
                }
              />
            )}
          </For>
        </Stack>
      </Stack>
    </Show>
  );
};

export type { StatusFilterChipsProps, StatusFilterChipVariant };
export default StatusFilterChips;
