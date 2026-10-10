import { children as resolveChildren, createUniqueId, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx, modifier } from '../../utils/cx';
import { CloseButton } from '../primitives/CloseButton';
import type { ResolvedDialogProps } from './dialogTypes';
import { ModalBackdrop } from './ModalBackdrop';
interface DialogPanelProps {
  dialog: ResolvedDialogProps;
  ref: (element: HTMLDialogElement) => void;
}

/** Mounted only while open, so slot content is created on open and disposed on close. */
export const DialogPanel = (props: DialogPanelProps) => {
  const titleId = createUniqueId();
  const descriptionId = `${titleId}-description`;
  const translate = useTranslate();
  const title = resolveChildren(() => props.dialog.title);
  const description = resolveChildren(() => props.dialog.description);
  const footer = resolveChildren(() => props.dialog.footer);
  const body = resolveChildren(() => props.dialog.children);
  const drawer = () => props.dialog.placement !== 'center';
  const close = () => props.dialog.onClose?.();

  return (
    <ModalBackdrop
      ref={props.ref}
      class={cx('vui-dialog-backdrop', drawer() && `vui-dialog-backdrop--${props.dialog.placement}`)}
      onDismiss={props.dialog.dismissible ? close : undefined}
      aria-labelledby={title() ? titleId : undefined}
      aria-label={title() ? undefined : (props.dialog.label ?? translate('velvet.feedback.dialog.label'))}
      aria-describedby={description() ? descriptionId : undefined}
    >
      <div
        tabIndex={-1}
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
              <p id={descriptionId} class="vui-dialog__desc">
                {description()}
              </p>
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
