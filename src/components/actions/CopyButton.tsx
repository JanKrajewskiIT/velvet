import { createSignal, mergeProps, onCleanup, Show } from 'solid-js';

import { createOperation } from '../../hooks/createOperation';
import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { reportAsyncError } from '../../utils/reportAsyncError';
import { Glyph } from '../primitives/Glyph';
import { buttonClass } from './buttonClass';

const COPIED_FEEDBACK_MS = 1600;

type CopyStatus = 'idle' | 'copied' | 'failed';

export interface CopyButtonProps {
  value: string | (() => string);
  /** @default localized "Copy" */
  label?: string;
  /** @default localized "Copied" */
  copiedLabel?: string;
  /** @default localized "Copy failed" */
  failedLabel?: string;
  iconOnly?: boolean;
  /** @default 'secondary' */
  variant?: 'primary' | 'secondary' | 'soft' | 'ghost';
  /** @default 'sm' */
  size?: 'sm' | 'md' | 'lg';
  onCopy?: (value: string) => void;
  class?: string;
}

/** Copies text to the clipboard; the icon morphs copy → check and the result is announced. */
export const CopyButton = (props: CopyButtonProps) => {
  const p = mergeProps({ variant: 'secondary', size: 'sm' } satisfies Partial<CopyButtonProps>, props);
  const translate = useTranslate();
  const label = () => p.label ?? translate('velvet.common.copy');
  const [status, setStatus] = createSignal<CopyStatus>('idle');
  const operation = createOperation();
  let resetTimer: ReturnType<typeof setTimeout> | undefined;
  onCleanup(() => clearTimeout(resetTimer));

  const copy = async () => {
    if (operation.busy()) return;
    const text = typeof p.value === 'function' ? p.value() : p.value;
    const run = operation.begin();
    if (!run) return;
    let outcome: Exclude<CopyStatus, 'idle'>;
    try {
      await navigator.clipboard.writeText(text);
      outcome = 'copied';
    } catch {
      outcome = 'failed';
    }
    if (!run.isCurrent()) return;
    run.finish();
    setStatus(outcome);
    clearTimeout(resetTimer);
    resetTimer = setTimeout(() => setStatus('idle'), COPIED_FEEDBACK_MS);
    if (outcome === 'copied') p.onCopy?.(text);
  };

  const feedback = () => {
    if (status() === 'copied') return p.copiedLabel ?? translate('velvet.common.copied');
    if (status() === 'failed') return p.failedLabel ?? translate('velvet.actions.copyButton.failed');
    return '';
  };
  const caption = () => feedback() || label();

  return (
    <button
      type="button"
      class={cx(
        buttonClass({ variant: p.variant, size: p.size, icon: p.iconOnly }),
        'vui-copy',
        status() === 'copied' && 'vui-copy--done',
        p.class,
      )}
      onClick={() => void copy().catch(reportAsyncError)}
      disabled={operation.busy()}
      aria-busy={operation.busy() || undefined}
      aria-label={p.iconOnly ? caption() : undefined}
      title={p.iconOnly ? label() : undefined}
    >
      <span class="vui-copy__icons" aria-hidden="true">
        <Glyph name="copy" class="vui-copy__a" />
        <Glyph name="check" class="vui-copy__b" />
      </span>
      <Show when={!p.iconOnly}>
        <span>{caption()}</span>
      </Show>
      <span class="vui-sr-only" aria-live="polite">
        {feedback()}
      </span>
    </button>
  );
};
