import { createMemo, createUniqueId, For, Show, splitProps } from 'solid-js';

import ClosableChip from '~/components/feedback/ClosableChip/ClosableChip';
import CheckboxIndicator from '~/components/switchers/Checkbox/CheckboxIndicator/CheckboxIndicator';
import useDropdownPanel from '~/hooks/useDropdownPanel';
import { useI18n } from '~/i18n/I18nProvider';
import type Props from '~/models/Props';
import type { AriaFieldProps, ComponentSize } from '~/models/Props';
import { resolveAriaInvalid } from '~/utils/aria';
import classNames from '~/utils/classNames';

import DropdownChevronFieldTrigger from '../Dropdown/DropdownChevronFieldTrigger/DropdownChevronFieldTrigger';
import DropdownOption from '../Dropdown/DropdownOption/DropdownOption';
import DropdownSurface from '../Dropdown/DropdownSurface/DropdownSurface';
import styles from './MultiSelect.module.css';

export interface MultiSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface MultiSelectOwnProps extends AriaFieldProps {
  value: string[];
  options: MultiSelectOption[];
  onChange: (next: string[]) => void;
  name?: string;
  placeholder?: string;
  emptyLabel?: string;
  removeLabel?: string;
  disabled?: boolean;
  size?: ComponentSize;
}

const MultiSelect = (props: Props<MultiSelectOwnProps>) => {
  const { t } = useI18n();
  const [local, rest] = splitProps(props, [
    'value',
    'options',
    'onChange',
    'name',
    'placeholder',
    'emptyLabel',
    'removeLabel',
    'disabled',
    'size',
    'id',
    'aria-labelledby',
    'aria-describedby',
    'aria-invalid',
    'class',
  ]);
  let rootRef: HTMLDivElement | undefined;
  let triggerRef: HTMLButtonElement | undefined;
  let panelRef: HTMLDivElement | undefined;
  const dropdownId = createUniqueId();
  const dropdown = useDropdownPanel({
    rootRef: () => rootRef,
    panelRef: () => panelRef,
    triggerRef: () => triggerRef,
    isInteractive: () => !local.disabled,
  });

  const labelsByValue = createMemo(() => {
    return new Map(local.options.map((option) => [option.value, option.label]));
  });

  const selectedOptions = createMemo(() => {
    return local.value.map((value) => ({
      value,
      label: labelsByValue().get(value) ?? value,
    }));
  });

  const selectedLabels = createMemo(() =>
    selectedOptions()
      .map((option) => option.label)
      .join(', ')
  );

  const isSelected = (value: string) => local.value.includes(value);

  const toggleOption = (option: MultiSelectOption) => {
    if (local.disabled || option.disabled) return;

    if (isSelected(option.value)) {
      local.onChange(local.value.filter((value) => value !== option.value));
      return;
    }

    local.onChange([...local.value, option.value]);
  };

  const removeValue = (value: string) => {
    if (local.disabled) return;
    local.onChange(local.value.filter((entry) => entry !== value));
  };

  const toggleOpen = () => {
    dropdown.toggle();
  };

  const handleTriggerKeyDown = (e: KeyboardEvent) => {
    if (local.disabled) return;
    dropdown.openFromKeyboard(e, { ignoreWhenOpen: true });
  };

  return (
    <div {...rest} ref={rootRef} class={classNames(styles.wrapper, local.class)}>
      <div class={styles.triggerArea}>
        <DropdownChevronFieldTrigger
          id={local.id}
          ref={triggerRef}
          label={local.value.length > 0 ? selectedLabels() : (local.placeholder ?? t('multiselect.selectOptions'))}
          open={dropdown.open()}
          class={classNames(styles.trigger, dropdown.open() && styles.triggerOpen)}
          size={local.size}
          disabled={local.disabled}
          aria-haspopup="listbox"
          aria-expanded={dropdown.open() ? 'true' : 'false'}
          aria-controls={dropdown.open() ? dropdownId : undefined}
          aria-labelledby={local['aria-labelledby']}
          aria-describedby={local['aria-describedby']}
          aria-invalid={resolveAriaInvalid(undefined, props['aria-invalid'])}
          aria-errormessage={props['aria-errormessage']}
          onClick={toggleOpen}
          onKeyDown={handleTriggerKeyDown}
        />

        <Show when={dropdown.open()}>
          <DropdownSurface
            ref={panelRef}
            id={dropdownId}
            class={styles.dropdown}
            align="fullWidth"
            origin="top"
            role="listbox"
            aria-multiselectable="true"
            onKeyDown={dropdown.handlePanelKeyDown}
          >
            <Show
              when={local.options.length > 0}
              fallback={<div class={styles.empty}>{local.emptyLabel ?? t('common.noOptions')}</div>}
            >
              <For each={local.options}>
                {(option) => {
                  const selected = () => isSelected(option.value);

                  return (
                    <DropdownOption
                      class={styles.option}
                      selected={selected()}
                      label={option.label}
                      prefix={<CheckboxIndicator checked={selected()} class={styles.checkbox} />}
                      onClick={() => toggleOption(option)}
                      disabled={option.disabled}
                      role="option"
                      aria-selected={selected() ? 'true' : 'false'}
                    />
                  );
                }}
              </For>
            </Show>
          </DropdownSurface>
        </Show>
      </div>

      <Show when={selectedOptions().length > 0}>
        <div class={styles.selected}>
          <For each={selectedOptions()}>
            {(option) => (
              <ClosableChip
                label={option.label}
                removeLabel={local.removeLabel ? `${local.removeLabel} ${option.label}` : undefined}
                disabled={local.disabled}
                onRemove={() => removeValue(option.value)}
              />
            )}
          </For>
        </div>
      </Show>

      <Show when={Boolean(local.name)}>
        <For each={local.value}>
          {(value) => <input type="hidden" name={local.name} value={value} disabled={local.disabled} />}
        </For>
      </Show>
    </div>
  );
};

export default MultiSelect;
