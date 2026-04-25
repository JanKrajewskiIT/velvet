import { FiX } from 'solid-icons/fi';
import { createMemo, createSignal, createUniqueId, type JSX, Show, splitProps } from 'solid-js';
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
  const [local, rest] = splitProps(props, [
    'open',
    'onClose',
    'label',
    'subtitle',
    'children',
    'actions',
    'side',
    'size',
    'class',
    'aria-labelledby',
    'aria-describedby',
  ]);
  const [panelRef, setPanelRef] = createSignal<HTMLElement | undefined>();
  const titleId = createUniqueId();
  const subtitleId = createUniqueId();
  const entered = useOverlayAnimation(() => local.open);

  const side = createMemo(() => local.side ?? 'bottom');
  const size = createMemo(() => local.size ?? 'md');

  useEscapeKey(
    () => local.open,
    () => {
      local.onClose();
    },
  );

  useFocusTrap(panelRef, () => local.open);

  const panelClass = createMemo(() =>
    classNames(
      styles.panel,
      panelSideClassByValue[side()],
      panelSizeClassByValue[size()],
      entered() && styles.panelVisible,
      local.class,
    ),
  );

  return (
    <Show when={local.open}>
      <Portal>
        <div
          class={classNames(styles.overlay, entered() && styles.overlayVisible)}
          aria-hidden="true"
          onClick={() => {
            local.onClose();
          }}
        />
        <Surface
          {...rest}
          ref={setPanelRef}
          class={panelClass()}
          elevation="drawer"
          role="dialog"
          tabIndex={-1}
          aria-modal="true"
          aria-labelledby={joinAriaIds(local['aria-labelledby'], local.label && titleId)}
          aria-describedby={joinAriaIds(local['aria-describedby'], local.subtitle && subtitleId)}
        >
          <div class={styles.header}>
            <div class={styles.titleBlock}>
              <Show when={local.label}>
                <Heading as="h2" level={2} variant="titleLg" id={titleId}>
                  {local.label}
                </Heading>
              </Show>
              <Show when={local.subtitle}>
                <Text as="p" variant="bodySm" tone="muted" id={subtitleId}>
                  {local.subtitle}
                </Text>
              </Show>
            </div>
            <IconButton icon={FiX} label={ts('common.close')} onClick={local.onClose} />
          </div>
          <Show when={local.children}>
            <div class={styles.body}>{local.children}</div>
          </Show>
          <Show when={local.actions}>
            <div class={styles.footer}>{local.actions}</div>
          </Show>
        </Surface>
      </Portal>
    </Show>
  );
};

export default Sheet;
