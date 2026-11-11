import { For, type JSX } from 'solid-js';

import { Listbox } from '../primitives/Listbox';
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
  up?: boolean;
  onHover: (index: number) => void;
  onSelect: (time: string) => void;
}

export const TimePickerMenu = (props: TimePickerMenuProps) => (
  <Listbox
    flip={false}
    up={props.up}
    ref={props.ref}
    style={props.style}
    id={props.id}
    aria-label={props.label}
    aria-labelledby={props.labelledBy}
    class={styles.timePartMenu}
  >
    <For each={props.options}>
      {(option, index) => (
        <ComboboxOption
          id={`${props.id}-${index()}`}
          selected={option === props.value}
          active={index() === props.active}
          onHover={() => props.onHover(index())}
          onPick={() => props.onSelect(option)}
          label={formatTime(option, props.hour12, props.locale)}
          checkEnd
        />
      )}
    </For>
  </Listbox>
);
