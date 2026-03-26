import { type JSX, splitProps } from 'solid-js';
import { Dynamic } from 'solid-js/web';

import type {
  ButtonCoreNativeProps,
  ComponentSize,
  HTMLElementCoreNativeProps,
  InputCoreNativeProps,
  OptionCoreNativeProps,
  SelectCoreNativeProps,
  TextAreaCoreNativeProps,
} from '~/models/Props';
import classNames from '~/utils/classNames';
import getInputSizeClass from '~/utils/getInputSizeClass';

import styles from './FieldBase.module.css';

type FieldBaseSize = ComponentSize;
type FieldBaseFocusStyle = 'visible' | 'within' | 'none';
type FieldBaseDefaultTag = Exclude<keyof JSX.IntrinsicElements, 'input' | 'textarea' | 'button' | 'select' | 'option'>;

interface FieldBaseSharedProps {
  size?: FieldBaseSize | null;
  invalid?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  focusStyle?: FieldBaseFocusStyle;
  class?: string;
  children?: JSX.Element;
}

type FieldBaseInputProps = { as: 'input' } & Omit<InputCoreNativeProps, keyof FieldBaseSharedProps | 'as'> &
  FieldBaseSharedProps;

type FieldBaseTextAreaProps = { as: 'textarea' } & Omit<TextAreaCoreNativeProps, keyof FieldBaseSharedProps | 'as'> &
  FieldBaseSharedProps;

type FieldBaseButtonProps = { as: 'button' } & Omit<ButtonCoreNativeProps, keyof FieldBaseSharedProps | 'as'> &
  FieldBaseSharedProps;

type FieldBaseSelectProps = { as: 'select' } & Omit<SelectCoreNativeProps, keyof FieldBaseSharedProps | 'as'> &
  FieldBaseSharedProps;

type FieldBaseOptionProps = { as: 'option' } & Omit<OptionCoreNativeProps, keyof FieldBaseSharedProps | 'as'> &
  FieldBaseSharedProps;

type FieldBaseDefaultProps = { as?: FieldBaseDefaultTag } & Omit<
  HTMLElementCoreNativeProps,
  keyof FieldBaseSharedProps | 'as'
> &
  FieldBaseSharedProps;

type FieldBaseProps =
  | FieldBaseInputProps
  | FieldBaseTextAreaProps
  | FieldBaseButtonProps
  | FieldBaseSelectProps
  | FieldBaseOptionProps
  | FieldBaseDefaultProps;

const FieldBase = (props: FieldBaseProps) => {
  const [local, rest] = splitProps(props, [
    'as',
    'class',
    'size',
    'invalid',
    'readOnly',
    'disabled',
    'focusStyle',
    'children',
  ]);

  const component = () => local.as ?? 'div';
  const sizeClass = () => (local.size === null ? undefined : getInputSizeClass(styles, local.size ?? undefined));

  const focusClass = () => {
    if (local.focusStyle === 'within') return styles.fieldFocusWithin;
    if (local.focusStyle === 'none') return undefined;
    return styles.fieldFocusVisible;
  };

  const stateAttributes = () => {
    const currentComponent = component();

    if (currentComponent === 'input' || currentComponent === 'textarea') {
      return {
        disabled: local.disabled,
        readOnly: local.readOnly,
      };
    }

    if (currentComponent === 'button' || currentComponent === 'select' || currentComponent === 'option') {
      return {
        disabled: local.disabled,
      };
    }

    return {};
  };

  return (
    <Dynamic
      component={component()}
      {...rest}
      {...stateAttributes()}
      class={classNames(
        styles.fieldBase,
        focusClass(),
        sizeClass(),
        local.invalid && styles.fieldInvalid,
        local.readOnly && styles.fieldReadOnly,
        local.disabled && styles.fieldDisabled,
        local.class
      )}
    >
      {local.children}
    </Dynamic>
  );
};

export default FieldBase;
