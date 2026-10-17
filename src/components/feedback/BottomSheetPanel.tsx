import { children as resolveChildren, createSignal, createUniqueId, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { Heading } from '../primitives/Heading';
import { Text } from '../primitives/Text';
import styles from './BottomSheetPanel.module.css';
import type { BottomSheetProps } from './bottomSheetTypes';
import { ModalBackdrop } from './ModalBackdrop';

/** Drag distance (px) past which releasing the grabber dismisses the sheet. */
const DISMISS_DISTANCE = 120;
/** Release velocity (px/ms) past which a flick dismisses the sheet. */
const DISMISS_VELOCITY = 0.6;

interface BottomSheetPanelProps {
  sheet: BottomSheetProps;
  ref: (element: HTMLDialogElement) => void;
}

interface DragStart {
  y: number;
  time: number;
}

/** Mounted only while open, so slot content is created on open and disposed on close. */
export const BottomSheetPanel = (props: BottomSheetPanelProps) => {
  const translate = useTranslate();
  const titleId = createUniqueId();
  const descriptionId = `${titleId}-description`;
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
  const up = (event: PointerEvent) => {
    if (!drag) return;
    const distance = Math.max(0, event.clientY - drag.y);
    const velocity = distance / Math.max(1, Date.now() - drag.time);
    const dismiss = distance > DISMISS_DISTANCE || velocity > DISMISS_VELOCITY;
    drag = undefined;
    setDy(0);
    if (dismiss) props.sheet.onClose?.();
  };
  const cancelDrag = () => {
    drag = undefined;
    setDy(0);
  };

  return (
    <ModalBackdrop
      ref={props.ref}
      class={cx(styles.sheetBackdrop)}
      onDismiss={() => props.sheet.onClose?.()}
      aria-labelledby={title() ? titleId : undefined}
      aria-label={title() ? undefined : (props.sheet.label ?? translate('velvet.feedback.bottomSheet.label'))}
      aria-describedby={description() ? descriptionId : undefined}
    >
      <div
        tabIndex={-1}
        data-vui-focus-fallback
        class={cx(styles.sheet, dy() > 0 && styles.sheetVariantDragging, props.sheet.class)}
        style={{ transform: dy() ? `translateY(${dy()}px)` : undefined }}
      >
        <div
          class={styles.sheetPartGrab}
          onPointerDown={down}
          onPointerMove={move}
          onPointerUp={up}
          onPointerCancel={cancelDrag}
          onLostPointerCapture={cancelDrag}
          aria-hidden="true"
        >
          <span />
        </div>
        <Show when={title() || description()}>
          <div class={styles.sheetPartHead}>
            <Show when={title()}>
              <Heading level={2} variant="title-lg" id={titleId} class={styles.sheetPartTitle}>
                {title()}
              </Heading>
            </Show>
            <Show when={description()}>
              <Text as="p" variant="body-sm" tone="secondary" id={descriptionId} class={styles.sheetPartDesc}>
                {description()}
              </Text>
            </Show>
          </div>
        </Show>
        <div class={styles.sheetPartBody}>{body()}</div>
        <Show when={footer()}>
          <div class={styles.sheetPartFoot}>{footer()}</div>
        </Show>
      </div>
    </ModalBackdrop>
  );
};
