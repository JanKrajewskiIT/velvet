import { FiCheck, FiTarget, FiX } from 'solid-icons/fi';
import { For, type JSX, Show } from 'solid-js';

import type Props from '../../../models/Props';
import Button from '../Button/Button';
import ScoreRing from '../ScoreRing/ScoreRing';
import Spinner from '../Spinner/Spinner';
import styles from './AiResultPanel.module.css';

interface AiResultSection {
  icon: 'success' | 'danger' | 'primary';
  title: string;
  items: string[];
}

interface AiResultPanelProps {
  isPending: boolean;
  loadingText: string;
  errorText?: string;
  hasError: boolean;
  onRetry: () => void;
  retryLabel: string;
  score?: number;
  scoreLabel?: string;
  summary?: string;
  sections?: AiResultSection[];
  hasResult: boolean;
  actions?: JSX.Element;
  idle?: JSX.Element;
  children?: JSX.Element;
}

const iconMap = {
  success: (cls: string) => <FiCheck class={cls} />,
  danger: (cls: string) => <FiX class={cls} />,
  primary: (cls: string) => <FiTarget class={cls} />,
};

const iconClassMap = {
  success: styles.iconSuccess,
  danger: styles.iconDanger,
  primary: styles.iconPrimary,
};

const AiResultPanel = (props: Props<AiResultPanelProps>) => {
  return (
    <div class={`${styles.panel} ${props.class ?? ''}`}>
      <Show when={props.isPending}>
        <div class={styles.loading}>
          <Spinner size="md" />
          <p class={styles.loadingText}>{props.loadingText}</p>
        </div>
      </Show>

      <Show when={props.hasError && !props.hasResult && !props.isPending}>
        <div class={styles.errorState}>
          <p class={styles.errorText}>{props.errorText}</p>
          <Button variant="ghost" onClick={() => props.onRetry()}>
            {props.retryLabel}
          </Button>
        </div>
      </Show>

      <Show when={props.hasResult && !props.isPending}>
        <div class={styles.result}>
          <Show when={props.score !== undefined}>
            <div class={styles.scoreSection}>
              <ScoreRing score={props.score ?? 0} />
              <Show when={props.scoreLabel}>
                <span class={styles.scoreLabel}>{props.scoreLabel}</span>
              </Show>
            </div>
          </Show>

          <Show when={props.summary}>
            <div class={styles.summarySection}>
              <p class={styles.summaryText}>{props.summary}</p>
            </div>
          </Show>

          <For each={props.sections ?? []}>
            {(section) => (
              <Show when={section.items.length > 0}>
                <div class={styles.listSection}>
                  <h4 class={styles.listTitle}>
                    {iconMap[section.icon](iconClassMap[section.icon] ?? '')}
                    {section.title}
                  </h4>
                  <ul class={styles.list}>
                    <For each={section.items}>
                      {(item) => <li class={styles.listItem}>{item}</li>}
                    </For>
                  </ul>
                </div>
              </Show>
            )}
          </For>

          <Show when={props.children}>{props.children}</Show>

          <Show when={props.actions}>
            <div class={styles.actions}>{props.actions}</div>
          </Show>
        </div>
      </Show>

      <Show
        when={
          !props.isPending && !props.hasResult && !props.hasError && props.idle
        }
      >
        {props.idle}
      </Show>
    </div>
  );
};

export default AiResultPanel;
