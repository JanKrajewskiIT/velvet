import { For } from 'solid-js';

import { createControllable } from '../../hooks/createControllable';
import { cx } from '../../utils/cx';
import { Chip } from './Chip';
import styles from './ChipGroup.module.css';
import { type ChipOption, normalizeChipOption } from './chipOption';

interface ChipGroupBaseProps {
  options: ReadonlyArray<string | ChipOption>;
  size?: 'sm' | 'md';
  /** Accessible group name. */
  label?: string;
  class?: string;
}

export type ChipGroupProps = ChipGroupBaseProps &
  (
    | {
        /** Several chips can be on at once. @default true */
        multiple?: true;
        value?: string[];
        defaultValue?: string[];
        onValueChange?: (value: string[]) => void;
      }
    | {
        /** At most one chip is on; pressing it again clears the choice. */
        multiple: false;
        value?: string | null;
        defaultValue?: string | null;
        onValueChange?: (value: string | null) => void;
      }
  );

const toList = (value: string[] | string | null | undefined): string[] | undefined => {
  if (value === undefined) return undefined;
  if (value === null) return [];
  return typeof value === 'string' ? [value] : value;
};

/** Toggle chips for tagging and filtering. Multi-select by default; `multiple={false}` gives a deselectable single choice. For a required single choice use OptionSwitcher. */
export const ChipGroup = (props: ChipGroupProps) => {
  const [selected, setSelected] = createControllable<string[]>({
    value: () => toList(props.value),
    defaultValue: toList(props.defaultValue) ?? [],
    onChange: (next) => {
      if (props.multiple === false) props.onValueChange?.(next[0] ?? null);
      else props.onValueChange?.(next);
    },
  });
  const options = () => props.options.map(normalizeChipOption);
  const isOn = (value: string) => selected().includes(value);
  const toggle = (value: string) => {
    if (isOn(value)) setSelected(selected().filter((item) => item !== value));
    else setSelected(props.multiple === false ? [value] : [...selected(), value]);
  };
  return (
    <div role="group" aria-label={props.label} class={cx(styles.chips, props.class)}>
      <For each={options()}>
        {(option) => (
          <Chip
            selected={isOn(option.value)}
            disabled={option.disabled}
            size={props.size}
            icon={option.icon}
            count={option.count}
            onClick={() => toggle(option.value)}
          >
            {option.label}
          </Chip>
        )}
      </For>
    </div>
  );
};
