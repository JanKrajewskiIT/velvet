import { createMemo, createUniqueId, Show, splitProps } from 'solid-js';

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
  const hasText = createMemo(() => Boolean(local.label || local.description));
  const textId = createMemo(() => `${generatedId}-text`);
  const labelledBy = createMemo(() => joinAriaIds(local['aria-labelledby'], hasText() ? textId() : undefined));

  const handleClick = () => local.onChange(!local.checked);

  const switchButton = (
    <button
      {...rest}
      class={classNames(styles.switch, local.checked && styles.checked, !hasText() && local.class)}
      type="button"
      role="switch"
      aria-checked={local.checked}
      aria-labelledby={labelledBy()}
      disabled={local.disabled}
      onClick={handleClick}
    >
      <span class={styles.thumb} />
    </button>
  );

  return (
    <Show when={hasText()} fallback={switchButton}>
      <div class={classNames(styles.wrapper, local.class)}>
        {switchButton}
        <LabelText id={textId()} label={local.label} description={local.description} />
      </div>
    </Show>
  );
};

export default Switch;
