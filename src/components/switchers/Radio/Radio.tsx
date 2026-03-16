import { createUniqueId, For, type JSX, splitProps } from 'solid-js';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import LabelText from '../../typography/LabelText/LabelText';
import styles from './Radio.module.css';

export interface RadioOption<T extends string = string> {
  value: T;
  label: JSX.Element;
  description?: JSX.Element;
  disabled?: boolean;
}

interface RadioGroupOwnProps<T extends string> extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'onChange'> {
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
          const optionLabel = () => `${optionId()}-label`;

          return (
            <label class={styles.option} for={optionId()}>
              <span class={styles.control}>
                <input
                  id={optionId()}
                  type="radio"
                  name={groupName()}
                  value={option.value}
                  checked={local.value === option.value}
                  disabled={option.disabled}
                  class={styles.input}
                  aria-labelledby={optionLabel()}
                  onChange={() => local.onChange(option.value)}
                />
                <span class={styles.indicator} aria-hidden="true" />
              </span>
              <span id={optionLabel()}>
                <LabelText label={option.label} description={option.description} />
              </span>
            </label>
          );
        }}
      </For>
    </div>
  );
};

export { RadioGroup };
