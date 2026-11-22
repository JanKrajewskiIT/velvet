import type { JSX } from '@solidjs/web';
import { Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { booleanAttribute } from '../../utils/booleanAttribute';
import { cx } from '../../utils/cx';
import { withDefaults } from '../../utils/props';
import { Text } from '../primitives/Text';
import styles from './LoadingOverlay.module.css';
import { Spinner } from './Spinner';

export interface LoadingOverlayProps {
  show?: boolean;
  /** @default localized "Loading…" */
  label?: string;
  children?: JSX.Element;
  class?: string;
}

/** Dims its children and centres a spinner + label on top while `show` is true. */
export const LoadingOverlay = (props: LoadingOverlayProps) => {
  const p = withDefaults({ show: true } satisfies LoadingOverlayProps, props);
  const translate = useTranslate();
  const label = () => p.label ?? translate('velvet.feedback.loadingOverlay.label');
  return (
    <div class={cx(styles.loadingOverlay, p.class)} aria-busy={booleanAttribute(p.show || undefined)}>
      {p.children}
      <Show when={p.show}>
        <div class={styles.loadingOverlayPartVeil}>
          <Spinner size="lg" label={label()} />
          <Text as="span" variant="body-sm" tone="secondary" class={styles.loadingOverlayPartLabel}>
            {label()}
          </Text>
        </div>
      </Show>
    </div>
  );
};
