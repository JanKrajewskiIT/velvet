import type { JSX } from 'solid-js';
import { splitProps } from 'solid-js';

import Button from '~/components/buttons/Button/Button';
import Text from '~/components/typography/Text/Text';
import type Props from '~/models/Props';
import type { ButtonCoreNativeProps } from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './DropdownOption.module.css';

export interface DropdownOptionProps extends Omit<ButtonCoreNativeProps, 'children' | 'prefix'> {
  selected?: boolean;
  label: string;
  prefix?: JSX.Element;
  tone?: 'default' | 'primary' | 'success' | 'error';
}

const toneToClass: Record<NonNullable<DropdownOptionProps['tone']>, string | undefined> = {
  default: styles.itemToneDefault,
  primary: styles.itemTonePrimary,
  success: styles.itemToneSuccess,
  error: styles.itemToneError,
};

const DropdownOption = (props: Props<DropdownOptionProps>) => {
  const [local, rest] = splitProps(props, ['class', 'selected', 'type', 'label', 'prefix', 'tone', 'disabled']);

  return (
    <Button
      {...rest}
      variant="subtle"
      size="sm"
      type={local.type ?? 'button'}
      class={classNames(
        styles.item,
        local.selected && styles.itemSelected,
        local.disabled && styles.itemDisabled,
        toneToClass[local.tone ?? 'default'],
        local.class,
      )}
    >
      {local.prefix ? <span class={styles.itemPrefix}>{local.prefix}</span> : undefined}
      <Text as="span" variant="bodySm">
        {local.label}
      </Text>
    </Button>
  );
};

export default DropdownOption;
