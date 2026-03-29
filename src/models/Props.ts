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
type ComponentSize = 'sm' | 'md' | 'lg';

type HTMLElementCoreNativeProps = Partial<
  Pick<
    JSX.HTMLAttributes<HTMLElement>,
    | 'children'
    | 'role'
    | 'tabIndex'
    | 'title'
    | 'draggable'
    | 'hidden'
    | 'onClick'
    | 'onInput'
    | 'onChange'
    | 'onBlur'
    | 'onFocus'
    | 'onKeyDown'
    | 'onKeyUp'
    | 'onMouseDown'
    | 'onMouseUp'
    | 'onMouseLeave'
    | 'onMouseEnter'
    | 'onPointerDown'
    | 'onPointerUp'
    | 'onPointerLeave'
    | 'onPointerEnter'
    | 'onDragStart'
    | 'onDragEnd'
    | 'onContextMenu'
  >
>;

type DivCoreNativeProps = Partial<Pick<JSX.HTMLAttributes<HTMLDivElement>, keyof HTMLElementCoreNativeProps>>;

type SpanCoreNativeProps = Partial<Pick<JSX.HTMLAttributes<HTMLSpanElement>, keyof HTMLElementCoreNativeProps>>;

type AnchorCoreNativeProps = Pick<
  JSX.AnchorHTMLAttributes<HTMLAnchorElement>,
  'href' | 'target' | 'rel' | 'download' | 'hreflang' | 'referrerpolicy'
>;

type ListItemCoreNativeProps = Partial<Pick<JSX.HTMLAttributes<HTMLLIElement>, keyof HTMLElementCoreNativeProps>>;

type TableCoreNativeProps = Partial<
  Pick<
    JSX.HTMLAttributes<HTMLTableElement>,
    'children' | 'role' | 'tabIndex' | 'title' | 'onClick' | 'onBlur' | 'onFocus' | 'onKeyDown'
  >
>;

type TableSectionCoreNativeProps = Partial<
  Pick<
    JSX.HTMLAttributes<HTMLTableSectionElement>,
    'children' | 'role' | 'tabIndex' | 'title' | 'onClick' | 'onBlur' | 'onFocus' | 'onKeyDown'
  >
>;

type TableRowCoreNativeProps = Partial<
  Pick<
    JSX.HTMLAttributes<HTMLTableRowElement>,
    'children' | 'role' | 'tabIndex' | 'title' | 'onClick' | 'onBlur' | 'onFocus' | 'onKeyDown'
  >
>;

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
  | 'list'
  | 'maxlength'
  | 'maxLength'
  | 'max'
  | 'minlength'
  | 'minLength'
  | 'min'
  | 'pattern'
  | 'step'
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

type OptionCoreNativeProps = Pick<
  JSX.OptionHTMLAttributes<HTMLOptionElement>,
  | 'value'
  | 'label'
  | 'selected'
  | 'disabled'
  | 'onClick'
  | 'onInput'
  | 'onChange'
  | 'onBlur'
  | 'onFocus'
  | 'onKeyDown'
  | 'children'
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
  AnchorCoreNativeProps,
  AriaFieldProps,
  AriaLabelingProps,
  AriaValidationProps,
  ButtonCoreNativeProps,
  ChoiceInputCoreNativeProps,
  ComponentSize,
  Props as default,
  DivCoreNativeProps,
  HTMLElementCoreNativeProps,
  InputCoreNativeProps,
  LabelOnlyProps,
  ListItemCoreNativeProps,
  OptionalLabelOnlyProps,
  OptionCoreNativeProps,
  SelectCoreNativeProps,
  SliderCoreNativeProps,
  SpanCoreNativeProps,
  TableCellCoreNativeProps,
  TableCoreNativeProps,
  TableHeaderCoreNativeProps,
  TableRowCoreNativeProps,
  TableSectionCoreNativeProps,
  TextAreaCoreNativeProps,
};
