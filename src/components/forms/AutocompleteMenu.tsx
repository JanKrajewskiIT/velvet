import { For, Show } from 'solid-js';

import { Listbox } from '../primitives/Listbox';
import { ListboxPanel } from '../primitives/ListboxPanel';
import { highlightMatch } from '../primitives/Mark';
import { AutocompleteCustomOption } from './AutocompleteCustomOption';
import styles from './AutocompleteMenu.module.css';
import { ComboboxOption } from './ComboboxOption';
import type { ComboboxPopup } from './createComboboxPopup';
import { OptionListStatus, type OptionListStatusProps } from './OptionListStatus';
import type { SelectOption } from './selectOption';

export interface AutocompleteMenuProps {
  popup: ComboboxPopup;
  options: readonly SelectOption[];
  value: string | null;
  query: string;
  label?: string;
  labelledBy?: string;
  custom?: { label: string; onPick: () => void };
  status: OptionListStatusProps;
  onPick: (option: SelectOption) => void;
}

export const AutocompleteMenu = (props: AutocompleteMenuProps) => (
  <ListboxPanel
    flip={false}
    up={props.popup.floating.side() === 'top'}
    ref={props.popup.floating.ref}
    class={styles.comboboxPartMenu}
    style={props.popup.floating.style()}
  >
    <Listbox
      floating={false}
      id={props.popup.listId()}
      aria-busy={props.status.loading || undefined}
      aria-label={props.label}
      aria-labelledby={props.labelledBy}
      class={styles.comboboxPartList}
    >
      <For each={props.options}>
        {(option, index) => (
          <ComboboxOption
            id={props.popup.optionId(index())}
            selected={props.value === option.value}
            active={index() === props.popup.active()}
            disabled={option.disabled}
            onHover={() => !option.disabled && props.popup.setActive(index())}
            onPick={() => props.onPick(option)}
            icon={option.icon}
            label={highlightMatch(option.label, props.query)}
            description={option.description}
            checkEnd
          />
        )}
      </For>
      <Show when={props.custom}>
        {(custom) => (
          <AutocompleteCustomOption
            id={props.popup.optionId(props.options.length)}
            active={props.popup.active() === props.options.length}
            onHover={() => props.popup.setActive(props.options.length)}
            label={custom().label}
            onPick={() => custom().onPick()}
          />
        )}
      </Show>
    </Listbox>
    <OptionListStatus {...props.status} />
  </ListboxPanel>
);
