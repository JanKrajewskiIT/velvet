import { For, Show } from 'solid-js';

import { cx } from '../../utils/cx';
import { Glyph } from '../primitives/Glyph';
import { highlightMatch } from '../primitives/Mark';
import { AutocompleteCustomOption } from './AutocompleteCustomOption';
import styles from './AutocompleteMenu.module.css';
import { ComboboxOption } from './ComboboxOption';
import { ComboboxOptionText } from './ComboboxOptionText';
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
  <div
    ref={props.popup.floating.ref}
    class={cx(
      styles.selectPartMenu,
      styles.comboboxPartMenu,
      props.popup.floating.side() === 'top' && styles.selectPartMenuVariantUp,
    )}
    style={props.popup.floating.style()}
  >
    <ul
      id={props.popup.listId()}
      role="listbox"
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
          >
            <Show when={option.icon}>{(icon) => <Glyph name={icon()} />}</Show>
            <ComboboxOptionText label={highlightMatch(option.label, props.query)} description={option.description} />
            <Show when={props.value === option.value}>
              <Glyph name="check" class={styles.selectPartCheck} />
            </Show>
          </ComboboxOption>
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
    </ul>
    <OptionListStatus {...props.status} />
  </div>
);
