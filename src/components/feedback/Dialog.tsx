import { children as resolveChildren, createUniqueId, type JSX, mergeProps, Show } from 'solid-js';
import { Portal } from 'solid-js/web';

import { cx, modifier } from '../../utils/cx';
import { CloseButton } from '../primitives/CloseButton';
import { createModalRoot } from './createModalRoot';
import { ModalBackdrop } from './ModalBackdrop';

export interface DialogProps {
  open: boolean;
  onClose?: () => void;
  title?: JSX.Element;
  description?: JSX.Element;
  footer?: JSX.Element;
  /** @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** center = modal · right / left = full-height drawer sliding from that edge. @default 'center' */
  placement?: 'center' | 'right' | 'left';
  /** Escape, backdrop click and the close button dismiss. @default true */
  dismissible?: boolean;
  /** Accessible name of the close button. @default localized "Close" */
  closeLabel?: string;
  class?: string;
  children?: JSX.Element;
}

type ResolvedDialogProps = DialogProps & Required<Pick<DialogProps, 'size' | 'placement' | 'dismissible'>>;

interface DialogPanelProps {
  dialog: ResolvedDialogProps;
  ref: (element: HTMLElement) => void;
}

/** Mounted only while open, so slot content is created on open and disposed on close. */
const DialogPanel = (props: DialogPanelProps) => {
  const titleId = createUniqueId();
  const title = resolveChildren(() => props.dialog.title);
  const description = resolveChildren(() => props.dialog.description);
  const footer = resolveChildren(() => props.dialog.footer);
  const body = resolveChildren(() => props.dialog.children);
  const drawer = () => props.dialog.placement !== 'center';
  const close = () => props.dialog.onClose?.();

  return (
    <ModalBackdrop
      class={cx('vui-dialog-backdrop', drawer() && `vui-dialog-backdrop--${props.dialog.placement}`)}
      onDismiss={props.dialog.dismissible ? close : undefined}
    >
      <div
        ref={props.ref}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title() ? titleId : undefined}
        class={cx(
          'vui-dialog',
          drawer() && 'vui-dialog--drawer',
          modifier('vui-dialog', props.dialog.size, 'md'),
          props.dialog.class,
        )}
        style={{ outline: 'none' }}
      >
        <Show when={props.dialog.dismissible}>
          <CloseButton class="vui-dialog__close" label={props.dialog.closeLabel} onClick={close} />
        </Show>
        <Show when={title() || description()}>
          <div class="vui-dialog__header">
            <Show when={title()}>
              <h2 id={titleId} class="vui-dialog__title">
                {title()}
              </h2>
            </Show>
            <Show when={description()}>
              <p class="vui-dialog__desc">{description()}</p>
            </Show>
          </div>
        </Show>
        <Show when={body.toArray().length > 0} fallback={<div style={{ height: 'var(--space-6)' }} />}>
          <div class="vui-dialog__body">{body()}</div>
        </Show>
        <Show when={footer()}>
          <div class="vui-dialog__footer">{footer()}</div>
        </Show>
      </div>
    </ModalBackdrop>
  );
};

/** Modal dialog or side drawer. Page behind is inert, focus returns on close, Esc + backdrop click dismiss. Becomes a bottom sheet under 640px (center placement). */
export const Dialog = (props: DialogProps) => {
  const p = mergeProps({ size: 'md', placement: 'center', dismissible: true } satisfies Partial<DialogProps>, props);
  const ref = createModalRoot(() => p.open, { onEscape: () => p.dismissible && p.onClose?.() });
  return (
    <Show when={p.open}>
      <Portal>
        <DialogPanel dialog={p} ref={ref} />
      </Portal>
    </Show>
  );
};
