import { Index, mergeProps, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { variantClass } from '../../utils/cssModule';
import { cx } from '../../utils/cx';
import { VisuallyHidden } from '../primitives/VisuallyHidden';
import styles from './Spinner.module.css';

const LOADER_CLASSES = {
  sm: styles.loaderVariantSm,
  lg: styles.loaderVariantLg,
  inline: styles.loaderVariantInline,
  current: styles.loaderVariantCurrent,
  ring: styles.loaderVariantRing,
  dots: styles.loaderVariantDots,
  bars: styles.loaderVariantBars,
  pulse: styles.loaderVariantPulse,
} as const;

export type SpinnerVariant = 'ring' | 'dots' | 'bars' | 'pulse';

const ELEMENT_COUNT: Record<SpinnerVariant, number> = { ring: 0, dots: 3, bars: 4, pulse: 1 };

export interface SpinnerProps {
  /** @default 'ring' */
  variant?: SpinnerVariant;
  /** sm 16 · md 24 · lg 40 · inline = 1em of the host text (buttons, chips). @default 'md' */
  size?: 'sm' | 'md' | 'lg' | 'inline';
  /** Accessible status text. @default localized "Loading" */
  label?: string;
  /** Hide from assistive technology when another element describes the pending action. */
  decorative?: boolean;
  /** `current` inherits the text colour. @default 'brand' */
  tone?: 'brand' | 'current';
  class?: string;
}

/** Loader: ring (inline/buttons), dots (chat/typing), bars (audio/processing), pulse (live). */
export const Spinner = (props: SpinnerProps) => {
  const p = mergeProps({ variant: 'ring', size: 'md', tone: 'brand' } satisfies SpinnerProps, props);
  const translate = useTranslate();
  const parts = () => Array.from({ length: ELEMENT_COUNT[p.variant] });
  return (
    <span
      role={p.decorative ? undefined : 'status'}
      aria-live={p.decorative ? undefined : 'polite'}
      aria-atomic={p.decorative ? undefined : true}
      aria-hidden={p.decorative || undefined}
      class={cx(
        styles.loader,
        variantClass(LOADER_CLASSES, p.variant),
        variantClass(LOADER_CLASSES, p.size),
        p.tone === 'current' && styles.loaderVariantCurrent,
        p.class,
      )}
    >
      <Index each={parts()}>{() => <i aria-hidden="true" />}</Index>
      <Show when={!p.decorative}>
        <VisuallyHidden>{p.label ?? translate('velvet.common.loading')}</VisuallyHidden>
      </Show>
    </span>
  );
};
