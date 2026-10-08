import { children, createMemo, type JSX, mergeProps, Show, splitProps } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import type { HtmlProps } from '../../utils/polymorphic';
import { Meter } from '../primitives/Meter';

export type ProgressTone = 'brand' | 'success' | 'warning' | 'danger' | 'neutral';

export interface ProgressProps extends HtmlProps<HTMLDivElement> {
  value?: number;
  /** @default 100 */
  max?: number;
  label?: JSX.Element;
  showValue?: boolean;
  indeterminate?: boolean;
  /** Use warning/danger for quotas near the limit. @default 'brand' */
  tone?: ProgressTone;
  /** @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** Custom value text — `(v, max) => v + ' of ' + max + ' GB'`. Defaults to a rounded percentage. */
  format?: (value: number, max: number) => string;
}

const percentOf = (value: number, max: number): number => Math.max(0, Math.min(100, (value / max) * 100));

/** Linear progress for determinate tasks (upload, onboarding, quota) or indeterminate loading. */
export const Progress = (props: ProgressProps) => {
  const merged = mergeProps(
    { value: 0, max: 100, showValue: false, indeterminate: false, tone: 'brand', size: 'md' } satisfies ProgressProps,
    props,
  );
  const [local, rest] = splitProps(merged, [
    'value',
    'max',
    'label',
    'showValue',
    'indeterminate',
    'tone',
    'size',
    'format',
    'class',
  ]);
  const translate = useTranslate();
  const label = children(() => local.label);
  const labelText = () => {
    const text = label();
    return typeof text === 'string' ? text : undefined;
  };
  const valueText = createMemo(
    () => local.format?.(local.value, local.max) ?? `${Math.round(percentOf(local.value, local.max))}%`,
  );

  return (
    <div
      {...rest}
      class={cx(
        'vui-progress',
        `vui-progress--${local.size}`,
        `vui-progress--${local.tone}`,
        local.indeterminate && 'vui-progress--indeterminate',
        local.class,
      )}
    >
      <Show when={label() || local.showValue}>
        <div class="vui-progress__head">
          <Show when={label()}>
            <span class="vui-progress__label">{label()}</span>
          </Show>
          <Show when={local.showValue && !local.indeterminate}>
            <span class="vui-progress__value">{valueText()}</span>
          </Show>
        </div>
      </Show>
      <Meter
        value={local.value}
        max={local.max}
        size={local.size}
        tone={local.tone === 'brand' ? undefined : local.tone}
        indeterminate={local.indeterminate}
        class="vui-progress__track"
        role="progressbar"
        aria-hidden={false}
        aria-label={labelText()}
        aria-valuemin={0}
        aria-valuemax={local.max}
        aria-valuenow={local.indeterminate ? undefined : local.value}
        aria-valuetext={local.indeterminate ? translate('velvet.common.loading') : valueText()}
      />
    </div>
  );
};
