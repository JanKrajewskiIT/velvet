import { children, createMemo, type JSX, mergeProps, Show, splitProps } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { variantClass } from '../../utils/cssModule';
import { cx } from '../../utils/cx';
import { percentOf } from '../../utils/math';
import type { HtmlProps } from '../../utils/polymorphic';
import { Meter } from '../primitives/Meter';
import { Text } from '../primitives/Text';
import { typographyClass } from '../primitives/typography';
import styles from './Progress.module.css';

const PROGRESS_CLASSES = {
  success: styles.progressVariantSuccess,
  warning: styles.progressVariantWarning,
  danger: styles.progressVariantDanger,
  neutral: styles.progressVariantNeutral,
} as const;

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
        styles.progress,
        variantClass(PROGRESS_CLASSES, local.size),
        variantClass(PROGRESS_CLASSES, local.tone),
        local.indeterminate && 'vui-progress--indeterminate',
        local.class,
      )}
    >
      <Show when={label() || local.showValue}>
        <div class={cx(styles.progressPartHead, typographyClass('body-sm'))}>
          <Show when={label()}>
            <Text as="span" variant="label" tone="inherit" class="vui-progress__label">
              {label()}
            </Text>
          </Show>
          <Show when={local.showValue && !local.indeterminate}>
            <Text as="span" variant="caption" mono tone="secondary" tabular class="vui-progress__value">
              {valueText()}
            </Text>
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
