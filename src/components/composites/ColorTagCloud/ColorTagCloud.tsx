import { createMemo, For, Show } from 'solid-js';

import Chip from '~/components/feedback/Chip/Chip';
import EmptyState from '~/components/feedback/EmptyState/EmptyState';
import Stack from '~/components/surfaces/Stack/Stack';
import LabelText from '~/components/typography/LabelText/LabelText';
import type Props from '~/models/Props';
import type { DivCoreNativeProps } from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './ColorTagCloud.module.css';

export interface ColorTagCloudItem {
  id: string;
  label: string;
  color: string;
  disabled?: boolean;
}

interface ColorTagCloudProps extends Omit<DivCoreNativeProps, 'onChange'> {
  items: readonly ColorTagCloudItem[];
  selectedIds?: readonly string[];
  label?: string;
  description?: string;
  emptyMessage?: string;
  emptyHint?: string;
  size?: 'sm' | 'md';
  disabled?: boolean;
  onChange?: (next: string[]) => void;
  children?: never;
}

const ColorTagCloud = (props: Props<ColorTagCloudProps>) => {
  const selection = createMemo(() => new Set(props.selectedIds ?? []));
  const hasItems = createMemo(() => props.items.length > 0);

  const handleToggle = (id: string) => {
    if (!props.onChange) return;

    const next = new Set(selection());
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }

    props.onChange([...next]);
  };

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
          <For each={props.items}>
            {(item) => (
              <Chip
                label={item.label}
                color={item.color}
                size={props.size}
                selected={selection().has(item.id)}
                onClick={props.onChange && !props.disabled && !item.disabled ? () => handleToggle(item.id) : undefined}
              />
            )}
          </For>
        </Stack>
      </Stack>
    </Show>
  );
};

export type { ColorTagCloudProps };
export default ColorTagCloud;
