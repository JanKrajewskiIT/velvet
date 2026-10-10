import { Show } from 'solid-js';
import { Portal } from 'solid-js/web';

import { BottomSheetPanel } from './BottomSheetPanel';
import type { BottomSheetProps } from './bottomSheetTypes';
import { createModalRoot } from './createModalRoot';

export type { BottomSheetProps } from './bottomSheetTypes';
/** Mobile-first panel sliding up from the bottom. Drag the grabber down (or flick) to dismiss; Esc and backdrop tap also close. Respects safe-area insets. */
export const BottomSheet = (props: BottomSheetProps) => {
  const ref = createModalRoot(() => props.open, { onEscape: () => props.onClose?.() });
  return (
    <Show when={props.open}>
      <Portal>
        <BottomSheetPanel sheet={props} ref={ref} />
      </Portal>
    </Show>
  );
};
