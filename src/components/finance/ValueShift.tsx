import { useI18n } from '@jankrajewskiit/i18n';
import { createMemo, type JSX, Show, splitProps } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import type { HtmlProps } from '../../utils/polymorphic';
import { Glyph } from '../primitives/Glyph';
import { VisuallyHidden } from '../primitives/VisuallyHidden';
import styles from './ValueShift.module.css';

export interface ValueShiftProps<T = number> extends HtmlProps<HTMLSpanElement> {
  from: T;
  to: T;
  format?: (value: T) => JSX.Element;
  worse?: (from: T, to: T) => boolean;
  better?: (from: T, to: T) => boolean;
  label?: string;
}

export const ValueShift = <T,>(props: ValueShiftProps<T>) => {
  const [local, rest] = splitProps(props, ['from', 'to', 'format', 'worse', 'better', 'label', 'class']);
  const i18n = useI18n();
  const translate = useTranslate();
  const formatter = createMemo(() => new Intl.NumberFormat(i18n.locale()));
  const format = (value: T) =>
    local.format
      ? local.format(value)
      : value == null
        ? '—'
        : typeof value === 'number'
          ? formatter().format(value)
          : String(value);
  const state = () =>
    local.worse?.(local.from, local.to) ? 'worse' : local.better?.(local.from, local.to) ? 'better' : 'same';
  return (
    <span {...rest} class={cx(styles.root, local.class)} data-state={state()}>
      <VisuallyHidden>
        {local.label ? `${local.label}: ` : ''}
        {translate('velvet.finance.valueShift.expected')}{' '}
      </VisuallyHidden>
      <span class={styles.from}>{format(local.from)}</span>
      <Glyph name="arrow-right" class={styles.arrow} />
      <VisuallyHidden> {translate('velvet.finance.valueShift.actual')} </VisuallyHidden>
      <span class={styles.to}>{format(local.to)}</span>
      <Show when={state() !== 'same'}>
        <VisuallyHidden>
          {' '}
          {translate(state() === 'worse' ? 'velvet.finance.valueShift.worse' : 'velvet.finance.valueShift.better')}
        </VisuallyHidden>
      </Show>
    </span>
  );
};
