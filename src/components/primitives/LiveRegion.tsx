import { createEffect, createSignal, mergeProps, onCleanup } from 'solid-js';

import { cx } from '../../utils/cx';
import styles from './LiveRegion.module.css';
import { Text } from './Text';

const LIVE_REGION_DELAY_MS = 60;

export interface LiveRegionProps {
  /** To repeat an identical message pass a new object: `{ text: 'Saved', id: Date.now() }`. */
  message?: string | { text: string; id?: string | number };
  /** assertive interrupts — reserve it for errors. @default 'polite' */
  politeness?: 'polite' | 'assertive';
  /** Milliseconds before the text clears; 0 keeps it. @default 5000 */
  clearAfter?: number;
  /** Also show the text (status line) instead of hiding it. */
  visible?: boolean;
  class?: string;
}

/** Announces dynamic changes ("3 results", "Saved") to screen readers. Mount it once, then change `message`. */
export const LiveRegion = (props: LiveRegionProps) => {
  const p = mergeProps({ politeness: 'polite', clearAfter: 5000 } satisfies LiveRegionProps, props);
  const [shown, setShown] = createSignal('');

  createEffect(() => {
    const message = p.message;
    const text = typeof message === 'object' ? message.text : message;
    setShown('');
    if (!text) return;
    // Clearing first, then writing after a tick, makes screen readers announce a repeated message again.
    const show = setTimeout(() => setShown(text), LIVE_REGION_DELAY_MS);
    const clear = p.clearAfter ? setTimeout(() => setShown(''), p.clearAfter + LIVE_REGION_DELAY_MS) : undefined;
    onCleanup(() => {
      clearTimeout(show);
      clearTimeout(clear);
    });
  });

  return (
    <Text
      as="div"
      variant="body-sm"
      tone="secondary"
      role={p.politeness === 'assertive' ? 'alert' : 'status'}
      aria-live={p.politeness}
      aria-atomic="true"
      class={cx(p.visible ? styles.live : styles.srOnly, p.class)}
    >
      {shown()}
    </Text>
  );
};
