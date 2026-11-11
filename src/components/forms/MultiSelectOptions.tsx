import { For, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { Checkmark } from '../primitives/Checkmark';
import { Glyph } from '../primitives/Glyph';
import { ComboboxOption } from './ComboboxOption';
import type { ComboboxPopup } from './createComboboxPopup';
import type { MultiSelectEntry } from './createMultiSelectEntries';
import styles from './MultiSelectOptions.module.css';

export interface MultiSelectOptionsProps {
  options: readonly MultiSelectEntry[];
  selected: readonly string[];
  popup: ComboboxPopup;
  createLabel: string | undefined;
  onToggle: (option: MultiSelectEntry) => void;
}

export const MultiSelectOptions = (props: MultiSelectOptionsProps) => {
  const translate = useTranslate();
  return (
    <For each={props.options}>
      {(option, index) => (
        <ComboboxOption
          id={props.popup.optionId(index())}
          selected={props.selected.includes(option.value)}
          active={index() === props.popup.active()}
          disabled={option.disabled}
          class={styles.option}
          onHover={() => !option.disabled && props.popup.setActive(index())}
          onPick={() => props.onToggle(option)}
          leading={
            <Show
              when={option.create}
              fallback={<Checkmark size="sm" checked={props.selected.includes(option.value)} />}
            >
              <Glyph name="plus" />
            </Show>
          }
          icon={option.icon}
          description={option.description}
          label={
            option.create
              ? translate('velvet.forms.multiSelect.createOption', {
                  verb: props.createLabel ?? translate('velvet.forms.multiSelect.createLabel'),
                  label: option.label,
                })
              : option.label
          }
        />
      )}
    </For>
  );
};
