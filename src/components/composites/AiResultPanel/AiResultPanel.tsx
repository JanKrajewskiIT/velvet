import { FiCheck, FiInfo, FiTarget, FiX } from 'solid-icons/fi';
import { For, type JSX, Show } from 'solid-js';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import Button from '../../buttons/Button/Button';
import ScoreRing from '../../charts/ScoreRing/ScoreRing';
import Spinner from '../../feedback/Spinner/Spinner';
import Stack from '../../surfaces/Stack/Stack';
import CodeText from '../../typography/CodeText/CodeText';
import Heading from '../../typography/Heading/Heading';
import Text from '../../typography/Text/Text';
import styles from './AiResultPanel.module.css';

interface AiResultSection {
  icon: 'success' | 'danger' | 'primary' | 'info';
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
  info: (cls: string) => <FiInfo class={cls} />,
};

const iconClassMap = {
  success: styles.iconSuccess,
  danger: styles.iconDanger,
  primary: styles.iconPrimary,
  info: styles.iconInfo,
};

const AiResultPanel = (props: Props<AiResultPanelProps>) => {
  return (
    <Stack gap="md" class={classNames(styles.panel, props.class)}>
      <Show when={props.isPending}>
        <Stack align="center" gap="sm" class={styles.loading}>
          <Spinner size="md" />
          <Text as="p" variant="bodySm" tone="muted">
            {props.loadingText}
          </Text>
        </Stack>
      </Show>

      <Show when={props.hasError && !props.hasResult && !props.isPending}>
        <Stack align="center" gap="sm" class={styles.errorState}>
          <Text as="p" variant="bodySm" tone="primary" class={styles.errorText}>
            {props.errorText}
          </Text>
          <Button variant="ghost" onClick={props.onRetry}>
            {props.retryLabel}
          </Button>
        </Stack>
      </Show>

      <Show when={props.hasResult && !props.isPending}>
        <Stack gap="md" class={styles.result}>
          <Show when={props.score !== undefined}>
            <Stack align="center" gap="xs" class={styles.scoreSection}>
              <ScoreRing score={props.score ?? 0} />
              <Show when={props.scoreLabel}>
                <CodeText as="span" size="sm" tone="muted" class={styles.scoreLabel}>
                  {props.scoreLabel}
                </CodeText>
              </Show>
            </Stack>
          </Show>

          <Show when={props.summary}>
            <div class={styles.summarySection}>
              <Text as="p" variant="bodySm">
                {props.summary}
              </Text>
            </div>
          </Show>

          <For each={props.sections ?? []}>
            {(section) => (
              <Show when={section.items.length > 0}>
                <Stack gap="xs" class={styles.listSection}>
                  <Stack direction="horizontal" align="center" gap="xs" class={styles.listTitle}>
                    {iconMap[section.icon](classNames(styles.icon, iconClassMap[section.icon]))}
                    <Heading as="h4" level={4} variant="titleMd">
                      {section.title}
                    </Heading>
                  </Stack>
                  <ul class={styles.list}>
                    <For each={section.items}>
                      {(item) => (
                        <li>
                          <Text as="span" variant="bodySm">
                            {item}
                          </Text>
                        </li>
                      )}
                    </For>
                  </ul>
                </Stack>
              </Show>
            )}
          </For>

          <Show when={props.children}>{props.children}</Show>
        </Stack>
      </Show>

      <Show when={!props.isPending && !props.hasResult && !props.hasError && props.idle}>{props.idle}</Show>

      <Show when={!props.isPending && props.actions}>
        <Stack direction="horizontal" justify="center" gap="sm" class={styles.actions}>
          {props.actions}
        </Stack>
      </Show>
    </Stack>
  );
};

export default AiResultPanel;
