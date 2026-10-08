import { Index, type JSX, mergeProps, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';

export type SpinnerVariant = 'ring' | 'dots' | 'bars' | 'pulse';

const ELEMENT_COUNT: Record<SpinnerVariant, number> = { ring: 0, dots: 3, bars: 4, pulse: 1 };

export interface SpinnerProps {
  /** @default 'ring' */
  variant?: SpinnerVariant;
  /** sm 16 · md 24 · lg 40 · inline = 1em of the host text (buttons, chips). @default 'md' */
  size?: 'sm' | 'md' | 'lg' | 'inline';
  /** Accessible status text. @default localized "Loading" */
  label?: string;
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
      role="status"
      aria-label={p.label ?? translate('velvet.common.loading')}
      class={cx(
        'vui-loader',
        `vui-loader--${p.variant}`,
        `vui-loader--${p.size}`,
        p.tone === 'current' && 'vui-loader--current',
        p.class,
      )}
    >
      <Index each={parts()}>{() => <i />}</Index>
    </span>
  );
};

export interface LoadingOverlayProps {
  show?: boolean;
  /** @default localized "Loading…" */
  label?: string;
  children?: JSX.Element;
  class?: string;
}

/** Dims its children and centres a spinner + label on top while `show` is true. */
export const LoadingOverlay = (props: LoadingOverlayProps) => {
  const p = mergeProps({ show: true } satisfies LoadingOverlayProps, props);
  const translate = useTranslate();
  const label = () => p.label ?? translate('velvet.feedback.loadingOverlay.label');
  return (
    <div class={cx('vui-loading-overlay', p.class)} aria-busy={p.show || undefined}>
      {p.children}
      <Show when={p.show}>
        <div class="vui-loading-overlay__veil">
          <Spinner size="lg" label={label()} />
          <span class="vui-loading-overlay__label">{label()}</span>
        </div>
      </Show>
    </div>
  );
};
