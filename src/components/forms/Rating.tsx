import { useI18n } from '@jankrajewskiit/i18n';
import { createMemo, createSignal, For, type JSX, mergeProps, Show } from 'solid-js';

import { createControllable } from '../../hooks/createControllable';
import { useTranslate } from '../../i18n/useTranslate';
import { variantClass } from '../../utils/cssModule';
import { cx } from '../../utils/cx';
import { Text } from '../primitives/Text';
import styles from './Rating.module.css';
import { RatingStar } from './RatingStar';

const RATING_CLASSES = {
  readonly: styles.ratingVariantReadonly,
  sm: styles.ratingVariantSm,
  lg: styles.ratingVariantLg,
} as const;

export interface RatingProps {
  /** Controlled value. */
  value?: number;
  /** @default 0 */
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  /** @default 5 */
  max?: number;
  /** Static, labelled image for reviews and lists. */
  readOnly?: boolean;
  /** @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** "4.0 / 5" after the stars. */
  showValue?: boolean;
  /** Accessible group name. @default localized "Rating" */
  label?: string;
  /** Spoken value of the read-only image, appended to `label`. @default localized "{value} of {max}" */
  valueLabel?: (value: number, max: number) => string;
  /** Accessible name of each star button. @default localized "{star} of {max}" */
  starLabel?: (star: number, max: number) => string;
  class?: string;
}

/** Star rating. Hover previews, click commits (click the current star again to clear), ←→ ↑↓ Home End by keyboard. */
export const Rating = (props: RatingProps) => {
  const p = mergeProps(
    { defaultValue: 0, max: 5, readOnly: false, size: 'md', showValue: false } satisfies RatingProps,
    props,
  );
  const i18n = useI18n();
  const translate = useTranslate();
  const oneDecimal = createMemo(
    () => new Intl.NumberFormat(i18n.locale(), { minimumFractionDigits: 1, maximumFractionDigits: 1 }),
  );
  const label = () => p.label ?? translate('velvet.forms.rating.label');
  const valueLabel = (value: number, max: number) =>
    p.valueLabel ? p.valueLabel(value, max) : translate('velvet.forms.rating.valueLabel', { value, max });
  const starLabel = (star: number, max: number) =>
    p.starLabel ? p.starLabel(star, max) : translate('velvet.forms.rating.starLabel', { star, max });
  const [current, setCurrent] = createControllable({
    value: () => p.value,
    defaultValue: p.defaultValue,
    onChange: (next) => p.onValueChange?.(next),
  });
  const [hover, setHover] = createSignal(0);
  const shown = () => hover() || current();
  const stars = () => Array.from({ length: p.max }, (_, index) => index);
  const sizeClass = () => variantClass(RATING_CLASSES, p.size);
  let root!: HTMLSpanElement;

  const commit = (next: number) => {
    if (!p.readOnly) setCurrent(next);
  };
  const onKeyDown: JSX.EventHandler<HTMLSpanElement, KeyboardEvent> = (e) => {
    let next: number;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') next = Math.min(p.max, current() + 1);
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') next = Math.max(1, current() - 1);
    else if (e.key === 'Home') next = 1;
    else if (e.key === 'End') next = p.max;
    else return;
    e.preventDefault();
    commit(next);
    root.querySelectorAll<HTMLButtonElement>('[role="radio"]')[next - 1]?.focus();
  };

  return (
    <Show
      when={!p.readOnly}
      fallback={
        <span
          class={cx(styles.rating, sizeClass(), styles.ratingVariantReadonly, p.class)}
          role="img"
          aria-label={`${label()}: ${valueLabel(current(), p.max)}`}
        >
          <For each={stars()}>
            {(star) => (
              <span class={cx(styles.ratingPartStar, star < Math.round(current()) && styles.ratingPartStarVariantOn)}>
                <RatingStar />
              </span>
            )}
          </For>
          <Show when={p.showValue}>
            <Text as="span" variant="code" tone="inherit" class={styles.ratingPartValue}>
              {oneDecimal().format(current())}
            </Text>
          </Show>
        </span>
      }
    >
      {/* eslint-disable-next-line jsx-a11y/interactive-supports-focus -- focus roves on the radio stars, not on the group */}
      <span
        ref={(element) => {
          root = element;
        }}
        class={cx(styles.rating, sizeClass(), p.class)}
        role="radiogroup"
        aria-label={label()}
        onMouseLeave={() => setHover(0)}
        onKeyDown={onKeyDown}
      >
        <For each={stars()}>
          {(star) => (
            <button
              type="button"
              role="radio"
              aria-checked={current() === star + 1}
              aria-label={starLabel(star + 1, p.max)}
              tabIndex={(current() || 1) === star + 1 ? 0 : -1}
              class={cx(
                styles.ratingPartStar,
                star < shown() && styles.ratingPartStarVariantOn,
                hover() > 0 && star < hover() && styles.ratingPartStarVariantPreview,
              )}
              onMouseEnter={() => setHover(star + 1)}
              onClick={() => commit(current() === star + 1 ? 0 : star + 1)}
            >
              <RatingStar />
            </button>
          )}
        </For>
        <Show when={p.showValue}>
          <Text as="span" variant="code" tone="inherit" class={styles.ratingPartValue}>
            {oneDecimal().format(shown())}{' '}
            <Text as="span" variant="caption" tone="inherit">
              / {p.max}
            </Text>
          </Text>
        </Show>
      </span>
    </Show>
  );
};
