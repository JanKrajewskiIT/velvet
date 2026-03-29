import { type JSX, splitProps } from 'solid-js';

import FieldBase from '~/components/inputs/FieldBase/FieldBase';
import type { TypographyTone } from '~/components/typography/Typography/Typography';
import type Props from '~/models/Props';
import type { ButtonCoreNativeProps, ComponentSize } from '~/models/Props';
import classNames from '~/utils/classNames';

import DropdownTriggerContent from '../DropdownTriggerContent/DropdownTriggerContent';
import styles from './DropdownFieldTrigger.module.css';

export interface DropdownFieldTriggerProps extends Omit<ButtonCoreNativeProps, 'children'> {
  label: string;
  labelId?: string;
  size?: ComponentSize;
  invalid?: boolean;
  readOnly?: boolean;
  tone?: 'default' | 'inverse';
  labelTone?: TypographyTone;
  children?: JSX.Element;
}

const DropdownFieldTrigger = (props: Props<DropdownFieldTriggerProps>) => {
  const [local, rest] = splitProps(props, [
    'label',
    'labelId',
    'size',
    'invalid',
    'readOnly',
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
        labelId={local.labelId}
        tone={local.tone}
        labelTone={local.labelTone}
        class={styles.content}
      >
        {local.children}
      </DropdownTriggerContent>
    </FieldBase>
  );
};

export default DropdownFieldTrigger;
