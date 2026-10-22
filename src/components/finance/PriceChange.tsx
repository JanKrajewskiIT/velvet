import { useI18n } from '@jankrajewskiit/i18n';
import { createMemo, mergeProps, Show, splitProps } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import type { HtmlProps } from '../../utils/polymorphic';
import { Glyph } from '../primitives/Glyph';
import { marketDirection } from './marketDirection';
import styles from './PriceChange.module.css';

const SUFFIX = { percent: '%', number: '', bp: ' bp', pp: ' pp' } as const;

export interface PriceChangeProps extends HtmlProps<HTMLSpanElement, 'children'> {
  value: number | null | undefined;
  format?: keyof typeof SUFFIX;
  digits?: number;
  unit?: string;
  arrow?: boolean;
  variant?: 'text' | 'pill' | 'solid';
  size?: 'sm' | 'md' | 'lg';
  flatThreshold?: number;
  label?: string;
}

export const PriceChange = (props: PriceChangeProps) => {
  const merged = mergeProps(
    {
      format: 'percent',
      digits: 2,
      arrow: true,
      variant: 'text',
      size: 'md',
      flatThreshold: 0,
    } satisfies Partial<PriceChangeProps>,
    props,
  );
  const [local, rest] = splitProps(merged, [
    'value',
    'format',
    'digits',
    'unit',
    'arrow',
    'variant',
    'size',
    'flatThreshold',
    'label',
    'class',
  ]);
  const i18n = useI18n();
  const translate = useTranslate();
  const valid = () => local.value != null && Number.isFinite(local.value);
  const direction = () =>
    Math.abs(local.value ?? 0) <= local.flatThreshold ? 'flat' : marketDirection(local.value ?? 0);
  const formatter = createMemo(
    () =>
      new Intl.NumberFormat(i18n.locale(), {
        minimumFractionDigits: local.digits,
        maximumFractionDigits: local.digits,
      }),
  );
  const absolute = () => formatter().format(Math.abs(local.value ?? 0));
  const suffix = () => local.unit ?? SUFFIX[local.format];
  const text = () => `${direction() === 'up' ? '+' : direction() === 'down' ? '−' : ''}${absolute()}${suffix()}`;
  const description = () =>
    translate('velvet.finance.priceChange.description', {
      label: local.label ?? '',
      direction: translate(`velvet.finance.priceChange.${direction()}`),
      value: absolute() + suffix(),
    });
  return (
    <span
      {...rest}
      class={cx(styles.root, local.class)}
      data-size={local.size}
      data-variant={valid() ? local.variant : 'text'}
      data-dir={valid() ? direction() : 'none'}
      aria-label={valid() ? description() : rest['aria-label']}
    >
      <Show when={valid()} fallback="—">
        <Show when={local.arrow && direction() !== 'flat'}>
          <Glyph name={direction() === 'up' ? 'arrow-up' : 'arrow-down'} class={styles.icon} />
        </Show>
        <span aria-hidden="true">{text()}</span>
      </Show>
    </span>
  );
};
