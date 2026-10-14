import { For, type JSX, Show } from 'solid-js';

import { Glyph } from '../primitives/Glyph';
import { ComboboxOption } from './ComboboxOption';
import { formatTime } from './time';

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
    class="vui-select__menu vui-time__menu"
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
          <span class="vui-select__label" style={{ 'font-variant-numeric': 'tabular-nums' }}>
            {formatTime(option, props.hour12, props.locale)}
          </span>
          <Show when={option === props.value}>
            <Glyph name="check" class="vui-select__check" />
          </Show>
        </ComboboxOption>
      )}
    </For>
  </ul>
);
