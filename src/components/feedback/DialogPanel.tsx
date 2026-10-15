import { children as resolveChildren, createUniqueId, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { variantClass } from '../../utils/cssModule';
import { cx } from '../../utils/cx';
import { CloseButton } from '../primitives/CloseButton';
import { Heading } from '../primitives/Heading';
import { Text } from '../primitives/Text';
import styles from './DialogPanel.module.css';
import type { ResolvedDialogProps } from './dialogTypes';
import { ModalBackdrop } from './ModalBackdrop';

const DIALOG_BACKDROP_CLASSES = {
  right: styles.dialogBackdropVariantRight,
  left: styles.dialogBackdropVariantLeft,
  top: styles.dialogBackdropVariantTop,
} as const;

const DIALOG_CLASSES = {
  sm: styles.dialogVariantSm,
  lg: styles.dialogVariantLg,
  drawer: styles.dialogVariantDrawer,
} as const;
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
      class={cx(styles.dialogBackdrop, drawer() && variantClass(DIALOG_BACKDROP_CLASSES, props.dialog.placement))}
      onDismiss={props.dialog.dismissible ? close : undefined}
      aria-labelledby={title() ? titleId : undefined}
      aria-label={title() ? undefined : (props.dialog.label ?? translate('velvet.feedback.dialog.label'))}
      aria-describedby={description() ? descriptionId : undefined}
    >
      <div
        tabIndex={-1}
        data-vui-focus-fallback
        class={cx(
          styles.dialog,
          drawer() && styles.dialogVariantDrawer,
          variantClass(DIALOG_CLASSES, props.dialog.size, 'md'),
          props.dialog.class,
        )}
        style={{ outline: 'none' }}
      >
        <Show when={props.dialog.dismissible}>
          <CloseButton class={styles.dialogPartClose} label={props.dialog.closeLabel} onClick={close} />
        </Show>
        <Show when={title() || description()}>
          <div class={styles.dialogPartHeader}>
            <Show when={title()}>
              <Heading level={2} variant="title-lg" id={titleId} class="vui-dialog__title">
                {title()}
              </Heading>
            </Show>
            <Show when={description()}>
              <Text as="p" variant="body" tone="secondary" id={descriptionId} class={styles.dialogPartDesc}>
                {description()}
              </Text>
            </Show>
          </div>
        </Show>
        <Show when={body.toArray().length > 0} fallback={<div style={{ height: 'var(--space-6)' }} />}>
          <div class={cx(styles.dialogPartBody, props.dialog.bodyClass)}>{body()}</div>
        </Show>
        <Show when={footer()}>
          <div class={cx(styles.dialogPartFooter, props.dialog.footerClass)}>{footer()}</div>
        </Show>
      </div>
    </ModalBackdrop>
  );
};
