import { type JSX, mergeProps, splitProps } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { callHandler } from '../../utils/callHandler';
import { cx, modifier } from '../../utils/cx';
import { type HtmlProps, Polymorphic } from '../../utils/polymorphic';
import { Glyph } from './Glyph';

const BASE = {
  button: 'vui-btn vui-btn--ghost vui-btn--icon',
  field: 'vui-control__btn',
  tag: 'vui-tag__remove',
  bare: undefined,
} as const;

export type CloseButtonVariant = keyof typeof BASE;

export interface CloseButtonProps extends HtmlProps<HTMLElement, 'children' | 'onClick'> {
  /** button = ghost icon button · field = clear inside a Control · tag = remove inside a Tag · bare = host class only. @default 'button' */
  variant?: CloseButtonVariant;
  /** Only for `variant="button"`. @default 'sm' */
  size?: 'xs' | 'sm' | 'md' | 'lg';
  /** Accessible name — say what goes away: "Remove Design", "Clear search". @default localized "Close" */
  label?: string;
  /** Glyph name. @default 'x' */
  icon?: string;
  /** `span` is for use inside another button; it keeps Enter/Space and stops propagation. @default 'button' */
  as?: 'button' | 'span';
  disabled?: boolean;
  onClick?: (e: MouseEvent | KeyboardEvent) => void;
}

/** The one "×" control: closes, dismisses, removes, clears. Always a real control with an accessible name. */
export const CloseButton = (props: CloseButtonProps) => {
  const merged = mergeProps(
    { variant: 'button', size: 'sm', icon: 'x', as: 'button' } satisfies CloseButtonProps,
    props,
  );
  const [local, rest] = splitProps(merged, [
    'variant',
    'size',
    'label',
    'icon',
    'as',
    'disabled',
    'onClick',
    'onKeyDown',
    'class',
  ]);
  const translate = useTranslate();
  const isSpan = () => local.as === 'span';

  const fire = (e: MouseEvent | KeyboardEvent) => {
    if (isSpan()) e.stopPropagation();
    if (local.disabled) return;
    local.onClick?.(e);
  };
  const onKeyDown: JSX.EventHandler<HTMLElement, KeyboardEvent> = (e) => {
    callHandler(local.onKeyDown, e);
    if (e.defaultPrevented || !isSpan() || (e.key !== 'Enter' && e.key !== ' ')) return;
    e.preventDefault();
    fire(e);
  };

  return (
    <Polymorphic
      {...rest}
      tag={local.as}
      type={isSpan() ? undefined : 'button'}
      role={isSpan() ? 'button' : undefined}
      tabIndex={isSpan() ? (local.disabled ? -1 : 0) : undefined}
      disabled={isSpan() ? undefined : local.disabled}
      aria-disabled={isSpan() && local.disabled ? true : undefined}
      aria-label={local.label ?? translate('velvet.common.close')}
      class={cx(BASE[local.variant], local.variant === 'button' && modifier('vui-btn', local.size, 'md'), local.class)}
      onClick={fire}
      onKeyDown={onKeyDown}
    >
      <Glyph name={local.icon} />
    </Polymorphic>
  );
};
