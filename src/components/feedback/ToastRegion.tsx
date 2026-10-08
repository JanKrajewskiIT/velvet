import type { JSX } from 'solid-js';

import { cx } from '../../utils/cx';

export interface ToastRegionProps {
  class?: string;
  children?: JSX.Element;
}

/** Fixed bottom-right stack (full-width bottom on mobile). A polite live region; new toasts spring in. */
export const ToastRegion = (props: ToastRegionProps) => (
  <div class={cx('vui-toast-region', props.class)} aria-live="polite">
    {props.children}
  </div>
);
