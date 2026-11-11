import { type JSX, mergeProps, Show, splitProps } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import type { HtmlProps } from '../../utils/polymorphic';
import styles from './StatusBar.module.css';

export interface StatusBarProps extends HtmlProps<HTMLElement> {
  start?: JSX.Element;
  end?: JSX.Element;
  /** Pins the bar to the viewport bottom. Reserve its height in the page layout. */
  fixed?: boolean;
  /** Landmark name. Defaults to the localized status label. */
  label?: string;
}

export const StatusBar = (props: StatusBarProps) => {
  const p = mergeProps({ fixed: false }, props);
  const [local, rest] = splitProps(p, ['start', 'end', 'fixed', 'label', 'children', 'class']);
  const translate = useTranslate();

  return (
    <footer
      {...rest}
      aria-label={rest['aria-label'] ?? local.label ?? translate('velvet.trading.statusBar.label')}
      class={cx(styles.root, local.fixed && styles.fixed, local.class)}
    >
      <div class={styles.group}>
        {local.start}
        {local.children}
      </div>
      <Show when={local.end != null}>
        <div class={cx(styles.group, styles.end)}>{local.end}</div>
      </Show>
    </footer>
  );
};
