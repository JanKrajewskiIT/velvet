import { useI18n } from '@jankrajewskiit/i18n';
import { createMemo, For, mergeProps } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { Polymorphic } from '../../utils/polymorphic';
import { Glyph } from '../primitives/Glyph';
import { Meter } from '../primitives/Meter';
import { Text } from '../primitives/Text';
import { typographyClass } from '../primitives/typography';
import { Rating } from './Rating';
import styles from './RatingSummary.module.css';

const DEFAULT_SCALE = 5;
const PERCENT = 100;

export interface RatingSummaryProps {
  /** Votes per star, index 0 = 1★ … last = max★. Length sets the scale, e.g. `[2, 3, 9, 41, 88]`. */
  counts: readonly number[];
  /** Override; otherwise computed from `counts`. */
  average?: number;
  /** Singular noun after the total. @default localized "review" */
  noun?: string;
  /** Plural noun. @default `${noun}s` when `noun` is set, otherwise localized plural forms */
  nounPlural?: string;
  /** Currently filtered star (controlled). */
  activeStar?: number | null;
  /** With a handler the rows become toggle buttons (click the active row again to clear). */
  onFilter?: (star: number | null) => void;
  /** @default localized "Rating breakdown" */
  label?: string;
  /** Accessible name of the average stars. @default localized "Average rating" */
  averageLabel?: string;
  /** Accessible name of one row. @default localized "{star} star(s): {count} ({percent}%)" */
  rowLabel?: (star: number, count: number, percent: number) => string;
  /** Locale of the grouped total and the average. @default the active locale */
  locale?: string;
  class?: string;
}

/** Review summary: big average, read-only stars, total, and a per-star distribution. */
export const RatingSummary = (props: RatingSummaryProps) => {
  const p = mergeProps({ activeStar: null } satisfies Partial<RatingSummaryProps>, props);
  const i18n = useI18n();
  const translate = useTranslate();
  const locale = () => p.locale ?? i18n.locale();
  const oneDecimal = createMemo(
    () => new Intl.NumberFormat(locale(), { minimumFractionDigits: 1, maximumFractionDigits: 1 }),
  );
  const rowLabel = (star: number, count: number, percent: number) =>
    p.rowLabel
      ? p.rowLabel(star, count, percent)
      : translate('velvet.forms.ratingSummary.rowLabel', { star, count, percent });
  const max = () => p.counts.length || DEFAULT_SCALE;
  const total = () => p.counts.reduce((sum, count) => sum + count, 0);
  const average = () =>
    p.average ?? (total() ? p.counts.reduce((sum, count, index) => sum + count * (index + 1), 0) / total() : 0);
  const peak = () => Math.max(1, ...p.counts);
  const stars = () => {
    const count = max();
    return Array.from({ length: count }, (_, index) => count - index);
  };
  const countOf = (star: number) => p.counts[star - 1] ?? 0;
  const percentOf = (star: number) => (total() ? Math.round((countOf(star) / total()) * PERCENT) : 0);
  const countText = () => {
    const formatted = total().toLocaleString(locale());
    if (p.noun === undefined && p.nounPlural === undefined)
      return translate('velvet.forms.ratingSummary.reviewCount', { total: formatted, count: total() });
    const singular = p.noun ?? translate('velvet.forms.ratingSummary.noun');
    return `${formatted} ${total() === 1 ? singular : (p.nounPlural ?? `${singular}s`)}`;
  };

  return (
    <div class={cx(styles.ratesum, p.class)}>
      <div class={styles.ratesumPartScore}>
        <Text as="span" variant="kpi" tone="inherit" class={styles.ratesumPartAvg}>
          {oneDecimal().format(average())}
        </Text>
        <Rating
          readOnly
          value={average()}
          max={max()}
          size="sm"
          label={p.averageLabel ?? translate('velvet.forms.ratingSummary.averageLabel')}
        />
        <Text as="span" variant="caption" tone="inherit" class={styles.ratesumPartCount}>
          {countText()}
        </Text>
      </div>
      <div
        class={styles.ratesumPartRows}
        role="group"
        aria-label={p.label ?? translate('velvet.forms.ratingSummary.label')}
      >
        <For each={stars()}>
          {(star) => {
            const on = () => p.activeStar === star;
            return (
              <Polymorphic
                tag={p.onFilter ? 'button' : 'div'}
                type={p.onFilter ? 'button' : undefined}
                class={cx(
                  typographyClass('caption'),
                  styles.ratesumPartRow,
                  on() && styles.ratesumPartRowVariantActive,
                )}
                aria-pressed={p.onFilter ? on() : undefined}
                aria-label={rowLabel(star, countOf(star), percentOf(star))}
                onClick={p.onFilter ? () => p.onFilter?.(on() ? null : star) : undefined}
              >
                <Text as="span" variant="caption" tone="inherit" class={styles.ratesumPartStar}>
                  {star}
                  <Glyph name="star" />
                </Text>
                <Meter rating value={countOf(star)} max={peak()} />
                <Text as="span" variant="caption" tone="inherit" class={styles.ratesumPartN}>
                  {percentOf(star)}%
                </Text>
              </Polymorphic>
            );
          }}
        </For>
      </div>
    </div>
  );
};
