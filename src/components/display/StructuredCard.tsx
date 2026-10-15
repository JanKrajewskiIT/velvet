import { children, type JSX, mergeProps, Show, splitProps } from 'solid-js';

import { variantClass } from '../../utils/cssModule';
import { cx } from '../../utils/cx';
import { Surface, type SurfaceProps } from '../primitives/Surface';
import { Text } from '../primitives/Text';
import styles from './StructuredCard.module.css';

const SCARD_PART_FOOTER_CLASSES = {
  between: styles.scardPartFooterVariantBetween,
  end: styles.scardPartFooterVariantEnd,
  start: styles.scardPartFooterVariantStart,
} as const;

export type StructuredCardFooterAlign = 'start' | 'end' | 'between';

/**
 * Card laid out in hairline-divided regions: media → header → body → footer.
 * Built on Surface (`clip` on); behaviour props are the same as Card. Use when a card has 2+ distinct
 * regions (project, article, event). For a single content block use Card.
 */
export interface StructuredCardProps extends Omit<SurfaceProps, 'title' | 'padding' | 'clip' | 'variant'> {
  /** Full-bleed media region (img / video / placeholder). */
  media?: JSX.Element;
  /** CSS `aspect-ratio` of the media region. @default '16 / 9' */
  mediaRatio?: string;
  /** Floating top-left over media — usually a Badge. */
  mediaTag?: JSX.Element;
  /** Bottom-right over media, white on scrim (e.g. "6 min read"). Turns the scrim on. */
  mediaMeta?: JSX.Element;
  /** Bottom gradient scrim over media. @default true when `mediaMeta` is set */
  scrim?: boolean;
  title?: JSX.Element;
  /** Secondary line under the title — icon + text. */
  meta?: JSX.Element;
  /** Header right slot — Badge / IconButton. */
  badge?: JSX.Element;
  /** Hairline-divided footer row. */
  footer?: JSX.Element;
  /** @default 'between' */
  footerAlign?: StructuredCardFooterAlign;
}

export const StructuredCard = (props: StructuredCardProps) => {
  const merged = mergeProps({ mediaRatio: '16 / 9', footerAlign: 'between' } satisfies StructuredCardProps, props);
  const [local, surface] = splitProps(merged, [
    'media',
    'mediaRatio',
    'mediaTag',
    'mediaMeta',
    'scrim',
    'title',
    'meta',
    'badge',
    'footer',
    'footerAlign',
    'class',
    'children',
  ]);
  const body = children(() => local.children);
  const showScrim = () => local.scrim ?? !!local.mediaMeta;
  return (
    <Surface {...surface} clip class={cx('vui-scard', local.class)}>
      <Show when={local.media}>
        <div class={styles.scardPartMedia} style={local.mediaRatio ? { 'aspect-ratio': local.mediaRatio } : undefined}>
          {local.media}
          <Show when={showScrim()}>
            <span class={styles.scardPartScrim} aria-hidden="true" />
          </Show>
          <Show when={local.mediaTag}>
            <span class={styles.scardPartTag}>{local.mediaTag}</span>
          </Show>
          <Show when={local.mediaMeta}>
            <Text as="span" variant="label-sm" class={styles.scardPartMmeta}>
              {local.mediaMeta}
            </Text>
          </Show>
        </div>
      </Show>
      <Show when={local.title || local.meta || local.badge}>
        <div class={styles.scardPartHeader}>
          <div class={styles.scardPartHeading}>
            <Show when={local.title}>
              <Text as="div" variant="title" tone="primary" class="vui-scard__title">
                {local.title}
              </Text>
            </Show>
            <Show when={local.meta}>
              <Text as="div" variant="caption" tone="tertiary" class={styles.scardPartMeta}>
                {local.meta}
              </Text>
            </Show>
          </div>
          <Show when={local.badge}>
            <div class={styles.scardPartBadge}>{local.badge}</div>
          </Show>
        </div>
      </Show>
      <Show when={body() != null}>
        <Text as="div" variant="body-sm" tone="secondary" class={styles.scardPartBody}>
          {body()}
        </Text>
      </Show>
      <Show when={local.footer}>
        <div class={cx(styles.scardPartFooter, variantClass(SCARD_PART_FOOTER_CLASSES, local.footerAlign))}>
          {local.footer}
        </div>
      </Show>
    </Surface>
  );
};
