import { createUniqueId, Show, splitProps } from 'solid-js';

import LabelText from '~/components/typography/LabelText/LabelText';
import type Props from '~/models/Props';
import type { ButtonCoreNativeProps } from '~/models/Props';
import { joinAriaIds } from '~/utils/aria';
import classNames from '~/utils/classNames';

import styles from './Switch.module.css';

interface SwitchOwnProps extends Omit<ButtonCoreNativeProps, 'type' | 'onChange'> {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
}

const Switch = (props: Props<SwitchOwnProps>) => {
  const generatedId = createUniqueId();
  const [local, rest] = splitProps(props, [
    'checked',
    'onChange',
    'label',
    'description',
    'class',
    'disabled',
    'aria-labelledby',
  ]);

  const hasText = () => Boolean(local.label || local.description);
  const textId = () => `${generatedId}-text`;
  const labelledBy = () => {
    return joinAriaIds(local['aria-labelledby'], hasText() ? textId() : undefined);
  };

  return (
    <div class={classNames(styles.wrapper, local.class)}>
      <button
        {...rest}
        class={classNames(styles.switch, local.checked && styles.checked)}
        type="button"
        role="switch"
        aria-checked={local.checked}
        aria-labelledby={labelledBy()}
        disabled={local.disabled}
        onClick={() => local.onChange(!local.checked)}
      >
        <span class={styles.thumb} />
      </button>
      <Show when={hasText()}>
        <LabelText id={textId()} label={local.label} description={local.description} />
      </Show>
    </div>
  );
};

export default Switch;
