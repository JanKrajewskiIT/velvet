import { For, type JSX, mergeProps, Show, splitProps } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import type { HtmlProps } from '../../utils/polymorphic';
import { Button } from '../actions/Button';
import { DataState } from './DataState';
import styles from './EnvironmentBar.module.css';

const CONNECTION_STATES = { live: 'fresh', stale: 'stale', offline: 'unavailable' } as const;
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

export type EnvironmentBarTone = 'neutral' | 'info' | 'warning' | 'danger';

export interface EnvironmentBarProps extends HtmlProps<HTMLDivElement> {
  /** Sets the colour of the strip and its default label. */
  tone?: EnvironmentBarTone;
  /** @deprecated Use tone with a label. */
  environment?: keyof typeof ENVIRONMENT_LABELS;
  label?: string;
  items?: EnvironmentBarItem[];
  connection?: { state: keyof typeof CONNECTION_STATES; label: JSX.Element };
  /** Open a confirmation flow; the bar does not perform the operation itself. */
  onStop?: () => void;
  stopLabel?: string;
  stopDisabled?: boolean;
  /** @deprecated Use onStop. */
  onKill?: () => void;
  /** @deprecated Use stopLabel. */
  killLabel?: string;
  /** @deprecated Use stopDisabled. */
  killDisabled?: boolean;
  sticky?: boolean;
  top?: number;
  maxWidth?: number | string;
  actions?: JSX.Element;
}

export const EnvironmentBar = (props: EnvironmentBarProps) => {
  const merged = mergeProps({ items: [], top: 0, maxWidth: 1360 } satisfies Partial<EnvironmentBarProps>, props);
  const [local, rest] = splitProps(merged, [
    'tone',
    'environment',
    'label',
    'items',
    'connection',
    'onStop',
    'stopLabel',
    'stopDisabled',
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
  const environment = () => {
    if (local.tone !== undefined) return undefined;
    // eslint-disable-next-line @typescript-eslint/no-deprecated -- environment remains supported for existing consumers.
    if (local.environment !== undefined) return local.environment;
    // Preserve the original paper label for calls without neutral props.
    return local.onStop || local.stopLabel !== undefined || local.stopDisabled !== undefined ? undefined : 'paper';
  };
  const tone = () => local.tone ?? 'info';
  const label = () => {
    if (local.label !== undefined) return local.label;
    const legacy = environment();
    return legacy ? translate(ENVIRONMENT_LABELS[legacy]) : translate(`velvet.finance.environmentBar.tones.${tone()}`);
  };
  // eslint-disable-next-line @typescript-eslint/no-deprecated -- onKill remains supported for existing consumers.
  const onStop = () => local.onStop ?? local.onKill;
  // eslint-disable-next-line @typescript-eslint/no-deprecated -- killLabel remains supported for existing consumers.
  const legacyStopLabel = () => local.killLabel;
  const stopLabel = () =>
    local.stopLabel ??
    legacyStopLabel() ??
    translate(local.onStop ? 'velvet.finance.environmentBar.stop' : 'velvet.finance.environmentBar.kill');
  // eslint-disable-next-line @typescript-eslint/no-deprecated -- killDisabled remains supported for existing consumers.
  const stopDisabled = () => local.stopDisabled ?? local.killDisabled;
  return (
    <div
      {...rest}
      role="region"
      aria-label={translate('velvet.finance.environmentBar.label', { environment: label() })}
      data-env={environment() ?? tone()}
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
              <DataState
                class={styles.connection}
                state={CONNECTION_STATES[connection().state]}
                label={connection().label ?? ''}
              />
            )}
          </Show>
          {local.actions}
          <Show when={onStop()}>
            <Button
              variant="danger"
              size="sm"
              iconLeft="stop"
              class={styles.stop}
              onClick={() => onStop()?.()}
              disabled={stopDisabled()}
            >
              {stopLabel()}
            </Button>
          </Show>
        </div>
      </div>
    </div>
  );
};
