import { For, type JSX, Show } from 'solid-js';

import { cx } from '../../utils/cx';
import { Glyph } from '../primitives/Glyph';
import { Text } from '../primitives/Text';
import { ComboboxOption } from './ComboboxOption';
import { formatTime } from './time';
import styles from './TimePickerMenu.module.css';

export interface TimePickerMenuProps {
  id: string;
  label: string;
  labelledBy?: string;
  options: readonly string[];
  value: string | null;
  active: number;
  hour12: boolean;
  locale: string;
  ref: JSX.HTMLAttributes<HTMLUListElement>['ref'];
  style?: JSX.CSSProperties;
  onHover: (index: number) => void;
  onSelect: (time: string) => void;
}

export const TimePickerMenu = (props: TimePickerMenuProps) => (
  <ul
    ref={props.ref}
    style={props.style}
    id={props.id}
    role="listbox"
    aria-label={props.label}
    aria-labelledby={props.labelledBy}
    class={cx(styles.selectPartMenu, styles.timePartMenu)}
  >
    <For each={props.options}>
      {(option, index) => (
        <ComboboxOption
          id={`${props.id}-${index()}`}
          selected={option === props.value}
          active={index() === props.active}
          onHover={() => props.onHover(index())}
          onPick={() => props.onSelect(option)}
        >
          <Text as="span" variant="body" tone="inherit" class={styles.selectPartLabel} tabular>
            {formatTime(option, props.hour12, props.locale)}
          </Text>
          <Show when={option === props.value}>
            <Glyph name="check" class={styles.selectPartCheck} />
          </Show>
        </ComboboxOption>
      )}
    </For>
  </ul>
);
