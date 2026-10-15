import { createSignal, type JSX, mergeProps, onCleanup, onMount, Show, untrack } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { clamp } from '../../utils/math';
import { Meter } from '../primitives/Meter';
import { Text } from '../primitives/Text';
import styles from './SkillBar.module.css';

export interface SkillBarProps {
  label: JSX.Element;
  /** 0–100 */
  value: number;
  /** Text shown at right, e.g. 'Advanced'. Keep it a word, not a number. */
  level?: string;
  /** @default 'brand' */
  tone?: 'brand' | 'success' | 'warning' | 'danger' | 'info';
  /** Grow-in + shimmer on mount. Off for static lists / print. @default true */
  animate?: boolean;
  class?: string;
}

/** Competency meter: label, optional level word, and a bar that grows in once on mount with a single shimmer sweep. Not for task progress (use Progress). */
export const SkillBar = (props: SkillBarProps) => {
  const merged = mergeProps({ tone: 'brand', animate: true } satisfies Partial<SkillBarProps>, props);
  const translate = useTranslate();
  const [grown, setGrown] = createSignal(untrack(() => !merged.animate));
  onMount(() => {
    if (!merged.animate) return;
    const frame = requestAnimationFrame(() => setGrown(true));
    onCleanup(() => cancelAnimationFrame(frame));
  });
  const percent = () => clamp(merged.value, 0, 100);
  const valueText = () =>
    merged.level
      ? translate('velvet.data.skillBar.valueTextWithLevel', { level: merged.level, percent: percent() })
      : `${percent()}%`;
  return (
    <div class={cx(styles.skill, `vui-skill--${merged.tone}`, merged.class)}>
      <div class={styles.skillPartHead}>
        <Text as="span" variant="body-sm" tone="primary" class="vui-skill__label">
          {merged.label}
        </Text>
        <Show when={merged.level}>
          {(level) => (
            <Text as="span" variant="caption" tone="tertiary" class="vui-skill__level">
              {level()}
            </Text>
          )}
        </Show>
      </div>
      <Meter
        size="lg"
        shimmer={merged.animate}
        tone={merged.tone}
        value={grown() ? percent() : 0}
        label={typeof merged.label === 'string' ? merged.label : translate('velvet.data.skillBar.label')}
        aria-valuetext={valueText()}
      />
    </div>
  );
};
