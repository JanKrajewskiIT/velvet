import { FiX } from 'solid-icons/fi';
import { createSignal, createUniqueId, type JSX, Show } from 'solid-js';
import { Portal } from 'solid-js/web';

import useEscapeKey from '~/hooks/useEscapeKey';
import useFocusTrap from '~/hooks/useFocusTrap';
import useOverlayAnimation from '~/hooks/useOverlayAnimation';
import { useI18n } from '~/i18n/I18nProvider';
import type Props from '~/models/Props';
import { joinAriaIds } from '~/utils/aria';
import classNames from '~/utils/classNames';

import IconButton from '../../buttons/IconButton/IconButton';
import Surface from '../../surfaces/Surface/Surface';
import Heading from '../../typography/Heading/Heading';
import Text from '../../typography/Text/Text';
import styles from './Sheet.module.css';

interface SheetProps {
  open: boolean;
  onClose: () => void;
  label?: string;
  subtitle?: string;
  children?: JSX.Element;
  actions?: JSX.Element;
  side?: 'bottom' | 'left' | 'right';
  size?: 'sm' | 'md' | 'lg';
}

type SheetSide = NonNullable<SheetProps['side']>;
type SheetSize = NonNullable<SheetProps['size']>;

const panelSideClassByValue: Record<SheetSide, string | undefined> = {
  bottom: styles.bottom,
  left: styles.left,
  right: styles.right,
};

const panelSizeClassByValue: Record<SheetSize, string | undefined> = {
  sm: styles.sm,
  md: styles.md,
  lg: styles.lg,
};

const Sheet = (props: Props<SheetProps>) => {
  const { ts } = useI18n();
  const [panelRef, setPanelRef] = createSignal<HTMLElement | undefined>();
  const titleId = createUniqueId();
  const subtitleId = createUniqueId();
  const entered = useOverlayAnimation(() => props.open);

  const side = () => props.side ?? 'bottom';
  const size = () => props.size ?? 'md';

  useEscapeKey(
    () => props.open,
    () => props.onClose(),
  );

  useFocusTrap(panelRef, () => props.open);

  const panelClass = () =>
    classNames(
      styles.panel,
      panelSideClassByValue[side()],
      panelSizeClassByValue[size()],
      entered() && styles.panelVisible,
      props.class,
    );

  return (
    <Show when={props.open}>
      <Portal>
        <div
          class={classNames(styles.overlay, entered() && styles.overlayVisible)}
          aria-hidden="true"
          onClick={() => props.onClose()}
        />
        <Surface
          ref={setPanelRef}
          class={panelClass()}
          elevation="drawer"
          role="dialog"
          tabIndex={-1}
          aria-modal="true"
          aria-labelledby={joinAriaIds(props['aria-labelledby'], props.label && titleId)}
          aria-describedby={joinAriaIds(props['aria-describedby'], props.subtitle && subtitleId)}
        >
          <div class={styles.header}>
            <div class={styles.titleBlock}>
              <Show when={props.label}>
                <Heading as="h2" level={2} variant="titleLg" id={titleId}>
                  {props.label}
                </Heading>
              </Show>
              <Show when={props.subtitle}>
                <Text as="p" variant="bodySm" tone="muted" id={subtitleId}>
                  {props.subtitle}
                </Text>
              </Show>
            </div>
            <IconButton icon={FiX} label={ts('common.close')} onClick={() => props.onClose()} />
          </div>
          <Show when={props.children}>
            <div class={styles.body}>{props.children}</div>
          </Show>
          <Show when={props.actions}>
            <div class={styles.footer}>{props.actions}</div>
          </Show>
        </Surface>
      </Portal>
    </Show>
  );
};

export default Sheet;
