import { For, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { Checkmark } from '../primitives/Checkmark';
import { Glyph } from '../primitives/Glyph';
import { ComboboxOption } from './ComboboxOption';
import { ComboboxOptionText } from './ComboboxOptionText';
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
        >
          <Show when={option.create} fallback={<Checkmark size="sm" checked={props.selected.includes(option.value)} />}>
            <Glyph name="plus" />
          </Show>
          <Show when={option.icon}>{(icon) => <Glyph name={icon()} />}</Show>
          <ComboboxOptionText
            label={
              option.create
                ? translate('velvet.forms.multiSelect.createOption', {
                    verb: props.createLabel ?? translate('velvet.forms.multiSelect.createLabel'),
                    label: option.label,
                  })
                : option.label
            }
            description={option.description}
          />
        </ComboboxOption>
      )}
    </For>
  );
};
