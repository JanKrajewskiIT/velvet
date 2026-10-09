import { children as resolveChildren, createSignal, createUniqueId, type JSX, Show } from 'solid-js';
import { Portal } from 'solid-js/web';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { createModalRoot } from './createModalRoot';
import { ModalBackdrop } from './ModalBackdrop';

/** Drag distance (px) past which releasing the grabber dismisses the sheet. */
const DISMISS_DISTANCE = 120;
/** Release velocity (px/ms) past which a flick dismisses the sheet. */
const DISMISS_VELOCITY = 0.6;

export interface BottomSheetProps {
  open: boolean;
  onClose?: () => void;
  title?: JSX.Element;
  description?: JSX.Element;
  footer?: JSX.Element;
  /** Accessible name when there is no `title`. @default localized "Sheet" */
  label?: string;
  class?: string;
  children?: JSX.Element;
}

interface BottomSheetPanelProps {
  sheet: BottomSheetProps;
  ref: (element: HTMLElement) => void;
}

interface DragStart {
  y: number;
  time: number;
}

/** Mounted only while open, so slot content is created on open and disposed on close. */
const BottomSheetPanel = (props: BottomSheetPanelProps) => {
  const translate = useTranslate();
  const titleId = createUniqueId();
  const title = resolveChildren(() => props.sheet.title);
  const description = resolveChildren(() => props.sheet.description);
  const footer = resolveChildren(() => props.sheet.footer);
  const body = resolveChildren(() => props.sheet.children);
  const [dy, setDy] = createSignal(0);
  let drag: DragStart | undefined;

  const down = (e: PointerEvent & { currentTarget: HTMLElement }) => {
    drag = { y: e.clientY, time: Date.now() };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const move = (e: PointerEvent) => {
    if (drag) setDy(Math.max(0, e.clientY - drag.y));
  };
  const up = () => {
    if (!drag) return;
    const velocity = dy() / Math.max(1, Date.now() - drag.time);
    const dismiss = dy() > DISMISS_DISTANCE || velocity > DISMISS_VELOCITY;
    drag = undefined;
    setDy(0);
    if (dismiss) props.sheet.onClose?.();
  };

  return (
    <ModalBackdrop class="vui-sheet-backdrop" onDismiss={() => props.sheet.onClose?.()}>
      <div
        ref={props.ref}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title() ? titleId : undefined}
        aria-label={title() ? undefined : (props.sheet.label ?? translate('velvet.feedback.bottomSheet.label'))}
        class={cx('vui-sheet', dy() > 0 && 'vui-sheet--dragging', props.sheet.class)}
        style={{ transform: dy() ? `translateY(${dy()}px)` : undefined }}
      >
        <div
          class="vui-sheet__grab"
          onPointerDown={down}
          onPointerMove={move}
          onPointerUp={up}
          onPointerCancel={up}
          aria-hidden="true"
        >
          <span />
        </div>
        <Show when={title() || description()}>
          <div class="vui-sheet__head">
            <Show when={title()}>
              <h2 id={titleId} class="vui-sheet__title">
                {title()}
              </h2>
            </Show>
            <Show when={description()}>
              <p class="vui-sheet__desc">{description()}</p>
            </Show>
          </div>
        </Show>
        <div class="vui-sheet__body">{body()}</div>
        <Show when={footer()}>
          <div class="vui-sheet__foot">{footer()}</div>
        </Show>
      </div>
    </ModalBackdrop>
  );
};

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
