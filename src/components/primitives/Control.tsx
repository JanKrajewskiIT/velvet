import { type JSX, mergeProps, Show, splitProps } from 'solid-js';

import { cx, modifier } from '../../utils/cx';
import type { HtmlProps } from '../../utils/polymorphic';
import { renderIcon } from './Glyph';

export interface ControlProps extends HtmlProps<HTMLDivElement, 'prefix'> {
  /** Height from `--control-height-*` (density- and pointer-aware). @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  invalid?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  /** Auto height for a textarea. */
  multiline?: boolean;
  /** Glyph name or node, inside the left edge. */
  iconLeft?: JSX.Element;
  iconRight?: JSX.Element;
  /** Text affix, e.g. `"https://"` or `"€"`. */
  prefix?: JSX.Element;
  suffix?: JSX.Element;
  /** Trailing slot for inline buttons (clear, reveal, stepper). */
  end?: JSX.Element;
}

/** The bordered field shell. Put a native element with class `vui-control__input` inside. */
export const Control = (props: ControlProps) => {
  const merged = mergeProps({ size: 'md' } satisfies ControlProps, props);
  const [local, rest] = splitProps(merged, [
    'size',
    'invalid',
    'disabled',
    'readOnly',
    'multiline',
    'iconLeft',
    'iconRight',
    'prefix',
    'suffix',
    'end',
    'class',
    'children',
  ]);
  return (
    <div
      class={cx(
        'vui-control',
        modifier('vui-control', local.size, 'md'),
        local.multiline && 'vui-control--textarea',
        local.invalid && 'vui-control--invalid',
        local.disabled && 'vui-control--disabled',
        local.readOnly && 'vui-control--readonly',
        local.class,
      )}
      {...rest}
    >
      <Show when={local.iconLeft}>
        <span class="vui-control__adorn">{renderIcon(local.iconLeft)}</span>
      </Show>
      <Show when={local.prefix}>
        <span class="vui-control__affix">{local.prefix}</span>
      </Show>
      {local.children}
      <Show when={local.suffix}>
        <span class="vui-control__affix vui-control__affix--end">{local.suffix}</span>
      </Show>
      <Show when={local.iconRight}>
        <span class="vui-control__adorn vui-control__adorn--end">{renderIcon(local.iconRight)}</span>
      </Show>
      {local.end}
    </div>
  );
};
