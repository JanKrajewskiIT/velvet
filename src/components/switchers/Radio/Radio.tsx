import { createUniqueId, For, splitProps } from 'solid-js';

import ChoiceControl from '~/components/switchers/ChoiceControl/ChoiceControl';
import type Props from '~/models/Props';
import type { DivCoreNativeProps } from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './Radio.module.css';

export interface RadioOption<T extends string = string> {
  value: T;
  label: string;
  description?: string;
  disabled?: boolean;
}

interface RadioGroupOwnProps<T extends string> extends Omit<DivCoreNativeProps, 'onChange'> {
  name?: string;
  value: T;
  options: RadioOption<T>[];
  onChange: (value: T) => void;
  direction?: 'row' | 'column';
}

const RadioGroup = <T extends string>(props: Props<RadioGroupOwnProps<T>>) => {
  const generatedName = createUniqueId();
  const [local, rest] = splitProps(props, ['name', 'value', 'options', 'onChange', 'direction', 'class']);

  const groupName = () => local.name || generatedName;

  return (
    <div {...rest} class={classNames(styles.group, styles[local.direction ?? 'column'], local.class)} role="radiogroup">
      <For each={local.options}>
        {(option, index) => {
          const optionId = () => `${groupName()}-${index()}`;

          return (
            <ChoiceControl
              id={optionId()}
              type="radio"
              name={groupName()}
              value={option.value}
              checked={local.value === option.value}
              disabled={option.disabled}
              onChange={() => local.onChange(option.value)}
              controlClass={styles.control}
              inputClass={styles.input}
              indicatorClass={styles.indicator}
              label={option.label}
              description={option.description}
            />
          );
        }}
      </For>
    </div>
  );
};

export { RadioGroup };
