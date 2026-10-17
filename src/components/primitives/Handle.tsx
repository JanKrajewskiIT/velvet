import { type JSX, mergeProps, Show, splitProps } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { assignRef } from '../../utils/assignRef';
import { cx } from '../../utils/cx';
import { Glyph } from './Glyph';
import styles from './Handle.module.css';

export interface HandleProps extends JSX.ButtonHTMLAttributes<HTMLElement> {
  /** Accessible name incl. the keyboard hint, e.g. "Reorder item 2 (↑↓)". @default localized "Drag to reorder" */
  label?: string;
  /** Visual-only grip (the whole row is the drag target). Renders a hidden span. */
  decorative?: boolean;
  /** Swap the grip glyph — e.g. `'lock'` for a row that cannot move. @default 'grip-vertical' */
  icon?: string;
}

/** Drag grip for reorderable rows and cards. A focusable button unless `decorative`. */
export const Handle = (props: HandleProps) => {
  const merged = mergeProps({ icon: 'grip-vertical' } satisfies HandleProps, props);
  const [local, rest] = splitProps(merged, ['label', 'decorative', 'icon', 'class', 'ref']);
  const translate = useTranslate();
  return (
    <Show
      when={local.decorative}
      fallback={
        <button
          {...rest}
          ref={(element) => assignRef(local.ref, element)}
          type={rest.type ?? 'button'}
          class={cx(styles.handle, local.class)}
          aria-label={local.label ?? translate('velvet.primitives.handle.label')}
        >
          <Glyph name={local.icon} />
        </button>
      }
    >
      <span
        {...rest}
        ref={(element) => assignRef(local.ref, element)}
        class={cx(styles.handle, styles.handleVariantDecorative, local.class)}
        aria-hidden="true"
      >
        <Glyph name={local.icon} />
      </span>
    </Show>
  );
};
