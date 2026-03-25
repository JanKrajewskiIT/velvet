import { type JSX, splitProps } from 'solid-js';

import FieldBase from '~/components/inputs/FieldBase/FieldBase';
import type { InputSize } from '~/components/inputs/Input/Input';
import type { TypographyTone } from '~/components/typography/Typography/Typography';
import type Props from '~/models/Props';
import type { ButtonCoreNativeProps } from '~/models/Props';
import classNames from '~/utils/classNames';

import DropdownTriggerContent from '../DropdownTriggerContent/DropdownTriggerContent';
import styles from './DropdownFieldTrigger.module.css';

interface DropdownFieldTriggerOwnProps extends Omit<ButtonCoreNativeProps, 'children'> {
  label: string;
  size?: InputSize;
  invalid?: boolean;
  readOnly?: boolean;
  contentClass?: string;
  tone?: 'default' | 'inverse';
  labelTone?: TypographyTone;
  children?: JSX.Element;
}

const DropdownFieldTrigger = (props: Props<DropdownFieldTriggerOwnProps>) => {
  const [local, rest] = splitProps(props, [
    'label',
    'size',
    'invalid',
    'readOnly',
    'contentClass',
    'tone',
    'labelTone',
    'children',
    'class',
    'type',
  ]);

  return (
    <FieldBase
      {...rest}
      as="button"
      size={local.size}
      invalid={local.invalid}
      readOnly={local.readOnly}
      focusStyle="visible"
      type={local.type ?? 'button'}
      class={classNames(styles.trigger, local.readOnly && styles.triggerReadonly, local.class)}
    >
      <DropdownTriggerContent
        label={local.label}
        tone={local.tone}
        labelTone={local.labelTone}
        class={classNames(styles.content, local.contentClass)}
      >
        {local.children}
      </DropdownTriggerContent>
    </FieldBase>
  );
};

export default DropdownFieldTrigger;
