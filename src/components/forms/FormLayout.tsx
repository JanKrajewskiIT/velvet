import { type JSX, mergeProps, splitProps } from 'solid-js';

import { cx } from '../../utils/cx';
import { type HtmlProps, Polymorphic } from '../../utils/polymorphic';
import { cssLength } from '../data/cssLength';

export type FormGap = 'sm' | 'md' | 'lg';

export interface FormLayoutProps extends HtmlProps<HTMLElement, 'onSubmit'> {
  /** @default 'form' */
  as?: 'form' | 'div' | 'section';
  /** sm 12 · md 20 · lg 32 px between children. @default 'md' */
  gap?: FormGap;
  /** Max width, e.g. `640` or `'40rem'`. */
  width?: number | string;
  /** Called after `preventDefault`. Only applies to `as="form"`. */
  onSubmit?: (event: SubmitEvent) => void;
}

/** Vertical form shell. Renders a `<form>` (`noValidate`) or any element. Sets rhythm between sections, grids and fields. */
export const FormLayout = (props: FormLayoutProps) => {
  const merged = mergeProps({ as: 'form', gap: 'md' } satisfies Partial<FormLayoutProps>, props);
  const [local, rest] = splitProps(merged, ['as', 'gap', 'width', 'onSubmit', 'class', 'style']);
  const submit = (event: SubmitEvent) => {
    event.preventDefault();
    local.onSubmit?.(event);
  };
  const style = (): JSX.CSSProperties => ({ 'max-width': cssLength(local.width), ...local.style });
  return (
    <Polymorphic
      {...rest}
      tag={local.as}
      class={cx('vui-form', `vui-form--gap-${local.gap}`, local.class)}
      style={style()}
      noValidate={local.as === 'form' || undefined}
      onSubmit={local.as === 'form' ? submit : undefined}
    />
  );
};
