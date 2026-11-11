import type { JSX } from 'solid-js';

import { ListboxOption } from '../primitives/ListboxOption';

export interface ComboboxOptionProps {
  id: string;
  selected: boolean;
  active: boolean;
  disabled?: boolean | undefined;
  class?: string;
  icon?: JSX.Element;
  label?: JSX.Element;
  description?: JSX.Element;
  leading?: JSX.Element;
  trailing?: JSX.Element;
  checkEnd?: boolean;
  onHover?: () => void;
  onPick: () => void;
  children?: JSX.Element;
}

export const ComboboxOption = (props: ComboboxOptionProps) => (
  <ListboxOption
    id={props.id}
    selected={props.selected}
    active={props.active}
    disabled={props.disabled}
    class={props.class}
    icon={props.icon}
    label={props.label ?? props.children}
    description={props.description}
    leading={props.leading}
    trailing={props.trailing}
    checkEnd={props.checkEnd ?? false}
    onMouseEnter={() => !props.disabled && props.onHover?.()}
    onClick={() => props.onPick()}
  />
);
