import type { JSX } from 'solid-js';

type BaseProps = {
  id?: string;
  class?: string;
  style?: JSX.CSSProperties;
} & {
  [K in `aria-${string}`]?: string | undefined;
} & {
  [K in `data-${string}`]?: string | number | boolean | undefined;
};

type AriaLabelingProps = {
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
};

type AriaValidationProps = {
  'aria-invalid'?: boolean | 'true' | 'false';
  'aria-errormessage'?: string;
};

type AriaFieldProps = AriaLabelingProps & AriaValidationProps;

type ButtonCoreNativeProps = Pick<
  JSX.ButtonHTMLAttributes<HTMLButtonElement>,
  | 'name'
  | 'value'
  | 'form'
  | 'type'
  | 'disabled'
  | 'onClick'
  | 'onBlur'
  | 'onFocus'
  | 'onKeyDown'
  | 'onMouseDown'
  | 'onMouseUp'
  | 'onMouseLeave'
  | 'onMouseEnter'
  | 'onDragStart'
  | 'onDragEnd'
  | 'role'
  | 'tabIndex'
  | 'title'
  | 'draggable'
>;

type InputCoreNativeProps = Pick<
  JSX.InputHTMLAttributes<HTMLInputElement>,
  | 'name'
  | 'value'
  | 'form'
  | 'required'
  | 'disabled'
  | 'readOnly'
  | 'placeholder'
  | 'autofocus'
  | 'autocomplete'
  | 'inputmode'
  | 'maxlength'
  | 'maxLength'
  | 'minlength'
  | 'minLength'
  | 'pattern'
  | 'type'
  | 'onInput'
  | 'onChange'
  | 'onBlur'
  | 'onFocus'
  | 'onKeyDown'
>;

type TextAreaCoreNativeProps = Pick<
  JSX.TextareaHTMLAttributes<HTMLTextAreaElement>,
  | 'name'
  | 'value'
  | 'form'
  | 'required'
  | 'disabled'
  | 'readOnly'
  | 'placeholder'
  | 'rows'
  | 'maxlength'
  | 'minlength'
  | 'onInput'
  | 'onChange'
  | 'onBlur'
  | 'onFocus'
  | 'onKeyDown'
>;

type SelectCoreNativeProps = Pick<
  JSX.SelectHTMLAttributes<HTMLSelectElement>,
  | 'name'
  | 'value'
  | 'form'
  | 'required'
  | 'disabled'
  | 'multiple'
  | 'onInput'
  | 'onChange'
  | 'onBlur'
  | 'onFocus'
  | 'onKeyDown'
>;

type ChoiceInputCoreNativeProps = Pick<
  JSX.InputHTMLAttributes<HTMLInputElement>,
  | 'name'
  | 'value'
  | 'form'
  | 'checked'
  | 'required'
  | 'disabled'
  | 'onClick'
  | 'onInput'
  | 'onChange'
  | 'onBlur'
  | 'onFocus'
  | 'onKeyDown'
>;

type SliderCoreNativeProps = Pick<
  JSX.InputHTMLAttributes<HTMLInputElement>,
  'name' | 'form' | 'required' | 'disabled' | 'onBlur' | 'onFocus' | 'onKeyDown'
>;

type TableHeaderCoreNativeProps = Pick<
  JSX.ThHTMLAttributes<HTMLTableCellElement>,
  | 'children'
  | 'style'
  | 'colspan'
  | 'colSpan'
  | 'rowspan'
  | 'rowSpan'
  | 'headers'
  | 'scope'
  | 'onClick'
  | 'onBlur'
  | 'onFocus'
  | 'onKeyDown'
>;

type TableCellCoreNativeProps = Pick<
  JSX.TdHTMLAttributes<HTMLTableCellElement>,
  | 'children'
  | 'style'
  | 'colspan'
  | 'colSpan'
  | 'rowspan'
  | 'rowSpan'
  | 'headers'
  | 'onClick'
  | 'onBlur'
  | 'onFocus'
  | 'onKeyDown'
>;

type LabelOnlyProps = {
  label: string;
  children?: never;
};

type OptionalLabelOnlyProps = {
  label?: string;
  children?: never;
};

type Props<T = object> = T & BaseProps;

export type {
  AriaFieldProps,
  AriaLabelingProps,
  AriaValidationProps,
  ButtonCoreNativeProps,
  ChoiceInputCoreNativeProps,
  Props as default,
  InputCoreNativeProps,
  LabelOnlyProps,
  OptionalLabelOnlyProps,
  SelectCoreNativeProps,
  SliderCoreNativeProps,
  TableCellCoreNativeProps,
  TableHeaderCoreNativeProps,
  TextAreaCoreNativeProps,
};
