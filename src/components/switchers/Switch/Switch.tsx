import { createUniqueId, type JSX, Show, splitProps } from 'solid-js';

import LabelText from '~/components/typography/LabelText/LabelText';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './Switch.module.css';

interface SwitchOwnProps extends Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'onChange'> {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: JSX.Element;
  description?: JSX.Element;
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
    const ids = [local['aria-labelledby'], hasText() ? textId() : undefined].filter(Boolean);
    return ids.length > 0 ? ids.join(' ') : undefined;
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
        <span id={textId()}>
          <LabelText label={local.label} description={local.description} />
        </span>
      </Show>
    </div>
  );
};

export default Switch;
