import { children, type JSX, mergeProps, Show, splitProps } from 'solid-js';

import { variantClass } from '../../utils/cssModule';
import { cx } from '../../utils/cx';
import type { HtmlProps } from '../../utils/polymorphic';
import { Text } from '../primitives/Text';
import type { TextVariant } from '../primitives/typography';
import styles from './EmptyState.module.css';
import { type StateSize, StateTile, type StateTone } from './StateTile';

const EMPTY_CLASSES = {
  sm: styles.emptyVariantSm,
  lg: styles.emptyVariantLg,
} as const;

const TONE_CLASSES = {
  warning: styles.toneVariantWarning,
  danger: styles.toneVariantDanger,
  info: styles.toneVariantInfo,
  neutral: styles.toneVariantNeutral,
} as const;

const EMPTY_TITLE_TYPOGRAPHY = {
  sm: 'label',
  md: 'title-lg',
  lg: 'h4',
} as const satisfies Record<StateSize, TextVariant>;

export interface EmptyStateProps extends HtmlProps<HTMLDivElement, 'title'> {
  /** Icon name; `null` hides the icon circle. @default 'inbox' */
  icon?: string | null;
  title?: JSX.Element;
  description?: JSX.Element;
  actions?: JSX.Element;
  /** sm = inline (card, table, list) · md = section · lg = whole page. @default 'md' */
  size?: StateSize;
  /** Icon circle colour. @default 'brand' */
  tone?: StateTone;
  /** Extra content under the actions. */
  children?: JSX.Element;
}

/** No-data placeholder: tinted icon circle + title + description + actions (use size="sm" buttons). Always offer the next action. */
export const EmptyState = (props: EmptyStateProps) => {
  const merged = mergeProps({ icon: 'inbox', size: 'md', tone: 'brand' } satisfies EmptyStateProps, props);
  const [local, rest] = splitProps(merged, [
    'icon',
    'title',
    'description',
    'actions',
    'size',
    'tone',
    'class',
    'children',
  ]);
  const title = children(() => local.title);
  const description = children(() => local.description);
  const actions = children(() => local.actions);
  const extra = children(() => local.children);

  return (
    <div
      {...rest}
      class={cx(
        styles.empty,
        variantClass(EMPTY_CLASSES, local.size),
        variantClass(TONE_CLASSES, local.tone),
        local.class,
      )}
    >
      <Show when={local.icon}>{(icon) => <StateTile icon={icon()} size={local.size} tone={local.tone} />}</Show>
      <div class={styles.emptyPartText}>
        <Show when={title()}>
          <Text as="div" variant={EMPTY_TITLE_TYPOGRAPHY[local.size]} tone="primary" class={styles.emptyPartTitle}>
            {title()}
          </Text>
        </Show>
        <Show when={description()}>
          <Text
            as="div"
            variant={local.size === 'sm' ? 'caption' : 'body-sm'}
            tone="secondary"
            class={styles.emptyPartDesc}
          >
            {description()}
          </Text>
        </Show>
      </div>
      <Show when={actions()}>
        <div class={styles.emptyPartActions}>{actions()}</div>
      </Show>
      <Show when={extra()}>
        <div class={styles.statusPagePartExtra}>{extra()}</div>
      </Show>
    </div>
  );
};
