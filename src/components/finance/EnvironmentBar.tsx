import { For, type JSX, mergeProps, Show, splitProps } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import type { HtmlProps } from '../../utils/polymorphic';
import { Button } from '../actions/Button';
import { Dot } from '../primitives/Dot';
import styles from './EnvironmentBar.module.css';

const CONNECTION_TONES = { live: 'success', stale: 'warning', offline: 'danger' } as const;
const ENVIRONMENT_LABELS = {
  research: 'velvet.finance.environmentBar.research',
  replay: 'velvet.finance.environmentBar.replay',
  paper: 'velvet.finance.environmentBar.paper',
  demo: 'velvet.finance.environmentBar.demo',
  shadow: 'velvet.finance.environmentBar.shadow',
  live: 'velvet.finance.environmentBar.live',
} as const;

export interface EnvironmentBarItem {
  label: JSX.Element;
  value: JSX.Element;
}

export interface EnvironmentBarProps extends HtmlProps<HTMLDivElement> {
  environment?: keyof typeof ENVIRONMENT_LABELS;
  label?: string;
  items?: EnvironmentBarItem[];
  connection?: { state: keyof typeof CONNECTION_TONES; label: JSX.Element };
  /** Open a confirmation flow; the bar does not perform the operation itself. */
  onKill?: () => void;
  killLabel?: string;
  killDisabled?: boolean;
  sticky?: boolean;
  top?: number;
  maxWidth?: number | string;
  actions?: JSX.Element;
}

export const EnvironmentBar = (props: EnvironmentBarProps) => {
  const merged = mergeProps(
    { environment: 'paper', items: [], top: 0, maxWidth: 1360 } satisfies Partial<EnvironmentBarProps>,
    props,
  );
  const [local, rest] = splitProps(merged, [
    'environment',
    'label',
    'items',
    'connection',
    'onKill',
    'killLabel',
    'killDisabled',
    'sticky',
    'top',
    'maxWidth',
    'actions',
    'class',
    'style',
  ]);
  const translate = useTranslate();
  const label = () => local.label ?? translate(ENVIRONMENT_LABELS[local.environment]);
  return (
    <div
      {...rest}
      role="region"
      aria-label={translate('velvet.finance.environmentBar.label', { environment: label() })}
      data-env={local.environment}
      class={cx(styles.root, local.sticky && styles.sticky, local.class)}
      style={{ top: local.sticky ? `${local.top}px` : undefined, ...local.style }}
    >
      <div
        class={styles.inner}
        style={{ 'max-width': typeof local.maxWidth === 'number' ? `${local.maxWidth}px` : local.maxWidth }}
      >
        <span class={styles.chip}>{label()}</span>
        <div class={styles.items}>
          <For each={local.items}>
            {(item) => (
              <div class={styles.item}>
                <span class={styles.key}>{item.label}</span>
                <span class={styles.value}>{item.value}</span>
              </div>
            )}
          </For>
        </div>
        <div class={styles.end}>
          <Show when={local.connection}>
            {(connection) => (
              <span class={styles.connection} role="status">
                <Dot tone={CONNECTION_TONES[connection().state]} pulse={connection().state === 'live'} />
                {connection().label}
              </span>
            )}
          </Show>
          {local.actions}
          <Show when={local.onKill}>
            <Button
              variant="danger"
              size="sm"
              iconLeft="stop"
              class={styles.kill}
              onClick={() => local.onKill?.()}
              disabled={local.killDisabled}
            >
              {local.killLabel ?? translate('velvet.finance.environmentBar.kill')}
            </Button>
          </Show>
        </div>
      </div>
    </div>
  );
};
