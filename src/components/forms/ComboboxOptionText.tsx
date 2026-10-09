import { type JSX, Show } from 'solid-js';

export interface ComboboxOptionTextProps {
  label: JSX.Element;
  description?: JSX.Element;
}

export const ComboboxOptionText = (props: ComboboxOptionTextProps) => (
  <span class="vui-select__label">
    {props.label}
    <Show when={props.description}>
      <span class="vui-select__desc">{props.description}</span>
    </Show>
  </span>
);
