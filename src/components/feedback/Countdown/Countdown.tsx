import { createEffect, createMemo, createSignal, For, on, onCleanup, splitProps } from 'solid-js';

import Text from '~/components/typography/Text/Text';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './Countdown.module.css';

interface CountdownProps {
  seconds: number;
  onComplete?: () => void;
  autoStart?: boolean;
  format?: 'hh:mm:ss' | 'mm:ss' | 'ss';
  size?: 'sm' | 'md' | 'lg';
}

const sizeClassByValue: Record<NonNullable<CountdownProps['size']>, string | undefined> = {
  sm: styles.sm,
  md: styles.md,
  lg: styles.lg,
};

const pad = (n: number) => String(n).padStart(2, '0');

const formatTime = (totalSeconds: number, format: 'hh:mm:ss' | 'mm:ss' | 'ss'): string[] => {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;

  if (format === 'hh:mm:ss') return [pad(h), pad(m), pad(s)];
  if (format === 'mm:ss') return [pad(m), pad(s)];
  return [pad(s)];
};

const Countdown = (props: Props<CountdownProps>) => {
  const [local, rest] = splitProps(props, ['seconds', 'onComplete', 'autoStart', 'format', 'size', 'class']);
  const [remaining, setRemaining] = createSignal(0);

  const format = () => local.format ?? 'mm:ss';
  const size = () => local.size ?? 'md';
  const autoStart = () => local.autoStart ?? true;

  createEffect(
    on(
      () => [local.seconds, autoStart()] as const,
      ([seconds, shouldStart]) => {
        setRemaining(seconds);

        if (!shouldStart) return;

        const interval = setInterval(() => {
          setRemaining((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              local.onComplete?.();
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        onCleanup(() => clearInterval(interval));
      },
    ),
  );

  const segments = createMemo(() => formatTime(remaining(), format()));
  const isUrgent = createMemo(() => remaining() > 0 && remaining() < 10);

  return (
    <div
      {...rest}
      class={classNames(styles.countdown, sizeClassByValue[size()], isUrgent() && styles.urgent, local.class)}
    >
      <For each={segments()}>
        {(segment, index) => (
          <>
            {index() > 0 && (
              <Text as="span" variant="bodyLg" tone="inherit" class={styles.separator}>
                :
              </Text>
            )}
            <Text as="span" variant="bodyLg" tone="inherit" class={styles.digit}>
              {segment}
            </Text>
          </>
        )}
      </For>
    </div>
  );
};

export default Countdown;
