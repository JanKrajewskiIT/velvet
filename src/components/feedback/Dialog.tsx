import { mergeProps, Show } from 'solid-js';
import { Portal } from 'solid-js/web';

import { cx } from '../../utils/cx';
import { createModalRoot } from './createModalRoot';
import styles from './Dialog.module.css';
import { DialogPanel } from './DialogPanel';
import type { DialogProps } from './dialogTypes';

export type { DialogProps } from './dialogTypes';
/** Modal dialog or side drawer. Page behind is inert, focus returns on close, Esc + backdrop click dismiss. Becomes a bottom sheet under 640px (center placement). */
export const Dialog = (props: DialogProps) => {
  const p = mergeProps({ size: 'md', placement: 'center', dismissible: true } satisfies Partial<DialogProps>, props);
  const ref = createModalRoot(() => p.open, {
    onEscape: () => p.dismissible && p.onClose?.(),
    get initialFocus() {
      return p.initialFocus;
    },
    get restoreFocus() {
      return p.restoreFocus;
    },
  });
  const dialog = mergeProps(p, {
    get class() {
      return cx(styles.root, p.class);
    },
  });
  return (
    <Show when={p.open}>
      <Portal>
        <DialogPanel dialog={dialog} ref={ref} />
      </Portal>
    </Show>
  );
};
